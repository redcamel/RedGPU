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
import skyAtmosphereFn_wgsl from '../display/skyAtmosphere/core/skyAtmosphereFn.wgsl';
import transmittanceShaderCode_wgsl
    from '../display/skyAtmosphere/core/generator/transmittance/transmittanceShaderCode.wgsl';
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
import globalVertexStruct_wgsl from './shader/systemStruct/globalStruct/globalVertexStruct.wgsl';
import globalFragmentStructPBR_wgsl from './shader/systemStruct/globalStruct/globalFragmentStructPBR.wgsl';
import globalFragmentStructBuiltIn_wgsl from './shader/systemStruct/globalStruct/globalFragmentStructBuiltIn.wgsl';
import POST_EFFECT_SYSTEM_UNIFORM_wgsl from './shader/systemStruct/POST_EFFECT_SYSTEM_UNIFORM.wgsl';
import SYSTEM_UNIFORM_wgsl from './shader/systemStruct/SYSTEM_UNIFORM.wgsl';
import getReflectionVectorFromViewDirection_wgsl
    from './shader/math/direction/getReflectionVectorFromViewDirection.wgsl';
import getViewDirection_wgsl from './shader/math/direction/getViewDirection.wgsl';
import getRayDirection_wgsl from './shader/math/direction/getRayDirection.wgsl';
import getNDCFromDepth_wgsl from './shader/math/reconstruct/getNDCFromDepth.wgsl';
import getWorldPositionFromDepth_wgsl from './shader/math/reconstruct/getWorldPositionFromDepth.wgsl';
import getViewPositionFromDepth_wgsl from './shader/math/reconstruct/getViewPositionFromDepth.wgsl';
import getWorldNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getWorldNormalFromGNormalBuffer.wgsl';
import getViewNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getViewNormalFromGNormalBuffer.wgsl';
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
import getIsFinite_wgsl from './shader/math/getIsFinite.wgsl';

export namespace MathLibrary {

