struct SystemUniforms {
  projectionMatrix : mat4x4<f32>,
  inverseProjectionMatrix: mat4x4<f32>,
  cameraMatrix: mat4x4<f32>,
  resolution: vec2<f32>,
  nearFar: vec2<f32>,
};
struct ClusterLights  {
    offset : u32,
    count : u32
};

const inducesLength:u32 = REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER * REDGPU_DEFINE_TOTAL_TILES;
struct ClusterLightGroup {
    offset : atomic<u32>,
    lights : array<ClusterLights , REDGPU_DEFINE_TOTAL_TILES>,
    indices : array<u32, inducesLength>
};
@group(0) @binding(0) var<uniform> systemUniforms : SystemUniforms;
@group(0) @binding(3) var<storage, read_write> clusterLightGroup : ClusterLightGroup;
