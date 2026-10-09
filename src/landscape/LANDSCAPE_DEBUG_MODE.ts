/**
 * [KO] 대규모 지형(Landscape) 렌더링 디버그 시각화 모드 상수 및 타입 정의 모듈입니다.
 * [EN] Debug visualization mode constants and type definition module for large-scale Landscape rendering.
 * @packageDocumentation
 */

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
 * landscape.debuggerManager.landscapeDebugMode = RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.LOD_LEVEL;
 *
 * // 디버그 모드 끄기 (일반 렌더링)
 * landscape.debuggerManager.landscapeDebugMode = RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.NONE;
 * ```
 *
 */
export const LANDSCAPE_DEBUG_MODE = {
    /**
     * [KO] 디버그 모드 꺼짐 (일반 PBR 및 가상 텍스처 지형 렌더링)
     * [EN] Debug mode disabled (Standard PBR and virtual texture terrain rendering)
     */
    NONE: 0,
    /**
     * [KO] 최종 결합된 월드 노멀 벡터 시각화 (RGB = Normal * 0.5 + 0.5)
     * [EN] Visualizes final combined world normal vectors (RGB = Normal * 0.5 + 0.5)
     */
    FINAL_NORMAL: 1,
    /**
     * [KO] 가상 노멀 텍스처(VNT)의 매크로 노멀 벡터 시각화
     * [EN] Visualizes macro normal vectors from Virtual Normal Texture (VNT)
     */
    MACRO_NORMAL: 2,
    /**
     * [KO] 가상 베이스 텍스처(VBT)의 알베도(Albedo) 디퓨즈 컬러 시각화
     * [EN] Visualizes albedo diffuse color from Virtual Base Texture (VBT)
     */
    ALBEDO: 3,
    /**
     * [KO] 다중 레이어 스플랫 가중치 맵(Splat Weightmap) 채널 분포 시각화
     * [EN] Visualizes multi-layer splat weightmap channel distribution
     */
    SPLAT_WEIGHTS: 4,
    /**
     * [KO] 표면 거칠기(Roughness) 맵 시각화 (흑백)
     * [EN] Visualizes surface roughness map (Grayscale)
     */
    ROUGHNESS: 5,
    /**
     * [KO] 앰비언트 오클루전(Ambient Occlusion) 맵 시각화 (흑백)
     * [EN] Visualizes ambient occlusion map (Grayscale)
     */
    AMBIENT_OCCLUSION: 6,
    /**
     * [KO] 가상 고도 텍스처(VHT) 기반 지형 자체 레이마칭 그림자 마스크 시각화
     * [EN] Visualizes raymarched terrain self-shadow mask based on Virtual Height Texture (VHT)
     */
    HEIGHTMAP_SHADOW_MASK: 7,
    /**
     * [KO] 캐스케이드 그림자 맵(CSM)의 지형 투영 그림자 마스크 시각화
     * [EN] Visualizes projected terrain shadow mask from Cascaded Shadow Maps (CSM)
     */
    CSM_SHADOW_MASK: 8,
    /**
     * [KO] 고도맵 그림자와 CSM 그림자가 최종 합성된 통합 그림자 가시성 시각화
     * [EN] Visualizes combined shadow visibility compositing both heightmap and CSM shadows
     */
    TOTAL_SHADOW_VISIBILITY: 9,
    /**
     * [KO] 지형 고도(Elevation) 히트맵 시각화 (저고도 파랑 ~ 고고도 빨강)
     * [EN] Visualizes terrain elevation heatmap (Blue for low elevation to Red for high elevation)
     */
    ELEVATION_HEATMAP: 10,
    /**
     * [KO] 카메라 거리에 따른 지형 타일 계층 LOD 단계별 고유 색상 시각화
     * [EN] Visualizes hierarchical terrain tile LOD levels with distinct colors based on camera distance
     */
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
