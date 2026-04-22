import getHash1D_wgsl from './shader/math/hash/getHash1D.wgsl';
import getHash1D_vec2_wgsl from './shader/math/hash/getHash1D_vec2.wgsl';
import getHash1D_vec3_wgsl from './shader/math/hash/getHash1D_vec3.wgsl';
import getHash1D_vec4_wgsl from './shader/math/hash/getHash1D_vec4.wgsl';
import getHash2D_vec2_wgsl from './shader/math/hash/getHash2D_vec2.wgsl';
import getHash3D_vec3_wgsl from './shader/math/hash/getHash3D_vec3.wgsl';
import getInterleavedGradientNoise_wgsl from './shader/math/getInterleavedGradientNoise.wgsl';
import getLightDistanceAttenuation_wgsl from './shader/lighting/getLightDistanceAttenuation.wgsl';
import getLightAngleAttenuation_wgsl from './shader/lighting/getLightAngleAttenuation.wgsl';
import getBitHash1D_wgsl from './shader/math/hash/getBitHash1D.wgsl';
import getBitHash1D_vec2_wgsl from './shader/math/hash/getBitHash1D_vec2.wgsl';
import getBitHash1D_vec3_wgsl from './shader/math/hash/getBitHash1D_vec3.wgsl';
import getBitHash1D_vec4_wgsl from './shader/math/hash/getBitHash1D_vec4.wgsl';
import getBitHash2D_vec2_wgsl from './shader/math/hash/getBitHash2D_vec2.wgsl';
import getBitHash3D_vec3_wgsl from './shader/math/hash/getBitHash3D_vec3.wgsl';
import getRadicalInverseVanDerCorput_wgsl from './shader/math/hash/getRadicalInverseVanDerCorput.wgsl';
import getHammersley_wgsl from './shader/math/hash/getHammersley.wgsl';
import getNDCFromDepth_wgsl from './shader/math/reconstruct/getNDCFromDepth.wgsl';
import getWorldPositionFromDepth_wgsl from './shader/math/reconstruct/getWorldPositionFromDepth.wgsl';
import getViewPositionFromDepth_wgsl from './shader/math/reconstruct/getViewPositionFromDepth.wgsl';
import getWorldNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getWorldNormalFromGNormalBuffer.wgsl';
import getViewNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getViewNormalFromGNormalBuffer.wgsl';
import getViewDirection_wgsl from './shader/math/direction/getViewDirection.wgsl';
import getRayDirection_wgsl from './shader/math/direction/getRayDirection.wgsl';
import getReflectionVectorFromViewDirection_wgsl
    from './shader/math/direction/getReflectionVectorFromViewDirection.wgsl';
import getShadowCoord_wgsl from './shader/shadow/getShadowCoord.wgsl';
import getShadowClipPosition_wgsl from './shader/shadow/getShadowClipPosition.wgsl';
import getDirectionalShadowVisibility_wgsl from './shader/shadow/getDirectionalShadowVisibility.wgsl';
import getMotionVector_wgsl from './shader/math/getMotionVector.wgsl';
import getBillboardMatrix_wgsl from './shader/math/billboard/getBillboardMatrix.wgsl';
import getBillboardResult_wgsl from './shader/math/billboard/getBillboardResult.wgsl';
import getDisplacementPosition_wgsl from './shader/displacement/getDisplacementPosition.wgsl';
import getDisplacementNormal_wgsl from './shader/displacement/getDisplacementNormal.wgsl';
import getTBNFromVertexTangent_wgsl from './shader/math/tnb/getTBNFromVertexTangent.wgsl';
import getTBN_wgsl from './shader/math/tnb/getTBN.wgsl';
import getTBNFromCotangent_wgsl from './shader/math/tnb/getTBNFromCotangent.wgsl';
import getNormalFromNormalMap_wgsl from './shader/math/tnb/getNormalFromNormalMap.wgsl';
import rgbToYCoCg_wgsl from './shader/color/rgbToYCoCg.wgsl';
import YCoCgToRgb_wgsl from './shader/color/YCoCgToRgb.wgsl';
import linearToSrgbVec3_wgsl from './shader/color/linearToSrgbVec3.wgsl';
import linearToSrgbVec4_wgsl from './shader/color/linearToSrgbVec4.wgsl';
import srgbToLinearVec3_wgsl from './shader/color/srgbToLinearVec3.wgsl';
import srgbToLinearVec4_wgsl from './shader/color/srgbToLinearVec4.wgsl';
import getLuminance_wgsl from './shader/color/getLuminance.wgsl';
import getTintBlendMode_wgsl from './shader/color/getTintBlendMode.wgsl';
import getLinearizeDepth_wgsl from './shader/depth/getLinearizeDepth.wgsl';
import diffuseBRDFDisney_wgsl from './shader/lighting/getDiffuseBRDFDisney.wgsl';
import fresnelSchlick_wgsl from './shader/lighting/getFresnelSchlick.wgsl';
import conductorFresnel_wgsl from './shader/lighting/getConductorFresnel.wgsl';
import iridescentFresnel_wgsl from './shader/lighting/getIridescentFresnel.wgsl';
import distributionGGX_wgsl from './shader/lighting/getDistributionGGX.wgsl';
import geometrySmith_wgsl from './shader/lighting/getGeometrySmith.wgsl';
import specularVisibility_wgsl from './shader/lighting/getSpecularVisibility.wgsl';
import specularBRDF_wgsl from './shader/lighting/getSpecularBRDF.wgsl';
import specularBTDF_wgsl from './shader/lighting/getSpecularBTDF.wgsl';
import diffuseBTDF_wgsl from './shader/lighting/getDiffuseBTDF.wgsl';
import getPhongLight_wgsl from './shader/lighting/getPhongLight.wgsl';
import fresnelMix_wgsl from './shader/lighting/getFresnelMix.wgsl';
import fresnelCoat_wgsl from './shader/lighting/getFresnelCoat.wgsl';
import getIsFinite_wgsl from './shader/math/getIsFinite.wgsl';
import getKHRTextureTransformUV_wgsl from './shader/KHR/KHR_texture_transform/getKHRTextureTransformUV.wgsl';
import getSheenCharlieDFG_wgsl from './shader/KHR/KHR_materials_sheen/getSheenCharlieDFG.wgsl';
import getSheenCharlieE_wgsl from './shader/KHR/KHR_materials_sheen/getSheenCharlieE.wgsl';
import getSheenLambda_wgsl from './shader/KHR/KHR_materials_sheen/getSheenLambda.wgsl';
import getSheenIBL_wgsl from './shader/KHR/KHR_materials_sheen/getSheenIBL.wgsl';
import getAnisotropicNDF_wgsl from './shader/KHR/KHR_materials_anisotropy/getAnisotropicNDF.wgsl';
import getAnisotropicVisibility_wgsl from './shader/KHR/KHR_materials_anisotropy/getAnisotropicVisibility.wgsl';
import getAnisotropicSpecularBRDF_wgsl from './shader/KHR/KHR_materials_anisotropy/getAnisotropicSpecularBRDF.wgsl';
import getTransmissionRefraction_wgsl from './shader/lighting/getTransmissionRefraction.wgsl';
import getAtmosphereSunLight_wgsl from './shader/lighting/skyAtmosphere/getAtmosphereSunLight.wgsl';
import skyAtmosphereFn_wgsl from '../display/skyAtmosphere/core/skyAtmosphereFn.wgsl';
import transmittanceShaderCode_wgsl from '../display/skyAtmosphere/core/generator/transmittance/transmittanceShaderCode.wgsl';
import meshEntryPointPickingVertex_wgsl from './shader/entryPoint/mesh/entryPointPickingVertex.wgsl';
import meshEntryPointPickingFragment_wgsl from './shader/entryPoint/mesh/entryPointPickingFragment.wgsl';
import meshEntryPointShadowVertex_wgsl from './shader/entryPoint/mesh/entryPointShadowVertex.wgsl';
import billboardEntryPointPickingVertex_wgsl from './shader/entryPoint/billboard/entryPointPickingVertex.wgsl';
import emptyEntryPointPickingVertex_wgsl from './shader/entryPoint/empty/entryPointPickingVertex.wgsl';
import emptyEntryPointShadowVertex_wgsl from './shader/entryPoint/empty/entryPointShadowVertex.wgsl';
import OutputFragment_wgsl from './shader/systemStruct/OutputFragment.wgsl';
import OutputShadowData_wgsl from './shader/systemStruct/OutputShadowData.wgsl';
import Camera_wgsl from './shader/systemStruct/Camera.wgsl';
import Projection_wgsl from './shader/systemStruct/Projection.wgsl';
import Time_wgsl from './shader/systemStruct/Time.wgsl';
import DirectionalLight_wgsl from './shader/systemStruct/DirectionalLight.wgsl';
import AmbientLight_wgsl from './shader/systemStruct/AmbientLight.wgsl';
import Shadow_wgsl from './shader/systemStruct/Shadow.wgsl';
import SkyAtmosphere_wgsl from './shader/systemStruct/SkyAtmosphere.wgsl';
import meshVertexBasicUniform_wgsl from '../display/mesh/core/shader/meshVertexBasicUniform.wgsl';
import POST_EFFECT_SYSTEM_UNIFORM_wgsl from './shader/systemStruct/POST_EFFECT_SYSTEM_UNIFORM.wgsl';
import SYSTEM_UNIFORM_wgsl from './shader/systemStruct/SYSTEM_UNIFORM.wgsl';

/**
 * [KO] 수학 관련 셰이더 함수 라이브러리
 * [EN] Math related shader function library
 */
