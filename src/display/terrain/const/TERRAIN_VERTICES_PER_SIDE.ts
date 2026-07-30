const TERRAIN_VERTICES_PER_SIDE = {
    SIZE_16: 16,
    SIZE_32: 32,
    SIZE_64: 64,
    SIZE_128: 128,
    SIZE_256: 256
} as const;

export type TerrainVerticesPerSide = typeof TERRAIN_VERTICES_PER_SIDE[keyof typeof TERRAIN_VERTICES_PER_SIDE];

Object.freeze(TERRAIN_VERTICES_PER_SIDE);
export default TERRAIN_VERTICES_PER_SIDE;
