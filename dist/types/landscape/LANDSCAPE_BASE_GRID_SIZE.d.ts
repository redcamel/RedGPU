/**
 * [KO] 지형 컴포넌트의 한 변당 기본 쿼드(Quad) 분할 해상도 프리셋 상수입니다.
 * [EN] Base quad subdivision resolution preset constants per side of a landscape component.
 *
 * @category Landscape
 */
export declare const LANDSCAPE_BASE_GRID_SIZE: {
    /**
     * [KO] 16x16 쿼드 격자 해상도입니다.
     * [EN] 16x16 quad grid resolution.
     */
    readonly QUAD_16: 16;
    /**
     * [KO] 32x32 쿼드 격자 해상도입니다.
     * [EN] 32x32 quad grid resolution.
     */
    readonly QUAD_32: 32;
    /**
     * [KO] 64x64 쿼드 격자 해상도입니다 (기본값).
     * [EN] 64x64 quad grid resolution (default).
     */
    readonly QUAD_64: 64;
    /**
     * [KO] 128x128 쿼드 격자 해상도입니다.
     * [EN] 128x128 quad grid resolution.
     */
    readonly QUAD_128: 128;
    /**
     * [KO] 256x256 쿼드 격자 해상도입니다.
     * [EN] 256x256 quad grid resolution.
     */
    readonly QUAD_256: 256;
    /**
     * [KO] 512x512 쿼드 격자 해상도입니다.
     * [EN] 512x512 quad grid resolution.
     */
    readonly QUAD_512: 512;
};
/**
 * [KO] 지형 기본 격자 해상도 상수의 값 타입입니다.
 * [EN] Value type of the landscape base grid size constants.
 *
 * @category Landscape
 */
export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];
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
export declare function validateLandscapeBaseGridSize(value: number): void;
export default LANDSCAPE_BASE_GRID_SIZE;