export namespace MathLibrary {
    /** [KO] 해시(Hash) 관련 셰이더 함수 [EN] Hash related shader functions */
    export namespace hash {
        /**
         * [KO] 단일 시드값을 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
         * [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)
         *
         * ```wgsl
         * fn getHash1D(seed: f32) -> f32 {
         *     var x = u32(abs(seed));
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u) ^ (q.w * 4000000007u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 1597334677u) ^ (q.y * 3812015801u);
         *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
         *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
         *     x = (x >> 16u) ^ x;
         *     
         *     let r = f32(x) / 4294967296.0;
         *     x = (x * 1103515245u + 12345u);
         *     let g = f32(x) / 4294967296.0;
         *     
         *     return vec2<f32>(r, g);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합 (일직선 패턴 방지)
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u) ^ (q.w * 4000000007u);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
         *     var x = (q.x * 1597334677u) ^ (q.y * 3812015801u);
         *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
         *     x = ((x >> 16u) ^ x) * 0x45d9f3bu;
         *     x = (x >> 16u) ^ x;
         *     
         *     let r = f32(x) / 4294967296.0;
         *     x = (x * 1103515245u + 12345u);
         *     let g = f32(x) / 4294967296.0;
         *     
         *     return vec2<f32>(r, g);
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
         *     // [KO] 소수 곱셈을 이용한 정밀 비트 혼합 (일직선 패턴 방지)
         *     var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
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
        /**
         * [KO] 입력된 정수의 비트 순서를 뒤집어 0~1 사이의 소수(Van der Corput 시퀀스)를 반환합니다.
         * [EN] Reverses the bits of an integer to return a floating-point number between 0 and 1 (Van der Corput sequence).
         *
         * ```wgsl
         * fn getRadicalInverseVanDerCorput(bits_in: u32) -> f32 {
         *     var bits = bits_in;
         *     bits = (bits << 16u) | (bits >> 16u);
         *     bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
         *     bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
         *     bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
         *     bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
         *     return f32(bits) * 2.3283064365386963e-10;
         * }
         * ```
         */
        export const getRadicalInverseVanDerCorput = getRadicalInverseVanDerCorput_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.hash.getRadicalInverseVanDerCorput
         * 
         * // [KO] 균일한 분포를 가지는 2D 준난수(Low-Discrepancy Sequence)를 생성합니다. (IBL 등 중요도 샘플링에 필수적입니다.)
         * // [EN] Generates a uniformly distributed 2D quasi-random number (Low-Discrepancy Sequence). (Essential for importance sampling like IBL.)
         * fn getHammersley(i: u32, N: u32) -> vec2<f32> {
         *     return vec2<f32>(f32(i) / f32(N), getRadicalInverseVanDerCorput(i));
         * }
         * ```
         */
        export const getHammersley = getHammersley_wgsl;
    }

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
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 현재 프레임과 이전 프레임의 클립 공간 좌표를 비교하여 모션 벡터(UV 단위)를 계산합니다.
     *  * [EN] Calculates the motion vector (in UV units) by comparing current and previous clip space coordinates.
     *  *
     *  * @param currentClipPos -
     *  * [KO] 현재 프레임의 Clip Space 위치
     *  * [EN] Current frame's clip space position
     *  * @param prevClipPos -
     *  * [KO] 이전 프레임의 Clip Space 위치
     *  * [EN] Previous frame's clip space position
     *  * @returns
     *  * [KO] UV 공간 상의 모션 벡터 (vec2)
     *  * [EN] Motion vector in UV space (vec2)
     *  *\/
     * fn getMotionVector(
     *     currentClipPos: vec4<f32>,
     *     prevClipPos: vec4<f32>,
     * ) -> vec2<f32> {
     *     // 1. Perspective Divide (NDC로 변환)
     *     // 0으로 나누기 방지를 위해 매우 작은 값(epsilon) 사용
     *     let currentNDC = currentClipPos.xy / max(currentClipPos.w, EPSILON);
     *     let prevNDC = prevClipPos.xy / max(prevClipPos.w, EPSILON);
     * 
     *     // 2. 모션 벡터 계산 (NDC 공간: -1 ~ 1 범위)
     *     // 현재 위치에서 이전 위치를 뺍니다.
     *     var motionVector = currentNDC - prevNDC;
     * 
     *     // 3. Y축 반전 보정 (중요)
     *     // WebGPU NDC의 Y축은 위가 +, 아래가 -이지만,
     *     // UV 좌표계(0~1)는 위가 0, 아래가 1이므로 방향을 맞춰줘야 합니다.
     *     motionVector.y = -motionVector.y;
     * 
     *     // 4. NDC(-2 ~ 2 범위의 차이)를 UV 단위(0 ~ 1 범위의 차이)로 변환
     *     // NDC 전체 너비가 2이므로 0.5를 곱해줍니다.
     *     let uvMotionVector = motionVector * 0.5;
     * 
     *     return uvMotionVector;
     * }
     * ```
     */
    export const getMotionVector = getMotionVector_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 단일 스칼라 값이 유한(Finite)한지 체크합니다. (NaN과 Inf 체크)
     *  * [EN] Checks if a single scalar value is finite. (Checks for NaN and Inf)
     *  *
     *  * @param x - [KO] 입력 스칼라 값 [EN] Input scalar value
     *  * @returns [KO] 유한 여부 [EN] Whether it is finite
     *  *\/
     * fn getIsFiniteScalar(x: f32) -> bool {
     *     // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
     *     return x == x && abs(x) < 1e30;
     * }
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] vec3 벡터의 모든 채널이 유한(Finite)한지 체크합니다.
     *  * [EN] Checks if all channels of a vec3 vector are finite.
     *  *
     *  * @param v - [KO] 입력 vec3 벡터 [EN] Input vec3 vector
     *  * @returns [KO] 채널별 유한 여부 (vec3<bool>) [EN] Whether each channel is finite (vec3<bool>)
     *  *\/
     * fn getIsFiniteVec3(v: vec3<f32>) -> vec3<bool> {
     *     return vec3<bool>(
     *         v.x == v.x && abs(v.x) < 1e30,
     *         v.y == v.y && abs(v.y) < 1e30,
     *         v.z == v.z && abs(v.z) < 1e30
     *     );
     * }
     * ```
     */
    export const getIsFinite = getIsFinite_wgsl;

    /** [KO] 빌보드(Billboard) 관련 셰이더 함수 [EN] Billboard related shader functions */
    export namespace billboard {
        /**
         * ```wgsl
         * /**
         *  * [KO] 빌보드 행렬을 계산합니다.
         *  * [EN] Calculates the billboard matrix.
         *  * @param viewMatrix - [KO] 카메라 행렬 [EN] Camera matrix
         *  * @param modelMatrix - [KO] 모델 행렬 [EN] Model matrix
         *  * @param useStandardScale - [KO] 1u: 표준 (정확한 스케일 추출), 0u: 빠른 스케일 (대각 성분 사용)
         *  *                           [EN] 1u: Standard (accurate scale extraction), 0u: Fast scale (uses diagonal elements)
         *  *\/
         * fn getBillboardMatrix(viewMatrix: mat4x4<f32>, modelMatrix: mat4x4<f32>, useStandardScale: u32) -> mat4x4<f32> {
         *     var resultMatrix = viewMatrix * modelMatrix;
         *     
         *     if (useStandardScale == 1u) {
         *         // [표준 모드] 회전이 포함된 행렬에서도 정확한 스케일 추출 (length 연산 포함)
         *         let scaleX = length(modelMatrix[0].xyz);
         *         let scaleY = length(modelMatrix[1].xyz);
         *         let scaleZ = length(modelMatrix[2].xyz);
         *         
         *         resultMatrix[0] = vec4<f32>(scaleX, 0.0, 0.0, resultMatrix[0].w);
         *         resultMatrix[1] = vec4<f32>(0.0, scaleY, 0.0, resultMatrix[1].w);
         *         resultMatrix[2] = vec4<f32>(0.0, 0.0, scaleZ, resultMatrix[2].w);
         *     } else {
         *         // [빠른 모드] 대각 성분을 직접 사용하여 회전 제거 (파티클 등 최적화용)
         *         resultMatrix[0] = vec4<f32>(modelMatrix[0][0], 0.0, 0.0, resultMatrix[0].w);
         *         resultMatrix[1] = vec4<f32>(0.0, modelMatrix[1][1], 0.0, resultMatrix[1].w);
         *         resultMatrix[2] = vec4<f32>(0.0, 0.0, modelMatrix[2][2], resultMatrix[2].w);
         *     }
         *     
         *     return resultMatrix;
         * }
         * ```
         */
        export const getBillboardMatrix = getBillboardMatrix_wgsl;
        /**
         * ```wgsl
         * struct BillboardResult {
         *     position: vec4<f32>,       // [KO] 클립 공간 좌표 [EN] Clip space position
         *     vertexPosition: vec3<f32>, // [KO] 뷰 공간 좌표 [EN] View space position
         *     vertexNormal: vec3<f32>,   // [KO] 뷰 공간 법선 [EN] View space normal
         * }
         * 
         * /**
         *  * [KO] 빌보드 및 픽셀 크기 모드를 지원하는 공통 정점 변환 결과 데이터를 리턴합니다.
         *  * [EN] Returns common vertex transformation result data supporting billboard and pixel size modes.
         *  *\/
         * fn getBillboardResult(
         *     input_position: vec3<f32>,
         *     input_normal: vec3<f32>,
         *     modelMatrix: mat4x4<f32>,
         *     viewMatrix: mat4x4<f32>,
         *     projectionMatrix: mat4x4<f32>,
         *     resolution: vec2<f32>,
         *     useBillboard: u32,
         *     usePixelSize: u32,
         *     pixelSize: f32,
         *     renderRatioX: f32,
         *     renderRatioY: f32
         * ) -> BillboardResult {
         *     var result: BillboardResult;
         *     
         *     let ratioScaleMatrix = mat4x4<f32>(
         *         renderRatioX, 0, 0, 0,
         *         0, renderRatioY, 0, 0,
         *         0, 0, 1, 0,
         *         0, 0, 0, 1
         *     );
         * 
         *     var viewPos: vec4<f32>;
         *     var viewNormal: vec4<f32>;
         * 
         *     if (useBillboard == 1u) {
         *         let billboardMatrix = getBillboardMatrix(viewMatrix, modelMatrix, 1u);
         *         
         *         if (usePixelSize == 1u) {
         *             // [Pixel Size 모드] - 피벗 기반 확장 및 W-보정 적용
         *             let viewCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
         *             let clipCenter = projectionMatrix * viewCenter;
         * 
         *             let scaleX = (pixelSize / resolution.x) * 2.0 * renderRatioX;
         *             let scaleY = (pixelSize / resolution.y) * 2.0 * renderRatioY;
         * 
         *             result.position = vec4<f32>(
         *                 clipCenter.xy + input_position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
         *                 clipCenter.zw
         *             );
         *             viewPos = viewCenter;
         *             viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0);
         *         } else {
         *             // [월드 모드] - 일반 빌보드 변환
         *             viewPos = billboardMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
         *             viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0); 
         *             result.position = projectionMatrix * viewPos;
         *         }
         *     } else {
         *         // [일반 모드] - 빌보드 없는 평면 변환
         *         viewPos = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
         *         viewNormal = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_normal, 0.0);
         *         result.position = projectionMatrix * viewPos;
         *     }
         * 
         *     result.vertexPosition = viewPos.xyz;
         *     result.vertexNormal = normalize(viewNormal.xyz);
         *     
         *     return result;
         * }
         * ```
         */
        export const getBillboardResult = getBillboardResult_wgsl;
    }

    /** [KO] 방향(Direction) 관련 셰이더 함수 [EN] Direction related shader functions */
    export namespace direction {
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 월드 좌표와 카메라 위치를 사용하여 정규화된 시선 방향 벡터(카메라를 향하는 벡터)를 계산합니다.
         *  * [EN] Calculates the normalized view direction vector (vector toward the camera) using world position and camera position.
         *  *
         *  * @param worldPosition - [KO] 월드 공간의 좌표 [EN] World space position
         *  * @param cameraPosition - [KO] 카메라의 월드 위치 [EN] Camera position in world space
         *  * @returns [KO] 정규화된 시선 방향 벡터 [EN] Normalized view direction vector
         *  *\/
         * fn getViewDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
         *     return normalize(cameraPosition - worldPosition);
         * }
         * ```
         */
        export const getViewDirection = getViewDirection_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 카메라 위치와 월드 좌표를 사용하여 정규화된 광선 방향 벡터(픽셀을 향하는 벡터)를 계산합니다.
         *  * [EN] Calculates the normalized ray direction vector (vector toward the pixel) using camera position and world position.
         *  *
         *  * @param worldPosition - [KO] 월드 공간의 좌표 [EN] World space position
         *  * @param cameraPosition - [KO] 카메라의 월드 위치 [EN] Camera position in world space
         *  * @returns [KO] 정규화된 광선 방향 벡터 [EN] Normalized ray direction vector
         *  *\/
         * fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
         *     return normalize(worldPosition - cameraPosition);
         * }
         * ```
         */
        export const getRayDirection = getRayDirection_wgsl;
        export const getReflectionVectorFromViewDirection = getReflectionVectorFromViewDirection_wgsl;
    }

    /** [KO] 공간 및 벡터 복구(Reconstruction) 관련 셰이더 함수 [EN] Space and vector reconstruction related shader functions */
    export namespace reconstruct {
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 스크린 UV와 깊이 값을 WebGPU 표준 NDC(Normalized Device Coordinates) 좌표로 변환합니다.
         *  * [EN] Converts screen UV and depth values to standard WebGPU NDC (Normalized Device Coordinates).
         *  *
         *  * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         *  * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         *  * @returns [KO] NDC 좌표 (-1~1 range for XY, 0~1 for Z) [EN] NDC coordinates
         *  *\/
         * fn getNDCFromDepth(uv: vec2<f32>, depth: f32) -> vec3<f32> {
         *     return vec3<f32>(
         *         uv.x * 2.0 - 1.0,
         *         (1.0 - uv.y) * 2.0 - 1.0, // WGSL 스크린 Y-Down을 NDC Y-Up으로 보정
         *         depth
         *     );
         * }
         * ```
         */
        export const getNDCFromDepth = getNDCFromDepth_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.reconstruct.getNDCFromDepth
         * 
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 깊이 정보를 바탕으로 월드 공간의 좌표를 복구합니다.
         *  * [EN] Reconstructs world space position from depth information.
         *  *
         *  * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         *  * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         *  * @param inverseProjectionViewMatrix - [KO] 역투영카메라 행렬 [EN] Inverse Projection-View matrix
         *  * @returns [KO] 복구된 월드 공간 좌표 [EN] Reconstructed world space position
         *  *\/
         * fn getWorldPositionFromDepth(
         *     uv: vec2<f32>,
         *     depth: f32,
         *     inverseProjectionViewMatrix: mat4x4<f32>
         * ) -> vec3<f32> {
         *     let ndc = getNDCFromDepth(uv, depth);
         *     let worldPos4 = inverseProjectionViewMatrix * vec4<f32>(ndc, 1.0);
         *     return worldPos4.xyz / worldPos4.w;
         * }
         * ```
         */
        export const getWorldPositionFromDepth = getWorldPositionFromDepth_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.reconstruct.getNDCFromDepth
         * 
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 깊이 정보를 바탕으로 뷰(카메라) 공간의 좌표를 복구합니다.
         *  * [EN] Reconstructs view (camera) space position from depth information.
         *  *
         *  * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         *  * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         *  * @param inverseProjectionMatrix - [KO] 역투영 행렬 [EN] Inverse Projection matrix
         *  * @returns [KO] 복구된 뷰 공간 좌표 [EN] Reconstructed view space position
         *  *\/
         * fn getViewPositionFromDepth(
         *     uv: vec2<f32>,
         *     depth: f32,
         *     inverseProjectionMatrix: mat4x4<f32>
         * ) -> vec3<f32> {
         *     let ndc = getNDCFromDepth(uv, depth);
         *     let viewPos4 = inverseProjectionMatrix * vec4<f32>(ndc, 1.0);
         *     return viewPos4.xyz / viewPos4.w;
         * }
         * ```
         */
        export const getViewPositionFromDepth = getViewPositionFromDepth_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] G-Buffer의 RGB 데이터([0, 1] 범위)를 사용하여 월드 공간 법선 벡터([-1, 1] 범위)를 복구합니다.
         *  * [EN] Reconstructs world space normal vector ([-1, 1] range) from G-Buffer RGB data ([0, 1] range).
         *  *
         *  * @param gBufferNormal - [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
         *  * @returns [KO] 복구된 월드 공간 법선 벡터 [EN] Reconstructed world space normal vector
         *  *\/
         * fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
         *     return normalize(gBufferNormal * 2.0 - 1.0);
         * }
         * ```
         */
        export const getWorldNormalFromGNormalBuffer = getWorldNormalFromGNormalBuffer_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer
         * 
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] G-Buffer 데이터와 카메라 행렬을 사용하여 뷰 공간 법선 벡터를 복구합니다.
         *  * [EN] Reconstructs view space normal vector from G-Buffer data and camera matrix.
         *  *
         *  * @param gBufferNormal - [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
         *  * @param viewMatrix - [KO] 카메라 행렬 (View Matrix) [EN] Camera matrix (View Matrix)
         *  * @returns [KO] 복구된 뷰 공간 법선 벡터 [EN] Reconstructed view space normal vector
         *  *\/
         * fn getViewNormalFromGNormalBuffer(gBufferNormal: vec3<f32>, viewMatrix: mat4x4<f32>) -> vec3<f32> {
         *     let worldNormal = getWorldNormalFromGNormalBuffer(gBufferNormal);
         *     return normalize((viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz);
         * }
         * ```
         */
        export const getViewNormalFromGNormalBuffer = getViewNormalFromGNormalBuffer_wgsl;
    }

    /** [KO] TNB(Tangent, Normal, Bitangent) 관련 셰이더 함수 [EN] TNB related shader functions */
    export namespace tnb {
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 법선(Normal)과 버텍스 탄젠트(vec4)를 사용하여 TBN(Tangent, Bitangent, Normal) 행렬을 구축합니다.
         *  * [EN] Constructs a TBN (Tangent, Bitangent, Normal) matrix using the normal and vertex tangent (vec4).
         *  *
         *  * @param inputNormal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
         *  * @param inputVertexTangent - [KO] 버텍스 탄젠트 데이터 (xyz: 방향, w: 방향성) [EN] Vertex tangent data
         *  * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         *  *\/
         * fn getTBNFromVertexTangent(inputNormal: vec3<f32>, inputVertexTangent: vec4<f32>) -> mat3x3<f32> {
         *     let tangent = normalize(inputVertexTangent.xyz);
         *     // [KO] glTF 표준 및 오른손 법칙 준수 (N x T = B)
         *     // [EN] Adheres to glTF standard and right-hand rule (N x T = B)
         *     let bitangent = normalize(cross(inputNormal, tangent) * inputVertexTangent.w);
         *     return mat3x3<f32>(tangent, bitangent, inputNormal);
         * }
         * ```
         */
        export const getTBNFromVertexTangent = getTBNFromVertexTangent_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.
         *  * [EN] Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.
         *  *
         *  * @param inputNormal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
         *  * @param inputTangent - [KO] 탄젠트 벡터 (법선과 수직이 아니어도 됨) [EN] Tangent vector (does not need to be perpendicular to normal)
         *  * @returns [KO] 3x3 직교 TBN 행렬 [EN] 3x3 Orthonormal TBN matrix
         *  *\/
         * fn getTBN(inputNormal: vec3<f32>, inputTangent: vec3<f32>) -> mat3x3<f32> {
         *     // Gram-Schmidt orthonormalization
         *     let tangent = normalize(inputTangent - inputNormal * dot(inputTangent, inputNormal));
         *     // [KO] 표준적인 오른손 좌표계 기저 형성 (N x T = B)
         *     // [EN] Standard right-handed basis formation (N x T = B)
         *     let bitangent = cross(inputNormal, tangent);
         *     return mat3x3<f32>(tangent, bitangent, inputNormal);
         * }
         * ```
         */
        export const getTBN = getTBN_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [Stage: Fragment Only]
         *  * [KO] 픽셀의 미분(Derivatives)을 사용하여 탄젠트와 비탄젠트를 동적으로 계산하고 TBN 행렬을 구축합니다.
         *  * [EN] Dynamically calculates tangent and bitangent using pixel derivatives and constructs a TBN matrix.
         *  *
         *  * @param inputNormal - [KO] 보간된 법선 벡터 [EN] Interpolated normal vector
         *  * @param inputWorldPos - [KO] 월드 공간의 픽셀 위치 [EN] World space pixel position
         *  * @param inputUV - [KO] 픽셀의 UV 좌표 [EN] Pixel UV coordinates
         *  * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         *  *\/
         * fn getTBNFromCotangent(inputNormal: vec3<f32>, inputWorldPos: vec3<f32>, inputUV: vec2<f32>) -> mat3x3<f32> {
         *     // 픽셀 미분을 통한 위치 및 UV 변화량 계산
         *     let dp1 = dpdx(inputWorldPos);
         *     let dp2 = dpdy(inputWorldPos);
         *     let duv1 = dpdx(inputUV);
         *     let duv2 = dpdy(inputUV);
         * 
         *     // 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
         *     let dp2perp = cross(dp2, inputNormal);
         *     let dp1perp = cross(inputNormal, dp1);
         *     let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
         *     let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;
         * 
         *     // Gram-Schmidt 직교화 및 행렬 구성
         *     let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
         *     return mat3x3<f32>(tangent * invmax, bitangent * invmax, inputNormal);
         * }
         * ```
         */
        export const getTBNFromCotangent = getTBNFromCotangent_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 노멀 맵 데이터를 탄젠트 공간의 법선 벡터로 변환하고 TBN 행렬을 적용합니다.
         *  * [EN] Converts normal map data to a tangent space normal vector and applies the TBN matrix.
         *  *
         *  * @param sampledNormalColor - [KO] 노멀 맵에서 샘플링된 데이터 (RG 또는 RGB) [EN] Sampled data from normal map (RG or RGB)
         *  * @param tbn - [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         *  * @param strength - [KO] 노멀 강도 [EN] Normal strength
         *  * @returns [KO] 월드/뷰 공간의 정규화된 법선 벡터 [EN] Normalized normal vector in world/view space
         *  *\/
         * fn getNormalFromNormalMap(sampledNormalColor: vec3<f32>, tbn: mat3x3<f32>, strength: f32) -> vec3<f32> {
         *     // 1. Unpack XY: [0, 1] -> [-1, 1]
         *     var n: vec2<f32> = sampledNormalColor.xy * 2.0 - 1.0;
         * 
         *     // 2. Apply Strength
         *     n *= strength;
         * 
         *     // 3. Z-Reconstruction: z = sqrt(1.0 - x^2 - y^2)
         *     let z: f32 = sqrt(max(0.0, 1.0 - dot(n, n)));
         * 
         *     // 4. Transform to World/View Space and Normalize
         *     return normalize(tbn * vec3<f32>(n, z));
         * }
         * ```
         */
        export const getNormalFromNormalMap = getNormalFromNormalMap_wgsl;
    }

    // 수학 상수
    export const PI = 'const PI: f32 = 3.141592653589793;';
    export const PI2 = 'const PI2: f32 = 6.283185307179586;';
    export const HPI = 'const HPI: f32 = 1.5707963267948966;';
    export const INV_PI = 'const INV_PI: f32 = 0.31830988618379067;';
    export const DEG_TO_RAD = 'const DEG_TO_RAD: f32 = 0.017453292519943295;';
    export const RAD_TO_DEG = 'const RAD_TO_DEG: f32 = 57.29577951308232;';
    export const EPSILON = 'const EPSILON: f32 = 1e-6;';
    export const FLT_MAX = 'const FLT_MAX: f32 = 3.402823466e+38;';
}

/**
 * [KO] glTF KHR 확장 관련 셰이더 함수 라이브러리
 * [EN] Shader function library for glTF KHR extensions
 */
export namespace KHRLibrary {
    /** [KO] KHR_texture_transform [EN] KHR_texture_transform */
    export namespace KHR_texture_transform {
        /**
         * ```wgsl
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] KHR_texture_transform 확장을 기반으로 UV 좌표를 변환합니다.
         *  * [EN] Transforms UV coordinates based on the KHR_texture_transform extension.
         *  *
         *  * [KO] 오프셋(Offset), 회전(Rotation), 스케일(Scale)을 적용하여 최종 UV 좌표를 계산하며, 멀티 UV(UV0, UV1)를 지원합니다.
         *  * [EN] Calculates the final UV coordinates by applying offset, rotation, and scale, supporting multi-UV (UV0, UV1).
         *  *
         *  * @param input_uv - [KO] 기본 UV 좌표 (UV0) [EN] Base UV coordinates (UV0)
         *  * @param input_uv1 - [KO] 보조 UV 좌표 (UV1) [EN] Secondary UV coordinates (UV1)
         *  * @param texCoord_index - [KO] 사용할 UV 인덱스 (0 또는 1) [EN] UV index to use (0 or 1)
         *  * @param use_transform - [KO] 변환 적용 여부 [EN] Whether to apply transform
         *  * @param transform_offset - [KO] UV 오프셋 [EN] UV offset
         *  * @param transform_rotation - [KO] UV 회전 (Radians) [EN] UV rotation (Radians)
         *  * @param transform_scale - [KO] UV 스케일 [EN] UV scale
         *  * @returns [KO] 변환된 최종 UV 좌표 [EN] Transformed final UV coordinates
         *  *\/
         * fn getKHRTextureTransformUV(
         *     input_uv: vec2<f32>,
         *     input_uv1: vec2<f32>,
         *     texCoord_index: u32,
         *     use_transform: u32,
         *     transform_offset: vec2<f32>,
         *     transform_rotation: f32,
         *     transform_scale: vec2<f32>
         * ) -> vec2<f32> {
         *     // 1. UV 좌표 선택 (UV index selection)
         *     var result_uv = select(input_uv, input_uv1, texCoord_index == 1u);
         * 
         *     // 2. 변환 적용 (Apply transformation if enabled)
         *     if (use_transform == 1u) {
         *         // Translation Matrix
         *         let translation = mat3x3<f32>(
         *             1.0, 0.0, 0.0,
         *             0.0, 1.0, 0.0,
         *             transform_offset.x, transform_offset.y, 1.0
         *         );
         * 
         *         // Rotation Matrix
         *         let cos_rot = cos(transform_rotation);
         *         let sin_rot = sin(transform_rotation);
         *         let rotation_matrix = mat3x3<f32>(
         *             cos_rot, -sin_rot, 0.0,
         *             sin_rot, cos_rot, 0.0,
         *             0.0, 0.0, 1.0
         *         );
         * 
         *         // Scale Matrix
         *         let scale_matrix = mat3x3<f32>(
         *             transform_scale.x, 0.0, 0.0,
         *             0.0, transform_scale.y, 0.0,
         *             0.0, 0.0, 1.0
         *         );
         * 
         *         // glTF KHR_texture_transform 규격에 따른 TRS 행렬 합성
         *         let result_matrix = translation * rotation_matrix * scale_matrix;
         *         result_uv = (result_matrix * vec3<f32>(result_uv, 1.0)).xy;
         *     }
         * 
         *     return result_uv;
         * }
         * ```
         */
        export const getKHRTextureTransformUV = getKHRTextureTransformUV_wgsl;
    }
    /** [KO] KHR_materials_sheen [EN] KHR_materials_sheen */
    export namespace KHR_materials_sheen {
        /**
         * ```wgsl
         * #redgpu_include math.EPSILON
         * 
         * /**
         *  * [KO] Charlie Sheen 모델의 DFG(Distribution, Fresnel, Geometry) 통합 항을 계산합니다.
         *  * [EN] Calculates the integrated DFG term for the Charlie Sheen model.
         *  *
         *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
         *  * @param roughness - [KO] Sheen 거칠기 [EN] Sheen roughness
         *  * @returns [KO] 계산된 DFG 값 [EN] Calculated DFG value
         *  *\/
         * fn getSheenCharlieDFG(NdotV: f32, roughness: f32) -> f32 {
         *     if (roughness < 0.01) {
         *         return 0.0;
         *     }
         * 
         *     let r = clamp(roughness, 0.01, 1.0);
         *     let grazingFactor = 1.0 - NdotV;
         *     let roughnessExp = 1.0 / max(r, EPSILON);
         *     let distribution = pow(grazingFactor, roughnessExp);
         *     let intensity = pow(roughnessExp, 0.5);
         * 
         *     return distribution * intensity * 0.5;
         * }
         * ```
         */
        export const getSheenCharlieDFG = getSheenCharlieDFG_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.EPSILON
         * 
         * /**
         *  * [KO] Charlie Sheen 모델의 에너지 보존을 위한 E항을 계산합니다. (Albedo scaling용)
         *  * [EN] Calculates the E term for energy conservation in the Charlie Sheen model. (For albedo scaling)
         *  *
         *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
         *  * @param roughness - [KO] Sheen 거칠기 [EN] Sheen roughness
         *  * @returns [KO] 계산된 E 값 [EN] Calculated E value
         *  *\/
         * fn getSheenCharlieE(NdotV: f32, roughness: f32) -> f32 {
         *     if (roughness < 0.01) {
         *         return 0.0;
         *     }
         * 
         *     let r = clamp(roughness, 0.01, 1.0);
         *     let grazingFactor = 1.0 - NdotV;
         *     let roughnessExp = 1.0 / max(r, EPSILON);
         * 
         *     return pow(grazingFactor, roughnessExp) * pow(r, 0.5);
         * }
         * ```
         */
        export const getSheenCharlieE = getSheenCharlieE_wgsl;
        /**
         * ```wgsl
         * /**
         *  * [KO] Charlie Sheen 모델의 가시성(Visibility) 항 계산을 위한 Lambda 함수입니다.
         *  * [EN] Lambda function for calculating the visibility term in the Charlie Sheen model.
         *  *
         *  * @param cosTheta - [KO] 법선과 방향 벡터의 내적 (NdotV 또는 NdotL) [EN] Dot product of normal and direction vector
         *  * @param alpha - [KO] Sheen 거칠기 값 [EN] Sheen roughness value
         *  * @returns [KO] 계산된 Lambda 값 [EN] Calculated Lambda value
         *  *\/
         * fn getSheenLambda(cosTheta: f32, alpha: f32) -> f32 {
         *     if (cosTheta <= 0.0) {
         *         return 0.0;
         *     }
         *     
         *     // [KO] Charlie Sheen 가시성 근사식 (Estevez and Kulla)
         *     // [EN] Charlie Sheen visibility approximation (Estevez and Kulla)
         *     if (cosTheta < 0.5) {
         *         return exp(-1.01242 / alpha) * pow(cosTheta, 3.72201 + 0.10060 * alpha) / (alpha * (0.00327 - 0.04313 * alpha));
         *     } else {
         *         return exp(-0.39031 / alpha) * pow(cosTheta, 0.58707 + 0.04651 * alpha) / (alpha * (0.09028 + 0.03032 * alpha));
         *     }
         * }
         * ```
         */
        export const getSheenLambda = getSheenLambda_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.EPSILON
         * #redgpu_include math.direction.getReflectionVectorFromViewDirection
         * #redgpu_include KHR.KHR_materials_sheen.getSheenCharlieDFG
         * #redgpu_include KHR.KHR_materials_sheen.getSheenCharlieE
         * 
         * struct SheenIBLResult {
         *     sheenIBLContribution: vec3<f32>,
         *     sheenAlbedoScaling: f32
         * }
         * 
         * /**
         *  * [Stage: Fragment, Compute]
         *  * [KO] Charlie 모델 기반의 Sheen IBL 기여도를 통합 계산합니다.
         *  * [EN] Integrally calculates Sheen IBL contribution based on the Charlie model.
         *  *
         *  * @param N - [KO] 법선 벡터 [EN] Normal vector
         *  * @param V - [KO] 시선 방향 벡터 [EN] View direction vector
         *  * @param sheenColor - [KO] Sheen 색상 [EN] Sheen color
         *  * @param maxSheenColor - [KO] Sheen 색상의 최대 채널 값 [EN] Maximum channel value of sheen color
         *  * @param sheenRoughness - [KO] Sheen 거칠기 [EN] Sheen roughness
         *  * @param iblMipmapCount - [KO] IBL 텍스처의 밉맵 수 [EN] Mipmap count of IBL texture
         *  * @param irradianceTexture - [KO] IBL 환경 텍스처 [EN] IBL environment texture
         *  * @param textureSampler - [KO] 환경 텍스처 샘플러 [EN] Environment texture sampler
         *  * @returns [KO] Sheen IBL 계산 결과 (기여도 및 알베도 스케일링) [EN] Sheen IBL calculation result
         *  *\/
         * fn getSheenIBL(
         *     N: vec3<f32>,
         *     V: vec3<f32>,
         *     sheenColor: vec3<f32>,
         *     maxSheenColor: f32,
         *     sheenRoughness: f32,
         *     iblMipmapCount: f32,
         *     irradianceTexture: texture_cube<f32>,
         *     textureSampler: sampler
         * ) -> SheenIBLResult {
         *     let NdotV = clamp(dot(N, V), EPSILON, 1.0);
         *     let R = getReflectionVectorFromViewDirection(V, N);
         * 
         *     let mipLevel = sheenRoughness * iblMipmapCount;
         *     let sheenRadiance = textureSampleLevel(irradianceTexture, textureSampler, R, mipLevel).rgb;
         * 
         *     let sheenDFG = getSheenCharlieDFG(NdotV, sheenRoughness);
         *     let contribution = sheenRadiance * sheenColor * sheenDFG;
         * 
         *     let E = getSheenCharlieE(NdotV, sheenRoughness);
         *     let albedoScaling = 1.0 - maxSheenColor * E;
         * 
         *     return SheenIBLResult(contribution, albedoScaling);
         * }
         * ```
         */
        export const getSheenIBL = getSheenIBL_wgsl;
    }
    /** [KO] KHR_materials_anisotropy [EN] KHR_materials_anisotropy */
    export namespace KHR_materials_anisotropy {
        /**
         * ```wgsl
         * #redgpu_include math.INV_PI
         * #redgpu_include math.EPSILON
         * 
         * /**
         *  * [KO] 이방성 GGX(Trowbridge-Reitz) 법선 분포 함수(NDF)를 계산합니다.
         *  * [EN] Calculates the Anisotropic GGX (Trowbridge-Reitz) Normal Distribution Function (NDF).
         *  *
         *  * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
         *  * @param TdotH - [KO] 탄젠트와 하프 벡터의 내적 [EN] Dot product of tangent and half vector
         *  * @param BdotH - [KO] 비탄젠트와 하프 벡터의 내적 [EN] Dot product of bitangent and half vector
         *  * @param at - [KO] 탄젠트 방향의 거칠기 [EN] Roughness in the tangent direction
         *  * @param ab - [KO] 비탄젠트 방향의 거칠기 [EN] Roughness in the bitangent direction
         *  * @returns [KO] 계산된 NDF 값 [EN] Calculated NDF value
         *  *\/
         * fn getAnisotropicNDF(NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32) -> f32 {
         *     let a2: f32 = at * ab;
         *     let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
         *     let denominator: f32 = dot(f, f);
         *     
         *     // [KO] 수치적 안정성을 위해 INV_PI 적용 및 0 나누기 방어
         *     // [EN] Applies INV_PI and prevents division by zero for numerical stability
         *     let w2: f32 = a2 / max(denominator, EPSILON);
         *     return a2 * w2 * w2 * INV_PI;
         * }
         * ```
         */
        export const getAnisotropicNDF = getAnisotropicNDF_wgsl;
        /**
         * ```wgsl
         * #redgpu_include math.EPSILON
         * 
         * /**
         *  * [KO] 이방성 GGX 스펙큘러 BRDF를 위한 가시성(Visibility) 항을 계산합니다.
         *  * [EN] Calculates the Visibility term for Anisotropic GGX specular BRDF.
         *  *
         *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
         *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
         *  * @param BdotV - [KO] 비탄젠트와 시선 방향의 내적 [EN] Dot product of bitangent and view direction
         *  * @param TdotV - [KO] 탄젠트와 시선 방향의 내적 [EN] Dot product of tangent and view direction
         *  * @param TdotL - [KO] 탄젠트와 광원 방향의 내적 [EN] Dot product of tangent and light direction
         *  * @param BdotL - [KO] 비탄젠트와 광원 방향의 내적 [EN] Dot product of bitangent and light direction
         *  * @param at - [KO] 탄젠트 방향의 거칠기 [EN] Roughness in the tangent direction
         *  * @param ab - [KO] 비탄젠트 방향의 거칠기 [EN] Roughness in the bitangent direction
         *  * @returns [KO] 계산된 가시성 값 [EN] Calculated visibility value
         *  *\/
         * fn getAnisotropicVisibility(
         *     NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, 
         *     at: f32, ab: f32
         * ) -> f32 {
         *    let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
         *    let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
         *    let v = 0.5 / max(GGXV + GGXL, EPSILON);
         *    return clamp(v, 0.0, 1.0);
         * }
         * ```
         */
        export const getAnisotropicVisibility = getAnisotropicVisibility_wgsl;
        /**
         * ```wgsl
         * #redgpu_include lighting.getFresnelSchlick
         * #redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicNDF
         * #redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicVisibility
         * 
         * /**
         *  * [Stage: Common (Vertex, Fragment, Compute)]
         *  * [KO] 이방성(Anisotropic) GGX 모델을 사용하여 물리 기반 스펙큘러 BRDF를 계산합니다.
         *  * [EN] Calculates Physically-Based Specular BRDF using the Anisotropic GGX model.
         *  *
         *  * @param f0 - [KO] 기본 반사율 [EN] Base reflectance
         *  * @param alphaRoughness - [KO] 표면 거칠기 [EN] Surface roughness
         *  * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
         *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
         *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
         *  * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
         *  * @param BdotV - [KO] 비탄젠트와 시선 방향의 내적 [EN] Dot product of bitangent and view direction
         *  * @param TdotV - [KO] 탄젠트와 시선 방향의 내적 [EN] Dot product of tangent and view direction
         *  * @param TdotL - [KO] 탄젠트와 광원 방향의 내적 [EN] Dot product of tangent and light direction
         *  * @param BdotL - [KO] 비탄젠트와 광원 방향의 내적 [EN] Dot product of bitangent and light direction
         *  * @param TdotH - [KO] 탄젠트와 하프 벡터의 내적 [EN] Dot product of tangent and half vector
         *  * @param BdotH - [KO] 비탄젠트와 하프 벡터의 내적 [EN] Dot product of bitangent and half vector
         *  * @param anisotropy - [KO] 이방성 강도 [EN] Anisotropy strength
         *  * @returns [KO] 계산된 이방성 스펙큘러 BRDF 값 [EN] Calculated anisotropic specular BRDF value
         *  *\/
         * fn getAnisotropicSpecularBRDF(
         *     f0: vec3<f32>, 
         *     alphaRoughness: f32, 
         *     VdotH: f32, 
         *     NdotL: f32, 
         *     NdotV: f32, 
         *     NdotH: f32, 
         *     BdotV: f32, 
         *     TdotV: f32, 
         *     TdotL: f32, 
         *     BdotL: f32, 
         *     TdotH: f32, 
         *     BdotH: f32, 
         *     anisotropy: f32
         * ) -> vec3<f32> {
         *     // [KO] 이방성 파라미터를 기반으로 방향별 거칠기(alpha) 계산
         *     // [EN] Calculates directional roughness (alpha) based on anisotropic parameters
         *     var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
         *     var ab = alphaRoughness;
         *     
         *     var F: vec3<f32> = getFresnelSchlick(VdotH, f0);
         *     var V: f32 = getAnisotropicVisibility(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
         *     var D: f32 = getAnisotropicNDF(NdotH, TdotH, BdotH, at, ab);
         *     
         *     return F * (V * D);
         * }
         * ```
         */
        export const getAnisotropicSpecularBRDF = getAnisotropicSpecularBRDF_wgsl;
    }
}

