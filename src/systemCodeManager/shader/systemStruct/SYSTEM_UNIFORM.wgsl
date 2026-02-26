// [KO] 엔진의 표준 시스템 유니폼 및 전역 바인딩 구조체 정의입니다.
// [EN] Definitions of the engine's standard system uniforms and global binding structures.
#redgpu_include systemStruct.DirectionalLight
#redgpu_include systemStruct.AmbientLight

#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.Shadow
#redgpu_include systemStruct.SkyAtmosphere

struct SystemUniform {
	  projection: Projection,
	  time: Time,
	  resolution:vec2<f32>,
      //
      camera:Camera,
	  usePrefilterTexture:u32,
	  isView3D:u32,
	  //
	  skyAtmosphere:SkyAtmosphere,
	  shadow:Shadow,
      //
      directionalLightCount:u32,
      directionalLightProjectionViewMatrix:mat4x4<f32>,
      directionalLightProjectionMatrix:mat4x4<f32>,
      directionalLightViewMatrix:mat4x4<f32>,
      directionalLights:array<DirectionalLight,3>,
	  //
	  ambientLight:AmbientLight,

};

@group(0) @binding(0) var<uniform> systemUniforms: SystemUniform;
@group(0) @binding(1) var directionalShadowMapSampler: sampler_comparison;
@group(0) @binding(2) var directionalShadowMap: texture_depth_2d;
@group(0) @binding(3) var prefilterTextureSampler: sampler;

@group(0) @binding(7) var renderPath1ResultTextureSampler: sampler;
@group(0) @binding(8) var renderPath1ResultTexture: texture_2d<f32>;
@group(0) @binding(9) var packedTextureSampler: sampler;
@group(0) @binding(10) var ibl_environmentTexture: texture_cube<f32>;
@group(0) @binding(11) var ibl_irradianceTexture: texture_cube<f32>;
@group(0) @binding(12) var ibl_brdfLUTTexture: texture_2d<f32>;
@group(0) @binding(13) var cameraVolumeTexture: texture_3d<f32>;
@group(0) @binding(14) var atmosphereSampler: sampler;
@group(0) @binding(15) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(16) var skyViewTexture: texture_2d<f32>;
@group(0) @binding(17) var atmosphereIrradianceTexture: texture_2d<f32>;
@group(0) @binding(18) var skyAtmosphere_prefilteredTexture: texture_cube<f32>;

#redgpu_include depth.getLinearizeDepth

const clusterLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
const clusterLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);

/**
 * [KO] 클러스터 조명 격자의 한 칸(박스) 정보를 나타내는 구조체입니다.
 * [EN] Structure representing a single cell (box) in the cluster light grid.
 */
struct ClusterLightCell {
    offset : u32,
    count : u32
};

/**
 * [KO] 클러스터 조명 데이터를 통합 관리하는 격자(Grid) 구조체입니다.
 * [EN] Grid structure that integrally manages cluster light data.
 */
struct ClusterLightGrid {
    offset : atomic<u32>,
    cells : array<ClusterLightCell , REDGPU_DEFINE_TOTAL_TILES>,
    indices : array<u32, clusterLight_indicesLength>
};
struct ClusterLight {
    position : vec3<f32>, radius : f32,
    color : vec3<f32>,    intensity : f32,
    isSpotLight:f32,    directionX:f32,    directionY:f32,    directionZ:f32,
    outerCutoff:f32,    innerCutoff:f32,
};
struct ClusterLightList {
    count:vec4<f32>,
    lights : array<ClusterLight>
};
@group(0) @binding(5) var<storage> clusterLightList : ClusterLightList;
@group(0) @binding(6) var<storage, read_write> clusterLightGrid : ClusterLightGrid;

fn getClusterLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
    let tile = getClusterLightTile(fragCoord);
    return tile.x +
           tile.y * clusterLight_tileCount.x +
           tile.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

}
fn getClusterLightTile(fragCoord : vec4<f32>) -> vec3<u32> {
    let near = systemUniforms.camera.nearClipping;
    let far = systemUniforms.camera.farClipping;
    let sliceScale = f32(clusterLight_tileCount.z) / log2(far / near);
    let sliceBias = -(f32(clusterLight_tileCount.z) * log2(near) / log2(far / near));
    let zTile = u32(max(log2(getLinearizeDepth(fragCoord.z, near, far)) * sliceScale + sliceBias, 0.0));
    return vec3<u32>(u32(fragCoord.x / (systemUniforms.resolution.x / f32(clusterLight_tileCount.x))),
                     u32(fragCoord.y / (systemUniforms.resolution.y / f32(clusterLight_tileCount.y))),
                     zTile);
}