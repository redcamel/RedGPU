struct ClusterCube {
    minAABB : vec4<f32>,
    maxAABB : vec4<f32>
  };
struct Clusters {
    cubeList : array<ClusterCube, REDGPU_DEFINE_TOTAL_TILES>
};
const tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);