    export namespace hash {
        /**
         * // [KO] 단일 시드값을 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)
         *
         * // @param seed [KO] 입력 시드값 [EN] Input seed value
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 2D 좌표를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by converting 2D coordinates to integers. (Stable Grid-based)
         *
         * // @param coord [KO] 입력 2D 좌표 [EN] Input 2D coordinates
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 3D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a 3D vector to integers. (Stable Grid-based)
         *
         * // @param v [KO] 입력 3D 벡터 [EN] Input 3D vector
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 4D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a 4D vector to integers. (Stable Grid-based)
         *
         * // @param v [KO] 입력 4D 벡터 [EN] Input 4D vector
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 2D 좌표를 정수로 변환하여 2D 난수 벡터를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 2D random vector by converting 2D coordinates to integers. (Stable Grid-based)
         *
         * // @param coord [KO] 입력 2D 좌표 [EN] Input 2D coordinates
         * // @returns [KO] 생성된 2D 난수 벡터 [EN] Generated 2D random vector
         *
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
         * // [KO] 3D 위치를 정수로 변환하여 3D 난수 벡터를 생성합니다. (안정적 그리드 기반)
         * // [EN] Generates a 3D random vector by converting a 3D position to integers. (Stable Grid-based)
         *
         * // @param position [KO] 입력 3D 위치 [EN] Input 3D position
         * // @returns [KO] 생성된 3D 난수 벡터 [EN] Generated 3D random vector
         *
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
         * // [KO] 단일 시드값의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a single seed value. (Ultra-precise)
         *
         * // @param seed [KO] 입력 시드값 [EN] Input seed value
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 2D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 2D vector. (Ultra-precise)
         *
         * // @param coord [KO] 입력 2D 좌표 [EN] Input 2D coordinates
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 3D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 3D vector. (Ultra-precise)
         *
         * // @param v [KO] 입력 3D 벡터 [EN] Input 3D vector
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 4D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
         * // [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 4D vector. (Ultra-precise)
         *
         * // @param v [KO] 입력 4D 벡터 [EN] Input 4D vector
         * // @returns [KO] 생성된 난수 [EN] Generated random number
         *
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
         * // [KO] 2D 벡터의 비트 구조를 보존하여 2D 난수 벡터를 생성합니다. (초정밀)
         * // [EN] Generates a 2D random vector by preserving the bit structure of a 2D vector. (Ultra-precise)
         *
         * // @param coord [KO] 입력 2D 좌표 [EN] Input 2D coordinates
         * // @returns [KO] 생성된 2D 난수 벡터 [EN] Generated 2D random vector
         *
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
         * // [KO] 3D 벡터의 비트 구조를 보존하여 3D 난수 벡터를 생성합니다. (초정밀)
         * // [EN] Generates a 3D random vector by preserving the bit structure of a 3D vector. (Ultra-precise)
         *
         * // @param position [KO] 입력 3D 위치 [EN] Input 3D position
         * // @returns [KO] 생성된 3D 난수 벡터 [EN] Generated 3D random vector
         *
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
         * // [KO] 입력된 정수의 비트 순서를 뒤집어 0~1 사이의 소수(Van der Corput 시퀀스)를 반환합니다.
         * // [EN] Reverses the bits of an integer to return a floating-point number between 0 and 1 (Van der Corput sequence).
         *
         * // @param bits_in [KO] 입력 정수 [EN] Input integer
         * // @returns [KO] 생성된 소수 [EN] Generated floating-point number
         *
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
         * // [KO] 균일한 분포를 가지는 2D 준난수(Low-Discrepancy Sequence)를 생성합니다. (IBL 등 중요도 샘플링에 필수적입니다.)
         * // [EN] Generates a uniformly distributed 2D quasi-random number (Low-Discrepancy Sequence). (Essential for importance sampling like IBL.)
         *
         * // @param i [KO] 인덱스 [EN] Index
         * // @param N [KO] 전체 샘플 수 [EN] Total number of samples
         * // @returns [KO] 생성된 2D 준난수 [EN] Generated 2D quasi-random number
         *
         *
         * ```wgsl
         * #redgpu_include math.hash.getRadicalInverseVanDerCorput
         *
         * fn getHammersley(i: u32, N: u32) -> vec2<f32> {
         *     return vec2<f32>(f32(i) / f32(N), getRadicalInverseVanDerCorput(i));
         * }
         * ```
         */
        export const getHammersley = getHammersley_wgsl;
    }
    /**
     * // [KO] Jorge Jimenez의 Interleaved Gradient Noise를 생성합니다. (디더링 및 샘플 회전용 초고속 노이즈)
     * // [EN] Generates Interleaved Gradient Noise by Jorge Jimenez. (Ultra-fast noise for dithering and sample rotation)
     *
     * // @param screenCoord [KO] 스크린 좌표 [EN] Screen coordinates
     * // @returns [KO] 생성된 노이즈 값 [EN] Generated noise value
     *
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
     * // [KO] 현재 프레임과 이전 프레임의 클립 공간 좌표를 비교하여 모션 벡터(UV 단위)를 계산합니다.
     * // [EN] Calculates the motion vector (in UV units) by comparing current and previous clip space coordinates.
     *
     * // @param currentClipPos [KO] 현재 프레임의 Clip Space 위치 [EN] Current frame's clip space position
     * // @param prevClipPos [KO] 이전 프레임의 Clip Space 위치 [EN] Previous frame's clip space position
     * // @returns [KO] UV 공간 상의 모션 벡터 (vec2) [EN] Motion vector in UV space (vec2)
     *
     *
     * ```wgsl
     * #redgpu_include math.EPSILON
     *
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
     * // [KO] 단일 스칼라 값이 유한(Finite)한지 체크합니다. (NaN과 Inf 체크)
     * // [EN] Checks if a single scalar value is finite. (Checks for NaN and Inf)
     *
     * // @param x [KO] 입력 스칼라 값 [EN] Input scalar value
     * // @returns [KO] 유한 여부 [EN] Whether it is finite
     *
     *
     * ```wgsl
     * fn getIsFiniteScalar(x: f32) -> bool {
     *     // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
     *     return x == x && abs(x) < 1e30;
     * }
     *
     * /**
     *  * [KO] vec3 벡터의 모든 채널이 유한(Finite)한지 체크합니다.
     *  * [EN] Checks if all channels of a vec3 vector are finite.
     *  *
     *  * @param v [KO] 입력 vec3 벡터 [EN] Input vec3 vector
     *  * @returns [KO] 채널별 유한 여부 (vec3<bool>) [EN] Whether each channel is finite (vec3<bool>)
     *  *
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

    export namespace billboard {
        /**
         * // [KO] 빌보드 행렬을 계산합니다.
         * // [EN] Calculates the billboard matrix.
         *
         * // @param viewMatrix [KO] 카메라 행렬 [EN] Camera matrix
         * // @param modelMatrix [KO] 모델 행렬 [EN] Model matrix
         * // @param useStandardScale [KO] 1u: 표준 (정확한 스케일 추출), 0u: 빠른 스케일 (대각 성분 사용) [EN] 1u: Standard (accurate scale extraction), 0u: Fast scale (uses diagonal elements)
         * // @returns [KO] 계산된 빌보드 행렬 [EN] Calculated billboard matrix
         *
         *
         * ```wgsl
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
         * // [KO] 빌보드 계산 결과 구조체입니다.
         * // [EN] Billboard calculation result structure.
         *
         *
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
         *  *
         *  * @param input_position [KO] 입력 정점 위치 [EN] Input vertex position
         *  * @param input_normal [KO] 입력 정점 법선 [EN] Input vertex normal
         *  * @param modelMatrix [KO] 모델 행렬 [EN] Model matrix
         *  * @param viewMatrix [KO] 뷰 행렬 [EN] View matrix
         *  * @param projectionMatrix [KO] 투영 행렬 [EN] Projection matrix
         *  * @param resolution [KO] 화면 해상도 [EN] Screen resolution
         *  * @param useBillboard [KO] 빌보드 사용 여부 (1u: 사용) [EN] Whether to use billboard (1u: yes)
         *  * @param usePixelSize [KO] 픽셀 크기 모드 사용 여부 (1u: 사용) [EN] Whether to use pixel size mode (1u: yes)
         *  * @param pixelSize [KO] 픽셀 크기 [EN] Pixel size
         *  * @param renderRatioX [KO] 렌더링 가로 비율 [EN] Rendering horizontal ratio
         *  * @param renderRatioY [KO] 렌더링 세로 비율 [EN] Rendering vertical ratio
         *  * @returns [KO] 빌보드 계산 결과 데이터 [EN] Billboard calculation result data
         *  *
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

    export namespace direction {
        /**
         * // [KO] 월드 좌표와 카메라 위치를 사용하여 정규화된 시선 방향 벡터(카메라를 향하는 벡터)를 계산합니다.
         * // [EN] Calculates the normalized view direction vector (vector toward the camera) using world position and camera position.
         *
         * // @param worldPosition [KO] 월드 공간의 좌표 [EN] World space position
         * // @param cameraPosition [KO] 카메라의 월드 위치 [EN] Camera position in world space
         * // @returns [KO] 정규화된 시선 방향 벡터 [EN] Normalized view direction vector
         *
         *
         * ```wgsl
         * fn getViewDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
         *     return normalize(cameraPosition - worldPosition);
         * }
         * ```
         */
        export const getViewDirection = getViewDirection_wgsl;
        /**
         * // [KO] 카메라 위치와 월드 좌표를 사용하여 정규화된 광선 방향 벡터(픽셀을 향하는 벡터)를 계산합니다.
         * // [EN] Calculates the normalized ray direction vector (vector toward the pixel) using camera position and world position.
         *
         * // @param worldPosition [KO] 월드 공간의 좌표 [EN] World space position
         * // @param cameraPosition [KO] 카메라의 월드 위치 [EN] Camera position in world space
         * // @returns [KO] 정규화된 광선 방향 벡터 [EN] Normalized ray direction vector
         *
         *
         * ```wgsl
         * fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
         *     return normalize(worldPosition - cameraPosition);
         * }
         * ```
         */
        export const getRayDirection = getRayDirection_wgsl;
        /**
         * // [KO] 시선 방향(픽셀에서 카메라를 향하는 벡터)과 법선 벡터를 사용하여 정규화된 반사 방향 벡터를 계산합니다.
         * // [EN] Calculates the normalized reflection direction vector using the view direction (vector from pixel to camera) and the normal vector.
         *
         * // [KO] 이 함수는 내부적으로 시선 방향을 반전시켜 reflect(-viewDir, normal) 연산을 수행합니다.
         * // [EN] This function internally negates the view direction to perform the reflect(-viewDir, normal) operation.
         *
         * // @param viewDirection [KO] 시선 방향 (픽셀 -> 카메라) [EN] View direction (pixel -> camera)
         * // @param normal [KO] 표면 법선 벡터 [EN] Surface normal vector
         * // @returns [KO] 정규화된 반사 방향 벡터 [EN] Normalized reflection direction vector
         *
         *
         * ```wgsl
         * fn getReflectionVectorFromViewDirection(viewDirection: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
         *     return reflect(-viewDirection, normal);
         * }
         * ```
         */
        export const getReflectionVectorFromViewDirection = getReflectionVectorFromViewDirection_wgsl;
    }

    export namespace reconstruct {
        /**
         * // [KO] 스크린 UV와 깊이 값을 WebGPU 표준 NDC(Normalized Device Coordinates) 좌표로 변환합니다.
         * // [EN] Converts screen UV and depth values to standard WebGPU NDC (Normalized Device Coordinates).
         *
         * // @param uv [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         * // @param depth [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         * // @returns [KO] NDC 좌표 (-1~1 range for XY, 0~1 for Z) [EN] NDC coordinates
         *
         *
         * ```wgsl
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
         * // [KO] 깊이 정보를 바탕으로 월드 공간의 좌표를 복구합니다.
         * // [EN] Reconstructs world space position from depth information.
         *
         * // @param uv [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         * // @param depth [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         * // @param inverseProjectionViewMatrix [KO] 역투영카메라 행렬 [EN] Inverse Projection-View matrix
         * // @returns [KO] 복구된 월드 공간 좌표 [EN] Reconstructed world space position
         *
         *
         * ```wgsl
         * #redgpu_include math.reconstruct.getNDCFromDepth
         *
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
         * // [KO] 깊이 정보를 바탕으로 뷰(카메라) 공간의 좌표를 복구합니다.
         * // [EN] Reconstructs view (camera) space position from depth information.
         *
         * // @param uv [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
         * // @param depth [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
         * // @param inverseProjectionMatrix [KO] 역투영 행렬 [EN] Inverse Projection matrix
         * // @returns [KO] 복구된 뷰 공간 좌표 [EN] Reconstructed view space position
         *
         *
         * ```wgsl
         * #redgpu_include math.reconstruct.getNDCFromDepth
         *
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
         * // [KO] G-Buffer의 RGB 데이터([0, 1] 범위)를 사용하여 월드 공간 법선 벡터([-1, 1] 범위)를 복구합니다.
         * // [EN] Reconstructs world space normal vector ([-1, 1] range) from G-Buffer RGB data ([0, 1] range).
         *
         * // @param gBufferNormal [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
         * // @returns [KO] 복구된 월드 공간 법선 벡터 [EN] Reconstructed world space normal vector
         *
         *
         * ```wgsl
         * fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
         *     return normalize(gBufferNormal * 2.0 - 1.0);
         * }
         * ```
         */
        export const getWorldNormalFromGNormalBuffer = getWorldNormalFromGNormalBuffer_wgsl;
        /**
         * // [KO] G-Buffer 데이터와 카메라 행렬을 사용하여 뷰 공간 법선 벡터를 복구합니다.
         * // [EN] Reconstructs view space normal vector from G-Buffer data and camera matrix.
         *
         * // @param gBufferNormal [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
         * // @param viewMatrix [KO] 카메라 행렬 (View Matrix) [EN] Camera matrix (View Matrix)
         * // @returns [KO] 복구된 뷰 공간 법선 벡터 [EN] Reconstructed view space normal vector
         *
         *
         * ```wgsl
         * #redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer
         *
         * fn getViewNormalFromGNormalBuffer(gBufferNormal: vec3<f32>, viewMatrix: mat4x4<f32>) -> vec3<f32> {
         *     let worldNormal = getWorldNormalFromGNormalBuffer(gBufferNormal);
         *     return normalize((viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz);
         * }
         * ```
         */
        export const getViewNormalFromGNormalBuffer = getViewNormalFromGNormalBuffer_wgsl;
    }

    export namespace tnb {
        /**
         * // [KO] 법선(Normal)과 버텍스 탄젠트(vec4)를 사용하여 TBN(Tangent, Bitangent, Normal) 행렬을 구축합니다.
         * // [EN] Constructs a TBN (Tangent, Bitangent, Normal) matrix using the normal and vertex tangent (vec4).
         *
         * // @param inputNormal [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
         * // @param inputVertexTangent [KO] 버텍스 탄젠트 데이터 (xyz: 방향, w: 방향성) [EN] Vertex tangent data
         * // @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         *
         *
         * ```wgsl
         * fn getTBNFromVertexTangent(inputNormal: vec3<f32>, inputVertexTangent: vec4<f32>) -> mat3x3<f32> {
         *     // [KO] Gram-Schmidt 직교화: 탄젠트가 법선과 정확히 수직이 되도록 보정
         *     // [EN] Gram-Schmidt orthonormalization: Corrects the tangent to be perfectly perpendicular to the normal
         *     let tangent = normalize(inputVertexTangent.xyz - inputNormal * dot(inputVertexTangent.xyz, inputNormal));
         *
         *     // [KO] glTF 표준 및 오른손 법칙 준수 (N x T = B)
         *     // [EN] Adheres to glTF standard and right-hand rule (N x T = B)
         *     let bitangent = cross(inputNormal, tangent) * inputVertexTangent.w;
         *
         *     return mat3x3<f32>(tangent, bitangent, inputNormal);
         * }
         * ```
         */
        export const getTBNFromVertexTangent = getTBNFromVertexTangent_wgsl;
        /**
         * // [KO] 법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.
         * // [EN] Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.
         *
         * // @param inputNormal [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
         * // @param inputTangent [KO] 탄젠트 벡터 (법선과 수직이 아니어도 됨) [EN] Tangent vector (does not need to be perpendicular to normal)
         * // @returns [KO] 3x3 직교 TBN 행렬 [EN] 3x3 Orthonormal TBN matrix
         *
         *
         * ```wgsl
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
         * // [KO] 픽셀의 미분(Derivatives)을 사용하여 탄젠트와 비탄젠트를 동적으로 계산하고 TBN 행렬을 구축합니다.
         * // [EN] Dynamically calculates tangent and bitangent using pixel derivatives and constructs a TBN matrix.
         *
         * // @param inputNormal [KO] 보간된 법선 벡터 [EN] Interpolated normal vector
         * // @param inputWorldPos [KO] 월드 공간의 픽셀 위치 [EN] World space pixel position
         * // @param inputUV [KO] 픽셀의 UV 좌표 [EN] Pixel UV coordinates
         * // @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         *
         *
         * ```wgsl
         * fn getTBNFromCotangent(inputNormal: vec3<f32>, inputWorldPos: vec3<f32>, inputUV: vec2<f32>) -> mat3x3<f32> {
         *     // [KO] 픽셀 미분을 통한 위치 및 UV 변화량 계산
         *     // [EN] Calculate position and UV changes through pixel derivatives
         *     let dp1 = dpdx(inputWorldPos);
         *     let dp2 = dpdy(inputWorldPos);
         *     let duv1 = dpdx(inputUV);
         *     let duv2 = dpdy(inputUV);
         *
         *     // [KO] 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
         *     // [EN] Derive tangent and bitangent directions by solving simultaneous equations (Schüler's technique)
         *     let dp2perp = cross(dp2, inputNormal);
         *     let dp1perp = cross(inputNormal, dp1);
         *
         *     let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
         *     let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;
         *
         *     // [KO] Gram-Schmidt 직교화 및 행렬 구성
         *     // [EN] Gram-Schmidt orthonormalization and matrix construction
         *     let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
         *
         *     // [KO] glTF 노멀 맵 G 채널은 Y+이며, 이는 V가 감소하는 방향(위쪽)을 의미합니다.
         *     // [KO] Schüler 공식으로 계산된 bitangent는 V가 증가하는 방향(아래쪽)을 향하므로 부호를 반전시킵니다.
         *     // [EN] glTF normal map G channel is Y+ (upwards), which corresponds to decreasing V.
         *     // [EN] The bitangent calculated by Schüler's formula points in the direction of increasing V (downwards), so we flip its sign.
         *     return mat3x3<f32>(tangent * invmax, -bitangent * invmax, inputNormal);
         * }
         * ```
         */
        export const getTBNFromCotangent = getTBNFromCotangent_wgsl;
        /**
         * // [KO] 노멀 맵 데이터를 탄젠트 공간의 법선 벡터로 변환하고 TBN 행렬을 적용합니다.
         * // [EN] Converts normal map data to a tangent space normal vector and applies the TBN matrix.
         *
         * // @param sampledNormalColor [KO] 노멀 맵에서 샘플링된 데이터 (RG 또는 RGB) [EN] Sampled data from normal map (RG or RGB)
         * // @param tbn [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
         * // @param strength [KO] 노멀 강도 [EN] Normal strength
         * // @returns [KO] 월드/뷰 공간의 정규화된 법선 벡터 [EN] Normalized normal vector in world/view space
         *
         *
         * ```wgsl
         * fn getNormalFromNormalMap(sampledNormalColor: vec3<f32>, tbn: mat3x3<f32>, strength: f32) -> vec3<f32> {
         *     // 1. Unpack XY: [0, 1] -> [-1, 1]
         *     var n: vec2<f32> = sampledNormalColor.xy * 2.0 - 1.0;
         *
         *     // [KO] WebGPU의 Top-Left UV(V+가 아래로 향함)와 표준 노멀 맵(Y+가 위로 향함) 사이의 방향성 불일치 해결을 위해 Y 기여도 반전
         *     // [EN] Invert Y contribution to resolve the directional mismatch between WebGPU's Top-Left UV (V+ points down) and standard normal maps (Y+ points up)
         *     n.y = -n.y;
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

    export const PI = 'const PI: f32 = 3.141592653589793;';
    export const PI2 = 'const PI2: f32 = 6.283185307179586;';
    export const HPI = 'const HPI: f32 = 1.5707963267948966;';
    export const INV_PI = 'const INV_PI: f32 = 0.31830988618379067;';
    export const DEG_TO_RAD = 'const DEG_TO_RAD: f32 = 0.017453292519943295;';
    export const RAD_TO_DEG = 'const RAD_TO_DEG: f32 = 57.29577951308232;';
    export const EPSILON = 'const EPSILON: f32 = 1e-6;';
    export const FLT_MAX = 'const FLT_MAX: f32 = 3.402823466e+38;';
}

export namespace ShadowLibrary {
    /**
     * // [KO] 월드 좌표를 빛의 클립 공간 좌표(UV + Depth)로 변환합니다.
     * // [EN] Converts world coordinates to light's clip space coordinates (UV + Depth).
     *
     * // @param worldPosition [KO] 월드 공간 상의 위치 [EN] Position in world space
     * // @param lightViewProjectionMatrix [KO] 빛의 View-Projection 행렬 [EN] Light's View-Projection matrix
     * // @returns [KO] 그림자 맵 샘플링을 위한 vec3 좌표 (x, y: UV, z: Depth) [EN] vec3 coordinates for shadow map sampling (x, y: UV, z: Depth)
     *
     *
     * ```wgsl
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
     * // [KO] 월드 좌표를 빛의 관점에서의 클립 공간(Clip Space) 좌표로 변환합니다. (Shadow Pass 전용)
     * // [EN] Converts world coordinates to clip space coordinates from the light's perspective. (For Shadow Pass)
     *
     * // @param worldPosition [KO] 월드 공간 상의 위치 [EN] Position in world space
     * // @param lightViewProjectionMatrix [KO] 빛의 View-Projection 행렬 [EN] Light's View-Projection matrix
     * // @returns [KO] 빛의 클립 공간 좌표 (vec4) [EN] Light's clip space coordinates (vec4)
     *
     *
     * ```wgsl
     * fn getShadowClipPosition(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec4<f32> {
     *     // [KO] 월드 좌표를 빛의 공간으로 투영
     *     // [EN] Projects world coordinates into light space
     *     return lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
     * }
     * ```
     */
    export const getShadowClipPosition = getShadowClipPosition_wgsl;
    /**
     * // [KO] 방향성 광원의 그림자 가시성(Visibility)을 계산합니다.
     * // [EN] Calculates the shadow visibility for a directional light.
     *
     * // @param directionalShadowMap [KO] 방향성 광원용 깊이 텍스처 [EN] Depth texture for directional light
     * // @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
     * // @param shadowDepthTextureSize [KO] 그림자 텍스처의 크기 [EN] Size of the shadow texture
     * // @param bias [KO] 그림자 바이어스 [EN] Shadow bias
     * // @param shadowCoord [KO] [0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값) [EN] Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
     * // @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
     *
     *
     * ```wgsl
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
     *     return visibility;
     * }
     * ```
     */
    export const getDirectionalShadowVisibility = getDirectionalShadowVisibility_wgsl;
}

