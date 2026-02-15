import hash12_wgsl from './shader/math/hash12.wgsl';
import hash33_wgsl from './shader/math/hash33.wgsl';
import rgb_to_ycocg_wgsl from './shader/color/rgb_to_ycocg.wgsl';
import get_luminance_wgsl from './shader/color/get_luminance.wgsl';
import linearizeDepth_wgsl from './shader/depth/linearizeDepth.wgsl';
import SYSTEM_UNIFORM_wgsl from '../resources/systemCode/shader/SYSTEM_UNIFORM.wgsl';

/**
 * [KO] 수학 관련 셰이더 함수 라이브러리
 * [EN] Math related shader function library
 */
export namespace MathLibrary {
    /**
     * [KO] 2D 입력 좌표를 기반으로 1D 해시 값을 생성합니다.
     * [EN] Generates a 1D hash value based on 2D input coordinates.
     *
     * ```wgsl
     * fn hash12(p: vec2<f32>) -> f32 {
     *     var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
     *     p3 += dot(p3, p3.yzx + 33.33);
     *     return fract((p3.x + p3.y) * p3.z);
     * }
     * ```
     */
    export const hash12 = hash12_wgsl;

    /**
     * [KO] 3D 입력 벡터를 기반으로 3D 해시 벡터를 생성합니다.
     * [EN] Generates a 3D hash vector based on a 3D input vector.
     *
     * ```wgsl
     * fn hash33(p: vec3<f32>) -> vec3<f32> {
     *     var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
     *     p3 += dot(p3, p3.yxz + 33.33);
     *     return fract((p3.xxy + p3.yzz) * p3.zyx);
     * }
     * ```
     */
    export const hash33 = hash33_wgsl;
}

/**
 * [KO] 색상 관련 셰이더 함수 라이브러리
 * [EN] Color related shader function library
 */
export namespace ColorLibrary {
    /**
     * [KO] RGB 색상을 YCoCg 색상 공간으로 변환합니다.
     * [EN] Converts RGB color to YCoCg color space.
     *
     * ```wgsl
     * fn rgb_to_ycocg(rgb: vec3<f32>) -> vec3<f32> {
     *     let y  = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
     *     let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
     *     let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
     *     return vec3<f32>(y, co, cg);
     * }
     * ```
     */
    export const rgb_to_ycocg = rgb_to_ycocg_wgsl;

    /**
     * [KO] RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709)
     * [EN] Calculates the luminance of an RGB color. (Rec. 709)
     *
     * ```wgsl
     * fn get_luminance(rgb: vec3<f32>) -> f32 {
     *     return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
     * }
     * ```
     */
    export const get_luminance = get_luminance_wgsl;
}

/**
 * [KO] 깊이 관련 셰이더 함수 라이브러리
 * [EN] Depth related shader function library
 */
export namespace DepthLibrary {
    /**
     * [KO] 개선된 선형 깊이 복구 공식 (Stable Version)
     * [EN] Improved linear depth reconstruction formula (Stable Version)
     *
     * ```wgsl
     * fn linearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
     *     let d = clamp(depthSample, 0.0, 1.0);
     *     return (near * far) / max(1e-6, far - d * (far - near));
     * }
     * ```
     */
    export const linearizeDepth = linearizeDepth_wgsl;
}

/**
 * [KO] 시스템 셰이더 코드 및 공통 라이브러리 관리자
 * [EN] System shader code and common library manager
 * 
 * [KO] 네임스페이스 구조를 통해 셰이더 자산의 계층 관계를 문서상에 명확히 시각화하며, 각 함수의 실제 WGSL 소스 코드를 포함합니다.
 * [EN] Clearly visualizes the hierarchical relationship of shader assets in the documentation through a namespace structure, and includes the actual WGSL source code for each function.
 * 
 * @category Shader
 */
