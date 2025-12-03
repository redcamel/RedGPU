/**
 * @category NoiseTexture
 * @experimental
 */
const VORONOI_DISTANCE_TYPE = {
    EUCLIDEAN: 0,
    MANHATTAN: 1,
    CHEBYSHEV: 2,
} as const
Object.freeze(VORONOI_DISTANCE_TYPE)
export default VORONOI_DISTANCE_TYPE