export namespace ColorLibrary {
    /**
     * // [KO] RGB 색상을 YCoCg 색 공간으로 변환합니다. (TAA 및 압축 효율 최적화)
     * // [EN] Converts RGB color to YCoCg color space. (Optimized for TAA and compression efficiency)
     *
     * // @param rgb [KO] 입력 RGB 색상 [EN] Input RGB color
     * // @returns [KO] 변환된 YCoCg 색상 [EN] Converted YCoCg color
     *
     *
     * ```wgsl
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
     * // [KO] YCoCg 색상을 RGB 색 공간으로 복원합니다.
     * // [EN] Restores YCoCg color back to RGB color space.
     *
     * // @param ycocg [KO] 입력 YCoCg 색상 [EN] Input YCoCg color
     * // @returns [KO] 복원된 RGB 색상 [EN] Restored RGB color
     *
     *
     * ```wgsl
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
     * // [KO] Linear 색 공간의 vec3 색상을 sRGB 색 공간으로 변환합니다.
     * // [EN] Converts vec3 color from Linear color space to sRGB color space.
     *
     * // @param linearColor [KO] 입력 Linear 색상 [EN] Input Linear color
     * // @returns [KO] 변환된 sRGB 색상 [EN] Converted sRGB color
     *
     *
     * ```wgsl
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
     * // [KO] Linear 색 공간의 vec4 색상을 sRGB 색 공간으로 변환합니다. (Alpha 보존)
     * // [EN] Converts vec4 color from Linear color space to sRGB color space. (Preserves Alpha)
     *
     * // @param linearColor [KO] 입력 Linear 색상 [EN] Input Linear color
     * // @returns [KO] 변환된 sRGB 색상 [EN] Converted sRGB color
     *
     *
     * ```wgsl
     * #redgpu_include color.linearToSrgbVec3
     *
     * fn linearToSrgbVec4(linearColor: vec4<f32>) -> vec4<f32> {
     *     return vec4<f32>(linearToSrgbVec3(linearColor.rgb), linearColor.a);
     * }
     * ```
     */
    export const linearToSrgbVec4 = linearToSrgbVec4_wgsl;
    /**
     * // [KO] sRGB 색 공간의 vec3 색상을 Linear 색 공간으로 변환합니다.
     * // [EN] Converts vec3 color from sRGB color space to Linear color space.
     *
     * // @param srgbColor [KO] 입력 sRGB 색상 [EN] Input sRGB color
     * // @returns [KO] 변환된 Linear 색상 [EN] Converted Linear color
     *
     *
     * ```wgsl
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
     * // [KO] sRGB 색 공간의 vec4 색상을 Linear 색 공간으로 변환합니다. (Alpha 보존)
     * // [EN] Converts vec4 color from sRGB color space to Linear color space. (Preserves Alpha)
     *
     * // @param srgbColor [KO] 입력 sRGB 색상 [EN] Input sRGB color
     * // @returns [KO] 변환된 Linear 색상 [EN] Converted Linear color
     *
     *
     * ```wgsl
     * #redgpu_include color.srgbToLinearVec3
     *
     * fn srgbToLinearVec4(srgbColor: vec4<f32>) -> vec4<f32> {
     *     return vec4<f32>(srgbToLinearVec3(srgbColor.rgb), srgbColor.a);
     * }
     * ```
     */
    export const srgbToLinearVec4 = srgbToLinearVec4_wgsl;
    /**
     * // [KO] RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709 표준 가중치 적용)
     * // [EN] Calculates the luminance of an RGB color. (Applying Rec. 709 standard weights)
     *
     * // @param rgb [KO] 입력 RGB 색상 [EN] Input RGB color
     * // @returns [KO] 계산된 휘도 값 [EN] Calculated luminance value
     *
     *
     * ```wgsl
     * fn getLuminance(rgb: vec3<f32>) -> f32 {
     *     return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
     * }
     * ```
     */
    export const getLuminance = getLuminance_wgsl;
    /**
     * // [KO] RGB 색상을 HSL 색상 공간으로 변환합니다.
     * // [EN] Converts RGB color to HSL color space.
     *
     * // @param rgb [KO] 입력 RGB 색상 [EN] Input RGB color
     * // @returns [KO] 변환된 HSL 색상 [EN] Converted HSL color
     *
     *
     * ```wgsl
     * #redgpu_include math.EPSILON
     *
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
     *  * [KO] HSL 색상을 RGB 색상 공간으로 변환합니다.
     *  * [EN] Converts HSL color to RGB color space.
     *  *
     *  * @param hsl [KO] 입력 HSL 색상 [EN] Input HSL color
     *  * @returns [KO] 변환된 RGB 색상 [EN] Converted RGB color
     *  *
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
     *  * [KO] 베이스 색상에 틴트(Tint) 색상을 지정된 블렌딩 모드로 합성합니다.
     *  * [EN] Blends the base color with a tint color using the specified blending mode.
     *  *
     *  * @param baseColor [KO] 원본 색상 (RGBA) [EN] Base color (RGBA)
     *  * @param tintBlendMode [KO] 블렌딩 모드 인덱스 (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION) [EN] Blending mode index (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION)
     *  * @param tint [KO] 합성할 틴트 색상 (RGBA) [EN] Tint color to blend (RGBA)
     *  * @returns [KO] 합성된 최종 색상 (RGBA) [EN] Final blended color (RGBA)
     *  *
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

export namespace DepthLibrary {
    /**
     * // [KO] 비선형 깊이(Depth) 값을 선형 거리로 복구합니다. (Stable Version)
     * // [EN] Recovers non-linear depth values into linear distances. (Stable Version)
     *
     * // @param depthSample [KO] 텍스처에서 샘플링된 0~1 사이의 깊이값 [EN] Depth value sampled from texture (0~1)
     * // @param near [KO] 카메라의 Near 평면 거리 [EN] Camera near plane distance
     * // @param far [KO] 카메라의 Far 평면 거리 [EN] Camera far plane distance
     * // @returns [KO] 선형화된 거리 값 [EN] Linearized distance value
     *
     *
     * ```wgsl
     * #redgpu_include math.EPSILON
     *
     * fn getLinearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
     *     let d = clamp(depthSample, 0.0, 1.0);
     *     return (near * far) / max(EPSILON, far - d * (far - near));
     * }
     * ```
     */
    export const getLinearizeDepth = getLinearizeDepth_wgsl;
}

