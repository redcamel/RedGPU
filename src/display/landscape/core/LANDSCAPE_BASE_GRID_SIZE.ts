export const LANDSCAPE_BASE_GRID_SIZE = {

    QUAD_16: 16,

    QUAD_32: 32,

    QUAD_64: 64,

    QUAD_128: 128,

    QUAD_256: 256,

    QUAD_512: 512
} as const;

export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];

const VALID_GRID_SIZES: Set<number> = new Set(Object.values(LANDSCAPE_BASE_GRID_SIZE));

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
