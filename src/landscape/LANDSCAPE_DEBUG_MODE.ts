/**
 * [KO] 지형 렌더링의 시각적 디버그 모드 상수입니다.
 * [EN] Visual debug mode constants for landscape rendering.
 *
 * @category Landscape
 */
export const LANDSCAPE_DEBUG_MODE = {
    /**
     * [KO] 디버그 시각화를 비활성화하고 일반 PBR 렌더링을 수행합니다.
     * [EN] Disables debug visualization and performs normal PBR rendering.
     */
    NONE: 0,
    /**
     * [KO] 레이어 노말 맵이 합성된 최종 월드 공간 법선 벡터를 시각화합니다.
     * [EN] Visualizes the final world-space normal vector combined with layer normal maps.
     */
    FINAL_NORMAL: 1,
    /**
     * [KO] VNT 아틀라스에서 샘플링한 지형 매크로 법선 벡터를 시각화합니다.
     * [EN] Visualizes the terrain macro normal vector sampled from the VNT atlas.
     */
    MACRO_NORMAL: 2,
    /**
     * [KO] 조명 연산이 제외된 순수 알베도(Base Color) 색상을 시각화합니다.
     * [EN] Visualizes the pure albedo (Base Color) without lighting calculations.
     */
    ALBEDO: 3,
    /**
     * [KO] 스플래팅 레이어들의 블렌딩 가중치 분포를 시각화합니다.
     * [EN] Visualizes the blending weight distribution of splatting layers.
     */
    SPLAT_WEIGHTS: 4,
    /**
     * [KO] 지형 표면의 거칠기(Roughness) 값을 그레이스케일로 시각화합니다.
     * [EN] Visualizes the surface roughness value in grayscale.
     */
    ROUGHNESS: 5,
    /**
     * [KO] 지형 표면의 앰비언트 오클루전(Ambient Occlusion) 값을 시각화합니다.
     * [EN] Visualizes the surface ambient occlusion value.
     */
    AMBIENT_OCCLUSION: 6,
    /**
     * [KO] 하이트맵 레이마칭 기반 자체 그림자(Heightmap Shadow) 마스크를 시각화합니다.
     * [EN] Visualizes the heightmap raymarching-based self-shadow mask.
     */
    HEIGHTMAP_SHADOW_MASK: 7,
    /**
     * [KO] 캐스케이드 섀도우 맵(CSM) 그림자 마스크를 시각화합니다.
     * [EN] Visualizes the Cascaded Shadow Map (CSM) shadow mask.
     */
    CSM_SHADOW_MASK: 8,
    /**
     * [KO] 하이트맵 그림자와 CSM 그림자가 결합된 전체 그림자 가시성을 시각화합니다.
     * [EN] Visualizes the total shadow visibility combining heightmap shadows and CSM shadows.
     */
    TOTAL_SHADOW_VISIBILITY: 9,
    /**
     * [KO] 정규화된 지형 고도(Elevation)를 히트맵 색상으로 시각화합니다.
     * [EN] Visualizes normalized terrain elevation as a heatmap color.
     */
    ELEVATION_HEATMAP: 10,
    /**
     * [KO] 타일별 지오메트리 LOD 레벨을 색상으로 시각화합니다.
     * [EN] Visualizes per-tile geometry LOD levels with colors.
     */
    LOD_LEVEL: 11
} as const;

/**
 * [KO] 지형 디버그 모드 상수의 값 타입입니다.
 * [EN] Value type of the landscape debug mode constants.
 *
 * @category Landscape
 */
export type LANDSCAPE_DEBUG_MODE = typeof LANDSCAPE_DEBUG_MODE[keyof typeof LANDSCAPE_DEBUG_MODE];
Object.freeze(LANDSCAPE_DEBUG_MODE);