export namespace LightingLibrary {
    /**
     * // [KO] 물리적인 역제곱 법칙(Inverse Square Law)에 따른 광원 감쇄 계수를 계산합니다.
     * // [EN] Calculates the light attenuation factor according to the physical Inverse Square Law.
     *
     * // [KO] 이 함수는 순수 물리적 역제곱 법칙(1/d^2)을 따르며, Frostbite 방식의 윈도잉 함수를 사용하여 광원의 radius 지점에서 부드럽게 0으로 수렴하도록 합니다.
     * // [KO] 주의: 4*PI 분산 계수는 에너지 보존을 위해 외부(Lumen 단위 변환 시)에서 적용되어야 합니다.
     * // [EN] This function follows the pure physical inverse square law (1/d^2) and uses a Frostbite-style windowing function to smoothly converge to 0 at the light's radius.
     * // [EN] Note: The 4*PI dispersion factor should be applied externally (during Lumen unit conversion) for energy conservation.
     *
     * // @param distance [KO] 광원으로부터의 거리 [EN] Distance from the light source
     * // @param radius [KO] 광원의 최대 도달 반경 (윈도잉 기준) [EN] Maximum reach radius of the light source (windowing reference)
     * // @returns [KO] 계산된 물리적 감쇄 계수 [EN] Calculated physical attenuation factor
     *
     *
     * ```wgsl
     * #redgpu_include math.EPSILON
     *
     * fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
     *     let d2 = distance * distance;
     *
     *     // [KO] 현대적인 표준 윈도잉 함수 (Frostbite / Unreal 방식)
     *     // [EN] Modern standard windowing function (Frostbite / Unreal style)
     *     let factor = distance / radius;
     *     let factor2 = factor * factor;
     *     let factor4 = factor2 * factor2;
     *     let windowing = clamp(1.0 - factor4, 0.0, 1.0);
     *
     *     // [KO] 순수 역제곱 법칙 적용 (1 / d^2) + 윈도잉
     *     // [EN] Apply pure inverse square law (1 / d^2) + windowing
     *     return (windowing * windowing) / max(d2, 0.0001);
     * }
     * ```
     */
    export const getLightDistanceAttenuation = getLightDistanceAttenuation_wgsl;
    /**
     * // [KO] 스폿라이트의 각도(원뿔)에 따른 감쇄 계수를 계산합니다.
     * // [EN] Calculates the attenuation factor according to the angle (cone) of the spotlight.
     *
     * // [KO] 내부 원뿔(Inner Cone)과 외부 원뿔(Outer Cone) 사이의 영역에서 부드러운 페이드 효과를 생성합니다.
     * // [EN] Creates a smooth fade effect in the area between the inner cone and the outer cone.
     *
     * // @param lightToVertexDirection [KO] 광원에서 픽셀(버텍스)을 향하는 정규화된 방향 벡터 [EN] Normalized direction vector from the light source to the pixel (vertex)
     * // @param lightDirection [KO] 스폿라이트가 비추는 정규화된 중심 방향 벡터 [EN] Normalized center direction vector that the spotlight shines in
     * // @param innerCutoff [KO] 내부 원뿔 컷오프 각도 (Degree) [EN] Inner cone cutoff angle (Degree)
     * // @param outerCutoff [KO] 외부 원뿔 컷오프 각도 (Degree) [EN] Outer cone cutoff angle (Degree)
     * // @returns [KO] 계산된 각도 감쇄 계수 (0.0 ~ 1.0) [EN] Calculated angle attenuation factor (0.0 to 1.0)
     *
     *
     * ```wgsl
     * #redgpu_include math.EPSILON
     *
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
}

export namespace SkyAtmosphereLibrary {
    /**
     * // [KO] 특정 고도와 각도에서의 대기 투과율(Transmittance)을 조회합니다.
     * // [EN] Retrieves atmospheric transmittance at a specific altitude and angle.
     *
     *
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
     * const SUN_ANGULAR_RADIUS_RAD: f32 = 0.00465;
     * const SUN_SOLID_ANGLE_BASE: f32 = 6.794e-5;
     *
     * const TRANSMITTANCE_STEPS: u32 = 40u;
     * const MULTI_SCAT_STEPS: u32 = 40u;
     * const SKY_VIEW_STEPS: u32 = 128u;
     * const AP_STEPS: u32 = 64u;
     * const MULTI_SCAT_SAMPLES: u32 = 128u;
     * const IRRADIANCE_SAMPLES: u32 = 256u;
     *
     * const SUN_RADIANCE_BOOST: f32 = 1.0;
     * const MIE_GLOW_SUPPRESS: f32 = 0.40;
     * const NEAR_FIELD_CORRECTION_DIST: f32 = 0.2;
     *
     * struct AtmosphereDensities {
     *     rhoR: f32, rhoM: f32, rhoO: f32
     * };
     *
     * struct AtmosphereCoefficients {
     *     scatTotal: vec3<f32>,
     *     extinction: vec3<f32>
     * };
     *
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
     * fn getTransmittanceUV(viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
     *     let mu = clamp(cosTheta, -1.0, 1.0);
     *     let u = clamp(0.5 + 0.5 * sign(mu) * sqrt(abs(mu)), 0.001, 0.999);
     *     let v = clamp(1.0 - viewHeight / atmosphereHeight, 0.001, 0.999);
     *     return vec2<f32>(u, v);
     * }
     *
     * fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, groundRadius: f32, atmosphereHeight: f32) -> vec2<f32> {
     *     var azimuth: f32;
     *     if (abs(viewDir.z) < 1e-6 && abs(viewDir.x) < 1e-6) {
     *         azimuth = 0.0;
     *     } else {
     *         azimuth = atan2(viewDir.z, viewDir.x);
     *     }
     *     let u = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
     *     let r = groundRadius;
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
     *     return vec2<f32>(u, clamp(v, 0.001, 0.999));
     * }
     *
     * fn getTransmittance(transmittanceLUT: texture_2d<f32>, skyAtmosphereSampler: sampler, viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
     *     let uv = getTransmittanceUV(viewHeight, cosTheta, atmosphereHeight);
     *     // [KO] 하드웨어 선형 샘플링을 통해 LUT 사이의 값을 부드럽게 보간합니다.
     *     // [EN] Smoothly interpolate between LUT entries via hardware linear sampling.
     *     var transmittance = textureSampleLevel(transmittanceLUT, skyAtmosphereSampler, uv, 0.0).rgb;
     *     let mu = clamp(cosTheta, -1.0, 1.0);
     *     if (mu < 0.0) {
     *         // [KO] 지평선 아래로 내려갈 때 지면에 의한 차폐를 부드럽게 적용합니다.
     *         // [EN] Smoothly apply ground occlusion when below the horizon.
     *         let groundMask = smoothstep(-0.015, 0.0, mu); 
     *         transmittance *= groundMask;
     *     }
     *     return transmittance;
     * }
     *
     * fn getPlanetShadowMask(p: vec3<f32>, sunDir: vec3<f32>, r: f32, params: SkyAtmosphere) -> f32 {
     *     if (r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0) { return 0.0; }
     *     return 1.0;
     * }
     *
     * fn getAtmosphereDensities(viewHeight: f32, params: SkyAtmosphere) -> AtmosphereDensities {
     *     var d: AtmosphereDensities;
     *     if (viewHeight < 0.0) {
     *         d.rhoR = 0.0; d.rhoM = 0.0; d.rhoO = 0.0;
     *     } else {
     *         d.rhoR = exp(-viewHeight / params.rayleighExponentialDistribution);
     *         d.rhoM = exp(-viewHeight / params.mieExponentialDistribution);
     *         let ozoneDist = abs(viewHeight - params.absorptionTipAltitude);
     *         d.rhoO = max(0.0, 1.0 - ozoneDist / params.absorptionTentWidth);
     *     }
     *     return d;
     * }
     *
     * fn getSunTransmittanceManual(p: vec3<f32>, sunDir: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
     *     let r = params.groundRadius;
     *     let tMax = getRaySphereIntersection(p, sunDir, r + params.atmosphereHeight);
     *     if (tMax <= 0.0) { return vec3<f32>(1.0); }
     *     let intersect = getPlanetIntersection(p, sunDir, r);
     *
     *     if (r > 0.0 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
     *
     *     var optExt = vec3<f32>(0.0);
     *     let halfSteps = TRANSMITTANCE_STEPS / 2u;
     *
     *     if (intersect.x > EPSILON && intersect.x < tMax) {
     *         optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, halfSteps, params);
     *         if (intersect.y > 0.0 && tMax > intersect.y) {
     *             optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, halfSteps, params);
     *         }
     *     } else {
     *         optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, TRANSMITTANCE_STEPS, params);
     *     }
     *     return exp(-min(optExt, vec3<f32>(MAX_TAU)));
     * }
     *
     * fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmosphereHeight: f32, params: SkyAtmosphere) -> vec3<f32> {
     *     let minElevationRad = params.transmittanceMinLightElevationAngle * DEG_TO_RAD;
     *     var adjustedSunDir = sunDir;
     *     if (sunDir.y < sin(minElevationRad)) {
     *         let cosEl = cos(minElevationRad);
     *         let sinEl = sin(minElevationRad);
     *         let horizontalDir = normalize(vec3<f32>(sunDir.x, 0.0, sunDir.z));
     *         adjustedSunDir = vec3<f32>(horizontalDir.x * cosEl, sinEl, horizontalDir.z * cosEl);
     *     }
     *
     *     let intersect = getPlanetIntersection(p, adjustedSunDir, r);
     *     if (r > 0.0 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
     *     return getSunTransmittanceManual(p, adjustedSunDir, params);
     * }
     *
     * fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
     *     if (tMax <= tMin) { return vec3<f32>(0.0); }
     *     let stepSize = (tMax - tMin) / f32(steps);
     *     var optExt = vec3<f32>(0.0);
     *     for (var i = 0u; i < steps; i = i + 1u) {
     *         let t = tMin + (f32(i) + 0.5) * stepSize;
     *         let viewHeight = length(origin + dir * t) - params.groundRadius;
     *         if (viewHeight < 0.0) { continue; }
     *         let d = getAtmosphereDensities(viewHeight, params);
     *
     *         let scatR_phys = params.rayleighScattering * d.rhoR;
     *         let mieExt_phys = (params.mieScattering + params.mieAbsorption) * d.rhoM;
     *         let absC_phys = params.absorptionCoefficient * d.rhoO;
     *
     *         optExt += (scatR_phys + mieExt_phys + absC_phys) * stepSize;
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
     * fn phaseMieStable(cosTheta: f32, g: f32) -> f32 {
     *     return phaseMie(cosTheta, min(g, 0.80));
     * }
     *
     * fn getSquashedViewSunCos(viewDir: vec3<f32>, sunDir: vec3<f32>) -> f32 {
     *     let sunElevationParam = saturate(sunDir.y);
     *     let squashFactor = mix(0.85, 1.0, sunElevationParam);
     *     let verticalDist = viewDir.y - sunDir.y;
     *     let correctionGuard = saturate(dot(viewDir, sunDir) * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
     *     let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) * correctionGuard;
     *     return dot(viewDir, sunDir) - squashCorrection;
     * }
     *
     * fn getSunDiskRadianceUnit(
     *     viewSunCos: f32,
     *     sunSize: f32,
     *     sunLimbDarkening: f32,
     *     skyTrans: vec3<f32>,
     *     edgeSoftness: f32,
     *     params: SkyAtmosphere
     * ) -> vec3<f32> {
     *     let sunRad = (sunSize * 0.5) * DEG_TO_RAD;
     *     let cosSunRad = cos(sunRad);
     *     let solidAngle = PI2 * (1.0 - cosSunRad);
     *     let radianceScale = SUN_RADIANCE_BOOST / max(6.7e-5, solidAngle); 
     *
     *     let dist = (1.0 - viewSunCos) / max(1e-7, 1.0 - cosSunRad);
     *     let sunMask = 1.0 - smoothstep(1.0 - edgeSoftness, 1.0, dist);
     *     if (sunMask <= 0.0) { return vec3<f32>(0.0); }
     *
     *     let limbDarkening = pow(max(1e-7, 1.0 - saturate(dist)), sunLimbDarkening);
     *     let energyNormalization = sunLimbDarkening + 1.0;
     *
     *     return (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;
     * }
     *
     * fn getSunDiskRadianceIBL(
     *     viewSunCos: f32,
     *     sunLimbDarkening: f32,
     *     skyTrans: vec3<f32>,
     *     params: SkyAtmosphere
     * ) -> vec3<f32> {
     *     let sunRad = (params.sunSize * 0.5) * DEG_TO_RAD;
     *     let iblAlpha = max(sunRad * 2.0, 0.175); 
     *     let cosAlpha = cos(iblAlpha);
     *
     *     let radScale = 1.0 / (PI2 * (1.0 - cosAlpha));
     *     let diff = saturate(1.0 - viewSunCos);
     *     let sigma_sq = 1.0 - cosAlpha;
     *     let falloff = exp(-diff / max(1e-7, sigma_sq));
     *     if (falloff < 0.001) { return vec3<f32>(0.0); }
     *
     *     return (radScale * falloff) * skyTrans;
     * }
     *
     * fn getMieGlowAmountUnit(
     *     viewSunCos: f32,
     *     viewHeight: f32, 
     *     params: SkyAtmosphere, 
     *     transmittanceLUT: texture_2d<f32>, 
     *     skyAtmosphereSampler: sampler,
     *     transToEdge: vec3<f32>,
     *     overrideHalo: f32 
     * ) -> vec3<f32> {
     *     let actualAnisotropy = params.mieAnisotropy;
     *     let halo = select(actualAnisotropy, overrideHalo, overrideHalo > 0.0);
     *
     *     let sharpG = min(max(halo, 0.88), 0.94); 
     *     let stableG = min(actualAnisotropy, 0.80);
     *
     *     let sharpPhase = phaseMie(viewSunCos, sharpG);
     *     let stablePhase = phaseMie(viewSunCos, stableG);
     *     let diffPhase = max(0.0, sharpPhase - stablePhase);
     *
     *     let sunDirY = params.sunDirection.y;
     *     let sunCosTheta = clamp(sunDirY, -1.0, 1.0); 
     *     let sunTransForGlow = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, sunCosTheta, params.atmosphereHeight);
     *
     *     return sunTransForGlow * (params.mieScattering / max(vec3<f32>(0.0001), params.mieScattering + params.mieAbsorption)) 
     *                         * (diffPhase) * (1.0 - transToEdge) * MIE_GLOW_SUPPRESS * params.skyLuminanceFactor;
     * }
     *
     * /**
     *  * [KO] 지정된 구간에 대해 대기 산란 적분을 수행합니다. (LUT 및 물리 파라미터 활용)
     *  * [EN] Performs atmospheric scattering integration over a specified segment (Using LUTs and physical parameters).
     *  *
     *  *\/
     * fn integrateScatSegment(
     *     origin: vec3<f32>, dir: vec3<f32>, 
     *     tMin: f32, tMax: f32, steps: u32, 
     *     params: SkyAtmosphere,
     *     transmittanceLUT: texture_2d<f32>, 
     *     skyAtmosphereSampler: sampler,
     *     multiScatLUT: texture_2d<f32>,
     *     useLUT: bool,
     *     radiance: ptr<function, vec3<f32>>, 
     *     transmittance: ptr<function, vec3<f32>>
     * ) {
     *     if (tMax <= tMin) { return; }
     *     let r = params.groundRadius;
     *     let stepSize = (tMax - tMin) / f32(steps);
     *     let sunDir = params.sunDirection;
     *     let viewSunCos = dot(dir, sunDir);
     *
     *     // [KO] 위상 함수 계산 (레일리/미 산란 특성 반영)
     *     // [EN] Calculate Phase Functions (Reflecting Rayleigh/Mie scattering characteristics)
     *     let phaseR = phaseRayleigh(viewSunCos);
     *     let phaseM = select(phaseMie(viewSunCos, params.mieAnisotropy), phaseMieStable(viewSunCos, params.mieAnisotropy), useLUT);
     *
     *     for (var i = 0u; i < steps; i = i + 1u) {
     *         let t = tMin + (f32(i) + 0.5) * stepSize;
     *         let p = origin + dir * t;
     *         let pLen = length(p);
     *         let viewHeight = pLen - r;
     *
     *         if (r > 0.0 && viewHeight < 0.0) { continue; }
     *
     *         let up = p / pLen;
     *         let cosSun = dot(up, sunDir);
     *
     *         var sunTrans: vec3<f32>;
     *         if (useLUT) {
     *             // [KO] 미리 계산된 투과율 LUT 샘플링
     *             // [EN] Sample precomputed transmittance LUT
     *             sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, cosSun, params.atmosphereHeight);
     *         } else {
     *             // [KO] 실시간 수치 적분 수행 (LUT 생성 시 사용)
     *             // [EN] Perform real-time numerical integration (Used during LUT generation)
     *             sunTrans = getSunTransmittanceManual(p, sunDir, params);
     *         }
     *
     *         let shadowMask = select(1.0, 0.0, r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0);
     *         let d = getAtmosphereDensities(viewHeight, params);
     *
     *         let scatR_phys = params.rayleighScattering * d.rhoR;
     *         let scatM_phys = params.mieScattering * d.rhoM;
     *         let mieAbs_phys = params.mieAbsorption * d.rhoM;
     *         let ozoneAbs_phys = params.absorptionCoefficient * d.rhoO;
     *
     *         let scatR_luminous = scatR_phys * params.skyLuminanceFactor;
     *         let scatM_luminous = scatM_phys * params.skyLuminanceFactor;
     *
     *         let stepScat = (scatR_luminous * phaseR + scatM_luminous * phaseM) * sunTrans * shadowMask;
     *
     *         let scatTotal_luminous = scatR_luminous + scatM_luminous;
     *         let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - viewHeight / params.atmosphereHeight, 0.001, 0.999));
     *
     *         // [KO] 다중 산란 기여분 합산 (하드웨어 선형 샘플링 필수)
     *         // [EN] Add multi-scattering contribution (Hardware linear sampling mandatory)
     *         let msScat = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb * scatTotal_luminous * shadowMask * params.multiScatteringFactor;
     *
     *         *radiance += *transmittance * (stepScat + msScat) * stepSize;
     *
     *         let extinction_phys = scatR_phys + scatM_phys + mieAbs_phys + ozoneAbs_phys;
     *         *transmittance *= exp(-extinction_phys * stepSize);
     *     }
     * }
     *
     * fn getCubeMapDirection(uv: vec2<f32>, face: u32) -> vec3<f32> {
     *     let tex = uv * 2.0 - 1.0;
     *     var dir: vec3<f32>;
     *     switch (face) {
     *         case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); }
     *         case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); }
     *         case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }
     *         case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); }
     *         case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }
     *         case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); }
     *         default: { dir = vec3<f32>(0.0); }
     *     }
     *     return dir;
     * }
     *
     * fn evaluateGroundRadiance(cosSun: f32, sunTrans: vec3<f32>, msEnergy: vec3<f32>, groundAlbedo: vec3<f32>) -> vec3<f32> {
     *     let sunShadow = smoothstep(-0.01, 0.01, cosSun);
     *     var groundRadiance = vec3<f32>(0.0);
     *
     *     if (sunShadow > 0.0) {
     *         groundRadiance = (sunTrans * max(0.0, cosSun) * INV_PI + msEnergy) * groundAlbedo * sunShadow;
     *     } else {
     *         groundRadiance = msEnergy * groundAlbedo;
     *     }
     *
     *     return groundRadiance;
     * }
     *
     * fn evaluateIBLRadiance(
     *     viewDir: vec3<f32>, 
     *     params: SkyAtmosphere, 
     *     transmittanceLUT: texture_2d<f32>, 
     *     multiScatLUT: texture_2d<f32>, 
     *     skyViewLUT: texture_2d<f32>, 
     *     skyAtmosphereSampler: sampler
     * ) -> vec3<f32> {
     *     let r = params.groundRadius;
     *     let viewHeight = max(0.0, params.cameraHeight);
     *     let atmosphereHeight = params.atmosphereHeight;
     *     let sunDir = normalize(params.sunDirection);
     *
     *     let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
     *     let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);
     *
     *     var radiance = skySample.rgb;
     *
     *     let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
     *
     *     let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
     *     let tEarth = getRaySphereIntersection(camPos, viewDir, r);
     *     let isGround = r > 0.0 && tEarth > 0.0 && viewDir.y < -0.0001;
     *
     *     let transToEdge = select(getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), vec3<f32>(skySample.a), isGround);
     *
     *     let sunShadow = getPlanetShadowMask(camPos, sunDir, r, params);
     *     if (!isGround && sunShadow > 0.0) {
     *         let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge, 0.0);
     *         radiance += mieGlow * sunShadow;
     *     }
     *
     *     return radiance;
     * }
     *
     * fn getSpecularSunLobe(viewSun: f32, lobeHalfAngle: f32) -> f32 {
     *     let cosHalf = cos(lobeHalfAngle);
     *     let sunLobePower = clamp(log(0.5) / log(max(1e-4, cosHalf)), 2.0, 128.0);
     *     let sunLobeNorm = (sunLobePower + 1.0) * (0.5 * INV_PI);
     *     return sunLobeNorm * pow(max(0.0, viewSun), sunLobePower);
     * }
     *
     * fn evaluateIBLRadianceCompensated(
     *     viewDir: vec3<f32>,
     *     params: SkyAtmosphere,
     *     transmittanceLUT: texture_2d<f32>,
     *     multiScatLUT: texture_2d<f32>,
     *     skyViewLUT: texture_2d<f32>,
     *     skyAtmosphereSampler: sampler
     * ) -> vec3<f32> {
     *     let r = params.groundRadius;
     *     let viewHeight = max(0.0, params.cameraHeight);
     *     let atmosphereHeight = params.atmosphereHeight;
     *     let sunDir = normalize(params.sunDirection);
     *
     *     let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
     *     let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);
     *
     *     var radiance = skySample.rgb;
     *
     *     let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
     *
     *     let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
     *     let tEarth = getRaySphereIntersection(camPos, viewDir, r);
     *     let isGround = r > 0.0 && tEarth > 0.0 && viewDir.y < -0.0001;
     *
     *     let transToEdge = select(getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), vec3<f32>(skySample.a), isGround);
     *
     *     let sunShadow = getPlanetShadowMask(camPos, sunDir, r, params);
     *     if (!isGround && sunShadow > 0.0) {
     *         let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge, 0.0);
     *         radiance += mieGlow * sunShadow;
     *         radiance += getSunDiskRadianceIBL(viewSunCos, params.sunLimbDarkening, transToEdge, params) * sunShadow;
     *     }
     *
     *     return radiance;
     * }
     * fn getFrustumRayDirection(uv: vec2<f32>, invP: mat4x4<f32>, invV: mat4x4<f32>) -> vec3<f32> {
     *     let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
     *     let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
     *     let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
     *     return normalize(worldRotation * viewSpaceDir);
     * }
     *
     * // [KO] 절차적 노이즈 함수들 [EN] Procedural noise functions
     * fn cloud_hash(p: vec2<f32>) -> f32 {
     *     return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453123);
     * }
     *
     * fn cloud_noise(p: vec2<f32>) -> f32 {
     *     let i = floor(p);
     *     let f = fract(p);
     *     let u = f * f * (3.0 - 2.0 * f);
     *     return mix(mix(cloud_hash(i + vec2<f32>(0.0, 0.0)), cloud_hash(i + vec2<f32>(1.0, 0.0)), u.x),
     *                mix(cloud_hash(i + vec2<f32>(0.0, 1.0)), cloud_hash(i + vec2<f32>(1.0, 1.0)), u.x), u.y);
     * }
     *
     * fn cloud_fbm(p: vec2<f32>) -> f32 {
     *     var v = 0.0;
     *     var a = 0.5;
     *     var shift = vec2<f32>(100.0);
     *     var p_mut = p;
     *     for (var i = 0; i < 5; i = i + 1) {
     *         v += a * cloud_noise(p_mut);
     *         p_mut = p_mut * 2.0 + shift;
     *         a *= 0.5;
     *     }
     *     return v;
     * }
     *
     * fn getCloudWarpedUV(hitP: vec3<f32>, params: SkyAtmosphere) -> vec2<f32> {
     *     let baseUV = hitP.xz * 0.05 + vec2<f32>(params.cloudTime * 0.02);
     *     // [KO] 도메인 워핑: UV를 노이즈로 살짝 비틀어 유기적인 형태 생성
     *     // [EN] Domain Warping: Distort UVs with noise to create organic shapes
     *     let warp = vec2<f32>(
     *         cloud_noise(baseUV * 1.2 + vec2<f32>(params.cloudTime * 0.01)),
     *         cloud_noise(baseUV * 1.2 + vec2<f32>(5.7, 1.3) + vec2<f32>(params.cloudTime * 0.012))
     *     );
     *     return baseUV + warp * 0.2;
     * }
     *
     * fn getCloudDensity(hitP: vec3<f32>, params: SkyAtmosphere) -> f32 {
     *     let warpedUV = getCloudWarpedUV(hitP, params);
     *     let density = cloud_fbm(warpedUV);
     *     let coverage = params.cloudCoverage;
     *     let softness = (1.0 - params.cloudDensity) * 0.5 + 0.01;
     *     return smoothstep(1.0 - coverage, 1.0 - coverage + softness, density);
     * }
     *
     * fn getCloudNormal(hitP: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
     *     let warpedUV = getCloudWarpedUV(hitP, params);
     *     let density = cloud_fbm(warpedUV);
     *     let eps = 0.2;
     *     let dIdx = (cloud_fbm(warpedUV + vec2<f32>(eps, 0.0)) - density) / eps;
     *     let dIdy = (cloud_fbm(warpedUV + vec2<f32>(0.0, eps)) - density) / eps;
     *     return normalize(vec3<f32>(-dIdx, 2.0, -dIdy));
     * }
     * ```
     */
    export const skyAtmosphereFn = skyAtmosphereFn_wgsl;
    /**
     * ```wgsl
     * #redgpu_include skyAtmosphere.skyAtmosphereFn
     *
     * @group(0) @binding(0) var transmittanceLUT: texture_storage_2d<rgba16float, write>;
     * @group(0) @binding(1) var<globalStruct> params: SkyAtmosphere;
     *
     * @compute @workgroup_size(16, 16)
     * fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
     *     // [KO] 1. 인덱스 계산 및 정규화된 UV 산출
     *     // [EN] 1. Index calculation and normalized UV derivation
     *     let size = textureDimensions(transmittanceLUT);
     *     if (global_id.x >= size.x || global_id.y >= size.y) { return; }
     *
     *     let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
     *
     *     // [KO] 2. 파라미터 매핑 (UV -> 물리 수치)
     *     // [EN] 2. Parameter mapping (UV -> Physical values)
     *     // x축: 광학적 두께를 고려한 고도각 (Cos Theta)
     *     // y축: 대기권 내의 높이 (View Height)
     *     let x = uv.x * 2.0 - 1.0;
     *     let cosTheta = sign(x) * x * x;
     *     let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);
     *
     *     // [KO] 3. 광학 깊이(Optical Depth) 적분 및 투과율 산출
     *     // [EN] 3. Integrate Optical Depth and calculate Transmittance
     *     let T = exp(-min(getOpticalDepth(viewHeight, cosTheta), vec3<f32>(100.0)));
     *
     *     // [KO] 4. 결과 저장
     *     // [EN] 4. Store result
     *     textureStore(transmittanceLUT, global_id.xy, vec4<f32>(T, 1.0));
     * }
     *
     * fn getOpticalDepth(viewHeight: f32, cosTheta: f32) -> vec3<f32> {
     *     let groundRadius = params.groundRadius;
     *     let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
     *     let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
     *     let rayDir = vec3<f32>(sinTheta, cosTheta, 0.0);
     *
     *     let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
     *     if (tMax <= 0.0) { return vec3<f32>(0.0); }
     *
     *     let tEarth = getRaySphereIntersection(rayOrigin, rayDir, groundRadius);
     *     if (groundRadius > 0.0 && tEarth > 0.0) {
     *         return vec3<f32>(MAX_TAU);
     *     }
     *
     *     return integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, TRANSMITTANCE_STEPS, params);
     * }
     * ```
     */
    export const transmittanceLUT = transmittanceShaderCode_wgsl;
}

