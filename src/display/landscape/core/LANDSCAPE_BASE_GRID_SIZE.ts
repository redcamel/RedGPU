export const LANDSCAPE_BASE_GRID_SIZE = {

    QUAD_15: 15,

    QUAD_31: 31,

    QUAD_63: 63,

    QUAD_127: 127,

    QUAD_255: 255
} as const;

export type LANDSCAPE_BASE_GRID_SIZE = typeof LANDSCAPE_BASE_GRID_SIZE[keyof typeof LANDSCAPE_BASE_GRID_SIZE];

export default LANDSCAPE_BASE_GRID_SIZE;
