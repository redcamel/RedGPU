/**
 * [KO] 언리얼 엔진 5 지형 표준 베이스 쿼드 해상도 프리셋 상수 객체입니다.
 * [EN] Unreal Engine 5 terrain standard base grid quad resolution preset constant object.
 */
export const LANDSCAPE_BASE_GRID_SIZE = {
    /** 15x15 Quads (타일당 정점 256개) */
    QUAD_15: 15,
    /** 31x31 Quads (타일당 정점 1,024개) */
    QUAD_31: 31,
    /** 63x63 Quads (타일당 정점 4,096개 - 언리얼 엔진 5 공식 기본값) */
    QUAD_63: 63,
    /** 127x127 Quads (타일당 정점 16,384개) */
    QUAD_127: 127,
    /** 255x255 Quads (타일당 정점 65,536개) */
    QUAD_255: 255
} as const;

export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];

export default LANDSCAPE_BASE_GRID_SIZE;
