import getHash1D_wgsl from './shader/math/getHash1D.wgsl';
import getHash1D_vec2_wgsl from './shader/math/getHash1D_vec2.wgsl';
import getHash1D_vec3_wgsl from './shader/math/getHash1D_vec3.wgsl';
import getHash1D_vec4_wgsl from './shader/math/getHash1D_vec4.wgsl';
import getHash2D_vec2_wgsl from './shader/math/getHash2D_vec2.wgsl';
import getHash3D_vec3_wgsl from './shader/math/getHash3D_vec3.wgsl';
import getInterleavedGradientNoise_wgsl from './shader/math/getInterleavedGradientNoise.wgsl';
import getBitHash1D_wgsl from './shader/math/getBitHash1D.wgsl';
import getBitHash1D_vec2_wgsl from './shader/math/getBitHash1D_vec2.wgsl';
import getBitHash1D_vec3_wgsl from './shader/math/getBitHash1D_vec3.wgsl';
import getBitHash1D_vec4_wgsl from './shader/math/getBitHash1D_vec4.wgsl';
import getBitHash2D_vec2_wgsl from './shader/math/getBitHash2D_vec2.wgsl';
import getBitHash3D_vec3_wgsl from './shader/math/getBitHash3D_vec3.wgsl';
import rgb_to_ycocg_wgsl from './shader/color/rgb_to_ycocg.wgsl';
import get_luminance_wgsl from './shader/color/get_luminance.wgsl';
import linearizeDepth_wgsl from './shader/depth/linearizeDepth.wgsl';
import SYSTEM_UNIFORM_wgsl from '../resources/systemCode/shader/SYSTEM_UNIFORM.wgsl';
import SystemVertexCode from '../resources/systemCode/shader/vertex';
import SystemFragmentCode from '../resources/systemCode/shader/fragment';

/**
 * [KO] 수학 관련 셰이더 함수 라이브러리
 * [EN] Math related shader function library
 */
export namespace MathLibrary {
    // [KO] Grid 기반 안정적 해시 시리즈
    /**
     * [KO] 단일 시드값을 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash1D(seed: f32) -> f32 {
     *     var x = u32(abs(seed)); // [KO] 명시적 정수 변환 [EN] Explicit integer conversion
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getHash1D = getHash1D_wgsl;
    /**
     * [KO] 2D 좌표를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by converting 2D coordinates to integers. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash1D_vec2(coord: vec2<f32>) -> f32 {
     *     let q = vec2<u32>(abs(coord));
     *     var x = q.x ^ q.y;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getHash1D_vec2 = getHash1D_vec2_wgsl;
    /**
     * [KO] 3D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a 3D vector to integers. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash1D_vec3(v: vec3<f32>) -> f32 {
     *     let q = vec3<u32>(abs(v));
     *     var x = q.x ^ q.y ^ q.z;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getHash1D_vec3 = getHash1D_vec3_wgsl;
    /**
     * [KO] 4D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a 4D vector to integers. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash1D_vec4(v: vec4<f32>) -> f32 {
     *     let q = vec4<u32>(abs(v));
     *     var x = q.x ^ q.y ^ q.z ^ q.w;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getHash1D_vec4 = getHash1D_vec4_wgsl;
    /**
     * [KO] 2D 좌표를 정수로 변환하여 2D 난수 벡터를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 2D random vector by converting 2D coordinates to integers. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
     *     var q = vec2<u32>(abs(coord));
     *     q = q * vec2<u32>(1597334677u, 3812015801u);
     *     let n = (q.x ^ q.y) * 1597334677u;
     *     q = vec2<u32>(n ^ (n >> 16u), n ^ (n << 16u));
     *     return vec2<f32>(q) / 4294967296.0;
     * }
     * ```
     */
    export const getHash2D_vec2 = getHash2D_vec2_wgsl;
    /**
     * [KO] 3D 위치를 정수로 변환하여 3D 난수 벡터를 생성합니다. (안정적 그리드 기반)
     * [EN] Generates a 3D random vector by converting a 3D position to integers. (Stable Grid-based)
     *
     * ```wgsl
     * fn getHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
     *     var q = vec3<u32>(abs(position));
     *     var x = q.x ^ q.y ^ q.z;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     
     *     let r = f32(x) / 4294967296.0;
     *     x = (x * 1103515245u + 12345u);
     *     let g = f32(x) / 4294967296.0;
     *     x = (x * 1103515245u + 12345u);
     *     let b = f32(x) / 4294967296.0;
     *     
     *     return vec3<f32>(r, g, b);
     * }
     * ```
     */
    export const getHash3D_vec3 = getHash3D_vec3_wgsl;
    
    // [KO] 초고속 노이즈
    /**
     * [KO] Jorge Jimenez의 Interleaved Gradient Noise를 생성합니다. (디더링 및 샘플 회전용 초고속 노이즈)
     * [EN] Generates Interleaved Gradient Noise by Jorge Jimenez. (Ultra-fast noise for dithering and sample rotation)
     *
     * ```wgsl
     * fn getInterleavedGradientNoise(screenCoord: vec2<f32>) -> f32 {
     *     let magic = vec3<f32>(0.06711056, 0.00583715, 52.9829189);
     *     return fract(magic.z * fract(dot(screenCoord, magic.xy)));
     * }
     * ```
     */
    export const getInterleavedGradientNoise = getInterleavedGradientNoise_wgsl;

