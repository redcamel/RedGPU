/**
 * [KO] 지형(Landscape) 컴포넌트의 기본 쿼드(Quad) 그리드 크기 상수 객체입니다.
 * [EN] Constant object defining base quad grid sizes for Landscape components.
 *
 * [KO] 지형 타일의 메시 해상도(쿼드 개수)를 16, 32, 64, 128, 256, 512 단위로 정의합니다.
 * [EN] Defines terrain tile mesh resolution (quad count) in units of 16, 32, 64, 128, 256, and 512.
 *
 * ### Example
 * ```typescript
 * const landscape = new RedGPU.Landscape.Landscape(redGPUContext, {
 *     componentSizeQuads: RedGPU.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64
 * });
 * ```
 *
 */
export const LANDSCAPE_BASE_GRID_SIZE = {
    /**
     * [KO] 컴포넌트당 16x16 쿼드 그리드 (초저해상도 / 모바일 또는 광역 지형 테스트용)
     * [EN] 16x16 quad grid per component (Ultra-low resolution / for mobile or broad overview testing)
     */
    QUAD_16: 16,
    /**
     * [KO] 컴포넌트당 32x32 쿼드 그리드 (저해상도 지형용)
     * [EN] 32x32 quad grid per component (Low-resolution terrain)
     */
    QUAD_32: 32,
    /**
     * [KO] 컴포넌트당 64x64 쿼드 그리드 (기본 권장 해상도 / 성능과 디테일의 최적 균형)
     * [EN] 64x64 quad grid per component (Default recommended resolution / optimal balance of performance and detail)
     */
    QUAD_64: 64,
    /**
     * [KO] 컴포넌트당 128x128 쿼드 그리드 (중고해상도 지형용)
     * [EN] 128x128 quad grid per component (Medium-high resolution terrain)
     */
    QUAD_128: 128,
    /**
     * [KO] 컴포넌트당 256x256 쿼드 그리드 (고해상도 지형용)
     * [EN] 256x256 quad grid per component (High-resolution terrain)
     */
    QUAD_256: 256,
    /**
     * [KO] 컴포넌트당 512x512 쿼드 그리드 (초고정밀 지형용 / 높은 정밀도 및 GPU 정점 처리량)
     * [EN] 512x512 quad grid per component (Ultra-high fidelity terrain / maximum detail and GPU vertex throughput)
     */
    QUAD_512: 512
} as const;
Object.freeze(LANDSCAPE_BASE_GRID_SIZE);

/**
 * [KO] 지형 컴포넌트 기본 쿼드 그리드 크기 유니온 타입입니다.
 * [EN] Union type for landscape component base quad grid sizes.
 *
 * [KO] `16 | 32 | 64 | 128 | 256 | 512` 중 하나의 숫자 리터럴 값을 가집니다.
 * [EN] Represents a numeric literal value among `16 | 32 | 64 | 128 | 256 | 512`.
 *
 * ### Example
 * ```typescript
 * function setGridResolution(size: RedGPU.Landscape.LANDSCAPE_BASE_GRID_SIZE) {
 *     console.log(`Grid resolution: ${size}`);
 * }
 * ```
 *
 */
export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];

const VALID_GRID_SIZES: Set<number> = new Set(Object.values(LANDSCAPE_BASE_GRID_SIZE));

/**
 * [KO] 지형 컴포넌트 쿼드 크기 유효성 검증 함수 (내부 전용)
 * [EN] Validates landscape component quad size value (Internal only)
 * @internal
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
