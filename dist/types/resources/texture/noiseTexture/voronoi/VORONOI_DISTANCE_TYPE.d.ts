/**
 * [KO] Voronoi 노이즈의 셀 거리 계산 방식을 정의하는 상수입니다.
 * [EN] Constants defining the cell distance calculation method of Voronoi noise.
 *
 * ### Example
 * ```typescript
 * texture.distanceType = RedGPU.Resource.VORONOI_DISTANCE_TYPE.MANHATTAN;
 * ```
 *
 * @experimental
 * @category NoiseTexture
 */
declare const VORONOI_DISTANCE_TYPE: {
    /**
     * [KO] 유클리드 거리 (직선 거리)
     * [EN] Euclidean distance (straight-line distance)
     */
    readonly EUCLIDEAN: 0;
    /**
     * [KO] 맨해튼 거리 (축별 거리의 합)
     * [EN] Manhattan distance (sum of per-axis distances)
     */
    readonly MANHATTAN: 1;
    /**
     * [KO] 체비셰프 거리 (축별 거리 중 최댓값)
     * [EN] Chebyshev distance (maximum of per-axis distances)
     */
    readonly CHEBYSHEV: 2;
};
export default VORONOI_DISTANCE_TYPE;
