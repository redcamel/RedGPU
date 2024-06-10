struct SystemUniforms {
  projectionMatrix : mat4x4<f32>,
  inverseProjectionMatrix: mat4x4<f32>,
  cameraMatrix: mat4x4<f32>,
  resolution: vec2<f32>,
  nearFar: vec2<f32>,
};

const pointLight_indicesLength:u32 = REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER * REDGPU_DEFINE_TOTAL_TILES;
const pointLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);

struct PointLight_ClusterLights  {
    offset : u32,
    count : u32
};
struct PointLight_ClusterLightsGroup {
    offset : atomic<u32>,
    lights : array<PointLight_ClusterLights , REDGPU_DEFINE_TOTAL_TILES>,
    indices : array<u32, pointLight_indicesLength>
};
struct PointLight_ClusterCube {
    minAABB : vec4<f32>,
    maxAABB : vec4<f32>
  };
struct PointLight_Clusters {
    cubeList : array<PointLight_ClusterCube, REDGPU_DEFINE_TOTAL_TILES>
};

fn linearDepth(depthSample : f32) -> f32 {
    return systemUniforms.nearFar.y*systemUniforms.nearFar.x / fma(depthSample, systemUniforms.nearFar.x-systemUniforms.nearFar.y, systemUniforms.nearFar.y);
}
fn getPointLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
    let tile = getPointLightTile(fragCoord);
    return tile.x +
           tile.y * pointLight_tileCount.x +
           tile.z * pointLight_tileCount.x * pointLight_tileCount.y;

}
fn getPointLightTile(fragCoord : vec4<f32>) -> vec3<u32> {
    // TODO: scale and bias calculation can be moved outside the shader to save cycles.
    let sliceScale = f32(pointLight_tileCount.z) / log2(systemUniforms.nearFar.y / systemUniforms.nearFar.x);
    let sliceBias = -(f32(pointLight_tileCount.z) * log2(systemUniforms.nearFar.x) / log2(systemUniforms.nearFar.y / systemUniforms.nearFar.x));
    let zTile = u32(max(log2(linearDepth(fragCoord.z)) * sliceScale + sliceBias, 0.0));
    return vec3<u32>(u32(fragCoord.x / (systemUniforms.resolution.x / f32(pointLight_tileCount.x))),
                     u32(fragCoord.y / (systemUniforms.resolution.y / f32(pointLight_tileCount.y))),
                     zTile);
}

struct PointLight {
    position : vec3<f32>,
    radius : f32,
    color : vec3<f32>,
    intensity : f32
};
struct PointLightList {
    count:vec4<f32>,
    lights : array<PointLight>
};

@group(0) @binding(0) var<uniform> systemUniforms : SystemUniforms;
@group(0) @binding(2) var<storage> pointLightList : PointLightList;
@group(0) @binding(3) var<storage, read_write> clusterLightGroup : PointLight_ClusterLightsGroup;