/**
 * [KO] 디스플레이스먼트(Displacement) 관련 셰이더 함수 라이브러리
 * [EN] Displacement related shader function library
 */
export namespace DisplacementLibrary {
    /**
     * ```wgsl
     * /**
     *  * [KO] 디스플레이스먼트 텍스처를 기반으로 변형된 정점 위치를 계산합니다.
     *  * [EN] Calculates the modified vertex position based on the displacement texture.
     *  *
     *  * @param input_position - [KO] 정점의 로컬 위치 [EN] Local position of the vertex
     *  * @param input_vertexNormal - [KO] 정점의 로컬 법선 벡터 [EN] Local normal vector of the vertex
     *  * @param displacementTexture - [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
     *  * @param displacementTextureSampler - [KO] 디스플레이스먼트 텍스처 샘플러 [EN] Displacement texture sampler
     *  * @param displacementScale - [KO] 디스플레이스먼트 강도 [EN] Displacement scale
     *  * @param input_uv - [KO] UV 좌표 [EN] UV coordinates
     *  * @param mipLevel - [KO] 샘플링할 MIP 레벨 [EN] MIP level to sample
     *  * @returns [KO] 변형된 로컬 공간 정점 위치 [EN] Modified local space vertex position
     *  *\/
     * fn getDisplacementPosition(
     *     input_position: vec3<f32>,
     *     input_vertexNormal: vec3<f32>,
     *     displacementTexture: texture_2d<f32>,
     *     displacementTextureSampler: sampler,
     *     displacementScale: f32,
     *     input_uv: vec2<f32>,
     *     mipLevel: f32
     * ) -> vec3<f32> {
     *     // [KO] 디스플레이스먼트 텍스처에서 높이 값 샘플링 (R 채널 사용)
     *     // [EN] Sample the height value from the displacement texture (using the R channel)
     *     let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
     * 
     *     // [KO] 0.5를 기준으로 높이를 스케일링 (0.5는 변위 없음, 1.0은 확장, 0.0은 수축)
     *     // [EN] Scale the height based on 0.5 (0.5 means no displacement, 1.0 expansion, 0.0 contraction)
     *     let scaledDisplacement = (displacementSample - 0.5) * displacementScale;
     * 
     *     // [KO] 정점 법선 방향으로 위치 이동
     *     // [EN] Move the position in the direction of the vertex normal
     *     let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;
     * 
     *     return displacedPosition;
     * }
     * ```
     */
    export const getDisplacementPosition = getDisplacementPosition_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] 디스플레이스먼트 텍스처를 기반으로 변형된 법선 벡터를 계산합니다.
     *  * [EN] Calculates the modified normal vector based on the displacement texture.
     *  *
     *  * @param input_worldNormal - [KO] 월드 공간의 정점 법선 벡터 [EN] Vertex normal vector in world space
     *  * @param displacementTexture - [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
     *  * @param displacementTextureSampler - [KO] 디스플레이스먼트 텍스처 샘플러 [EN] Displacement texture sampler
     *  * @param displacementScale - [KO] 디스플레이스먼트 강도 [EN] Displacement scale
     *  * @param input_uv - [KO] UV 좌표 [EN] UV coordinates
     *  * @param mipLevel - [KO] 샘플링할 MIP 레벨 [EN] MIP level to sample
     *  * @returns [KO] 변형된 월드 공간 법선 벡터 [EN] Modified normal vector in world space
     *  *\/
     * fn getDisplacementNormal(
     *     input_worldNormal: vec3<f32>,
     *     displacementTexture: texture_2d<f32>,
     *     displacementTextureSampler: sampler,
     *     displacementScale: f32,
     *     input_uv: vec2<f32>,
     *     mipLevel: f32
     * ) -> vec3<f32> {
     *     // [KO] 텍스처 해상도 기반 적응형 오프셋 계산
     *     // [EN] Calculate adaptive offset based on texture resolution
     *     let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
     *     let adaptiveOffset = vec2<f32>(1.0) / textureDimensions;
     * 
     *     // [KO] 중앙 차분법(Central Difference)을 위한 주변 픽셀 샘플링
     *     // [EN] Sampling surrounding pixels for Central Difference
     *     let left  = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv - vec2<f32>(adaptiveOffset.x, 0.0), mipLevel).r;
     *     let right = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(adaptiveOffset.x, 0.0), mipLevel).r;
     *     let up    = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv - vec2<f32>(0.0, adaptiveOffset.y), mipLevel).r;
     *     let down  = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(0.0, adaptiveOffset.y), mipLevel).r;
     * 
     *     // [KO] 높이 그라디언트 계산
     *     // [EN] Calculate height gradient
     *     // ddx: u 방향(X축) 증가에 따른 높이 변화
     *     // ddy: v 방향(Y축) 증가에 따른 높이 변화. WebGPU는 V가 아래로 증가하므로 down - up
     *     let ddx = (right - left) * displacementScale / (2.0 * adaptiveOffset.x);
     *     let ddy = (down - up) * displacementScale / (2.0 * adaptiveOffset.y);
     * 
     *     // [KO] 월드 공간 법선 섭동 (Perturbation)
     *     // [EN] World space normal perturbation
     *     // [KO] 탄젠트 정보를 명시적으로 받지 못하므로, 월드 노멀을 기준으로 직교 기저(Orthonormal Basis)를 임시 생성합니다.
     *     // [EN] Since tangent info is not explicitly provided, create a temporary orthonormal basis based on the world normal.
     *     let N = normalize(input_worldNormal);
     *     
     *     var T = vec3<f32>(1.0, 0.0, 0.0);
     *     if (abs(N.y) > 0.999) {
     *         T = vec3<f32>(0.0, 0.0, 1.0);
     *     }
     *     T = normalize(cross(T, N));
     *     let B = cross(N, T);
     * 
     *     // [KO] 최종 노멀 계산: N' = normalize(N - ddx*T - ddy*B)
     *     // [EN] Final normal calculation: N' = normalize(N - ddx*T - ddy*B)
     *     // [KO] 거리에 따른(MIP 레벨) 강도 감쇄 적용
     *     // [EN] Apply intensity attenuation based on distance (MIP level)
     *     let normalStrength = clamp(1.0 - mipLevel * 0.1, 0.0, 1.0);
     *     let perturbedNormal = normalize(N - (ddx * T + ddy * B) * (normalStrength * 0.1));
     * 
     *     return perturbedNormal;
     * }
     * ```
     */
    export const getDisplacementNormal = getDisplacementNormal_wgsl;
}

/**
 * [KO] 그림자 관련 셰이더 함수 라이브러리
 * [EN] Shadow related shader function library
 */
export namespace ShadowLibrary {
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 월드 좌표를 빛의 클립 공간 좌표(UV + Depth)로 변환합니다.
     *  * [EN] Converts world coordinates to light's clip space coordinates (UV + Depth).
     *  *
     *  * @param worldPosition -
     *  * [KO] 월드 공간 상의 위치
     *  * [EN] Position in world space
     *  * @param lightViewProjectionMatrix -
     *  * [KO] 빛의 View-Projection 행렬
     *  * [EN] Light's View-Projection matrix
     *  * @returns
     *  * [KO] 그림자 맵 샘플링을 위한 vec3 좌표 (x, y: UV, z: Depth)
     *  * [EN] vec3 coordinates for shadow map sampling (x, y: UV, z: Depth)
     *  *\/
     * fn getShadowCoord(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec3<f32> {
     *     // 1. 빛의 공간으로 변환 (Convert to light space)
     *     let posFromLight = lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
     *     
     *     // 2. 원근 분할 적용 (Apply perspective divide)
     *     // - 직교 투영(Directional)에서는 w가 1이지만, 원근 투영(Spot)을 위해 분할을 수행합니다.
     *     let shadowCoordNDC = posFromLight.xyz / posFromLight.w;
     *     
     *     // 3. NDC [-1, 1] 범위를 UV [0, 1] 범위로 변환
     *     // - WebGPU 표준: (x * 0.5 + 0.5), (y * -0.5 + 0.5)
     *     return vec3<f32>(
     *         shadowCoordNDC.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5, 0.5),
     *         shadowCoordNDC.z
     *     );
     * }
     * ```
     */
    export const getShadowCoord = getShadowCoord_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Vertex Only]
     *  * [KO] 월드 좌표를 빛의 관점에서의 클립 공간(Clip Space) 좌표로 변환합니다. (Shadow Pass 전용)
     *  * [EN] Converts world coordinates to clip space coordinates from the light's perspective. (For Shadow Pass)
     *  *
     *  * @param worldPosition - [KO] 월드 공간 상의 위치 [EN] Position in world space
     *  * @param lightViewProjectionMatrix - [KO] 빛의 View-Projection 행렬 [EN] Light's View-Projection matrix
     *  * @returns [KO] 빛의 클립 공간 좌표 (vec4) [EN] Light's clip space coordinates (vec4)
     *  *\/
     * fn getShadowClipPosition(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec4<f32> {
     *     // [KO] 월드 좌표를 빛의 공간으로 투영
     *     // [EN] Projects world coordinates into light space
     *     return lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
     * }
     * ```
     */
    export const getShadowClipPosition = getShadowClipPosition_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Fragment Only (or Compute with textureSampleCompare)]
     *  * [KO] 방향성 광원의 그림자 가시성(Visibility)을 계산합니다.
     *  * [EN] Calculates the shadow visibility for a directional light.
     *  *
     *  * @param directionalShadowMap -
     *  * [KO] 방향성 광원용 깊이 텍스처
     *  * [EN] Depth texture for directional light
     *  * @param directionalShadowMapSampler -
     *  * [KO] 비교 샘플러
     *  * [EN] Comparison sampler
     *  * @param shadowDepthTextureSize -
     *  * [KO] 그림자 텍스처의 크기
     *  * [EN] Size of the shadow texture
     *  * @param bias -
     *  * [KO] 그림자 바이어스
     *  * [EN] Shadow bias
     *  * @param shadowCoord -
     *  * [KO] [0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값)
     *  * [EN] Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
     *  * @returns
     *  * [KO] 가시성 계수 (0.0 ~ 1.0)
     *  * [EN] Visibility factor (0.0 ~ 1.0)
     *  *\/
     * fn getDirectionalShadowVisibility(
     *    directionalShadowMap: texture_depth_2d,
     *    directionalShadowMapSampler: sampler_comparison,
     *    shadowDepthTextureSize: u32,
     *    bias: f32,
     *    shadowCoord: vec3<f32>
     * ) -> f32 {
     *     let oneOverShadowDepthTextureSize = 1.0 / f32(shadowDepthTextureSize);
     *     let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);
     * 
     *     var visibility: f32 = 0.0;
     * 
     *     // 3x3 PCF 필터링 적용 (Apply 3x3 PCF filtering)
     *     for (var y = -1; y <= 1; y++) {
     *         for (var x = -1; x <= 1; x++) {
     *             let offset = vec2f(vec2(x, y)) * oneOverShadowDepthTextureSize;
     *             let tUV = shadowCoord.xy + offset;
     * 
     *             let sampleVisibility = textureSampleCompare(
     *                 directionalShadowMap,
     *                 directionalShadowMapSampler,
     *                 tUV,
     *                 shadowDepth - bias
     *             );
     * 
     *             // 텍스처 범위를 벗어난 경우 그림자가 없는 것으로 처리 (Visibility 1.0)
     *             if (tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0) {
     *                 visibility += 1.0;
     *             } else {
     *                 visibility += sampleVisibility;
     *             }
     *         }
     *     }
     * 
     *     visibility /= 9.0;
     * 
     *     // 거리에 따른 최소 가시성 보정 (Legacy logic preserved)
     *     let depthFactor = shadowDepth;
     *     let minVisibility = 0.2 + depthFactor * 0.6;
     * 
     *     return max(visibility, minVisibility);
     * }
     * ```
     */
    export const getDirectionalShadowVisibility = getDirectionalShadowVisibility_wgsl;
}

/**
 * [KO] 색상 관련 셰이더 함수 라이브러리
 * [EN] Color related shader function library
 */
