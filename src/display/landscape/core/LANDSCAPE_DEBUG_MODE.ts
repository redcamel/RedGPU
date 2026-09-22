/**
 * [KO] 랜드스케이프 지형 디버그 모드 열거형 상수입니다.
 * [EN] Landscape terrain debug mode enumeration constants.
 */
export const LANDSCAPE_DEBUG_MODE = {
    /** [KO] 일반 PBR 라이팅 렌더링 (기본값) / [EN] Normal PBR lighting rendering (default) */
    NONE: 0,
    /** [KO] 최종 복합 법선 벡터 (VNT 베이스 + 레이어 노멀) / [EN] Final composite world normal */
    FINAL_NORMAL: 1,
    /** [KO] 베이스 지형 법선 벡터 (하이트맵 / VNT) / [EN] Base terrain normal from heightmap / VNT */
    MACRO_NORMAL: 2,
    /** [KO] 순수 디퓨즈/알베도 색상 (라이팅 및 그림자 배제) / [EN] Pure diffuse / albedo color without lighting */
    ALBEDO: 3,
    /** [KO] RGBA 4채널 스플랫맵 가중치 분포 시각화 / [EN] Splatmap RGBA 4-channel weight distribution */
    SPLAT_WEIGHTS: 4,
    /** [KO] 표면 거칠기 (Roughness 0.0 ~ 1.0) / [EN] Surface roughness (0.0 ~ 1.0) */
    ROUGHNESS: 5,
    /** [KO] 앰비언트 오클루전 (AO 0.0 ~ 1.0) / [EN] Ambient occlusion (0.0 ~ 1.0) */
    AMBIENT_OCCLUSION: 6,
    /** [KO] 하이트맵 레이마칭 셀프 섀도우 마스크 / [EN] Heightmap raymarched self-shadow mask */
    HEIGHTMAP_SHADOW_MASK: 7,
    /** [KO] 방향성 광원 CSM 그림자 마스크 / [EN] Directional light CSM shadow mask */
    CSM_SHADOW_MASK: 8,
    /** [KO] 최종 합성 그림자 가시성 (하이트맵 + CSM) / [EN] Total combined shadow visibility */
    TOTAL_SHADOW_VISIBILITY: 9,
    /** [KO] 지형 고도 히트맵 및 등고선 / [EN] Elevation heatmap and contour lines */
    ELEVATION_HEATMAP: 10,
    /** [KO] 연속 LOD 레벨 색상 / [EN] Continuous LOD level coloration */
    LOD_LEVEL: 11
} as const;

export type LANDSCAPE_DEBUG_MODE = typeof LANDSCAPE_DEBUG_MODE[keyof typeof LANDSCAPE_DEBUG_MODE];
Object.freeze(LANDSCAPE_DEBUG_MODE);
