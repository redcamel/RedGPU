[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ShaderLibrary](../README.md) / SYSTEM\_UNIFORM

# Variable: SYSTEM\_UNIFORM

> `const` **SYSTEM\_UNIFORM**: `string` = `SYSTEM_UNIFORM_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2963](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L2963)

Definitions of the engine's standard system uniforms and global binding structures.

```wgsl
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
	  useSkyAtmosphere:u32,
	  preExposure:f32,
	  iblIntensity:f32,
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
@group(0) @binding(10) var ibl_prefilterTexture: texture_cube<f32>;
@group(0) @binding(11) var ibl_irradianceTexture: texture_cube<f32>;
@group(0) @binding(12) var ibl_brdfLUTTexture: texture_2d<f32>;

@group(0) @binding(13) var atmosphereSampler: sampler;
@group(0) @binding(14) var transmittanceTexture: texture_2d<f32>;

@group(0) @binding(15) var atmosphereIrradianceLUT: texture_cube<f32>;
@group(0) @binding(16) var skyAtmosphere_prefilteredTexture: texture_cube<f32>;

#redgpu_include systemStruct.globalVertexStruct;
@group(0) @binding(17) var<storage> globalVertexSSBO : array<GlobalVertexStruct>;

#redgpu_include systemStruct.globalFragmentStructPBR;
@group(0) @binding(18) var<storage> globalFragmentSSBO_PBR : array<GlobalFragmentStructPBR>;

#redgpu_include systemStruct.globalFragmentStructBuiltIn;
@group(0) @binding(19) var<storage> globalFragmentSSBO_BuiltIn : array<GlobalFragmentStructBuiltIn>;

#redgpu_include depth.getLinearizeDepth

const clusterLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
const clusterLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);

/**
 * Structure representing a single cell (box) in the cluster light grid.
 *
 */
struct ClusterLightCell {
    offset : u32,
    count : u32
};

/**
 * Grid structure that integrally manages cluster light data.
 *
 */
struct ClusterLightGrid {
    offset : atomic<u32>,
    cells : array<ClusterLightCell , REDGPU_DEFINE_TOTAL_TILES>,
    indices : array<u32, clusterLight_indicesLength>
};

/**
 * Cluster light (Point/Spot light) data structure.
 *
 */
struct ClusterLight {
    position : vec3<f32>, radius : f32,
    color : vec3<f32>,    intensity : f32,
    isSpotLight:f32,    directionX:f32,    directionY:f32,    directionZ:f32,
    outerCutoff:f32,    innerCutoff:f32,
};

/**
 * Cluster light list structure.
 *
 */
struct ClusterLightList {
    count:vec4<f32>,
    lights : array<ClusterLight>
};
@group(0) @binding(5) var<storage> clusterLightList : ClusterLightList;
@group(0) @binding(6) var<storage, read_write> clusterLightGrid : ClusterLightGrid;

/**
 * Calculates the index of the cluster using fragment coordinates.
 *
 * @param fragCoord Fragment coordinates
 * @returns Cluster index
 *
 */
fn getClusterLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
    let tile = getClusterLightTile(fragCoord);
    return tile.x +
           tile.y * clusterLight_tileCount.x +
           tile.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

}

/**
 * Calculates the tile (XYZ) coordinates of the cluster using fragment coordinates.
 *
 * @param fragCoord Fragment coordinates
 * @returns Cluster tile coordinates
 *
 */
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
```
