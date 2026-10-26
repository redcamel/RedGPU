// [KO] 단일 3D 클러스터 셀의 뷰 공간(View-Space) AABB 바운딩 박스 구조체 (32 Bytes 정렬)
// [EN] View-space AABB bounding box structure for a single 3D cluster cell (32-byte aligned)
struct ClusterCellBounds {
    minAABB : vec4<f32>,
    maxAABB : vec4<f32>
};

// [KO] 전체 프러스텀 클러스터 타일의 AABB 배열을 보관하는 그리드 구조체
// [EN] Grid structure holding the array of AABBs for all frustum cluster tiles
struct ClusterBoundsGrid {
    cubeList : array<ClusterCellBounds, REDGPU_DEFINE_TOTAL_TILES>
};