export namespace ColorLibrary {
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] RGB 색상을 YCoCg 색 공간으로 변환합니다. (TAA 및 압축 효율 최적화)
     *  * [EN] Converts RGB color to YCoCg color space. (Optimized for TAA and compression efficiency)
     *  *\/
     * fn rgbToYCoCg(rgb: vec3<f32>) -> vec3<f32> {
     *     let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
     *     let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
     *     let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
     *     return vec3<f32>(y, co, cg);
     * }
     * ```
     */
    export const rgbToYCoCg = rgbToYCoCg_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] YCoCg 색상을 RGB 색 공간으로 복원합니다.
     *  * [EN] Restores YCoCg color back to RGB color space.
     *  *\/
     * fn YCoCgToRgb(ycocg: vec3<f32>) -> vec3<f32> {
     *     let y = ycocg.x;
     *     let co = ycocg.y;
     *     let cg = ycocg.z;
     *     return vec3<f32>(y + co - cg, y + cg, y - co - cg);
     * }
     * ```
     */
    export const YCoCgToRgb = YCoCgToRgb_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] Linear 색 공간의 vec3 색상을 sRGB 색 공간으로 변환합니다.
     *  * [EN] Converts vec3 color from Linear color space to sRGB color space.
     *  *\/
     * fn linearToSrgbVec3(linearColor: vec3<f32>) -> vec3<f32> {
     *     return select(
     *         12.92 * linearColor,
     *         1.055 * pow(linearColor, vec3<f32>(1.0 / 2.4)) - 0.055,
     *         linearColor > vec3<f32>(0.0031308)
     *     );
     * }
     * ```
     */
    export const linearToSrgbVec3 = linearToSrgbVec3_wgsl;
    /**
     * ```wgsl
     * #redgpu_include color.linearToSrgbVec3
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] Linear 색 공간의 vec4 색상을 sRGB 색 공간으로 변환합니다. (Alpha 보존)
     *  * [EN] Converts vec4 color from Linear color space to sRGB color space. (Preserves Alpha)
     *  *\/
     * fn linearToSrgbVec4(linearColor: vec4<f32>) -> vec4<f32> {
     *     return vec4<f32>(linearToSrgbVec3(linearColor.rgb), linearColor.a);
     * }
     * ```
     */
    export const linearToSrgbVec4 = linearToSrgbVec4_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] sRGB 색 공간의 vec3 색상을 Linear 색 공간으로 변환합니다.
     *  * [EN] Converts vec3 color from sRGB color space to Linear color space.
     *  *\/
     * fn srgbToLinearVec3(srgbColor: vec3<f32>) -> vec3<f32> {
     *     return select(
     *         srgbColor / 12.92,
     *         pow((srgbColor + 0.055) / 1.055, vec3<f32>(2.4)),
     *         srgbColor > vec3<f32>(0.04045)
     *     );
     * }
     * ```
     */
    export const srgbToLinearVec3 = srgbToLinearVec3_wgsl;
    /**
     * ```wgsl
     * #redgpu_include color.srgbToLinearVec3
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] sRGB 색 공간의 vec4 색상을 Linear 색 공간으로 변환합니다. (Alpha 보존)
     *  * [EN] Converts vec4 color from sRGB color space to Linear color space. (Preserves Alpha)
     *  *\/
     * fn srgbToLinearVec4(srgbColor: vec4<f32>) -> vec4<f32> {
     *     return vec4<f32>(srgbToLinearVec3(srgbColor.rgb), srgbColor.a);
     * }
     * ```
     */
    export const srgbToLinearVec4 = srgbToLinearVec4_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709 표준 가중치 적용)
     *  * [EN] Calculates the luminance of an RGB color. (Applying Rec. 709 standard weights)
     *  *
     *  * @param rgb - [KO] 입력 RGB 색상 [EN] Input RGB color
     *  * @returns [KO] 계산된 휘도 값 [EN] Calculated luminance value
     *  *\/
     * fn getLuminance(rgb: vec3<f32>) -> f32 {
     *     return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
     * }
     * ```
     */
    export const getLuminance = getLuminance_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] RGB 색상을 HSL 색상 공간으로 변환합니다.
     *  * [EN] Converts RGB color to HSL color space.
     *  *\/
     * fn rgbToHsl(rgb: vec3<f32>) -> vec3<f32> {
     *     let maxVal: f32 = max(max(rgb.r, rgb.g), rgb.b);
     *     let minVal: f32 = min(min(rgb.r, rgb.g), rgb.b);
     *     let delta: f32 = maxVal - minVal;
     * 
     *     let lightness: f32 = (maxVal + minVal) * 0.5;
     * 
     *     if (delta < EPSILON) {
     *         return vec3<f32>(0.0, 0.0, lightness);
     *     }
     * 
     *     // Saturation 계산
     *     var saturation: f32;
     *     if (lightness < 0.5) {
     *         saturation = delta / (maxVal + minVal + EPSILON);
     *     } else {
     *         saturation = delta / (2.0 - maxVal - minVal + EPSILON);
     *     }
     * 
     *     // Hue 계산 (부동소수점 비교 개선)
     *     var hue: f32 = 0.0;
     *     if (abs(rgb.r - maxVal) < EPSILON) {
     *         hue = (rgb.g - rgb.b) / delta;
     *         if (rgb.g < rgb.b) {
     *             hue += 6.0;
     *         }
     *     } else if (abs(rgb.g - maxVal) < EPSILON) {
     *         hue = (rgb.b - rgb.r) / delta + 2.0;
     *     } else {
     *         hue = (rgb.r - rgb.g) / delta + 4.0;
     *     }
     * 
     *     hue = hue / 6.0;
     * 
     *     return vec3<f32>(hue, saturation, lightness);
     * }
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] HSL 색상을 RGB 색상 공간으로 변환합니다.
     *  * [EN] Converts HSL color to RGB color space.
     *  *\/
     * fn hslToRgb(hsl: vec3<f32>) -> vec3<f32> {
     *     let h = hsl.x; // Hue: 0.0 ~ 1.0
     *     let s = hsl.y; // Saturation: 0.0 ~ 1.0
     *     let l = hsl.z; // Lightness: 0.0 ~ 1.0
     * 
     *     if (s == 0.0) {
     *         // 무채색(회색)인 경우
     *         return vec3<f32>(l, l, l);
     *     }
     * 
     *     // q와 p 계산
     *     var q: f32;
     *     if (l < 0.5) {
     *         q = l * (1.0 + s);
     *     } else {
     *         q = l + s - l * s;
     *     }
     * 
     *     let p = 2.0 * l - q;
     * 
     *     // R, G, B 계산
     *     var r: f32;
     *     var g: f32;
     *     var b: f32;
     * 
     *     for (var i: i32 = 0; i < 3; i = i + 1) {
     *         var t: f32;
     *         if (i == 0) {
     *             t = h + 1.0 / 3.0; // Red
     *         } else if (i == 1) {
     *             t = h; // Green
     *         } else {
     *             t = h - 1.0 / 3.0; // Blue
     *         }
     * 
     *         if (t < 0.0) {
     *             t = t + 1.0;
     *         }
     *         if (t > 1.0) {
     *             t = t - 1.0;
     *         }
     * 
     *         var color: f32;
     *         if (t < 1.0 / 6.0) {
     *             color = p + (q - p) * 6.0 * t;
     *         } else if (t < 1.0 / 2.0) {
     *             color = q;
     *         } else if (t < 2.0 / 3.0) {
     *             color = p + (q - p) * (2.0 / 3.0 - t) * 6.0;
     *         } else {
     *             color = p;
     *         }
     * 
     *         if (i == 0) {
     *             r = color;
     *         } else if (i == 1) {
     *             g = color;
     *         } else {
     *             b = color;
     *         }
     *     }
     * 
     *     return vec3<f32>(r, g, b);
     * }
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 베이스 색상에 틴트(Tint) 색상을 지정된 블렌딩 모드로 합성합니다.
     *  * [EN] Blends the base color with a tint color using the specified blending mode.
     *  *
     *  * @param baseColor -
     *  * [KO] 원본 색상 (RGBA)
     *  * [EN] Base color (RGBA)
     *  * @param tintBlendMode -
     *  * [KO] 블렌딩 모드 인덱스 (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION)
     *  * [EN] Blending mode index (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION)
     *  * @param tint -
     *  * [KO] 합성할 틴트 색상 (RGBA)
     *  * [EN] Tint color to blend (RGBA)
     *  * @returns
     *  * [KO] 합성된 최종 색상 (RGBA)
     *  * [EN] Final blended color (RGBA)
     *  *\/
     * fn getTintBlendMode(baseColor: vec4<f32>, tintBlendMode: u32, tint: vec4<f32>) -> vec4<f32> {
     *     var tintedColor: vec3<f32>;
     * 
     *     switch (tintBlendMode) {
     *         case 0u: { // NORMAL
     *             tintedColor = mix(baseColor.rgb, tint.rgb, tint.a);
     *         }
     *         case 1u: { // MULTIPLY
     *             tintedColor = baseColor.rgb * tint.rgb;
     *         }
     *         case 2u: { // LIGHTEN
     *             tintedColor = max(baseColor.rgb, tint.rgb);
     *         }
     *         case 3u: { // SCREEN
     *             tintedColor = 1.0 - (1.0 - baseColor.rgb) * (1.0 - tint.rgb);
     *         }
     *         case 4u: { // LINEAR_DODGE
     *             tintedColor = clamp(baseColor.rgb + tint.rgb, vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 5u: { // SUBTRACT
     *             tintedColor = clamp(baseColor.rgb - tint.rgb, vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 6u: { // DARKEN
     *             tintedColor = min(baseColor.rgb, tint.rgb);
     *         }
     *         case 7u: { // OVERLAY
     *             tintedColor = mix(
     *                 2.0 * baseColor.rgb * tint.rgb,
     *                 1.0 - 2.0 * (1.0 - baseColor.rgb) * (1.0 - tint.rgb),
     *                 step(vec3<f32>(0.5), baseColor.rgb)
     *             );
     *         }
     *         case 8u: { // COLOR_DODGE
     *             tintedColor = clamp(baseColor.rgb / (1.0 - tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 9u: { // COLOR_BURN
     *             tintedColor = 1.0 - clamp((1.0 - baseColor.rgb) / (tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 10u: { // HARD_LIGHT
     *             tintedColor = mix(
     *                 2.0 * baseColor.rgb * tint.rgb,
     *                 1.0 - 2.0 * (1.0 - baseColor.rgb) * (1.0 - tint.rgb),
     *                 step(vec3<f32>(0.5), tint.rgb)
     *             );
     *         }
     *         case 11u: { // SOFT_LIGHT
     *             tintedColor = mix(
     *                 baseColor.rgb * (tint.rgb + tint.rgb - vec3<f32>(1.0)),
     *                 baseColor.rgb + tint.rgb - baseColor.rgb * tint.rgb,
     *                 step(vec3<f32>(0.5), tint.rgb)
     *             );
     *         }
     *         case 12u: { // DIFFERENCE
     *             tintedColor = abs(baseColor.rgb - tint.rgb);
     *         }
     *         case 13u: { // EXCLUSION
     *             tintedColor = baseColor.rgb + tint.rgb - 2.0 * baseColor.rgb * tint.rgb;
     *         }
     *         case 14u: { // DIVIDE
     *             tintedColor = clamp(baseColor.rgb / (tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 15u: { // VIVID_LIGHT
     *             tintedColor = mix(
     *                 clamp(baseColor.rgb / (1.0 - (tint.rgb - vec3<f32>(0.5)) * 2.0 + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0)),
     *                 1.0 - clamp((1.0 - baseColor.rgb) / (tint.rgb * 2.0 + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0)),
     *                 step(vec3<f32>(0.5), tint.rgb)
     *             );
     *         }
     *         case 16u: { // LINEAR_BURN
     *             tintedColor = clamp(baseColor.rgb + tint.rgb - vec3<f32>(1.0), vec3<f32>(0.0), vec3<f32>(1.0));
     *         }
     *         case 17u: { // PIN_LIGHT
     *             tintedColor = mix(
     *                 min(baseColor.rgb, 2.0 * tint.rgb),
     *                 max(baseColor.rgb, 2.0 * tint.rgb - vec3<f32>(1.0)),
     *                 step(vec3<f32>(0.5), tint.rgb)
     *             );
     *         }
     *         case 18u: { // SATURATION
     *             let baseHsl = rgbToHsl(baseColor.rgb);
     *             let tintHsl = rgbToHsl(tint.rgb);
     *             tintedColor = hslToRgb(vec3<f32>(baseHsl.x, tintHsl.y, baseHsl.z));
     *         }
     *         case 19u: { // HUE
     *             let baseHsl = rgbToHsl(baseColor.rgb);
     *             let tintHsl = rgbToHsl(tint.rgb);
     *             tintedColor = hslToRgb(vec3<f32>(tintHsl.x, baseHsl.y, baseHsl.z));
     *         }
     *         case 20u: { // LUMINOSITY
     *             let baseHsl = rgbToHsl(baseColor.rgb);
     *             let tintHsl = rgbToHsl(tint.rgb);
     *             tintedColor = hslToRgb(vec3<f32>(baseHsl.x, baseHsl.y, tintHsl.z));
     *         }
     *         case 21u: { // COLOR
     *             let baseHsl = rgbToHsl(baseColor.rgb);
     *             let tintHsl = rgbToHsl(tint.rgb);
     *             tintedColor = hslToRgb(vec3<f32>(tintHsl.x, tintHsl.y, baseHsl.z));
     *         }
     *         case 22u: { // NEGATION
     *             tintedColor = 1.0 - abs(1.0 - baseColor.rgb - tint.rgb);
     *         }
     *         default: {
     *             tintedColor = baseColor.rgb;
     *         }
     *     }
     * 
     *     return vec4<f32>(tintedColor, baseColor.a * tint.a);
     * }
     * ```
     */
    export const getTintBlendMode = getTintBlendMode_wgsl;
}

/**
 * [KO] 깊이 관련 셰이더 함수 라이브러리
 * [EN] Depth related shader function library
 */
