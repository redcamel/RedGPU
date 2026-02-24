/**
 * [KO] 클러스터 조명 격자의 한 칸(셀)에 대한 기하학적 영역(AABB) 정보를 정의합니다.
 * [EN] Geometry area (AABB) information for a single cell in the cluster light grid.
 */
struct ClusterCellBounds {
    minAABB : vec4<f32>,
    maxAABB : vec4<f32>
};

/**
 * [KO] 모든 클러스터 셀의 영역 정보를 담는 격자 구조체입니다.
 * [EN] Grid structure containing the area information of all cluster cells.
 */
struct ClusterBoundsGrid {
    cubeList : array<ClusterCellBounds, REDGPU_DEFINE_TOTAL_TILES>
};
