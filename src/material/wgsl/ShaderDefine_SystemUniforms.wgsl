struct SystemUniforms {
  projectionMatrix : mat4x4<f32>,
  inverseProjectionMatrix: mat4x4<f32>,
  cameraMatrix: mat4x4<f32>,
  resolution: vec2<f32>,
  nearFar: vec2<f32>,
};

const inducesLength:u32 = REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER * REDGPU_DEFINE_TOTAL_TILES;
const tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);

struct ClusterLights  {
    offset : u32,
    count : u32
};
struct ClusterLightGroup {
    offset : atomic<u32>,
    lights : array<ClusterLights , REDGPU_DEFINE_TOTAL_TILES>,
    indices : array<u32, inducesLength>
};
struct ClusterCube {
    minAABB : vec4<f32>,
    maxAABB : vec4<f32>
  };
struct Clusters {
    cubeList : array<ClusterCube, REDGPU_DEFINE_TOTAL_TILES>
};

fn linearDepth(depthSample : f32) -> f32 {
    return systemUniforms.nearFar.y*systemUniforms.nearFar.x / fma(depthSample, systemUniforms.nearFar.x-systemUniforms.nearFar.y, systemUniforms.nearFar.y);
}
fn getClusterIndex(fragCoord : vec4<f32>) -> u32 {
    let tile = getTile(fragCoord);
    return tile.x +
           tile.y * tileCount.x +
           tile.z * tileCount.x * tileCount.y;

}
fn getTile(fragCoord : vec4<f32>) -> vec3<u32> {
    // TODO: scale and bias calculation can be moved outside the shader to save cycles.
    let sliceScale = f32(tileCount.z) / log2(systemUniforms.nearFar.y / systemUniforms.nearFar.x);
    let sliceBias = -(f32(tileCount.z) * log2(systemUniforms.nearFar.x) / log2(systemUniforms.nearFar.y / systemUniforms.nearFar.x));
    let zTile = u32(max(log2(linearDepth(fragCoord.z)) * sliceScale + sliceBias, 0.0));
    return vec3<u32>(u32(fragCoord.x / (systemUniforms.resolution.x / f32(tileCount.x))),
                     u32(fragCoord.y / (systemUniforms.resolution.y / f32(tileCount.y))),
                     zTile);
}

struct Light {
    position : vec3<f32>,
    radius : f32,
    color : vec3<f32>,
    intensity : f32
};
struct LightList {
    count:vec4<f32>,
    lights : array<Light>
};

@group(0) @binding(0) var<uniform> systemUniforms : SystemUniforms;
@group(0) @binding(2) var<storage> lightList : LightList;
@group(0) @binding(3) var<storage, read_write> clusterLightGroup : ClusterLightGroup;