export namespace DepthLibrary {
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 비선형 깊이(Depth) 값을 선형 거리로 복구합니다. (Stable Version)
     *  * [EN] Recovers non-linear depth values into linear distances. (Stable Version)
     *  *
     *  * @param depthSample - [KO] 텍스처에서 샘플링된 0~1 사이의 깊이값 [EN] Depth value sampled from texture (0~1)
     *  * @param near - [KO] 카메라의 Near 평면 거리 [EN] Camera near plane distance
     *  * @param far - [KO] 카메라의 Far 평면 거리 [EN] Camera far plane distance
     *  * @returns [KO] 선형화된 거리 값 [EN] Linearized distance value
     *  *\/
     * fn getLinearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
     *     let d = clamp(depthSample, 0.0, 1.0);
     *     return (near * far) / max(EPSILON, far - d * (far - near));
     * }
     * ```
     */
    export const getLinearizeDepth = getLinearizeDepth_wgsl;
}

/**
 * [KO] 조명 및 BRDF 관련 셰이더 함수 라이브러리
 * [EN] Lighting and BRDF related shader function library
 */
export namespace LightingLibrary {
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 거리 제곱에 반비례하는 물리적 광원 감쇄 계수를 계산합니다.
     *  * [EN] Calculates the physical light attenuation factor inversely proportional to the square of the distance.
     *  *
     *  * [KO] 이 함수는 Inverse Square Law를 기반으로 하며, 광원의 반경(radius)을 고려하여 거리에 따른 에너지 감쇄를 계산합니다.
     *  * [EN] This function is based on the Inverse Square Law and calculates energy attenuation according to distance, considering the light's radius.
     *  *
     *  * @param distance - 
     *  * [KO] 광원으로부터의 거리
     *  * [EN] Distance from the light source
     *  * @param radius - 
     *  * [KO] 광원의 도달 반경
     *  * [EN] Reach radius of the light source
     *  * @returns 
     *  * [KO] 계산된 감쇄 계수 (0.0 ~ 1.0)
     *  * [EN] Calculated attenuation factor (0.0 to 1.0)
     *  *\/
     * fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
     *     let d2 = distance * distance;
     *     let r2 = radius * radius;
     *     
     *     // [KO] 현대적인 표준 윈도잉 함수 (glTF 2.0 / Frostbite / Unreal 방식)
     *     // [EN] Modern standard windowing function (glTF 2.0 / Frostbite / Unreal style)
     *     let factor = distance / radius;
     *     let factor2 = factor * factor;
     *     let factor4 = factor2 * factor2;
     *     let windowing = clamp(1.0 - factor4, 0.0, 1.0);
     *     
     *     // [KO] 정규화된 역제곱 법칙 적용 (Radius^2 / d^2)
     *     // [EN] Apply normalized inverse square law (Radius^2 / d^2)
     *     return (windowing * windowing) * r2 / max(d2, EPSILON);
     * }
     * ```
     */
    export const getLightDistanceAttenuation = getLightDistanceAttenuation_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] 스폿라이트의 각도(원뿔)에 따른 감쇄 계수를 계산합니다.
     *  * [EN] Calculates the attenuation factor according to the angle (cone) of the spotlight.
     *  *
     *  * [KO] 내부 원뿔(Inner Cone)과 외부 원뿔(Outer Cone) 사이의 영역에서 부드러운 페이드 효과를 생성합니다.
     *  * [EN] Creates a smooth fade effect in the area between the inner cone and the outer cone.
     *  *
     *  * @param lightToVertexDirection - 
     *  * [KO] 광원에서 픽셀(버텍스)을 향하는 정규화된 방향 벡터
     *  * [EN] Normalized direction vector from the light source to the pixel (vertex)
     *  * @param lightDirection - 
     *  * [KO] 스폿라이트가 비추는 정규화된 중심 방향 벡터
     *  * [EN] Normalized center direction vector that the spotlight shines in
     *  * @param innerCutoff - 
     *  * [KO] 내부 원뿔 컷오프 각도 (Degree)
     *  * [EN] Inner cone cutoff angle (Degree)
     *  * @param outerCutoff - 
     *  * [KO] 외부 원뿔 컷오프 각도 (Degree)
     *  * [EN] Outer cone cutoff angle (Degree)
     *  * @returns 
     *  * [KO] 계산된 각도 감쇄 계수 (0.0 ~ 1.0)
     *  * [EN] Calculated angle attenuation factor (0.0 to 1.0)
     *  *\/
     * fn getLightAngleAttenuation(
     *     lightToVertexDirection: vec3<f32>, 
     *     lightDirection: vec3<f32>, 
     *     innerCutoff: f32, 
     *     outerCutoff: f32
     * ) -> f32 {
     *     let cosTheta = dot(lightToVertexDirection, lightDirection);
     *     let cosOuter = cos(radians(outerCutoff));
     *     let cosInner = cos(radians(innerCutoff));
     *     
     *     // [KO] 스폿라이트 감쇄 수식 (glTF 2.0 표준)
     *     // [EN] Spotlight attenuation formula (glTF 2.0 standard)
     *     
     *     let epsilon = max(EPSILON, cosInner - cosOuter);
     *     let factor = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);
     *     return factor * factor;
     * }
     * ```
     */
    export const getLightAngleAttenuation = getLightAngleAttenuation_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.PI
     * #redgpu_include math.INV_PI
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] Disney Diffuse BRDF 모델을 사용하여 확산광을 계산합니다.
     *  * [EN] Calculates diffuse lighting using the Disney Diffuse BRDF model.
     *  *
     *  * [KO] 이 모델은 거친 표면에서 발생하는 역반사(Retro-reflection) 효과를 고려하여 물리적으로 더 정확한 확산광을 제공합니다.
     *  * [EN] This model considers retro-reflection effects on rough surfaces to provide physically more accurate diffuse lighting.
     *  *
     *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
     *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
     *  * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 [EN] Dot product of light direction and half vector
     *  * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
     *  * @param albedo - [KO] 표면 반사율(색상) [EN] Surface albedo (color)
     *  * @returns [KO] 계산된 확산광 BRDF 값 [EN] Calculated diffuse BRDF value
     *  *\/
     * fn getDiffuseBRDFDisney(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
     *     if (NdotL <= 0.0) { return vec3<f32>(0.0); }
     * 
     *     // Disney diffuse term
     *     let energyBias = mix(0.0, 0.5, roughness);
     *     let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
     *     let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
     *     let f0 = 1.0;
     *     let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
     *     let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);
     * 
     *     return albedo * NdotL * lightScatter * viewScatter * energyFactor * INV_PI;
     * }
     * ```
     */
    export const getDiffuseBRDFDisney = diffuseBRDFDisney_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] Schlick의 프레넬 근사식을 사용하여 반사율을 계산합니다.
     *  * [EN] Calculates reflectance using Schlick's Fresnel approximation.
     *  *
     *  * @param cosTheta - [KO] 입사각의 코사인 값 [EN] Cosine of the incidence angle
     *  * @param F0 - [KO] 수직 입사 시의 반사율 [EN] Reflectance at normal incidence
     *  * @returns [KO] 계산된 프레넬 반사율 [EN] Calculated Fresnel reflectance
     *  *\/
     * fn getFresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
     *     return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
     * }
     * ```
     */
    export const getFresnelSchlick = fresnelSchlick_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] 금속(Conductor)의 반사 특성을 고려한 프레넬 반사율을 계산합니다.
     *  * [EN] Calculates Fresnel reflectance considering the reflective characteristics of conductors (metals).
     *  *
     *  * @param F0 - [KO] 금속의 기본 반사율 (알베도 색상) [EN] Base reflectance of the metal (albedo color)
     *  * @param bsdf - [KO] 계산된 BRDF 값 [EN] Calculated BRDF value
     *  * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
     *  * @returns [KO] 프레넬이 적용된 최종 BRDF [EN] Final BRDF with Fresnel applied
     *  *\/
     * fn getConductorFresnel(F0: vec3<f32>, bsdf: vec3<f32>, VdotH: f32) -> vec3<f32> {
     *     let fresnel = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
     *     return bsdf * fresnel;
     * }
     * ```
     */
    export const getConductorFresnel = conductorFresnel_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.PI2
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [KO] 박막 간섭(Thin-film interference) 효과를 시뮬레이션하는 고정밀 무지개빛 프레넬을 계산합니다.
     *  * [EN] Calculates high-precision iridescent Fresnel simulating thin-film interference effects.
     *  *
     *  * [KO] 이 함수는 Airy's 공식을 기반으로 복소수 반사 계수를 계산하여 물리적으로 정확한 간섭 무늬를 생성합니다.
     *  * [EN] This function calculates complex reflection coefficients based on Airy's formulas to produce physically accurate interference patterns.
     *  *
     *  * @param outsideIOR - [KO] 외부 매질의 굴절률 (보통 공기=1.0) [EN] IOR of the outside medium (usually air=1.0)
     *  * @param iridescenceIOR - [KO] 박막 층의 굴절률 [EN] IOR of the thin-film layer
     *  * @param baseF0 - [KO] 하단 기저층의 기본 반사율 [EN] Base reflectance of the underlying layer
     *  * @param iridescenceThickness - [KO] 박막의 두께 (nm) [EN] Thickness of the thin-film (nm)
     *  * @param iridescenceFactor - [KO] 무지개빛 효과의 강도 [0, 1] [EN] Strength of the iridescence effect [0, 1]
     *  * @param cosTheta1 - [KO] 입사각의 코사인 값 [EN] Cosine of the incidence angle
     *  * @returns [KO] 간섭 효과가 반영된 최종 반사율 [EN] Final reflectance with interference effects
     *  *\/
     * fn getIridescentFresnel(outsideIOR: f32, iridescenceIOR: f32, baseF0: vec3<f32>,
     *                       iridescenceThickness: f32, iridescenceFactor: f32, cosTheta1: f32) -> vec3<f32> {
     *     // 조기 반환
     *     if (iridescenceThickness <= 0.0 || iridescenceFactor <= 0.0) {
     *         return baseF0;
     *     }
     * 
     *     let cosTheta1Abs = abs(cosTheta1);
     *     let safeIridescenceIOR = max(iridescenceIOR, 1.01);
     * 
     *     // 스넬의 법칙
     *     let sinTheta1 = sqrt(max(0.0, 1.0 - cosTheta1Abs * cosTheta1Abs));
     *     let sinTheta2 = (outsideIOR / safeIridescenceIOR) * sinTheta1;
     * 
     *     if (sinTheta2 >= 1.0) {
     *         return baseF0 + iridescenceFactor * (vec3<f32>(1.0) - baseF0);
     *     }
     * 
     *     let cosTheta2 = sqrt(max(0.0, 1.0 - sinTheta2 * sinTheta2));
     * 
     *     // 상수들 사전 계산
     *     let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
     *     let opticalThickness = 2.0 * iridescenceThickness * safeIridescenceIOR * cosTheta2;
     *     let phase = (PI2 * opticalThickness) / wavelengths;
     * 
     *     // 삼각함수 (한 번만)
     *     let cosPhase = cos(phase);
     *     let sinPhase = sin(phase);
     * 
     *     // 공통 계산값들
     *     let outsideCos1 = outsideIOR * cosTheta1Abs;
     *     let iridescenceCos2 = safeIridescenceIOR * cosTheta2;
     *     let iridescenceCos1 = safeIridescenceIOR * cosTheta1Abs;
     *     let outsideCos2 = outsideIOR * cosTheta2;
     * 
     *     // 프레넬 계수 (스칼라)
     *     let r12_s = (outsideCos1 - iridescenceCos2) / max(outsideCos1 + iridescenceCos2, EPSILON);
     *     let r12_p = (iridescenceCos1 - outsideCos2) / max(iridescenceCos1 + outsideCos2, EPSILON);
     * 
     *     // 기본 F0에서 굴절률 추출 (벡터화)
     *     let sqrtF0 = sqrt(clamp(baseF0, vec3<f32>(0.01), vec3<f32>(0.99)));
     *     let safeN3 = max((1.0 + sqrtF0) / max(1.0 - sqrtF0, vec3<f32>(EPSILON)), vec3<f32>(1.2));
     * 
     *     // r23 계산 (벡터화)
     *     let iridescenceCos2Vec = vec3<f32>(iridescenceCos2);
     *     let cosTheta1AbsVec = vec3<f32>(cosTheta1Abs);
     *     let iridescenceCos1Vec = vec3<f32>(iridescenceCos1);
     *     let cosTheta2Vec = vec3<f32>(cosTheta2);
     * 
     *     let r23_s = (iridescenceCos2Vec - safeN3 * cosTheta1AbsVec) /
     *                 max(iridescenceCos2Vec + safeN3 * cosTheta1AbsVec, vec3<f32>(EPSILON));
     *     let r23_p = (safeN3 * cosTheta2Vec - iridescenceCos1Vec) /
     *                 max(safeN3 * cosTheta2Vec + iridescenceCos1Vec, vec3<f32>(EPSILON));
     * 
     *     // 복소수 계산을 위한 공통 값들
     *     let r12_sVec = vec3<f32>(r12_s);
     *     let r12_pVec = vec3<f32>(r12_p);
     * 
     *     // S-편광 복소수 계산
     *     let numSReal = r12_sVec + r23_s * cosPhase;
     *     let numSImag = r23_s * sinPhase;
     *     let denSReal = vec3<f32>(1.0) + r12_sVec * r23_s * cosPhase;
     *     let denSImag = r12_sVec * r23_s * sinPhase;
     * 
     *     // P-편광 복소수 계산
     *     let numPReal = r12_pVec + r23_p * cosPhase;
     *     let numPImag = r23_p * sinPhase;
     *     let denPReal = vec3<f32>(1.0) + r12_pVec * r23_p * cosPhase;
     *     let denPImag = r12_pVec * r23_p * sinPhase;
     * 
     *     // 복소수 나눗셈 인라인 계산 (S-편광)
     *     let denSSquared = denSReal * denSReal + denSImag * denSImag;
     *     let rsReal = (numSReal * denSReal + numSImag * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
     *     let rsImag = (numSImag * denSReal - numSReal * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
     *     let Rs = rsReal * rsReal + rsImag * rsImag;
     * 
     *     // 복소수 나눗셈 인라인 계산 (P-편광)
     *     let denPSquared = denPReal * denPReal + denPImag * denPImag;
     *     let rpReal = (numPReal * denPReal + numPImag * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
     *     let rpImag = (numPImag * denPReal - numPReal * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
     *     let Rp = rpReal * rpReal + rpImag * rpImag;
     * 
     *     // 전체 반사율
     *     let reflectance = 0.5 * (Rs + Rp);
     * 
     *     // 최종 결과
     *     let clampedReflectance = clamp(reflectance, vec3<f32>(0.0), vec3<f32>(1.0));
     *     return mix(baseF0, clampedReflectance, iridescenceFactor);
     * }
     * ```
     */
    export const getIridescentFresnel = iridescentFresnel_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.PI
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [KO] GGX(Trowbridge-Reitz) 법선 분포 함수(NDF)를 계산합니다.
     *  * [EN] Calculates the GGX (Trowbridge-Reitz) Normal Distribution Function (NDF).
     *  *
     *  * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
     *  * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
     *  * @returns [KO] 미세면의 정렬 밀도 [EN] Microfacet alignment density
     *  *\/
     * fn getDistributionGGX(NdotH: f32, roughness: f32) -> f32 {
     *     let alpha = roughness * roughness;
     *     let alpha2 = alpha * alpha;
     *     let NdotH2 = NdotH * NdotH;
     * 
     *     let nom = alpha2;
     *     let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
     *     let denomSquared = denom * denom;
     * 
     *     return nom / max(EPSILON, denomSquared * PI);
     * }
     * ```
     */
    export const getDistributionGGX = distributionGGX_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] Smith의 기법을 사용한 기하 차폐(Geometric Shadowing) 함수를 계산합니다.
     *  * [EN] Calculates Geometric Shadowing using Smith's method with GGX.
     *  *
     *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
     *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
     *  * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
     *  * @returns [KO] 기하 감쇠 계수 [EN] Geometric attenuation factor
     *  *\/
     * fn getGeometrySmith(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
     *     let alpha = roughness * roughness;
     *     let k = alpha / 2.0; // 직접 조명(Direct Lighting)에 적합한 k 값
     * 
     *     let ggx1 = NdotV / (NdotV * (1.0 - k) + k);
     *     let ggx2 = NdotL / (NdotL * (1.0 - k) + k);
     * 
     *     return ggx1 * ggx2;
     * }
     * ```
     */
    export const getGeometrySmith = geometrySmith_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [KO] Smith의 기법을 사용한 높이 상관(Height-Correlated) 가시성(Visibility) 함수를 계산합니다.
     *  * [EN] Calculates the Height-Correlated Visibility function using Smith's method.
     *  *
     *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
     *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
     *  * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
     *  * @returns [KO] 가시성 계수 [EN] Visibility factor
     *  *\/
     * fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
     *     let alpha = roughness * roughness;
     *     let alpha2 = alpha * alpha;
     * 
     *     let GGXV = NdotL * sqrt(NdotV * NdotV * (1.0 - alpha2) + alpha2);
     *     let GGXL = NdotV * sqrt(NdotL * NdotL * (1.0 - alpha2) + alpha2);
     * 
     *     return 0.5 / max(GGXV + GGXL, EPSILON);
     * }
     * ```
     */
    export const getSpecularVisibility = specularVisibility_wgsl;
    /**
     * ```wgsl
     * #redgpu_include lighting.getDistributionGGX
     * #redgpu_include lighting.getGeometrySmith
     * #redgpu_include lighting.getFresnelSchlick
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Common (Vertex, Fragment, Compute)]
     *  * [KO] Cook-Torrance 모델을 사용하여 물리 기반 스펙큘러 BRDF를 계산합니다.
     *  * [EN] Calculates Physically-Based Specular BRDF using the Cook-Torrance model.
     *  *
     *  * [KO] 하이라이트의 선명도와 물리적 정확성을 위해 분모의 0 나누기 방지 처리를 최적화하였습니다.
     *  * [EN] Optimized the denominator's division-by-zero prevention for better highlight sharpness and physical accuracy.
     *  *
     *  * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
     *  * @param roughness - [KO] 표면 거칠기 [EN] Surface roughness
     *  * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
     *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
     *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
     *  * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 (프레넬용) [EN] Dot product of light and half vector (for Fresnel)
     *  * @returns [KO] 계산된 스펙큘러 BRDF 값 [EN] Calculated specular BRDF value
     *  *\/
     * fn getSpecularBRDF(
     *     F0: vec3<f32>,
     *     roughness: f32,
     *     NdotH: f32,
     *     NdotV: f32,
     *     NdotL: f32,
     *     LdotH: f32
     * ) -> vec3<f32> {
     *     // 1. Distribution (D)
     *     let D = getDistributionGGX(NdotH, roughness);
     * 
     *     // 2. Geometric Shadowing (G)
     *     let G = getGeometrySmith(NdotV, NdotL, roughness);
     * 
     *     // 3. Fresnel (F)
     *     let F = getFresnelSchlick(LdotH, F0);
     * 
     *     // 4. Cook-Torrance BRDF 합산
     *     // [KO] 분모를 시스템 표준 EPSILON을 사용하여 방어함으로써 수치적 안정성과 정밀도 확보
     *     // [EN] Ensures numerical stability and precision by protecting the denominator using the system standard EPSILON.
     *     let numerator = D * G * F;
     *     let denominator = 4.0 * max(NdotV, EPSILON) * max(NdotL, EPSILON);
     * 
     *     return numerator / denominator;
     * }
     * ```
     */
    export const getSpecularBRDF = specularBRDF_wgsl;
    /**
     * ```wgsl
     * #redgpu_include lighting.getDistributionGGX
     * #redgpu_include lighting.getFresnelSchlick
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [KO] 미세면(Microfacet) 모델 기반의 스펙큘러 BTDF를 계산합니다. (굴절 및 투과)
     *  * [EN] Calculates Specular BTDF based on the microfacet model. (Refraction and Transmission)
     *  *
     *  * [KO] 하이라이트의 정밀도와 수치적 안정성을 위해 분모 계산식을 최적화하였습니다.
     *  * [EN] Optimized the denominator calculation for better highlight precision and numerical stability.
     *  *
     *  * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
     *  * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
     *  * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
     *  * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
     *  * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 (프레넬용) [EN] Dot product of light direction and half vector (for Fresnel)
     *  * @param roughness - [KO] 표면 거칠기 [EN] Surface roughness
     *  * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
     *  * @param ior - [KO] 굴절률 [EN] Index of refraction
     *  * @returns [KO] 계산된 스펙큘러 BTDF 값 [EN] Calculated specular BTDF value
     *  *\/
     * fn getSpecularBTDF(
     *     NdotV: f32,
     *     NdotL: f32,
     *     NdotH: f32,
     *     VdotH: f32,
     *     LdotH: f32,
     *     roughness: f32,
     *     F0: vec3<f32>,
     *     ior: f32
     * ) -> vec3<f32> {
     *     let eta: f32 = 1.0 / ior;
     * 
     *     // 1. D (Distribution) 계산
     *     let D_rough: f32 = getDistributionGGX(NdotH, roughness);
     *     let t: f32 = clamp((ior - 1.0) * 100.0, 0.0, 1.0);
     *     let D: f32 = mix(1.0, D_rough, t);
     * 
     *     // 2. G (Geometric) 계산
     *     let G: f32 = min(1.0, min((2.0 * NdotH * NdotV) / VdotH, (2.0 * NdotH * NdotL) / VdotH));
     * 
     *     // 3. F (Fresnel) 계산
     *     let F: vec3<f32> = getFresnelSchlick(VdotH, F0);
     * 
     *     let denom = (eta * VdotH + LdotH) * (eta * VdotH + LdotH);
     * 
     *     // 4. BTDF 공식 적용
     *     // [KO] 분모에 시스템 표준 EPSILON을 적용하여 일관된 정밀도 유지
     *     // [EN] Applies the system standard EPSILON to the denominator for consistent precision.
     *     let btdf: vec3<f32> =
     *         (vec3<f32>(1.0) - F) *
     *         abs(VdotH * LdotH) *
     *         (eta * eta) *
     *         D *
     *         G /
     *         (max(NdotV, EPSILON) * max(denom, EPSILON));
     * 
     *     return btdf;
     * }
     * ```
     */
    export const getSpecularBTDF = specularBTDF_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.INV_PI
     * 
     * /**
     *  * [KO] 디퓨즈 BTDF(확산 투과)를 계산합니다.
     *  * [EN] Calculates Diffuse BTDF (Diffuse Transmission).
     *  *
     *  * [KO] 뒷면에서 들어오는 광선이 표면을 투과하여 시선 방향으로 산란되는 효과를 처리합니다.
     *  * [EN] Processes the effect where light coming from the back passes through the surface and scatters toward the view direction.
     *  *
     *  * @param N - [KO] 법선 벡터 [EN] Normal vector
     *  * @param L - [KO] 광원 방향 벡터 [EN] Light direction vector
     *  * @param albedo - [KO] 표면 반사율(색상) [EN] Surface albedo (color)
     *  * @returns [KO] 계산된 확산 투과 값 [EN] Calculated diffuse transmission value
     *  *\/
     * fn getDiffuseBTDF(N: vec3<f32>, L: vec3<f32>, albedo: vec3<f32>) -> vec3<f32> {
     *     // 뒷면으로 들어오는 광선만 처리 (-dot(N,L)를 사용하여 음수만 양수로 변환하여 사용)
     *     let cosTheta = max(-dot(N, L), 0.0);
     *     return albedo * cosTheta * INV_PI;
     * }
     * ```
     */
    export const getDiffuseBTDF = diffuseBTDF_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] 프레넬 항을 기반으로 하단 레이어(base)와 상단 레이어(layer)를 물리적으로 혼합합니다.
     *  * [EN] Physically mixes the base layer and the top layer based on the Fresnel term.
     *  *
     *  * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
     *  * @param weight - [KO] 혼합 가중치 [EN] Mixing weight
     *  * @param base - [KO] 하단 레이어 색상 (Diffuse/BTDF) [EN] Base layer color (Diffuse/BTDF)
     *  * @param layer - [KO] 상단 레이어 색상 (Specular) [EN] Top layer color (Specular)
     *  * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
     *  * @returns [KO] 혼합된 최종 색상 [EN] Final mixed color
     *  *\/
     * fn getFresnelMix(
     *     F0: vec3<f32>,
     *     weight: f32,
     *     base: vec3<f32>,
     *     layer: vec3<f32>,
     *     VdotH: f32
     * ) -> vec3<f32> {
     *     var f0 = min(F0, vec3<f32>(1.0));
     *     let fr = f0 + (vec3<f32>(1.0) - f0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
     *     return (1.0 - weight * max(max(fr.x, fr.y), fr.z)) * base + weight * fr * layer;
     * }
     * ```
     */
    export const getFresnelMix = fresnelMix_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] 기저 층 위에 투명 코팅(Clearcoat) 레이어를 적용합니다. (에너지 보존 고려)
     *  * [EN] Applies a clearcoat layer over the base layer, considering energy conservation.
     *  *\/
     * fn getFresnelCoat(NdotV: f32, ior: f32, weight: f32, base: vec3<f32>, layer: vec3<f32>) -> vec3<f32> {
     *     let f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
     *     let fr: f32 = f0 + (1.0 - f0) * pow(clamp(1.0 - abs(NdotV), 0.0, 1.0), 5.0);
     *     return mix(base, layer, weight * fr);
     * }
     * ```
     */
    export const getFresnelCoat = fresnelCoat_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.direction.getReflectionVectorFromViewDirection
     * #redgpu_include math.getIsFinite
     * #redgpu_include math.EPSILON
     * 
     * /**
     *  * [Stage: Fragment, Compute]
     *  * [KO] 굴절 및 투과 효과를 위해 배경(RenderPath1) 데이터를 샘플링하여 최종 투과 굴절 색상을 계산합니다.
     *  * [EN] Samples background (RenderPath1) data to calculate the final transmission refraction color.
     *  *
     *  * [KO] 이 함수는 KHR_materials_transmission 및 volume 확장을 지원하며, 분산(Dispersion) 및 두께에 따른 굴절 왜곡을 시뮬레이션합니다.
     *  * [EN] This function supports KHR_materials_transmission and volume extensions, simulating refractive distortion based on dispersion and thickness.
     *  *
     *  * @param u_useKHR_materials_volume - [KO] 볼륨 효과 사용 여부 [EN] Whether to use volume effects
     *  * @param thicknessParameter - [KO] 투과 두께 [EN] Transmission thickness
     *  * @param u_KHR_dispersion - [KO] 분산 계수 [EN] Dispersion coefficient
     *  * @param u_KHR_attenuationDistance - [KO] 감쇄 거리 [EN] Attenuation distance
     *  * @param u_KHR_attenuationColor - [KO] 감쇄 색상 [EN] Attenuation color
     *  * @param ior - [KO] 굴절률 [EN] Index of Refraction
     *  * @param roughnessParameter - [KO] 거칠기 계수 [EN] Roughness parameter
     *  * @param albedo - [KO] 알베도 색상 [EN] Albedo color
     *  * @param projectionViewMatrix - [KO] 투영-카메라 행렬 [EN] Projection-View matrix
     *  * @param input_vertexPosition - [KO] 월드 공간의 버텍스 위치 [EN] Vertex position in world space
     *  * @param input_ndcPosition - [KO] NDC 공간의 위치 (미사용) [EN] Position in NDC space (Unused)
     *  * @param V - [KO] 시선 방향 벡터 [EN] View direction vector
     *  * @param N - [KO] 법선 벡터 [EN] Normal vector
     *  * @param renderPath1ResultTexture - [KO] 배경 텍스처 [EN] Background texture
     *  * @param renderPath1ResultTextureSampler - [KO] 배경 샘플러 [EN] Background sampler
     *  * @returns [KO] 계산된 최종 투과 굴절 색상 [EN] Calculated final transmission refraction color
     *  *\/
     * fn getTransmissionRefraction(
     *     u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
     *     ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
     *     projectionViewMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
     *     V:vec3<f32>, N:vec3<f32>,
     *     renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
     * ) -> vec3<f32> {
     *     var transmissionRefraction = vec3<f32>(0.0);
     * 
     *     // Mip Level 안전 범위 설정
     *     let maxMipLevel = f32(textureNumLevels(renderPath1ResultTexture) - 1);
     *     let transmissionMipLevel = clamp(roughnessParameter * maxMipLevel, 0.0, maxMipLevel);
     * 
     *     if(u_useKHR_materials_volume){
     *         var iorR: f32 = ior;
     *         var iorG: f32 = ior;
     *         var iorB: f32 = ior;
     * 
     *         if(u_KHR_dispersion > 0.0){
     *             let halfSpread: f32 = (ior - 1.0) * 0.025 * u_KHR_dispersion;
     *             iorR = ior + halfSpread;
     *             iorG = ior;
     *             iorB = ior - halfSpread;
     *         }
     * 
     *         // IOR 값 안전 범위 제한 (1.0 이상)
     *         iorR = max(iorR, 1.0 + EPSILON);
     *         iorG = max(iorG, 1.0 + EPSILON);
     *         iorB = max(iorB, 1.0 + EPSILON);
     * 
     *         // 굴절 벡터 계산
     *         let refractedVecR: vec3<f32> = refract(-V, N, 1.0 / iorR);
     *         let refractedVecG: vec3<f32> = refract(-V, N, 1.0 / iorG);
     *         let refractedVecB: vec3<f32> = refract(-V, N, 1.0 / iorB);
     * 
     *         // 전반사 체크 (굴절 벡터가 0인 경우 반사 사용)
     *         let validR = dot(refractedVecR, refractedVecR) > 0.0;
     *         let validG = dot(refractedVecG, refractedVecG) > 0.0;
     *         let validB = dot(refractedVecB, refractedVecB) > 0.0;
     * 
     *         let R = getReflectionVectorFromViewDirection(V, N);
     *         let finalRefractR = select(R, refractedVecR, validR);
     *         let finalRefractG = select(R, refractedVecG, validG);
     *         let finalRefractB = select(R, refractedVecB, validB);
     * 
     *         // 안전한 thickness 범위 제한
     *         let safeThickness = clamp(thicknessParameter, 0.0, 100.0);
     * 
     *         // 각각의 굴절 벡터로 세계 좌표의 굴절 위치 계산
     *         let worldPosR: vec3<f32> = input_vertexPosition + finalRefractR * safeThickness;
     *         let worldPosG: vec3<f32> = input_vertexPosition + finalRefractG * safeThickness;
     *         let worldPosB: vec3<f32> = input_vertexPosition + finalRefractB * safeThickness;
     * 
     *         // 월드→뷰→프로젝션 변환 적용하여 최종 UV 좌표 계산
     *         let clipPosR: vec4<f32> = projectionViewMatrix * vec4<f32>(worldPosR, 1.0);
     *         let clipPosG: vec4<f32> = projectionViewMatrix * vec4<f32>(worldPosG, 1.0);
     *         let clipPosB: vec4<f32> = projectionViewMatrix * vec4<f32>(worldPosB, 1.0);
     * 
     *         // 0으로 나누기 방지
     *         let wR = max(abs(clipPosR.w), EPSILON);
     *         let wG = max(abs(clipPosG.w), EPSILON);
     *         let wB = max(abs(clipPosB.w), EPSILON);
     * 
     *         let ndcR: vec2<f32> = clipPosR.xy / wR * 0.5 + 0.5;
     *         let ndcG: vec2<f32> = clipPosG.xy / wG * 0.5 + 0.5;
     *         let ndcB: vec2<f32> = clipPosB.xy / wB * 0.5 + 0.5;
     * 
     *         // Y축 좌표 변환 적용 및 UV 범위 제한
     *         let finalUV_R: vec2<f32> = clamp(vec2<f32>(ndcR.x, 1.0 - ndcR.y), vec2<f32>(0.0), vec2<f32>(1.0));
     *         let finalUV_G: vec2<f32> = clamp(vec2<f32>(ndcG.x, 1.0 - ndcG.y), vec2<f32>(0.0), vec2<f32>(1.0));
     *         let finalUV_B: vec2<f32> = clamp(vec2<f32>(ndcB.x, 1.0 - ndcB.y), vec2<f32>(0.0), vec2<f32>(1.0));
     * 
     *         // RGB 픽셀 샘플링
     *         let sampledR = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
     *         let sampledG = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
     *         let sampledB = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;
     * 
     *         // NaN/Inf 방지
     *         transmissionRefraction.r = select(0.0, sampledR, getIsFiniteScalar(sampledR));
     *         transmissionRefraction.g = select(0.0, sampledG, getIsFiniteScalar(sampledG));
     *         transmissionRefraction.b = select(0.0, sampledB, getIsFiniteScalar(sampledB));
     * 
     *     } else {
     *         // IOR 값 안전 범위 제한
     *         let safeIor = max(ior, 1.0 + EPSILON);
     * 
     *         let refractedVec: vec3<f32> = refract(-V, N, 1.0 / safeIor);
     * 
     *         // 전반사 체크
     *         let valid = dot(refractedVec, refractedVec) > 0.0;
     *         let R = getReflectionVectorFromViewDirection(V, N);
     *         let finalRefract = select(R, refractedVec, valid);
     * 
     *         // 안전한 thickness 범위 제한
     *         let safeThickness = clamp(thicknessParameter, 0.0, 100.0);
     * 
     *         let worldPos: vec3<f32> = input_vertexPosition + finalRefract * safeThickness;
     *         let clipPos: vec4<f32> = projectionViewMatrix * vec4<f32>(worldPos, 1.0);
     * 
     *         // 0으로 나누기 방지
     *         let w = max(abs(clipPos.w), EPSILON);
     *         let ndc: vec2<f32> = clipPos.xy / w * 0.5 + 0.5;
     * 
     *         // UV 범위 제한
     *         let finalUV: vec2<f32> = clamp(vec2<f32>(ndc.x, 1.0 - ndc.y), vec2<f32>(0.0), vec2<f32>(1.0));
     * 
     *         let sampled = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;
     * 
     *         // NaN/Inf 방지
     *         transmissionRefraction = select(vec3<f32>(0.0), sampled, all(getIsFiniteVec3(sampled)));
     *     }
     * 
     *     // 투과 색상에 알베도 적용 (안전한 범위로 제한)
     *     let safeAlbedo = clamp(albedo, vec3<f32>(0.0), vec3<f32>(1.0));
     *     transmissionRefraction *= safeAlbedo;
     * 
     *     // 최종 결과 안전성 체크
     *     transmissionRefraction = select(vec3<f32>(0.0), transmissionRefraction, all(getIsFiniteVec3(transmissionRefraction)));
     * 
     *     return transmissionRefraction;
     * }
     * ```
     */
    export const getTransmissionRefraction = getTransmissionRefraction_wgsl;
    /**
     * ```wgsl
     * /**
     *  * [KO] Phong 모델 기반의 조명 기여도를 계산합니다.
     *  * [EN] Calculates light contribution based on the Phong model.
     *  *
     *  * @param lightColor - [KO] 광색 [EN] Light color
     *  * @param lightIntensity - [KO] 광도 (그림자 및 감쇄가 포함된 최종 강도) [EN] Light intensity (final intensity including shadow and attenuation)
     *  * @param surfaceToLight - [KO] 픽셀에서 광원을 향하는 벡터 [EN] Vector from surface to light source
     *  * @param N - [KO] 표면 법선 벡터 [EN] Surface normal vector
     *  * @param V - [KO] 시선 방향 벡터 (Surface-to-Eye) [EN] View direction vector
     *  * @param shininess - [KO] 광택도 [EN] Shininess (specular power)
     *  * @param specularSamplerValue - [KO] 스펙큘러 텍스처 샘플링 값 [EN] Specular texture sampled value
     *  * @param diffuseColor - [KO] 표면의 디퓨즈 색상 [EN] Surface diffuse color
     *  * @param specularColor - [KO] 표면의 스펙큘러 색상 [EN] Surface specular color
     *  * @param specularStrength - [KO] 스펙큘러 강도 계수 [EN] Specular strength factor
     *  * @returns [KO] 계산된 조명 색상 (RGB) [EN] Calculated light color (RGB)
     *  *\/
     * fn getPhongLight(
     *     lightColor: vec3<f32>,
     *     lightIntensity: f32,
     *     surfaceToLight: vec3<f32>,
     *     N: vec3<f32>,
     *     V: vec3<f32>,
     *     shininess: f32,
     *     specularSamplerValue: f32,
     *     diffuseColor: vec3<f32>,
     *     specularColor: vec3<f32>,
     *     specularStrength: f32
     * ) -> vec3<f32> {
     *     let L = normalize(surfaceToLight);
     *     let R = reflect(-L, N); // [KO] 입사광(-L)을 법선(N) 기준으로 반사 [EN] Reflect incident light (-L) based on normal (N)
     *     
     *     let NdotL = max(dot(N, L), 0.0);
     *     let lambertTerm = NdotL;
     *     
     *     // [KO] 스펙큘러 계산 (NdotL이 0보다 클 때만 하이라이트 발생)
     *     // [EN] Specular calculation (Highlight only occurs when NdotL > 0)
     *     let specularTerm = pow(max(dot(R, V), 0.0), shininess) * specularSamplerValue * step(0.0, lambertTerm);
     * 
     *     let finalLightColor = lightColor * lightIntensity;
     *     let diffuseContribution = diffuseColor * finalLightColor * lambertTerm;
     *     let specularContribution = (specularColor * specularStrength) * finalLightColor * specularTerm;
     * 
     *     return diffuseContribution + specularContribution;
     * }
     * ```
     */
    export const getPhongLight = getPhongLight_wgsl;
}

/**
 * [KO] 대기 산란(SkyAtmosphere) 관련 셰이더 함수 라이브러리
 * [EN] SkyAtmosphere related shader function library
 */
export namespace SkyAtmosphereLibrary {
    /**
     * ```wgsl
     * #redgpu_include skyAtmosphere.skyAtmosphereFn
     * 
     * /**
     *  * [KO] SkyAtmosphere 시스템의 태양 정보를 담는 구조체입니다.
     *  * [EN] Structure containing sun information from the SkyAtmosphere system.
     *  *\/
     * struct AtmosphereSunLight {
     *     direction: vec3<f32>, // [KO] 태양을 향하는 방향 (Surface-to-Light) [EN] Direction toward the sun
     *     intensity: f32,       // [KO] 태양 광도 [EN] Sun light intensity
     *     color: vec3<f32>,     // [KO] 태양 광색 (대기 투과율이 적용된 물리적 색상) [EN] Sun light color (physical color with atmospheric transmittance applied)
     *     padding: f32          // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
     * };
     * 
     * /**
     *  * [KO] 시스템 유니폼으로부터 대기 태양광 정보를 추출합니다.
     *  * [EN] Extracts atmospheric sun light information from system uniforms.
     *  *
     *  * @param worldPosition - [KO] 월드 공간 좌표 [EN] World space position
     *  * @returns [KO] 태양 정보 구조체 [EN] Sun light information structure
     *  *\/
     * fn getAtmosphereSunLight(worldPosition: vec3<f32>) -> AtmosphereSunLight {
     *     var sun: AtmosphereSunLight;
     *     let u_skyAtmosphere = systemUniforms.skyAtmosphere;
     *     
     *     let sunDir = normalize(u_skyAtmosphere.sunDirection);
     *     sun.direction = sunDir;
     *     sun.intensity = u_skyAtmosphere.sunIntensity;
     *     
     *     // [KO] 현재 픽셀의 고도와 태양 각도를 기반으로 대기 투과율(Transmittance)을 샘플링하여 실제 태양색 결정
     *     // [EN] Sample Atmospheric Transmittance based on current pixel's height and sun angle to determine actual sun color
     *     let h = max(0.001, (worldPosition.y / 1000.0) - u_skyAtmosphere.seaLevel);
     *     sun.color = getTransmittance(
     *         transmittanceTexture, 
     *         atmosphereSampler, 
     *         h, 
     *         sunDir.y, 
     *         u_skyAtmosphere.atmosphereHeight
     *     );
     *     
     *     return sun;
     * }
     * ```
     */
    export const getAtmosphereSunLight = getAtmosphereSunLight_wgsl;
    /**
     * ```wgsl
     * #redgpu_include math.PI
     * #redgpu_include math.PI2
     * #redgpu_include math.HPI
     * #redgpu_include math.INV_PI
     * #redgpu_include math.DEG_TO_RAD
     * #redgpu_include math.EPSILON
     * #redgpu_include systemStruct.SkyAtmosphere
     * #redgpu_include color.getLuminance
     * 
     * const MAX_TAU: f32 = 100.0;
     * 
     * // [KO] 태양 물리 상수 (기본값 계산용)
     * const SUN_ANGULAR_RADIUS_RAD: f32 = 0.00465; // 0.2665 degrees
     * const SUN_SOLID_ANGLE_BASE: f32 = 6.794e-5;
     * 
     * struct AtmosphereDensities {
     *     rhoR: f32, rhoM: f32, rhoF: f32, rhoO: f32
     * };
     * 
     * struct AtmosphereCoefficients {
     *     scatTotal: vec3<f32>,
     *     extinction: vec3<f32>
     * };
     * 
     * // [KO] 유틸리티
     * fn getRaySphereIntersection(rayOrigin: vec3<f32>, rayDir: vec3<f32>, sphereRadius: f32) -> f32 {
     *     let b = dot(rayOrigin, rayDir);
     *     let c = dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;
     *     let delta = b * b - c;
     *     if (delta < 0.0) { return -1.0; }
     *     let s = sqrt(delta);
     *     let t0 = -b - s;
     *     let t1 = -b + s;
     *     if (t0 > EPSILON) { return t0; }
     *     if (t1 > EPSILON) { return t1; }
     *     return -1.0;
     * }
     * 
     * fn getPlanetIntersection(origin: vec3<f32>, dir: vec3<f32>, r: f32) -> vec2<f32> {
     *     let b = dot(origin, dir);
     *     let c = dot(origin, origin) - r * r;
     *     let delta = b * b - c;
     *     if (delta < 0.0) { return vec2<f32>(-1.0); }
     *     let s = sqrt(delta);
     *     return vec2<f32>(-b - s, -b + s);
     * }
     * 
     * fn getTransmittanceUV(h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
     *     // [KO] 수평선(cosTheta = 0) 부근의 정밀도를 높이기 위한 비선형 매핑
     *     // [EN] Non-linear mapping to increase precision near the horizon (cosTheta = 0)
     *     let mu = clamp(cosTheta, -1.0, 1.0);
     *     // [KO] 경계면 블리딩 방지를 위한 안전 클램핑 (0.001 ~ 0.999)
     *     // [EN] Safe clamping (0.001 to 0.999) to prevent edge bleeding
     *     let u = clamp(0.5 + 0.5 * sign(mu) * sqrt(abs(mu)), 0.001, 0.999);
     *     let v = clamp(1.0 - h / atmosphereHeight, 0.001, 0.999);
     *     return vec2<f32>(u, v);
     * }
     * 
     * fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, bottomRadius: f32, atmosphereHeight: f32) -> vec2<f32> {
     *     // [KO] Zenith/Nadir 부근에서의 atan2(0, 0) 특이점 방지
     *     var azimuth: f32;
     *     if (abs(viewDir.z) < 1e-6 && abs(viewDir.x) < 1e-6) {
     *         azimuth = 0.0;
     *     } else {
     *         azimuth = atan2(viewDir.z, viewDir.x);
     *     }
     *     // [KO] 방위각(Azimuth) U축에도 경계면 블리딩 방지를 위한 안전 클램핑 추가
     *     let u = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
     *     let r = bottomRadius;
     *     let h = max(0.0001, viewHeight);
     *     
     *     let horizonCos = -sqrt(max(0.0, h * (2.0 * r + h))) / (r + h);
     *     let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));
     *     let viewElevation = asin(clamp(viewDir.y, -1.0, 1.0));
     * 
     *     var v: f32;
     *     if (viewElevation >= horizonElevation) {
     *         let ratio = (viewElevation - horizonElevation) / (HPI - horizonElevation);
     *         v = 0.5 * (1.0 - sqrt(max(0.0, ratio)));
     *     } else {
     *         let ratio = (horizonElevation - viewElevation) / (horizonElevation + HPI);
     *         v = 0.5 * (1.0 + sqrt(max(0.0, ratio)));
     *     }
     *     // [KO] 수평선 및 양극점(Zenith/Nadir)에서의 아티팩트 방지를 위한 v축 클램핑
     *     // [EN] v-axis clamping to prevent artifacts at the horizon and poles (Zenith/Nadir)
     *     return vec2<f32>(u, clamp(v, 0.001, 0.999));
     * }
     * 
     * fn getTransmittance(atmosphereTransmittanceTexture: texture_2d<f32>, atmosphereSampler: sampler, h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
     *     let uv = getTransmittanceUV(h, cosTheta, atmosphereHeight);
     *     var transmittance = textureSampleLevel(atmosphereTransmittanceTexture, atmosphereSampler, uv, 0.0).rgb;
     *     
     *     // [KO] mu < 0(지평선 아래)일 때 하드웨어 보간에 의한 빛 누출 방지
     *     // [EN] Prevent light leaking due to hardware interpolation when mu < 0 (below horizon)
     *     let mu = clamp(cosTheta, -1.0, 1.0);
     *     if (mu < 0.0) {
     *         // [KO] 지면 물리 모드에서는 지평선 아래를 완전히 차단
     *         // [EN] In ground physics mode, block below horizon completely
     *         let groundMask = smoothstep(-0.015, 0.0, mu); 
     *         transmittance *= groundMask;
     *     }
     *     return transmittance;
     * }
     * 
     * fn getPlanetShadowMask(p: vec3<f32>, sunDir: vec3<f32>, r: f32, params: SkyAtmosphere) -> f32 {
     *     if (params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0) { return 0.0; }
     *     return 1.0;
     * }
     * 
     * fn getAtmosphereDensities(h: f32, params: SkyAtmosphere) -> AtmosphereDensities {
     *     var d: AtmosphereDensities;
     *     if (h < 0.0) {
     *         d.rhoR = 0.0; d.rhoM = 0.0; d.rhoF = 0.0; d.rhoO = 0.0;
     *     } else {
     *         d.rhoR = exp(-h / params.rayleighExponentialDistribution);
     *         d.rhoM = exp(-h / params.mieExponentialDistribution);
     *         d.rhoF = exp(-h * params.heightFogFalloff);
     *         
     *         // [KO] 흡수층(오존) 밀도: 물리적으로 더 정확한 Tent Function 기반 프로파일 (Hillaire 2020)
     *         // [EN] Absorption layer (Ozone) density: Physically more accurate Tent Function based profile (Hillaire 2020)
     *         let ozoneDist = abs(h - params.absorptionTipAltitude);
     *         d.rhoO = max(0.0, 1.0 - ozoneDist / params.absorptionTentWidth);
     *     }
     *     return d;
     * }
     * 
     * fn getSunTransmittanceManual(p: vec3<f32>, sunDir: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
     *     let r = params.bottomRadius;
     *     let tMax = getRaySphereIntersection(p, sunDir, r + params.atmosphereHeight);
     *     if (tMax <= 0.0) { return vec3<f32>(1.0); }
     *     let intersect = getPlanetIntersection(p, sunDir, r);
     *     
     *     // [KO] 지면 차폐 확인: 태양 방향으로 지면과 충돌하는 경우 투과율 0
     *     // [EN] Check for ground occlusion: transmittance is 0 if colliding with ground in sun direction
     *     if (params.useGround > 0.5 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
     * 
     *     var optExt = vec3<f32>(0.0);
     *     if (intersect.x > EPSILON && intersect.x < tMax) {
     *         optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, 20u, params);
     *         if (intersect.y > 0.0 && tMax > intersect.y) {
     *             optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, 20u, params);
     *         }
     *     } else {
     *         optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 40u, params);
     *     }
     *     return exp(-min(optExt, vec3<f32>(MAX_TAU)));
     * }
     * 
     * fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmH: f32, params: SkyAtmosphere) -> vec3<f32> {
     *     let intersect = getPlanetIntersection(p, sunDir, r);
     *     if (params.useGround > 0.5 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
     *     return getSunTransmittanceManual(p, sunDir, params);
     * }
     * 
     * fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
     *     if (tMax <= tMin) { return vec3<f32>(0.0); }
     *     let stepSize = (tMax - tMin) / f32(steps);
     *     var optExt = vec3<f32>(0.0);
     *     for (var i = 0u; i < steps; i = i + 1u) {
     *         let t = tMin + (f32(i) + 0.5) * stepSize;
     *         let h = length(origin + dir * t) - params.bottomRadius;
     *         if (h < 0.0) { continue; }
     *         let d = getAtmosphereDensities(h, params);
     *         // [KO] 산란 및 흡수 배율 적용
     *         // [EN] Apply scattering and absorption scaling
     *         let scatR = params.rayleighScattering * d.rhoR * params.skyLuminanceFactor;
     *         let mieExt = (params.mieScattering + params.mieAbsorption) * d.rhoM * params.skyLuminanceFactor;
     *         let absC = params.absorptionCoefficient * d.rhoO;
     *         
     *         optExt += (scatR + vec3<f32>(mieExt) + absC) * stepSize;
     *     }
     *     return optExt;
     * }
     * 
     * fn phaseRayleigh(cosTheta: f32) -> f32 {
     *     return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
     * }
     * 
     * fn phaseMie(cosTheta: f32, g: f32) -> f32 {
     *     let g2 = g * g;
     *     return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(EPSILON, 1.0 + g2 - 2.0 * g * cosTheta), 1.5));
     * }
     * 
     * fn phaseMieDual(cosTheta: f32, g: f32, halo: f32, glow: f32) -> f32 {
     *     return mix(phaseMie(cosTheta, g), phaseMie(cosTheta, halo), glow);
     * }
     * 
     * /**
     *  * [KO] 태양 본체의 물리적 휘도(Radiance)를 계산합니다. (Unit Scale)
     *  * [EN] Calculates the physical radiance of the sun disk. (Unit Scale)
     *  *\/
     * /**
     *  * [KO] 수평선 근처에서 태양이 수직으로 압축되는 효과를 반영한 View-Sun Cosine 값을 계산합니다.
     *  * [EN] Calculates the View-Sun Cosine value reflecting the vertical squashing effect of the sun near the horizon.
     *  *\/
     * fn getSquashedViewSunCos(viewDir: vec3<f32>, sunDir: vec3<f32>) -> f32 {
     *     let sunElevationParam = saturate(sunDir.y);
     *     let squashFactor = mix(0.85, 1.0, sunElevationParam);
     *     let verticalDist = viewDir.y - sunDir.y;
     *     
     *     // [KO] 천장(Zenith) 및 태양 반대편에서의 아티팩트 방지를 위한 가드 조건
     *     let correctionGuard = saturate(dot(viewDir, sunDir) * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
     *     let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) * correctionGuard;
     *     
     *     return dot(viewDir, sunDir) - squashCorrection;
     * }
     * 
     * /**
     *  * [KO] 태양 본체의 물리적 휘도(Radiance)를 계산합니다. (Unit Scale)
     *  * [EN] Calculates the physical radiance of the sun disk. (Unit Scale)
     *  *\/
     * fn getSunDiskRadianceUnit(
     *     viewSunCos: f32,
     *     sunSize: f32,
     *     sunLimbDarkening: f32,
     *     skyTrans: vec3<f32>,
     *     edgeSoftness: f32 
     * ) -> vec3<f32> {
     *     let sunRad = sunSize * DEG_TO_RAD;
     *     let cosSunRad = cos(sunRad);
     *     
     *     // [KO] 고체각 기반 휘도 배율 계산 (에너지 보존)
     *     let solidAngle = PI2 * (1.0 - cosSunRad);
     *     
     *     // [KO] 태양 코어를 더 밝게 만들기 위해 배율 상향 (물리 상수 대비 약 2배 강조)
     *     // [EN] Boost radiance scale to make the sun core brighter (about 2x emphasis over physical constants)
     *     let radianceScale = 2.0 / max(6.7e-5, solidAngle); 
     * 
     *     let dist = (1.0 - viewSunCos) / max(1e-7, 1.0 - cosSunRad);
     *     let sunMask = 1.0 - smoothstep(1.0 - edgeSoftness, 1.0, dist);
     *     if (sunMask <= 0.0) { return vec3<f32>(0.0); }
     * 
     *     // [KO] 주연 감광 및 정규화
     *     let limbDarkening = pow(max(1e-7, 1.0 - saturate(dist)), sunLimbDarkening);
     *     let energyNormalization = sunLimbDarkening + 1.0;
     * 
     *     var radiance = (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;
     * 
     *     // [KO] 휘도 피크를 f16 한계 부근까지 확장 (2000 -> 60000)
     *     // [KO] 이를 통해 톤매핑 후 태양이 훨씬 더 작고 날카롭게 보이게 됩니다.
     *     // [EN] Expand radiance peaks near f16 limits (2000 -> 60000)
     *     // [EN] This makes the sun look much smaller and sharper after tone mapping.
     *     let luma = getLuminance(radiance);
     *     let threshold = 60000.0; 
     *     if (luma > threshold) {
     *         let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
     *         radiance = radiance * (softLuma / luma);
     *     }
     * 
     *     return radiance;
     * }
     * 
     * /**
     *  * [KO] IBL(반사 큐브맵) 전용 태양 휘도를 계산합니다. (Gaussian 모델)
     *  * [EN] Calculates sun radiance for IBL using a Gaussian-like profile. (Unit Scale)
     *  *\/
     * fn getSunDiskRadianceIBL(
     *     viewSunCos: f32,
     *     sunLimbDarkening: f32,
     *     skyTrans: vec3<f32>
     * ) -> vec3<f32> {
     *     // [KO] IBL 안정성을 위해 태양 반지름을 약 15도(sigma=7.5)로 대폭 분산시킴.
     *     // [KO] 중요도 샘플링(Importance Sampling) 시 샘플들이 태양을 놓치지 않도록 충분히 넓은 영역을 확보합니다.
     *     // [EN] Spread the sun radius to about 15 degrees (sigma=7.5) for maximum IBL stability.
     *     // [EN] Ensure a wide enough area so that importance sampling doesn't miss the sun.
     *     const IBL_SUN_ALPHA: f32 = 0.26; // ~15 degrees
     *     const IBL_SUN_COS: f32 = 0.9659; // cos(IBL_SUN_ALPHA)
     *     const IBL_RADIANCE_SCALE: f32 = 4.66; // 1.0 / (2 * PI * (1 - IBL_SUN_COS))
     * 
     *     let diff = saturate(1.0 - viewSunCos);
     *     let sigma_sq = 1.0 - IBL_SUN_COS;
     *     
     *     // [KO] Exponential falloff (Gaussian approximation)
     *     let falloff = exp(-diff / max(1e-7, sigma_sq));
     *     if (falloff < 0.001) { return vec3<f32>(0.0); }
     * 
     *     // [KO] 에너지 정규화
     *     var radiance = (IBL_RADIANCE_SCALE * falloff) * skyTrans;
     * 
     *     // [KO] IBL 휘도 피크 억제: 샘플링 시 에일리언싱 및 Fireflies 방지
     *     let luma = getLuminance(radiance);
     *     let threshold = 100.0; // 넓어진 면적에 맞춰 임계값을 더 낮춰 수치적 안정성 확보
     *     if (luma > threshold) {
     *         let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
     *         radiance = radiance * (softLuma / luma);
     *     }
     * 
     *     return radiance;
     * }
     * 
     * /**
     *  * [KO] 실시간 Mie Glow(Hybrid) 강도를 계산합니다. (Unit Scale)
     *  * [EN] Calculates real-time Mie Glow (Hybrid) intensity (Unit Scale).
     *  *\/
     * fn getMieGlowAmountUnit(
     *     viewSunCos: f32,
     *     h: f32, 
     *     params: SkyAtmosphere, 
     *     transmittanceTexture: texture_2d<f32>, 
     *     atmosphereSampler: sampler,
     *     transToEdge: vec3<f32>,
     *     overrideHalo: f32 // [KO] 비등방성 계수 오버라이드 (0.0이면 기본값 사용)
     * ) -> vec3<f32> {
     *     let halo = select(params.mieHalo, overrideHalo, overrideHalo > 0.0);
     *     
     *     // [KO] LUT에서 누락된 '날카로운(Sharp)' Mie 성분만 별도로 계산하여 합산
     *     let sharpPhase = phaseMie(viewSunCos, min(halo, 0.98));
     * 
     *     // [KO] 태양 방향의 투과율 참조 (카메라 높이 h 기준)
     *     let sunDirY = params.sunDirection.y;
     *     let sunCosTheta = clamp(sunDirY, -1.0, 1.0); 
     *     let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, h, sunCosTheta, params.atmosphereHeight);
     *     
     *     // [KO] 하늘 영역의 번짐을 극도로 억제하기 위해 글로우 강도 추가 하향 (0.15배 감쇄)
     *     // [EN] Extremely suppress sky area bleeding by reducing glow intensity (0.15x attenuation)
     *     const GLOW_SUPPRESS: f32 = 0.15;
     *     
     *     var glow = sunTransForGlow * (params.mieScattering / max(0.0001, params.mieScattering + params.mieAbsorption)) 
     *                         * (sharpPhase * params.mieGlow) * (1.0 - transToEdge) * GLOW_SUPPRESS;
     * 
     *     // [KO] 휘도 피크 억제 (Soft-Knee Clamping): 글로우 번짐 방지
     *     let luma = getLuminance(glow);
     *     let threshold = 100.0;
     *     if (luma > threshold) {
     *         let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
     *         glow = glow * (softLuma / luma);
     *     }
     *     return glow;
     * }
     * 
     * fn integrateScatSegment(
     *     origin: vec3<f32>, dir: vec3<f32>, 
     *     tMin: f32, tMax: f32, steps: u32, 
     *     params: SkyAtmosphere,
     *     atmosphereTransmittanceTexture: texture_2d<f32>, 
     *     atmosphereSampler: sampler,
     *     atmosphereMultiScatTexture: texture_2d<f32>,
     *     useLUT: bool,
     *     includeGlow: bool,
     *     radiance: ptr<function, vec3<f32>>, 
     *     transmittance: ptr<function, vec3<f32>>
     * ) {
     *     if (tMax <= tMin) { return; }
     *     let r = params.bottomRadius;
     *     let stepSize = (tMax - tMin) / f32(steps);
     *     let sunDir = params.sunDirection;
     *     let viewSunCos = dot(dir, sunDir);
     *     
     *     let phaseR = phaseRayleigh(viewSunCos);
     *     
     *     var phaseM: f32;
     *     if (includeGlow) {
     *         // [KO] 전체 에너지가 1로 정규화된 듀얼 위상 함수 사용
     *         // [EN] Use dual phase function normalized to total energy of 1
     *         phaseM = phaseMieDual(viewSunCos, params.mieAnisotropy, params.mieHalo, params.mieGlow);
     *     } else {
     *         // [KO] Glow로 빠져나갈 에너지를 제외한 '기본 Mie' 성분만 계산 (에너지 보존)
     *         // [KO] Integral of phaseM is (1.0 - mieGlow).
     *         // [EN] Calculate only the 'Base Mie' component excluding the energy that will go to Glow (Energy conservation)
     *         // [EN] Integral of phaseM is (1.0 - mieGlow).
     *         phaseM = phaseMie(viewSunCos, params.mieAnisotropy) * (1.0 - params.mieGlow);
     *     }
     *     
     *     let phaseF = phaseMie(viewSunCos, params.heightFogAnisotropy);
     * 
     *     for (var i = 0u; i < steps; i = i + 1u) {
     *         let t = tMin + (f32(i) + 0.5) * stepSize;
     *         let p = origin + dir * t;
     *         let pLen = length(p);
     *         let h = pLen - r;
     *         
     *         if (params.useGround > 0.5 && h < 0.0) { continue; }
     * 
     *         let up = p / pLen;
     *         let cosSun = dot(up, sunDir);
     *         
     *         var sunTrans: vec3<f32>;
     *         if (useLUT) {
     *             sunTrans = getTransmittance(atmosphereTransmittanceTexture, atmosphereSampler, h, cosSun, params.atmosphereHeight);
     *         } else {
     *             sunTrans = getSunTransmittanceManual(p, sunDir, params);
     *         }
     *         
     *         let shadowMask = select(1.0, 0.0, params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0);
     *         let d = getAtmosphereDensities(h, params);
     * 
     *         let scatR = params.rayleighScattering * d.rhoR * params.skyLuminanceFactor;
     *         let scatM = params.mieScattering * d.rhoM * params.skyLuminanceFactor;
     *         let scatF = params.heightFogDensity * d.rhoF * params.skyLuminanceFactor;
     *         
     *         let stepScat = (scatR * phaseR + vec3<f32>(scatM * phaseM + scatF * phaseF)) * sunTrans * shadowMask;
     *         
     *         // [KO] 다중 산란광 계산: msLUT는 전체 산란 에너지 보정 비율이므로, 현재의 전체 산란 계수(scaled)와 직접 곱합니다.
     *         // [EN] Multi-Scattering calculation: msLUT is the total scattering energy compensation ratio, 
     *         // [EN] so multiply it directly with the current total scattering coefficient (scaled).
     *         let scatTotal = scatR + vec3<f32>(scatM + scatF);
     *         let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - h / params.atmosphereHeight, 0.001, 0.999));
     *         // [KO] MS 에너지는 단위 강도로 계산 (sunIntensity는 렌더링 시점에만 적용)
     *         let msScat = textureSampleLevel(atmosphereMultiScatTexture, atmosphereSampler, msUV, 0.0).rgb * scatTotal * shadowMask;
     * 
     *         let ext = scatR + vec3<f32>((params.mieScattering + params.mieAbsorption) * d.rhoM * params.skyLuminanceFactor) + params.absorptionCoefficient * d.rhoO + vec3<f32>(scatF);
     * 
     *         *radiance += *transmittance * (stepScat + msScat) * stepSize;
     *         *transmittance *= exp(-ext * stepSize);
     *     }
     * }
     * 
     * // [KO] 큐브맵 UV 및 Face 인덱스를 기반으로 방향 벡터(Normal/ViewDir)를 반환합니다.
     * fn getCubeMapDirection(uv: vec2<f32>, face: u32) -> vec3<f32> {
     *     let tex = uv * 2.0 - 1.0;
     *     var dir: vec3<f32>;
     *     switch (face) {
     *         case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); } // +X
     *         case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); } // -X
     *         case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }  // +Y
     *         case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); } // -Y
     *         case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }  // +Z
     *         case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); } // -Z
     *         default: { dir = vec3<f32>(0.0); }
     *     }
     *     return dir;
     * }
     * 
     * // [KO] 대기 산란 지면 반사광(Ground Radiance)을 계산합니다.
     * fn evaluateGroundRadiance(cosSun: f32, sunTrans: vec3<f32>, msEnergy: vec3<f32>, groundAlbedo: vec3<f32>) -> vec3<f32> {
     *     let sunShadow = smoothstep(-0.01, 0.01, cosSun);
     *     var groundRadiance = vec3<f32>(0.0);
     *     if (sunShadow > 0.0) {
     *         groundRadiance = (sunTrans * max(0.0, cosSun) + msEnergy * PI) * (groundAlbedo * INV_PI) * sunShadow;
     *     } else {
     *         groundRadiance = (msEnergy * PI) * (groundAlbedo * INV_PI);
     *     }
     *     return groundRadiance;
     * }
     * 
     * // [KO] 태양 본체 스페큘러(Specular Sun Lobe) 강도를 계산합니다.
     * fn getSpecularSunLobe(viewSun: f32, lobeHalfAngle: f32) -> f32 {
     *     let cosHalf = cos(lobeHalfAngle);
     *     let sunLobePower = clamp(log(0.5) / log(max(1e-4, cosHalf)), 2.0, 128.0);
     *     let sunLobeNorm = (sunLobePower + 1.0) * (0.5 * INV_PI);
     *     return sunLobeNorm * pow(max(0.0, viewSun), sunLobePower);
     * }
     * 
     * // [KO] IBL 및 Reflection용 대기 휘도(Radiance)를 통합 평가합니다.
     * fn evaluateIBLRadiance(
     *     viewDir: vec3<f32>, 
     *     params: SkyAtmosphere, 
     *     transmittanceLUT: texture_2d<f32>, 
     *     multiScatLUT: texture_2d<f32>, 
     *     skyViewLUT: texture_2d<f32>, 
     *     skyAtmosphereSampler: sampler
     * ) -> vec3<f32> {
     *     let r = params.bottomRadius;
     *     let viewHeight = 0.0;
     *     let atmosphereHeight = params.atmosphereHeight;
     *     let sunDir = normalize(params.sunDirection);
     * 
     *     let IBL_SUN_DAMP = select(1.0, 0.5, mode == 0u);
     *     let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
     * 
     *     let camPos = vec3<f32>(0.0, r + camH, 0.0);
     *     let tEarth = getRaySphereIntersection(camPos, viewDir, r);
     *     let isGround = params.useGround > 0.5 && tEarth > 0.0 && viewDir.y < -0.0001;
     * 
     *     var radiance = vec3<f32>(0.0);
     *     let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
     * 
     *     if (isGround) {
     *         let hitP = camPos + viewDir * tEarth;
     *         let hitNormal = normalize(hitP);
     *         let cosS = dot(hitNormal, sunDir);
     *         let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosS, atmH);
     *         let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
     *         let groundRadiance = evaluateGroundRadiance(cosS, sunT, msEnergy, params.groundAlbedo);
     * 
     *         let viewZenithCosAngle = dot(hitNormal, -viewDir);
     *         let viewTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewZenithCosAngle, atmH);
     *         
     *         let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
     *         let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
     *         let inScattering = skySample.rgb;
     * 
     *         let transToEdge = vec3<f32>(skySample.a);
     *         let glowHalo = select(0.80, 0.65, mode == 1u);
     *         let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToEdge, glowHalo) * IBL_SUN_DAMP;
     * 
     *         radiance = groundRadiance * viewTransmittance + inScattering + mieGlowAmount;
     *     } else {
     *         let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
     *         let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
     *         radiance = skySample.rgb;
     * 
     *         let transToViewEdge = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
     *         let glowHalo = select(0.80, 0.65, mode == 1u);
     *         let mieGlowStable = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToViewEdge, glowHalo) * IBL_SUN_DAMP;
     *         radiance += mieGlowStable;
     * 
     *         if (mode == 0u) {
     *             radiance += getSunDiskRadianceIBL(viewSunCos, params.sunLimbDarkening, sunTrans) * IBL_SUN_DAMP;
     *         } else {
     *             let viewSun = max(0.0, dot(viewDir, sunDir));
     *             if (mode == 1u) {
     *                 // SoftCut
     *                 let sunRad = 0.25 * DEG_TO_RAD;
     *                 let lobeHalfAngle = clamp(sunRad, 0.002, 0.09);
     *                 let sunLobe = getSpecularSunLobe(viewSun, lobeHalfAngle);
     *                 radiance += sunTrans * sunLobe;
     * 
     *                 let cosCore = cos(lobeHalfAngle * 0.9);
     *                 let cosEdge = cos(lobeHalfAngle * 1.2);
     *                 let lobeMask = smoothstep(cosEdge, cosCore, viewSun);
     *                 radiance = mix(skySample.rgb, radiance, lobeMask);
     *             } else if (mode == 2u) {
     *                 // NoSoftCut
     *                 let sunRad = 5.0 * DEG_TO_RAD;
     *                 let lobeHalfAngle = clamp(sunRad, 0.1, 0.6);
     *                 let sunLobe = getSpecularSunLobe(viewSun, lobeHalfAngle);
     *                 radiance += sunTrans * sunLobe;
     *             }
     *         }
     *     }
     * 
     *     if (mode == 0u) {
     *         let finalLuma = getLuminance(radiance);
     *         let finalThreshold = 50.0; 
     *         if (finalLuma > finalThreshold) {
     *             let softLuma = finalThreshold + (finalLuma - finalThreshold) / (1.0 + (finalLuma - finalThreshold) / finalThreshold);
     *             radiance = radiance * (softLuma / finalLuma);
     *         }
     *     }
     * 
     *     return radiance;
     * }
     * 
     * // [KO] NDC 좌표와 역투영/역뷰 매핑 행렬을 통해 Frustum Ray 방향 벡터를 반환합니다.
     * fn getFrustumRayDirection(uv: vec2<f32>, invP: mat4x4<f32>, invV: mat4x4<f32>) -> vec3<f32> {
     *     let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
     *     let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
     *     let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
     *     return normalize(worldRotation * viewSpaceDir);
     * }
     * ```
     */
    export const skyAtmosphereFn = skyAtmosphereFn_wgsl;
    /**
     * [KO] UE5 표준 Transmittance LUT 생성
     *
     * ```wgsl
     * 
     * @group(0) @binding(0) var atmosphereTransmittanceTexture: texture_storage_2d<rgba16float, write>;
     * @group(0) @binding(1) var<uniform> params: SkyAtmosphere;
     * 
     * @compute @workgroup_size(16, 16)
     * fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
     *     let size = textureDimensions(atmosphereTransmittanceTexture);
     *     if (global_id.x >= size.x || global_id.y >= size.y) { return; }
     * 
     *     // [KO] 텍셀 중심 매핑으로 정밀도 향상
     *     // [EN] Improve precision with pixel center mapping
     *     let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
     *     
     *     // [KO] 수평선(cosTheta = 0) 부근에 더 많은 텍셀을 할당하기 위한 비선형 역매핑
     *     // [EN] Non-linear inverse mapping to allocate more texels near the horizon (cosTheta = 0)
     *     let x = uv.x * 2.0 - 1.0;
     *     let cosTheta = sign(x) * x * x;
     *     
     *     // [KO] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
     *     // [EN] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
     *     let h = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);
     * 
     *     let T = exp(-min(getOpticalDepth(h, cosTheta), vec3<f32>(100.0)));
     *     textureStore(atmosphereTransmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
     * }
     * 
     * fn getOpticalDepth(h: f32, cosTheta: f32) -> vec3<f32> {
     *     let r = params.bottomRadius;
     *     let rayOrigin = vec3<f32>(0.0, h + r, 0.0);
     *     let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
     *     let rayDir = vec3<f32>(sinTheta, cosTheta, 0.0);
     * 
     *     let tMax = getRaySphereIntersection(rayOrigin, rayDir, r + params.atmosphereHeight);
     *     if (tMax <= 0.0) { return vec3<f32>(0.0); }
     * 
     *     // [KO] 지면 교차점 계산 (tIn, tOut 모두 확보)
     *     // [EN] Calculate earth intersections (get both tIn and tOut)
     *     let b = dot(rayOrigin, rayDir);
     *     let c = dot(rayOrigin, rayOrigin) - r * r;
     *     let delta = b * b - c;
     *     
     *     var optExt = vec3<f32>(0.0);
     *     if (delta >= 0.0) {
     *         let s = sqrt(delta);
     *         let tIn = -b - s;
     *         let tOut = -b + s;
     * 
     *         // [KO] useGround가 활성화된 경우에만 지면 아래를 불투명 처리합니다.
     *         if (params.useGround > 0.5 && tIn > EPSILON) { 
     *             return vec3<f32>(MAX_TAU); 
     *         }
     * 
     *         // [KO] 지면 관통 시 (useGround가 꺼져 있는 경우 포함): 구간 분할 적분
     *         if (tIn > EPSILON && tIn < tMax) {
     *              // 1. 앞쪽 대기 구간 (진입점까지)
     *              optExt += integrateOpticalDepth(rayOrigin, rayDir, 0.0, tIn, 20u, params);
     *              // 2. 뒤쪽 대기 구간 (탈출점부터 대기 끝까지)
     *              if (tOut > 0.0 && tMax > tOut) {
     *                  optExt += integrateOpticalDepth(rayOrigin, rayDir, tOut, tMax, 20u, params);
     *              }
     *         } else {
     *              // 지면을 비껴가는 일반적인 경로
     *              optExt = integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, 40u, params);
     *         }
     *     } else {
     *         // 지면과 전혀 만나지 않는 경로
     *         optExt = integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, 40u, params);
     *     }
     * 
     *     return optExt;
     * }
     * ```
     */
    export const transmittanceLUT = transmittanceShaderCode_wgsl;
}

/**
 * [KO] 엔트리 포인트 관련 셰이더 함수 라이브러리
 * [EN] Entry point related shader function library
 */
export namespace EntryPointLibrary {
    /** [KO] 메시 관련 엔트리 포인트 [EN] Mesh related entry points */
    export namespace mesh {
        /**
         * ```wgsl
         * @vertex
         * fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
         *     var output: VertexOutput;
         *     let input_position = inputData.position;
         *     let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
         *     let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
         *     let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
         *     let u_camera = systemUniforms.camera;
         *     let u_viewMatrix = u_camera.viewMatrix;
         *     var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);
         *     output.position = u_projectionViewMatrix * position;
         *     output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
         *     return output;
         * }
         * ```
         */
        export const entryPointPickingVertex = meshEntryPointPickingVertex_wgsl;
        /**
         * ```wgsl
         * @fragment
         * fn entryPointPickingFragment(inputData: InputData) -> @location(0) vec4<f32> {
         *     var finalColor:vec4<f32> = inputData.pickingId;
         *     return finalColor;
         * }
         * ```
         */
        export const entryPointPickingFragment = meshEntryPointPickingFragment_wgsl;
        /**
         * ```wgsl
         * #redgpu_include shadow.getShadowClipPosition
         * #redgpu_include systemStruct.OutputShadowData;
         * 
         * @vertex
         * fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
         *     var output: OutputShadowData;
         * 
         *     // 시스템 Uniform 변수 가져오기
         *     let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
         *     let u_camera = systemUniforms.camera;
         *     let u_viewMatrix = u_camera.viewMatrix;
         *     let u_cameraPosition = u_camera.cameraPosition;
         * 
         *     // Vertex별 Uniform 변수 가져오기
         *     let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
         * 
         *     // 입력 데이터
         *     let input_position = inputData.position;
         *     let input_vertexNormal = inputData.vertexNormal;
         *     let input_uv = inputData.uv;
         * 
         *     // 위치 변환 처리
         *     var position: vec4<f32>;
         *     position = u_modelMatrix * vec4<f32>(input_position, 1.0);
         * 
         *     // 디스플레이스먼트 텍스처 적용
         *     #redgpu_if useDisplacementTexture
         *     {
         *         let distance = distance(position.xyz, u_cameraPosition);
         *         let mipLevel = (distance / maxDistance) * maxMipLevel;
         *         let displacedPosition = getDisplacementPosition(
         *             input_position,
         *             input_vertexNormal,
         *             displacementTexture,
         *             displacementTextureSampler,
         *             vertexUniforms.displacementScale,
         *             input_uv,
         *             mipLevel
         *         );
         *         position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
         *     }
         *     #redgpu_endIf
         * 
         *     // 최종 위치 계산 (그림자 맵 좌표계로 변환)
         *     output.position = getShadowClipPosition(position.xyz, u_directionalLightProjectionViewMatrix);
         * 
         *     return output;
         * }
         * ```
         */
        export const entryPointShadowVertex = meshEntryPointShadowVertex_wgsl;
    }
    /** [KO] 빌보드 관련 엔트리 포인트 [EN] Billboard related entry points */
    export namespace billboard {
        /**
         * ```wgsl
         * @vertex
         * fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
         *     var output: VertexOutput;
         *     let u_resolution = systemUniforms.resolution;
         *     
         *     #redgpu_if disableJitter
         *         let u_projectionMatrix = systemUniforms.projection.noneJitterProjectionMatrix;
         *     #redgpu_else
         *         let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
         *     #redgpu_endIf
         *     
         *     let u_viewMatrix = systemUniforms.camera.viewMatrix;
         *     let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
         *     let u_useBillboard = vertexUniforms.useBillboard;
         *     let u_usePixelSize = vertexUniforms.usePixelSize;
         *     let u_pixelSize = vertexUniforms.pixelSize;
         *     let u_renderRatioX = vertexUniforms._renderRatioX;
         *     let u_renderRatioY = vertexUniforms._renderRatioY;
         * 
         *     var ratioScaleMatrix: mat4x4<f32> = mat4x4<f32>(
         *         u_renderRatioX, 0, 0, 0,
         *         0, u_renderRatioY, 0, 0,
         *         0, 0, 1, 0,
         *         0, 0, 0, 1
         *     );
         * 
         *     if (u_useBillboard == 1) {
         *         let billboardMatrix = getBillboardMatrix(u_viewMatrix, u_modelMatrix, 1u);
         *         
         *         if (u_usePixelSize == 1) {
         *             let viewPositionCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
         *             let clipCenter = u_projectionMatrix * viewPositionCenter;
         *             let scaleX = (u_pixelSize / u_resolution.x) * 2.0 * u_renderRatioX;
         *             let scaleY = (u_pixelSize / u_resolution.y) * 2.0 * u_renderRatioY;
         * 
         *             output.position = vec4<f32>(
         *                 clipCenter.xy + inputData.position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
         *                 clipCenter.zw
         *             );
         *         } else {
         *             output.position = u_projectionMatrix * billboardMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
         *         }
         *     } else {
         *         output.position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
         *     }
         * 
         *     output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
         *     return output;
         * }
         * ```
         */
        export const entryPointPickingVertex = billboardEntryPointPickingVertex_wgsl;
    }
    /** [KO] 빈 엔트리 포인트 (미지원 객체용) [EN] Empty entry points (for unsupported objects) */
    export namespace empty {
        /**
         * ```wgsl
         * @vertex
         * fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
         *     var output: VertexOutput;
         *     return output;
         * }
         * ```
         */
        export const entryPointPickingVertex = emptyEntryPointPickingVertex_wgsl;
        /**
         * ```wgsl
         * #redgpu_include systemStruct.OutputShadowData;
         * 
         * @vertex
         * fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
         *     var output: OutputShadowData;
         *     return output;
         * }
         * ```
         */
        export const entryPointShadowVertex = emptyEntryPointShadowVertex_wgsl;
    }
}

/**
 * [KO] 시스템 공통 구조체 라이브러리
 * [EN] System common structure library
 */
export namespace SystemStructLibrary {
    /**
     * ```wgsl
     * struct OutputFragment {
     *     @location(0) color: vec4<f32>,
     *     @location(1) gBufferNormal: vec4<f32>,
     *     @location(2) gBufferMotionVector: vec4<f32>,
     * }
     * ```
     */
    export const OutputFragment = OutputFragment_wgsl;
    /**
     * ```wgsl
     * struct OutputShadowData {
     *     @builtin(position) position: vec4<f32>,
     * };
     * ```
     */
    export const OutputShadowData = OutputShadowData_wgsl;
    /**
     * ```wgsl
     * struct Camera {
     *     viewMatrix: mat4x4<f32>,
     *     inverseViewMatrix: mat4x4<f32>,
     *     cameraPosition: vec3<f32>,
     *     nearClipping: f32,
     *     farClipping: f32,
     *     fieldOfView: f32
     * };
     * ```
     */
    export const Camera = Camera_wgsl;
    /**
     * [KO] 투영(Projection) 관련 행렬 구조체 정의입니다.
     * [EN] Definition of the Projection-related matrices structure.
     *
     * ```wgsl
     * struct Projection {
     *     projectionMatrix: mat4x4<f32>,
     *     projectionViewMatrix: mat4x4<f32>,
     *     noneJitterProjectionMatrix: mat4x4<f32>,
     *     noneJitterProjectionViewMatrix: mat4x4<f32>,
     *     inverseProjectionMatrix: mat4x4<f32>,
     *     inverseProjectionViewMatrix: mat4x4<f32>,
     *     prevNoneJitterProjectionViewMatrix: mat4x4<f32>
     * };
     * ```
     */
    export const Projection = Projection_wgsl;
    /**
     * [KO] 시간 관련 데이터 구조체 정의입니다.
     * [EN] Definition of the time-related data structure.
     *
     * ```wgsl
     * struct Time {
     *     time: f32,
     *     deltaTime: f32,
     *     frameIndex: u32,
     *     sinTime: f32
     * };
     * ```
     */
    export const Time = Time_wgsl;
    /**
     * [KO] 직사광(DirectionalLight) 구조체 정의입니다.
     * [EN] Definition of the DirectionalLight structure.
     *
     * ```wgsl
     * struct DirectionalLight {
     * 	  direction:vec3<f32>,
     * 	  color:vec3<f32>,
     * 	  intensity:f32,
     * };
     * ```
     */
    export const DirectionalLight = DirectionalLight_wgsl;
    /**
     * [KO] 환경광(AmbientLight) 구조체 정의입니다.
     * [EN] Definition of the AmbientLight structure.
     *
     * ```wgsl
     * struct AmbientLight {
     * 	  color:vec3<f32>,
     * 	  intensity:f32
     * };
     * ```
     */
    export const AmbientLight = AmbientLight_wgsl;
    /**
     * ```wgsl
     * struct Shadow {
     *     directionalShadowDepthTextureSize: u32,
     *     directionalShadowBias: f32,
     *     padding: vec2<f32> // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
     * };
     * ```
     */
    export const Shadow = Shadow_wgsl;
    /**
     * ```wgsl
     * struct SkyAtmosphere {
     * 	rayleighScattering: vec3<f32>,
     * 	rayleighExponentialDistribution: f32,
     * 	mieScattering: vec3<f32>,
     * 	mieAnisotropy: f32,
     * 	mieAbsorption: vec3<f32>,
     * 	mieExponentialDistribution: f32,
     * 	absorptionCoefficient: vec3<f32>,
     * 	absorptionTipAltitude: f32,
     * 	groundAlbedo: vec3<f32>,
     * 	absorptionTentWidth: f32,
     * 	skyLuminanceFactor: vec3<f32>,
     * 	multiScatteringFactor: f32,
     * 	sunDirection: vec3<f32>,
     * 	transmittanceMinLightElevationAngle: f32,
     * 	groundRadius: f32,
     * 	atmosphereHeight: f32,
     * 	aerialPerspectiveDistanceScale: f32,
     * 	aerialPerspectiveStartDepth: f32,
     * 	sunIntensity: f32,
     * 	sunSize: f32,
     * 	sunLimbDarkening: f32,
     * 	cameraHeight: f32,
     * 	intensity: f32
     * };
     * ```
     */
    export const SkyAtmosphere = SkyAtmosphere_wgsl;
    /**
     * ```wgsl
     * struct MatrixList{
     *     localMatrix: mat4x4<f32>,
     *     modelMatrix: mat4x4<f32>,
     *     prevModelMatrix: mat4x4<f32>,
     *     normalModelMatrix: mat4x4<f32>,
     * }
     * struct VertexUniforms {
     *     matrixList:MatrixList,
     *     pickingId: u32,
     *     receiveShadow: f32,
     *     combinedOpacity: f32,
     *     useDisplacementTexture: u32,
     *     displacementScale: f32,
     *     disableJitter: u32,
     *     uvTransform: vec4<f32>,
     * };
     * ```
     */
    export const meshVertexBasicUniform = meshVertexBasicUniform_wgsl;
}

/**
 * [KO] 엔진 시스템에서 전역적으로 사용되는 셰이더 코드 및 공통 라이브러리를 통합 관리하는 레지스트리입니다.
 * [EN] A registry that integrates and manages shader code and common libraries used globally in the engine.
 *
 * @category Shader
 */
export namespace ShaderLibrary {
    /**
     * [KO] 엔진의 표준 시스템 유니폼 및 전역 바인딩 구조체 정의입니다.
     * [EN] Definitions of the engine's standard system uniforms and global binding structures.
     *
     * ```wgsl
     * #redgpu_include systemStruct.DirectionalLight
     * #redgpu_include systemStruct.AmbientLight
     * 
     * #redgpu_include systemStruct.Camera
     * #redgpu_include systemStruct.Projection
     * #redgpu_include systemStruct.Time
     * #redgpu_include systemStruct.Shadow
     * #redgpu_include systemStruct.SkyAtmosphere
     * 
     * struct SystemUniform {
     * 	  projection: Projection,
     * 	  time: Time,
     * 	  resolution:vec2<f32>,
     *       //
     *       camera:Camera,
     * 	  usePrefilterTexture:u32,
     * 	  isView3D:u32,
     * 	  useSkyAtmosphere:u32,
     * 	  //
     * 	  skyAtmosphere:SkyAtmosphere,
     * 	  shadow:Shadow,
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
     * @group(0) @binding(10) var ibl_prefilterTexture: texture_cube<f32>;
     * @group(0) @binding(11) var ibl_irradianceTexture: texture_cube<f32>;
     * @group(0) @binding(12) var ibl_brdfLUTTexture: texture_2d<f32>;
     * 
     * @group(0) @binding(13) var atmosphereSampler: sampler;
     * @group(0) @binding(14) var transmittanceTexture: texture_2d<f32>;
     * 
     * @group(0) @binding(15) var atmosphereIrradianceTexture: texture_cube<f32>;
     * @group(0) @binding(16) var skyAtmosphere_prefilteredTexture: texture_cube<f32>;
     * 
     * #redgpu_include depth.getLinearizeDepth
     * 
     * const clusterLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
     * const clusterLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);
     * 
     * /**
     *  * [KO] 클러스터 조명 격자의 한 칸(박스) 정보를 나타내는 구조체입니다.
     *  * [EN] Structure representing a single cell (box) in the cluster light grid.
     *  *\/
     * struct ClusterLightCell {
     *     offset : u32,
     *     count : u32
     * };
     * 
     * /**
     *  * [KO] 클러스터 조명 데이터를 통합 관리하는 격자(Grid) 구조체입니다.
     *  * [EN] Grid structure that integrally manages cluster light data.
     *  *\/
     * struct ClusterLightGrid {
     *     offset : atomic<u32>,
     *     cells : array<ClusterLightCell , REDGPU_DEFINE_TOTAL_TILES>,
     *     indices : array<u32, clusterLight_indicesLength>
     * };
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
     * @group(0) @binding(6) var<storage, read_write> clusterLightGrid : ClusterLightGrid;
     * 
     * fn getClusterLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
     *     let tile = getClusterLightTile(fragCoord);
     *     return tile.x +
     *            tile.y * clusterLight_tileCount.x +
     *            tile.z * clusterLight_tileCount.x * clusterLight_tileCount.y;
     * 
     * }
     * fn getClusterLightTile(fragCoord : vec4<f32>) -> vec3<u32> {
     *     let near = systemUniforms.camera.nearClipping;
     *     let far = systemUniforms.camera.farClipping;
     *     let sliceScale = f32(clusterLight_tileCount.z) / log2(far / near);
     *     let sliceBias = -(f32(clusterLight_tileCount.z) * log2(near) / log2(far / near));
     *     let zTile = u32(max(log2(getLinearizeDepth(fragCoord.z, near, far)) * sliceScale + sliceBias, 0.0));
     *     return vec3<u32>(u32(fragCoord.x / (systemUniforms.resolution.x / f32(clusterLight_tileCount.x))),
     *                      u32(fragCoord.y / (systemUniforms.resolution.y / f32(clusterLight_tileCount.y))),
     *                      zTile);
     * }
     * ```
     */
    export const SYSTEM_UNIFORM = SYSTEM_UNIFORM_wgsl;
    /**
     * ```wgsl
     * #redgpu_include systemStruct.Camera
     * #redgpu_include systemStruct.Projection
     * #redgpu_include systemStruct.Time
     * #redgpu_include systemStruct.SkyAtmosphere
     * // [KO] 포스트 이펙트 시스템 유니폼 [EN] Post effect system uniform
     * struct SystemUniform {
     *     projection: Projection,
     *     time: Time,
     *     camera:Camera,
     *     useSkyAtmosphere: u32,
     *     skyAtmosphere:SkyAtmosphere,
     * };
     * 
     * @group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
     * ```
     */
    export const POST_EFFECT_SYSTEM_UNIFORM = POST_EFFECT_SYSTEM_UNIFORM_wgsl;

    /** [KO] 수학 및 공간 변환 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for mathematics and space transformations. */
    export import math = MathLibrary;
    /** [KO] 그림자 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for shadow. */
    export import shadow = ShadowLibrary;
    /** [KO] 색상 변환 및 처리 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for color conversion and processing. */
    export import color = ColorLibrary;
    /** [KO] 깊이(Depth) 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for depth. */
    export import depth = DepthLibrary;
    /** [KO] 조명 및 BRDF 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for lighting and BRDF. */
    export import lighting = LightingLibrary;
    /** [KO] 대기 산란 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for SkyAtmosphere. */
    export import skyAtmosphere = SkyAtmosphereLibrary;
    /** [KO] 엔트리 포인트 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for entry points. */
    export import entryPoint = EntryPointLibrary;
    /** [KO] 시스템 공통 구조체 라이브러리입니다. [EN] Common shader structure library for system. */
    export import systemStruct = SystemStructLibrary;
    /** [KO] glTF KHR 확장 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for glTF KHR extensions. */
    export import KHR = KHRLibrary;
    /** [KO] 디스플레이스먼트(Displacement) 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for displacement. */
    export import displacement = DisplacementLibrary;
}

export default ShaderLibrary;
