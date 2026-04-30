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
import meshVertexBasicUniform_wgsl from '../display/mesh/core/shader/meshVertexBasicUniform.wgsl';
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
         */
        export const getHash1D = getHash1D_wgsl;
        export const getHash1D_vec2 = getHash1D_vec2_wgsl;
        export const getHash1D_vec3 = getHash1D_vec3_wgsl;
        export const getHash1D_vec4 = getHash1D_vec4_wgsl;
        export const getHash2D_vec2 = getHash2D_vec2_wgsl;
        export const getHash3D_vec3 = getHash3D_vec3_wgsl;
        export const getBitHash1D = getBitHash1D_wgsl;
        export const getBitHash1D_vec2 = getBitHash1D_vec2_wgsl;
        export const getBitHash1D_vec3 = getBitHash1D_vec3_wgsl;
        export const getBitHash1D_vec4 = getBitHash1D_vec4_wgsl;
        export const getBitHash2D_vec2 = getBitHash2D_vec2_wgsl;
        export const getBitHash3D_vec3 = getBitHash3D_vec3_wgsl;
        export const getRadicalInverseVanDerCorput = getRadicalInverseVanDerCorput_wgsl;
        export const getHammersley = getHammersley_wgsl;
    }

    export const getInterleavedGradientNoise = getInterleavedGradientNoise_wgsl;
    export const getMotionVector = getMotionVector_wgsl;
    export const getIsFinite = getIsFinite_wgsl;

    /** [KO] 빌보드(Billboard) 관련 셰이더 함수 [EN] Billboard related shader functions */
    export namespace billboard {
        export const getBillboardMatrix = getBillboardMatrix_wgsl;
        export const getBillboardResult = getBillboardResult_wgsl;
    }

    /** [KO] 방향(Direction) 관련 셰이더 함수 [EN] Direction related shader functions */
    export namespace direction {
        export const getViewDirection = getViewDirection_wgsl;
        export const getRayDirection = getRayDirection_wgsl;
        export const getReflectionVectorFromViewDirection = getReflectionVectorFromViewDirection_wgsl;
    }

    /** [KO] 공간 및 벡터 복구(Reconstruction) 관련 셰이더 함수 [EN] Space and vector reconstruction related shader functions */
    export namespace reconstruct {
        export const getNDCFromDepth = getNDCFromDepth_wgsl;
        export const getWorldPositionFromDepth = getWorldPositionFromDepth_wgsl;
        export const getViewPositionFromDepth = getViewPositionFromDepth_wgsl;
        export const getWorldNormalFromGNormalBuffer = getWorldNormalFromGNormalBuffer_wgsl;
        export const getViewNormalFromGNormalBuffer = getViewNormalFromGNormalBuffer_wgsl;
    }

    /** [KO] TNB(Tangent, Normal, Bitangent) 관련 셰이더 함수 [EN] TNB related shader functions */
    export namespace tnb {
        export const getTBNFromVertexTangent = getTBNFromVertexTangent_wgsl;
        export const getTBN = getTBN_wgsl;
        export const getTBNFromCotangent = getTBNFromCotangent_wgsl;
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
 * [KO] 그림자 관련 셰이더 함수 라이브러리
 * [EN] Common shader function library for shadow.
 */
export namespace ShadowLibrary {
    export const getShadowCoord = getShadowCoord_wgsl;
    export const getShadowClipPosition = getShadowClipPosition_wgsl;
    export const getDirectionalShadowVisibility = getDirectionalShadowVisibility_wgsl;
}

/**
 * [KO] 색상 변환 및 처리 관련 셰이더 함수 라이브러리
 * [EN] Common shader function library for color conversion and processing.
 */
export namespace ColorLibrary {
    export const rgbToYCoCg = rgbToYCoCg_wgsl;
    export const YCoCgToRgb = YCoCgToRgb_wgsl;
    export const linearToSrgbVec3 = linearToSrgbVec3_wgsl;
    export const linearToSrgbVec4 = linearToSrgbVec4_wgsl;
    export const srgbToLinearVec3 = srgbToLinearVec3_wgsl;
    export const srgbToLinearVec4 = srgbToLinearVec4_wgsl;
    export const getLuminance = getLuminance_wgsl;
    export const getTintBlendMode = getTintBlendMode_wgsl;
}

/**
 * [KO] 깊이(Depth) 관련 셰이더 함수 라이브러리
 * [EN] Common shader function library for depth.
 */
export namespace DepthLibrary {
    export const getLinearizeDepth = getLinearizeDepth_wgsl;
}

/**
 * [KO] 조명 및 BRDF 관련 셰이더 함수 라이브러리
 * [EN] Common shader function library for lighting and BRDF.
 */
export namespace LightingLibrary {
    export const getLightDistanceAttenuation = getLightDistanceAttenuation_wgsl;
    export const getLightAngleAttenuation = getLightAngleAttenuation_wgsl;
}

/**
 * [KO] 대기 산란 관련 공통 셰이더 함수 라이브러리입니다.
 * [EN] Common shader function library for SkyAtmosphere.
 */
export namespace SkyAtmosphereLibrary {
    export const skyAtmosphereFn = skyAtmosphereFn_wgsl;
    export const transmittanceLUT = transmittanceShaderCode_wgsl;
}

/**
 * [KO] 엔트리 포인트 관련 공통 셰이더 함수 라이브러리입니다.
 * [EN] Common shader function library for entry points.
 */
export namespace EntryPointLibrary {
    /** [KO] 메시 관련 엔트리 포인트 [EN] Mesh related entry points */
    export namespace mesh {
        export const entryPointPickingVertex = meshEntryPointPickingVertex_wgsl;
        export const entryPointPickingFragment = meshEntryPointPickingFragment_wgsl;
        export const entryPointShadowVertex = meshEntryPointShadowVertex_wgsl;
    }
    /** [KO] 빌보드 관련 엔트리 포인트 [EN] Billboard related entry points */
    export namespace billboard {
        export const entryPointPickingVertex = billboardEntryPointPickingVertex_wgsl;
    }
    /** [KO] 빈 엔트리 포인트 (미지원 객체용) [EN] Empty entry points (for unsupported objects) */
    export namespace empty {
        export const entryPointPickingVertex = emptyEntryPointPickingVertex_wgsl;
        export const entryPointShadowVertex = emptyEntryPointShadowVertex_wgsl;
    }
}

/**
 * [KO] 시스템 공통 구조체 라이브러리입니다.
 * [EN] Common shader structure library for system.
 */
export namespace SystemStructLibrary {
    export const OutputFragment = OutputFragment_wgsl;
    export const OutputShadowData = OutputShadowData_wgsl;
    export const Camera = Camera_wgsl;
    export const Projection = Projection_wgsl;
    export const Time = Time_wgsl;
    export const DirectionalLight = DirectionalLight_wgsl;
    export const AmbientLight = AmbientLight_wgsl;
    export const Shadow = Shadow_wgsl;
    export const SkyAtmosphere = SkyAtmosphere_wgsl;
    export const meshVertexBasicUniform = meshVertexBasicUniform_wgsl;
}

/**
 * [KO] glTF KHR 확장 관련 공통 셰이더 함수 라이브러리입니다.
 * [EN] Common shader function library for glTF KHR extensions.
 */
export namespace KHRLibrary {
}

/**
 * [KO] 디스플레이스먼트(Displacement) 관련 공통 셰이더 함수 라이브러리입니다.
 * [EN] Common shader function library for displacement.
 */
export namespace DisplacementLibrary {
    export const getDisplacementPosition = getDisplacementPosition_wgsl;
    export const getDisplacementNormal = getDisplacementNormal_wgsl;
}

/**
 * [KO] 엔진 시스템에서 전역적으로 사용되는 셰이더 코드 및 공통 라이브러리를 통합 관리하는 레지스트리입니다.
 * [EN] A registry that integrates and manages shader code and common libraries used globally in the engine.
 *
 * @category Shader
 */
export namespace ShaderLibrary {
    export const SYSTEM_UNIFORM = SYSTEM_UNIFORM_wgsl;
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
