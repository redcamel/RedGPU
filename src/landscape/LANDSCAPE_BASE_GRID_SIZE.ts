/**
 * [KO] 지형 컴포넌트의 기본 격자(Quad) 해상도 프리셋 상수입니다.
 * [EN] Base grid (Quad) resolution preset constants for landscape components.
 *
 * @category Landscape
 */
export const LANDSCAPE_BASE_GRID_SIZE = {
    /**
     * [KO] 16x16 쿼드 격자 해상도입니다.
     * [EN] 16x16 quad grid resolution.
     */
    QUAD_16: 16,
    /**
     * [KO] 32x32 쿼드 격자 해상도입니다.
     * [EN] 32x32 quad grid resolution.
     */
    QUAD_32: 32,
    /**
     * [KO] 64x64 쿼드 격자 해상도입니다 (기본값).
     * [EN] 64x64 quad grid resolution (default).
     */
    QUAD_64: 64,
    /**
     * [KO] 128x128 쿼드 격자 해상도입니다.
     * [EN] 128x128 quad grid resolution.
     */
    QUAD_128: 128,
    /**
     * [KO] 256x256 쿼드 격자 해상도입니다.
     * [EN] 256x256 quad grid resolution.
     */
    QUAD_256: 256,
    /**
     * [KO] 512x512 쿼드 격자 해상도입니다.
     * [EN] 512x512 quad grid resolution.
     */
    QUAD_512: 512
} as const;
Object.freeze(LANDSCAPE_BASE_GRID_SIZE);

/**
 * [KO] 지형 기본 격자 해상도 상수의 값 타입입니다.
 * [EN] Value type of landscape base grid size constants.
 *
 * @category Landscape
 */
export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];

const VALID_GRID_SIZES: Set<number> = new Set(Object.values(LANDSCAPE_BASE_GRID_SIZE));

/**
 * [KO] 입력된 격자 크기가 유효한 `LANDSCAPE_BASE_GRID_SIZE` 값인지 검증합니다.
 * [EN] Validates whether the given grid size is a valid `LANDSCAPE_BASE_GRID_SIZE` value.
 *
 * @param value -
 * [KO] 검증할 쿼드 격자 크기 값
 * [EN] Quad grid size value to validate
 * @throws
 * [KO] 허용되지 않은 격자 크기 값일 경우 `Error`가 발생합니다.
 * [EN] Throws an `Error` if the grid size value is not allowed.
 * @category Landscape
 */
export function validateLandscapeBaseGridSize(value: number): void {
    if (!VALID_GRID_SIZES.has(value)) {
        const allowed = Object.entries(LANDSCAPE_BASE_GRID_SIZE)
            .map(([k, v]) => `${k}(${v})`)
            .join(', ');
        throw new Error(
            `[RedGPU Landscape] Invalid componentSizeQuads: ${value}. Allowed values are: ${allowed}`
        );
    }
}

export default LANDSCAPE_BASE_GRID_SIZE;

