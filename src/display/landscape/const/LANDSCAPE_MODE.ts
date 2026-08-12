/**
 * [KO] Landscape 렌더링 모드 상수 객체
 * [EN] Landscape rendering mode constant object
 */
export const LANDSCAPE_MODE = {
    /** [KO] 와이어프레임 및 LOD 레벨별 색상 렌더링 모드 [EN] Wireframe & LOD color debug mode */
    DEBUG_WIRE_FRAME: 'DEBUG_WIRE_FRAME',
    /** [KO] 통합 높이맵 텍스처 디스플레이 렌더링 모드 [EN] Integrated heightmap texture rendering mode */
    DEBUG_HEIGHT_TEXTURE: 'DEBUG_HEIGHT_TEXTURE',
    /** [KO] 표준 지형 3D 재질 렌더링 모드 [EN] Standard terrain 3D surface material rendering mode */
    NORMAL: 'NORMAL'
} as const;

export type LANDSCAPE_MODE = typeof LANDSCAPE_MODE[keyof typeof LANDSCAPE_MODE];
