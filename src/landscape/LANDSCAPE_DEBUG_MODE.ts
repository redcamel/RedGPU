/**
 * [KO] 대규모 지형(Landscape) 렌더링 디버그 시각화 모드 상수 객체입니다.
 * [EN] Debug visualization mode constants for large-scale Landscape rendering.
 *
 * [KO] 알베도, 노멀, 고도 히트맵, LOD 단계, 스플랫 가중치, 그림자 가시성 등 렌더 파이프라인의 다양한 단계를 시각적으로 디버깅할 때 사용합니다.
 * [EN] Used to visually inspect various render pipeline stages including albedo, normals, elevation heatmap, LOD levels, splat weights, and shadow visibility.
 *
 * ### Example
 * ```typescript
 * // LOD 단계 시각화 모드 적용
 * landscape.debugMode = RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.LOD_LEVEL;
 *
 * // 디버그 모드 끄기 (일반 렌더링)
 * landscape.debugMode = RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.NONE;
 * ```
 *
 */
export const LANDSCAPE_DEBUG_MODE = {
    NONE: 0,
    FINAL_NORMAL: 1,
    MACRO_NORMAL: 2,
    ALBEDO: 3,
    SPLAT_WEIGHTS: 4,
    ROUGHNESS: 5,
    AMBIENT_OCCLUSION: 6,
    HEIGHTMAP_SHADOW_MASK: 7,
    CSM_SHADOW_MASK: 8,
    TOTAL_SHADOW_VISIBILITY: 9,
    ELEVATION_HEATMAP: 10,
    LOD_LEVEL: 11
} as const;

/**
 * [KO] 지형 디버그 시각화 모드 유니온 타입입니다.
 * [EN] Union type for landscape debug visualization modes.
 *
 * [KO] `0`부터 `11`까지의 정수 리터럴 중 하나의 값을 가집니다.
 * [EN] Represents an integer literal value between `0` and `11`.
 *
 * ### Example
 * ```typescript
 * function setDebugMode(mode: RedGPU.Landscape.LANDSCAPE_DEBUG_MODE) {
 *     landscape.debugMode = mode;
 * }
 * ```
 *
 */
export type LANDSCAPE_DEBUG_MODE = typeof LANDSCAPE_DEBUG_MODE[keyof typeof LANDSCAPE_DEBUG_MODE];
Object.freeze(LANDSCAPE_DEBUG_MODE);