    // [KO] Bitcast 기반 초정밀 해시 시리즈
    /**
     * [KO] 단일 시드값의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a single seed value. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash1D(seed: f32) -> f32 {
     *     var x = bitcast<u32>(seed);
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getBitHash1D = getBitHash1D_wgsl;
    /**
     * [KO] 2D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
     * [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 2D vector. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash1D_vec2(coord: vec2<f32>) -> f32 {
     *     let q = bitcast<vec2<u32>>(coord);
     *     var x = q.x ^ q.y;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getBitHash1D_vec2 = getBitHash1D_vec2_wgsl;
    /**
     * [KO] 3D 벡터의 비트 구조를 보존하여 1D 난수를 생성합니다. (초정밀)
     * [EN] Generates a 1D random number by preserving the bit structure of a 3D vector. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash1D_vec3(v: vec3<f32>) -> f32 {
     *     var q = bitcast<vec3<u32>>(v);
     *     var x = q.x ^ q.y ^ q.z;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getBitHash1D_vec3 = getBitHash1D_vec3_wgsl;
    /**
     * [KO] 4D 벡터의 비트 구조를 보존하여 1D 난수를 생성합니다. (초정밀)
     * [EN] Generates a 1D random number by preserving the bit structure of a 4D vector. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash1D_vec4(v: vec4<f32>) -> f32 {
     *     var q = bitcast<vec4<u32>>(v);
     *     var x = q.x ^ q.y ^ q.z ^ q.w;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     return f32(x) / 4294967296.0;
     * }
     * ```
     */
    export const getBitHash1D_vec4 = getBitHash1D_vec4_wgsl;
    /**
     * [KO] 2D 벡터의 비트 구조를 보존하여 2D 난수 벡터를 생성합니다. (초정밀)
     * [EN] Generates a 2D random vector by preserving the bit structure of a 2D vector. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
     *     var q = bitcast<vec2<u32>>(coord);
     *     q = q * vec2<u32>(1597334677u, 3812015801u);
     *     let n = (q.x ^ q.y) * 1597334677u;
     *     q = vec2<u32>(n ^ (n >> 16u), n ^ (n << 16u));
     *     return vec2<f32>(q) / 4294967296.0;
     * }
     * ```
     */
    export const getBitHash2D_vec2 = getBitHash2D_vec2_wgsl;
    /**
     * [KO] 3D 벡터의 비트 구조를 보존하여 3D 난수 벡터를 생성합니다. (초정밀)
     * [EN] Generates a 3D random vector by preserving the bit structure of a 3D vector. (Ultra-precise)
     *
     * ```wgsl
     * fn getBitHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
     *     var q = bitcast<vec3<u32>>(position);
     *     var x = q.x ^ q.y ^ q.z;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
     *     x = (x >> 16u) ^ x;
     *     
     *     let r = f32(x) / 4294967296.0;
     *     x = (x * 1103515245u + 12345u);
     *     let g = f32(x) / 4294967296.0;
     *     x = (x * 1103515245u + 12345u);
     *     let b = f32(x) / 4294967296.0;
     *     
     *     return vec3<f32>(r, g, b);
     * }
     * ```
     */
    export const getBitHash3D_vec3 = getBitHash3D_vec3_wgsl;
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
 * [KO] 엔진 시스템에서 전역적으로 사용되는 셰이더 코드 및 공통 라이브러리를 통합 관리하는 레지스트리입니다.
 * [EN] A registry that integrates and manages shader code and common libraries used globally in the engine.
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

    /** [KO] 수학 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for mathematics. */
    export import math = MathLibrary;

    /** [KO] 색상 변환 및 처리 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for color conversion and processing. */
    export import color = ColorLibrary;

    /** [KO] 깊이(Depth) 및 좌표 복구 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for depth and position reconstruction. */
    export import depth = DepthLibrary;

    /** [KO] 시스템 Vertex 관련 레거시 코드 [EN] System Vertex related legacy code */
    export const vertex = SystemVertexCode;
    /** [KO] 시스템 Fragment 관련 레거시 코드 [EN] System Fragment related legacy code */
    export const fragment = SystemFragmentCode;

    // [KO] 레거시 직접 참조 지원
    export const FragmentOutput = SystemFragmentCode.FragmentOutput;
    export const calcTintBlendMode = SystemFragmentCode.calcTintBlendMode;
    export const calcDirectionalShadowVisibility = SystemFragmentCode.calcDirectionalShadowVisibility;
    export const drawDirectionalShadowDepth = SystemFragmentCode.drawDirectionalShadowDepth;
    export const normalFunctions = SystemFragmentCode.normalFunctions;
    export const calcPrePathBackground = SystemFragmentCode.calcPrePathBackground;
    export const calculateMotionVector = SystemFragmentCode.calculateMotionVector;
    export const picking = SystemFragmentCode.picking;
    export const drawPicking = SystemFragmentCode.drawPicking;

    export const billboardPicking = SystemVertexCode.billboardPicking;
    export const billboardShadow = SystemVertexCode.billboardShadow;
    export const calcBillboard = SystemVertexCode.calcBillboard;
    export const calcDisplacements = SystemVertexCode.calcDisplacements;
    export const getBillboardMatrix = SystemVertexCode.getBillboardMatrix;
    export const extractScaleAndTranslation = SystemVertexCode.extractScaleAndTranslation;
    export const meshVertexBasicUniform = SystemVertexCode.meshVertexBasicUniform;
}

export default SystemCodeManager;