export namespace EntryPointLibrary {

    export namespace mesh {
        /**
         * // [KO] 메쉬 피킹 버텍스 셰이더 엔트리 포인트입니다.
         * // [EN] Vertex shader entry point for mesh picking.
         *
         * // @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
         * // @returns [KO] 버텍스 출력 데이터 [EN] Vertex output data
         *
         *
         * ```wgsl
         * @vertex
         * fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
         *     var output: VertexOutput;
         *     let input_position = inputData.position;
         *     let globalVertexUniforms = globalVertexSSBO[inputData.globalVertexSlotIndex];
         *     let u_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;
         *     let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
         *     let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
         *     let u_camera = systemUniforms.camera;
         *     let u_viewMatrix = u_camera.viewMatrix;
         *     var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);
         *     output.position = u_projectionViewMatrix * position;
         *     output.pickingId = unpack4x8unorm(globalVertexUniforms.pickingId);
         *     return output;
         * }
         * ```
         */
        export const entryPointPickingVertex = meshEntryPointPickingVertex_wgsl;
        /**
         * // [KO] 메쉬 피킹 프래그먼트 셰이더 엔트리 포인트입니다.
         * // [EN] Fragment shader entry point for mesh picking.
         *
         * // @param inputData [KO] 프래그먼트 입력 데이터 [EN] Fragment input data
         * // @returns [KO] 피킹 ID (location 0) [EN] Picking ID (location 0)
         *
         *
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
         * // [KO] 그림자 맵 생성을 위한 버텍스 셰이더 엔트리 포인트입니다.
         * // [EN] Vertex shader entry point for shadow map generation.
         *
         * // @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
         * // @returns [KO] 그림자 맵 출력을 위한 데이터 [EN] Data for shadow map output
         *
         *
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
         *         let maxMip = f32(textureNumLevels(displacementTexture)) - 1.0;
         *         let mipLevel = clamp((distance / maxDistance) * maxMip, 0.0, maxMip);
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

    export namespace billboard {
        /**
         * // [KO] 빌보드용 피킹 버텍스 셰이더 엔트리 포인트입니다.
         * // [EN] Vertex shader entry point for billboard picking.
         *
         * // @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
         * // @returns [KO] 버텍스 출력 데이터 [EN] Vertex output data
         *
         *
         * ```wgsl
         * @vertex
         * fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
         *     var output: VertexOutput;
         *     let u_resolution = systemUniforms.resolution;
         *      let globalVertexUniforms = globalVertexSSBO[inputData.globalVertexSlotIndex];
         *     #redgpu_if disableJitter
         *         let u_projectionMatrix = systemUniforms.projection.noneJitterProjectionMatrix;
         *     #redgpu_else
         *         let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
         *     #redgpu_endIf
         *
         *     let u_viewMatrix = systemUniforms.camera.viewMatrix;
         *     let u_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;
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
         *     output.pickingId = unpack4x8unorm(globalVertexUniforms.pickingId);
         *     return output;
         * }
         * ```
         */
        export const entryPointPickingVertex = billboardEntryPointPickingVertex_wgsl;
    }

