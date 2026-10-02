/**
 * [KO] 지형 스캐터링(식생/잔디)을 위한 스플랫 가중치 맵 정규화 샘플링 유틸리티 모듈입니다.
 * [EN] Splat weight map normalized sampling utility module for terrain scattering (foliage/grass).
 * @packageDocumentation
 */


/**
 * [KO] RGBA 4채널 가중치 배열에서 특정 채널의 4채널 합산 기준 정규화 가중치를 계산합니다. (Grass 고속 샘플링용)
 * [EN] Computes the normalized weight of a specific channel relative to total RGBA weight sum. (For Grass fast sampling)
 *
 * @param weights4 -
 * [KO] RGBA 4개 채널 가중치가 담긴 4원소 배열/Float32Array
 * [EN] 4-element array/Float32Array containing RGBA channel weights
 * @param channelIndex -
 * [KO] 샘플링 대상 채널 인덱스 (0: R, 1: G, 2: B, 3: A)
 * [EN] Target channel index (0: R, 1: G, 2: B, 3: A)
 * @returns
 * [KO] 0.0 ~ 1.0 범위로 정규화된 가중치 값
 * [EN] Normalized weight value in range [0.0, 1.0]
 */
export function computeNormalizedChannelWeight(weights4: Float32Array | number[], channelIndex: number): number {
    const r = weights4[0];
    const g = weights4[1];
    const b = weights4[2];
    const a = weights4[3];
    const isAlphaFull = a >= 0.99;
    const effectiveA = isAlphaFull ? Math.max(0.0, Math.min(1.0, 1.0 - (r + g + b))) : a;
    const effectiveTotalW = r + g + b + effectiveA;
    const rawW = channelIndex === 0 ? r : (channelIndex === 1 ? g : (channelIndex === 2 ? b : effectiveA));
    return effectiveTotalW > 0.001 ? (rawW / effectiveTotalW) : (rawW || 0.0);
}

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
