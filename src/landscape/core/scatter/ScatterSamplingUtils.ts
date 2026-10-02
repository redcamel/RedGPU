/**
 * [KO] 지형 스캐터링(식생/잔디)을 위한 스플랫 가중치 맵 정규화 샘플링 유틸리티 모듈입니다.
 * [EN] Splat weight map normalized sampling utility module for terrain scattering (foliage/grass).
 * @packageDocumentation
 */


/**
 * [KO] 지형의 활성화된 레이어 목록 전체를 순회하여 특정 대상 레이어의 총합 대비 정규화된 가중치를 계산합니다. (Foliage 멀티 레이어용)
 * [EN] Traverses all active landscape layers to compute the normalized weight of a target layer relative to total weight. (For Foliage multi-layer)
 *
 * @param landscape -
 * [KO] 대상 Landscape 인스턴스
 * [EN] Target Landscape instance
 * @param targetLayer -
 * [KO] 가중치를 산출할 대상 LandscapeLayer 객체
 * [EN] Target LandscapeLayer object to compute weight for
 * @param u -
 * [KO] U 텍스처 좌표 (0.0 ~ 1.0)
 * [EN] U texture coordinate (0.0 to 1.0)
 * @param v -
 * [KO] V 텍스처 좌표 (0.0 ~ 1.0)
 * [EN] V texture coordinate (0.0 to 1.0)
 * @returns
 * [KO] 0.0 ~ 1.0 범위로 정규화된 레이어 가중치 값
 * [EN] Normalized layer weight value in range [0.0, 1.0]
 */
export function sampleNormalizedLayerWeight(
    landscape: any,
    targetLayer: any,
    u: number,
    v: number
): number {
    if (!targetLayer) return 0.0;
    const layers = landscape?.layers;
    if (!layers || layers.length <= 1) {
        return typeof targetLayer.getWeightAtUV === 'function' ? targetLayer.getWeightAtUV(u, v) : 0.0;
    }

    let activeWeightLayerCount = 0;
    let totalWeight = 0.0;
    let targetWeight = 0.0;

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if (!layer.enabled) continue;
        if (layer.weightTexture?.src) {
            activeWeightLayerCount++;
        }
        const w = typeof layer.getWeightAtUV === 'function' ? layer.getWeightAtUV(u, v) : 0.0;
        totalWeight += w;
        if (layer === targetLayer) {
            targetWeight = w;
        }
    }

    if (activeWeightLayerCount <= 1 || totalWeight <= 0.001) {
        return targetWeight;
    }

    return targetWeight / totalWeight;
}