    export namespace empty {
        /**
         * // [KO] 비어있는 피킹 버텍스 셰이더 엔트리 포인트입니다.
         * // [EN] Empty vertex shader entry point for picking.
         *
         * // @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
         * // @returns [KO] 버텍스 출력 데이터 [EN] Vertex output data
         *
         *
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
         * // [KO] 비어있는 그림자 맵 버텍스 셰이더 엔트리 포인트입니다.
         * // [EN] Empty vertex shader entry point for shadow map generation.
         *
         * // @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
         * // @returns [KO] 그림자 맵 출력 데이터 [EN] Shadow map output data
         *
         *
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

export namespace SystemStructLibrary {
    /**
     * // [KO] 프래그먼트 출력(OutputFragment) 구조체 정의입니다.
     * // [EN] Definition of the OutputFragment structure.
     *
     *
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
     * // [KO] 그림자 맵 데이터 출력(OutputShadowData) 구조체 정의입니다.
     * // [EN] Definition of the OutputShadowData structure.
     *
     *
     * ```wgsl
     * struct OutputShadowData {
     *     @builtin(position) position: vec4<f32>,
     * };
     * ```
     */
    export const OutputShadowData = OutputShadowData_wgsl;
    /**
     * // [KO] 카메라(Camera) 구조체 정의입니다.
     * // [EN] Definition of the Camera structure.
     *
     *
     * ```wgsl
     * struct Camera {
     *     viewMatrix: mat4x4<f32>,
     *     inverseViewMatrix: mat4x4<f32>,
     *     cameraPosition: vec3<f32>,
     *     nearClipping: f32,
     *     farClipping: f32,
     *     fieldOfView: f32,
     *     ev100: f32,
     *     _pad_exposure: f32,
     *     aperture: f32,
     *     shutterSpeed: f32,
     *     iso: f32,
     *     _pad: f32
     * };
     * ```
     */
    export const Camera = Camera_wgsl;
    /**
     * // [KO] 투영(Projection) 관련 행렬 구조체 정의입니다.
     * // [EN] Definition of the Projection-related matrices structure.
     *
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
     * // [KO] 시간 관련 데이터 구조체 정의입니다.
     * // [EN] Definition of the time-related data structure.
     *
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
     * // [KO] 직사광(DirectionalLight) 구조체 정의입니다.
     * // [EN] Definition of the DirectionalLight structure.
     *
     *
     * ```wgsl
     * struct DirectionalLight {
     *      direction:vec3<f32>,
     *      color:vec3<f32>,
     *      intensity:f32,
     * };
     * ```
     */
    export const DirectionalLight = DirectionalLight_wgsl;
    /**
     * // [KO] 환경광(AmbientLight) 구조체 정의입니다.
     * // [EN] Definition of the AmbientLight structure.
     *
     *
     * ```wgsl
     * struct AmbientLight {
     *      color:vec3<f32>,
     *      intensity:f32
     * };
     * ```
     */
    export const AmbientLight = AmbientLight_wgsl;
    /**
     * // [KO] 그림자(Shadow) 설정 구조체 정의입니다.
     * // [EN] Definition of the Shadow configuration structure.
     *
     *
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
     * // [KO] 대기 산란(SkyAtmosphere) 파라미터 구조체 정의입니다.
     * // [EN] Definition of the SkyAtmosphere parameters structure.
     *
     *
     * ```wgsl
     * struct SkyAtmosphere {
     *    rayleighScattering: vec3<f32>,
     *    rayleighExponentialDistribution: f32,
     *    mieScattering: vec3<f32>,
     *    mieAnisotropy: f32,
     *    mieAbsorption: vec3<f32>,
     *    mieExponentialDistribution: f32,
     *    absorptionCoefficient: vec3<f32>,
     *    absorptionTipAltitude: f32,
     *    groundAlbedo: vec3<f32>,
     *    absorptionTentWidth: f32,
     *    skyLuminanceFactor: vec3<f32>,
     *    multiScatteringFactor: f32,
     *    sunDirection: vec3<f32>,
     *    transmittanceMinLightElevationAngle: f32,
     *    groundRadius: f32,
     *    atmosphereHeight: f32,
     *    aerialPerspectiveDistanceScale: f32,
     *    aerialPerspectiveStartDepth: f32,
     *    sunIntensity: f32,
     *    sunSize: f32,
     *    sunLimbDarkening: f32,
     *    cameraHeight: f32,
     *    cloudTime: f32,
     *    cloudTimeMultiplier: f32,
     *    cloudCoverage: f32,
     *    cloudDensity: f32,
     *    cloudHeight: f32
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
     * struct GlobalVertexStruct {
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
    export const globalVertexStruct = globalVertexStruct_wgsl;
    /**
     * [KO] PBR 재질 유니폼 구조체 정의입니다.
     * [EN] Definition of the PBR Material Uniforms structure.
     */
    export const globalFragmentStructPBR = globalFragmentStructPBR_wgsl;
    export const globalFragmentStructBuiltIn = globalFragmentStructBuiltIn_wgsl;
}

export namespace DisplacementLibrary {
    /**
     * // [KO] 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 정점 위치를 계산합니다.
     * // [EN] Calculates the modified vertex position by sampling the displacement texture with bicubic filtering.
     *
     * // @param input_position [KO] 입력 정점 위치 [EN] Input vertex position
     * // @param input_vertexNormal [KO] 입력 정점 법선 [EN] Input vertex normal
     * // @param displacementTexture [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
     * // @param displacementTextureSampler [KO] 샘플러 [EN] Sampler
     * // @param displacementScale [KO] 변위 강도 [EN] Displacement scale
     * // @param input_uv [KO] 입력 UV 좌표 [EN] Input UV coordinates
     * // @param mipLevel [KO] 밉맵 레벨 [EN] Mipmap level
     * // @returns [KO] 변형된 정점 위치 [EN] Modified vertex position
     *
     *
     * ```wgsl
     * fn getDisplacementPosition(
     *     input_position: vec3<f32>,
     *     input_vertexNormal: vec3<f32>,
     *     displacementTexture: texture_2d<f32>,
     *     displacementTextureSampler: sampler,
     *     displacementScale: f32,
     *     input_uv: vec2<f32>,
     *     mipLevel: f32
     * ) -> vec3<f32> {
     *     // [KO] 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 변위의 연속성을 유지합니다.
     *     // [EN] Texture dimensions based on base resolution (Mip 0) to maintain displacement continuity.
     *     let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
     *     let invTexSize = 1.0 / textureDimensions;
     *
     *     let uv = input_uv * textureDimensions;
     *     let iuv = floor(uv - 0.5);
     *     let fuv = fract(uv - 0.5);
     *
     *     let w0 = (1.0 - fuv) * (1.0 - fuv) * (1.0 - fuv) / 6.0;
     *     let w1 = (4.0 - 6.0 * fuv * fuv + 3.0 * fuv * fuv * fuv) / 6.0;
     *     let w2 = (1.0 + 3.0 * fuv + 3.0 * fuv * fuv - 3.0 * fuv * fuv * fuv) / 6.0;
     *     let w3 = fuv * fuv * fuv / 6.0;
     *
     *     let g0 = w0 + w1;
     *     let g1 = w2 + w3;
     *     let h0 = (w1 / g0) - 1.0 + iuv;
     *     let h1 = (w3 / g1) + 1.0 + iuv;
     *
     *     let res0 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g0.y;
     *     let res1 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g0.y;
     *     let res2 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g1.y;
     *     let res3 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g1.y;
     *
     *     let h_bicubic = res0 + res1 + res2 + res3;
     *
     *     let scaledDisplacement = (h_bicubic - 0.5) * displacementScale;
     *     let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;
     *
     *     return displacedPosition;
     * }
     * ```
     */
    export const getDisplacementPosition = getDisplacementPosition_wgsl;
    /**
     * // [KO] 바이큐빅 필터링 헬퍼 (B-Spline 기반 고정밀 버전)
     * // [EN] Bicubic filtering helper (High-precision version based on B-Spline)
     *
     * // @param uv [KO] 샘플링할 UV 좌표 [EN] UV coordinates to sample
     * // @param tex [KO] 샘플링할 텍스처 [EN] Texture to sample
     * // @param smp [KO] 샘플러 [EN] Sampler
     * // @param dims [KO] 텍스처 크기 [EN] Texture dimensions
     * // @param invSize [KO] 텍스처 크기의 역수 [EN] Inverse of texture dimensions
     * // @param mip [KO] 밉맵 레벨 [EN] Mipmap level
     * // @returns [KO] 샘플링된 값 [EN] Sampled value
     *
     *
     * ```wgsl
     * fn sampleBicubic(uv: vec2<f32>, tex: texture_2d<f32>, smp: sampler, dims: vec2<f32>, invSize: vec2<f32>, mip: f32) -> f32 {
     *     let res_uv = uv * dims;
     *     let i = floor(res_uv - 0.5);
     *     let f = fract(res_uv - 0.5);
     *
     *     let w0 = (1.0 - f) * (1.0 - f) * (1.0 - f) / 6.0;
     *     let w1 = (4.0 - 6.0 * f * f + 3.0 * f * f * f) / 6.0;
     *     let w2 = (1.0 + 3.0 * f + 3.0 * f * f - 3.0 * f * f * f) / 6.0;
     *     let w3 = f * f * f / 6.0;
     *
     *     let g0 = w0 + w1;
     *     let g1 = w2 + w3;
     *     let h0 = (w1 / g0) - 1.0 + i;
     *     let h1 = (w3 / g1) + 1.0 + i;
     *
     *     let r0 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h0.y) + 0.5) * invSize, mip).r * g0.x * g0.y;
     *     let r1 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h0.y) + 0.5) * invSize, mip).r * g1.x * g0.y;
     *     let r2 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h1.y) + 0.5) * invSize, mip).r * g0.x * g1.y;
     *     let r3 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h1.y) + 0.5) * invSize, mip).r * g1.x * g1.y;
     *
     *     return r0 + r1 + r2 + r3;
     * }
     *
     * /**
     *  * [KO] 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 법선 벡터를 계산합니다.
     *  * [EN] Calculates the modified normal vector by sampling the displacement texture with bicubic filtering.
     *  *
     *  * @param displacementTexture [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
     *  * @param displacementTextureSampler [KO] 샘플러 [EN] Sampler
     *  * @param displacementScale [KO] 변위 강도 [EN] Displacement scale
     *  * @param input_uv [KO] 입력 UV 좌표 [EN] Input UV coordinates
     *  * @param mipLevel [KO] 밉맵 레벨 [EN] Mipmap level
     *  * @returns [KO] 변형된 법선 벡터 [EN] Modified normal vector
     *  *
     *  *\/
     * fn getDisplacementNormal(
     *     displacementTexture: texture_2d<f32>,
     *     displacementTextureSampler: sampler,
     *     displacementScale: f32,
     *     input_uv: vec2<f32>,
     *     mipLevel: f32
     * ) -> vec3<f32> {
     *     // [KO] 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 노멀의 선명도를 유지합니다.
     *     // [EN] Texture dimensions based on base resolution (Mip 0) to maintain normal sharpness.
     *     let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
     *     let invTexSize = 1.0 / textureDimensions;
     *
     *     // [KO] 노멀 계산을 위한 샘플링 간격 (밉레벨에 따라 조절)
     *     // [EN] Sampling interval for normal calculation (adjusted by mip level)
     *     let step = invTexSize * exp2(mipLevel);
     *
     *     let h_u0 = sampleBicubic(input_uv + vec2<f32>(-step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
     *     let h_u1 = sampleBicubic(input_uv + vec2<f32>( step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
     *     let h_v0 = sampleBicubic(input_uv + vec2<f32>(0.0, -step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
     *     let h_v1 = sampleBicubic(input_uv + vec2<f32>(0.0,  step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
     *
     *     // [KO] UV 단위당 높이 변화율(Derivative) 계산
     *     let ddu = (h_u1 - h_u0) * displacementScale / (step.x * 2.0);
     *     let ddv = (h_v1 - h_v0) * displacementScale / (step.y * 2.0);
     *
     *     return normalize(vec3<f32>(-ddu, -ddv, 1.0));
     * }
     * ```
     */
    export const getDisplacementNormal = getDisplacementNormal_wgsl;
}

export namespace ShaderLibrary {
    /**
     * // [KO] 엔진의 표준 시스템 유니폼 및 전역 바인딩 구조체 정의입니다.
     * // [EN] Definitions of the engine's standard system uniforms and global binding structures.
     *
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
     *      projection: Projection,
     *      time: Time,
     *      resolution:vec2<f32>,
     *       //
     *       camera:Camera,
     *      usePrefilterTexture:u32,
     *      isView3D:u32,
     *      useSkyAtmosphere:u32,
     *      preExposure:f32,
     *      iblIntensity:f32,
     *      //
     *      skyAtmosphere:SkyAtmosphere,
     *      shadow:Shadow,
     *       //
     *       directionalLightCount:u32,
     *       directionalLightProjectionViewMatrix:mat4x4<f32>,
     *       directionalLightProjectionMatrix:mat4x4<f32>,
     *       directionalLightViewMatrix:mat4x4<f32>,
     *       directionalLights:array<DirectionalLight,3>,
     *      //
     *      ambientLight:AmbientLight,
     *
     * };
     *
     * @group(0) @binding(0) var<globalStruct> systemUniforms: SystemUniform;
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
     * @group(0) @binding(15) var atmosphereIrradianceLUT: texture_cube<f32>;
     * @group(0) @binding(16) var skyAtmosphere_prefilteredTexture: texture_cube<f32>;
     *
     * #redgpu_include systemStruct.globalVertexStruct;
     * @group(0) @binding(17) var<storage> globalVertexSSBO : array<GlobalVertexStruct>;
     *
     * #redgpu_include depth.getLinearizeDepth
     *
     * const clusterLight_indicesLength:u32 = u32(REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu * REDGPU_DEFINE_TOTAL_TILESu);
     * const clusterLight_tileCount = vec3<u32>(REDGPU_DEFINE_TILE_COUNT_Xu, REDGPU_DEFINE_TILE_COUNT_Yu, REDGPU_DEFINE_TILE_COUNT_Zu);
     *
     * /**
     *  * [KO] 클러스터 조명 격자의 한 칸(박스) 정보를 나타내는 구조체입니다.
     *  * [EN] Structure representing a single cell (box) in the cluster light grid.
     *  *
     *  *\/
     * struct ClusterLightCell {
     *     offset : u32,
     *     count : u32
     * };
     *
     * /**
     *  * [KO] 클러스터 조명 데이터를 통합 관리하는 격자(Grid) 구조체입니다.
     *  * [EN] Grid structure that integrally manages cluster light data.
     *  *
     *  *\/
     * struct ClusterLightGrid {
     *     offset : atomic<u32>,
     *     cells : array<ClusterLightCell , REDGPU_DEFINE_TOTAL_TILES>,
     *     indices : array<u32, clusterLight_indicesLength>
     * };
     *
     * /**
     *  * [KO] 클러스터 조명(포인트/스폿 라이트) 데이터 구조체입니다.
     *  * [EN] Cluster light (Point/Spot light) data structure.
     *  *
     *  *\/
     * struct ClusterLight {
     *     position : vec3<f32>, radius : f32,
     *     color : vec3<f32>,    intensity : f32,
     *     isSpotLight:f32,    directionX:f32,    directionY:f32,    directionZ:f32,
     *     outerCutoff:f32,    innerCutoff:f32,
     * };
     *
     * /**
     *  * [KO] 클러스터 조명 리스트 구조체입니다.
     *  * [EN] Cluster light list structure.
     *  *
     *  *\/
     * struct ClusterLightList {
     *     count:vec4<f32>,
     *     lights : array<ClusterLight>
     * };
     * @group(0) @binding(5) var<storage> clusterLightList : ClusterLightList;
     * @group(0) @binding(6) var<storage, read_write> clusterLightGrid : ClusterLightGrid;
     *
     * /**
     *  * [KO] 프래그먼트 좌표를 사용하여 해당 클러스터의 인덱스를 계산합니다.
     *  * [EN] Calculates the index of the cluster using fragment coordinates.
     *  *
     *  * @param fragCoord [KO] 프래그먼트 좌표 [EN] Fragment coordinates
     *  * @returns [KO] 클러스터 인덱스 [EN] Cluster index
     *  *
     *  *\/
     * fn getClusterLightClusterIndex(fragCoord : vec4<f32>) -> u32 {
     *     let tile = getClusterLightTile(fragCoord);
     *     return tile.x +
     *            tile.y * clusterLight_tileCount.x +
     *            tile.z * clusterLight_tileCount.x * clusterLight_tileCount.y;
     *
     * }
     *
     * /**
     *  * [KO] 프래그먼트 좌표를 사용하여 해당 클러스터의 타일(XYZ) 좌표를 계산합니다.
     *  * [EN] Calculates the tile (XYZ) coordinates of the cluster using fragment coordinates.
     *  *
     *  * @param fragCoord [KO] 프래그먼트 좌표 [EN] Fragment coordinates
     *  * @returns [KO] 클러스터 타일 좌표 [EN] Cluster tile coordinates
     *  *
     *  *\/
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
     * // [KO] 포스트 이펙트 시스템 유니폼 구조체입니다.
     * // [EN] Post effect system globalStruct structure.
     *
     *
     * ```wgsl
     * #redgpu_include systemStruct.Camera
     * #redgpu_include systemStruct.Projection
     * #redgpu_include systemStruct.Time
     * #redgpu_include systemStruct.SkyAtmosphere
     *
     * struct SystemUniform {
     *     projection: Projection,
     *     time: Time,
     *     camera:Camera,
     *     useSkyAtmosphere: u32,
     *     preExposure: f32,
     *     devicePixelRatio: f32,
     *     skyAtmosphere:SkyAtmosphere,
     * };
     *
     * @group(2) @binding(4) var<globalStruct> systemUniforms: SystemUniform;
     * ```
     */
    export const POST_EFFECT_SYSTEM_UNIFORM = POST_EFFECT_SYSTEM_UNIFORM_wgsl;

    export import math = MathLibrary;

    export import shadow = ShadowLibrary;

    export import color = ColorLibrary;

    export import depth = DepthLibrary;

    export import lighting = LightingLibrary;

    export import skyAtmosphere = SkyAtmosphereLibrary;

    export import entryPoint = EntryPointLibrary;

    export import systemStruct = SystemStructLibrary;

    export import displacement = DisplacementLibrary;
}

export default ShaderLibrary;
