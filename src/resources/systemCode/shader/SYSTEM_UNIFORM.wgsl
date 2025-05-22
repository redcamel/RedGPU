struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
struct AmbientLight {
	  color:vec3<f32>,
	  intensity:f32
};

struct Camera {
	  cameraMatrix:mat4x4<f32>,
	  cameraPosition:vec3<f32>,
	  nearClipping:f32,
      farClipping:f32
};

struct SystemUniform {
	  projectionMatrix:mat4x4<f32>,
	  inverseProjectionMatrix:mat4x4<f32>,
	  projectionCameraMatrix:mat4x4<f32>,
	  camera:Camera,
	  resolution:vec2<f32>,
	  viewPosition:vec2<f32>,
	  //
	  directionalLightCount:u32,
	  directionalLights:array<DirectionalLight,3>,
	  //
	  directionalLightProjectionViewMatrix:mat4x4<f32>,
	  directionalLightProjectionMatrix:mat4x4<f32>,
	  directionalLightViewMatrix:mat4x4<f32>,
	  //
	  directionalLightShadowDepthTextureSize:u32,
	  directionalLightShadowBias:f32,
	  //
	  ambientLight:AmbientLight,

	  time:f32,
	  //
	  useIblTexture:u32,
	  isView3D:u32
};

@group(0) @binding(0) var<uniform> systemUniforms: SystemUniform;
@group(0) @binding(1) var directionalShadowMapSampler: sampler_comparison;
@group(0) @binding(2) var directionalShadowMap: texture_depth_2d;
@group(0) @binding(3) var iblTextureSampler: sampler;
@group(0) @binding(4) var iblTexture: texture_cube<f32>;
@group(0) @binding(7) var renderPath1ResultTextureSampler: sampler;
@group(0) @binding(8) var renderPath1ResultTexture: texture_2d<f32>;
@group(0) @binding(9) var packedTextureSampler: sampler;

const pointLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
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
    return systemUniforms.camera.farClipping*systemUniforms.camera.nearClipping / fma(depthSample, systemUniforms.camera.nearClipping-systemUniforms.camera.farClipping, systemUniforms.camera.farClipping);
}
fn getPointLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
    let tile = getPointLightTile(fragCoord);
    return tile.x +
           tile.y * pointLight_tileCount.x +
           tile.z * pointLight_tileCount.x * pointLight_tileCount.y;

}
fn getPointLightTile(fragCoord : vec4<f32>) -> vec3<u32> {
    // TODO: scale and bias calculation can be moved outside the shader to save cycles.
    let sliceScale = f32(pointLight_tileCount.z) / log2(systemUniforms.camera.farClipping / systemUniforms.camera.nearClipping);
    let sliceBias = -(f32(pointLight_tileCount.z) * log2(systemUniforms.camera.nearClipping) / log2(systemUniforms.camera.farClipping / systemUniforms.camera.nearClipping));
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
@group(0) @binding(5) var<storage> pointLightList : PointLightList;
@group(0) @binding(6) var<storage, read_write> pointLight_clusterLightGroup : PointLight_ClusterLightsGroup;