export namespace SystemCodeManager {
    /**
     * [KO] 엔진의 표준 시스템 유니폼 및 전역 바인딩 구조체 정의입니다.
     * [EN] Definitions of the engine's standard system uniforms and global binding structures.
     *
     * ```wgsl
     * struct DirectionalLight {
     * 	  direction:vec3<f32>,
     * 	  color:vec3<f32>,
     * 	  intensity:f32,
     * };
     * struct AmbientLight {
     * 	  color:vec3<f32>,
     * 	  intensity:f32
     * };
     * 
     * struct Camera {
     * 	  cameraMatrix:mat4x4<f32>,
     * 	  cameraPosition:vec3<f32>,
     * 	  nearClipping:f32,
     *       farClipping:f32
     * };
     * 
     * struct SystemUniform {
     * 	  projectionMatrix:mat4x4<f32>,
     * 	  projectionCameraMatrix:mat4x4<f32>,
     * 	  noneJitterProjectionMatrix:mat4x4<f32>,
     * 	  noneJitterProjectionCameraMatrix:mat4x4<f32>,
     * 	  inverseProjectionMatrix:mat4x4<f32>,
     * 	  prevNoneJitterProjectionCameraMatrix:mat4x4<f32>,
     * 	  resolution:vec2<f32>,
     *       //
     *       camera:Camera,
     * 	  //
     * 	  time:f32,
     * 	  usePrefilterTexture:u32,
     * 	  isView3D:u32,
     * 	  useSkyAtmosphere:u32,
     * 	  skyAtmosphereSunIntensity:f32,
     * 	  skyAtmosphereExposure:f32,
     * 	  //
     * 	  shadowDepthTextureSize:u32,
     * 	  bias:f32,
     * 
     * 
     *       //
     *       directionalLightCount:u32,
     *       directionalLightProjectionViewMatrix:mat4x4<f32>,
     *       directionalLightProjectionMatrix:mat4x4<f32>,
     *       directionalLightViewMatrix:mat4x4<f32>,
     *       directionalLights:array<DirectionalLight,3>,
     * 	  //
     * 	  ambientLight:AmbientLight,
     * 
     * };
     * 
     * @group(0) @binding(0) var<uniform> systemUniforms: SystemUniform;
     * @group(0) @binding(1) var directionalShadowMapSampler: sampler_comparison;
     * @group(0) @binding(2) var directionalShadowMap: texture_depth_2d;
     * @group(0) @binding(3) var prefilterTextureSampler: sampler;
     * 
     * @group(0) @binding(7) var renderPath1ResultTextureSampler: sampler;
     * @group(0) @binding(8) var renderPath1ResultTexture: texture_2d<f32>;
     * @group(0) @binding(9) var packedTextureSampler: sampler;
     * @group(0) @binding(10) var ibl_environmentTexture: texture_cube<f32>;
     * @group(0) @binding(11) var ibl_irradianceTexture: texture_cube<f32>;
     * @group(0) @binding(12) var ibl_brdfLUTTexture: texture_2d<f32>;
     * @group(0) @binding(13) var cameraVolumeTexture: texture_3d<f32>;
     * @group(0) @binding(14) var tSampler: sampler;
     * 
     * const clusterLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
     * const clusterLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);
     * 
     * struct ClusterLights  {
     *     offset : u32,
     *     count : u32
     * };
     * struct ClusterLightsGroup {
     *     offset : atomic<u32>,
     *     lights : array<ClusterLights , REDGPU_DEFINE_TOTAL_TILES>,
     *     indices : array<u32, clusterLight_indicesLength>
     * };
     * struct ClusterLight_ClusterCube {
     *     minAABB : vec4<f32>,
     *     maxAABB : vec4<f32>
     *   };
     * struct ClusterLight_Clusters {
     *     cubeList : array<ClusterLight_ClusterCube, REDGPU_DEFINE_TOTAL_TILES>
     * };
     * 
     * fn linearDepth(depthSample : f32) -> f32 {
     *     let n = systemUniforms.camera.nearClipping;
     *     let f = systemUniforms.camera.farClipping;
     *     let d = clamp(depthSample, 0.0, 1.0);
     *     return (n * f) / max(1e-6, f - d * (f - n));
     * }
     * fn getClusterLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
     *     let tile = getClusterLightTile(fragCoord);
     *     return tile.x +
     *            tile.y * clusterLight_tileCount.x +
     *            tile.z * clusterLight_tileCount.x * clusterLight_tileCount.y;
     * 
     * }
     * fn getClusterLightTile(fragCoord : vec4<f32>) -> vec3<u32> {
     *     let sliceScale = f32(clusterLight_tileCount.z) / log2(systemUniforms.camera.farClipping / systemUniforms.camera.nearClipping);
     *     let sliceBias = -(f32(clusterLight_tileCount.z) * log2(systemUniforms.camera.nearClipping) / log2(systemUniforms.camera.farClipping / systemUniforms.camera.nearClipping));
     *     let zTile = u32(max(log2(linearDepth(fragCoord.z)) * sliceScale + sliceBias, 0.0));
     *     return vec3<u32>(u32(fragCoord.x / (systemUniforms.resolution.x / f32(clusterLight_tileCount.x))),
     *                      u32(fragCoord.y / (systemUniforms.resolution.y / f32(clusterLight_tileCount.y))),
     *                      zTile);
     * }
     * 
     * struct ClusterLight {
     *     position : vec3<f32>, radius : f32,
     *     color : vec3<f32>,    intensity : f32,
     *     isSpotLight:f32,    directionX:f32,    directionY:f32,    directionZ:f32,
     *     outerCutoff:f32,    innerCutoff:f32,
     * };
     * struct ClusterLightList {
     *     count:vec4<f32>,
     *     lights : array<ClusterLight>
     * };
     * @group(0) @binding(5) var<storage> clusterLightList : ClusterLightList;
     * @group(0) @binding(6) var<storage, read_write> clusterLightGroup : ClusterLightsGroup;
     * ```
     */
    export const SYSTEM_UNIFORM = SYSTEM_UNIFORM_wgsl;

    /** [KO] 수학 관련 라이브러리 [EN] Math related library */
    export import math = MathLibrary;

    /** [KO] 색상 관련 라이브러리 [EN] Color related library */
    export import color = ColorLibrary;

    /** [KO] 깊이 관련 라이브러리 [EN] Depth related library */
    export import depth = DepthLibrary;
}

export default SystemCodeManager;
