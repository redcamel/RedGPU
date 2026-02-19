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
import getNDCFromDepth_wgsl from './shader/math/reconstruct/getNDCFromDepth.wgsl';
import getWorldPositionFromDepth_wgsl from './shader/math/reconstruct/getWorldPositionFromDepth.wgsl';
import getViewPositionFromDepth_wgsl from './shader/math/reconstruct/getViewPositionFromDepth.wgsl';
import getWorldNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getWorldNormalFromGNormalBuffer.wgsl';
import getViewNormalFromGNormalBuffer_wgsl from './shader/math/reconstruct/getViewNormalFromGNormalBuffer.wgsl';
import getViewDirection_wgsl from './shader/math/direction/getViewDirection.wgsl';
import getRayDirection_wgsl from './shader/math/direction/getRayDirection.wgsl';
import getReflectionVectorFromViewDirection_wgsl from './shader/math/direction/getReflectionVectorFromViewDirection.wgsl';
import getShadowCoord_wgsl from './shader/shadow/getShadowCoord.wgsl';
import getShadowClipPosition_wgsl from './shader/shadow/getShadowClipPosition.wgsl';
import getDirectionalShadowVisibility_wgsl from './shader/shadow/getDirectionalShadowVisibility.wgsl';
import getMotionVector_wgsl from './shader/math/getMotionVector.wgsl';
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
import specularBRDF_wgsl from './shader/lighting/getSpecularBRDF.wgsl';
import specularBTDF_wgsl from './shader/lighting/getSpecularBTDF.wgsl';
import diffuseBTDF_wgsl from './shader/lighting/getDiffuseBTDF.wgsl';
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
import meshEntryPointPickingVertex_wgsl from './shader/entryPoint/mesh/entryPointPickingVertex.wgsl';
import meshEntryPointPickingFragment_wgsl from './shader/entryPoint/mesh/entryPointPickingFragment.wgsl';
import meshEntryPointShadowVertex_wgsl from './shader/entryPoint/mesh/entryPointShadowVertex.wgsl';
import billboardEntryPointPickingVertex_wgsl from './shader/entryPoint/billboard/entryPointPickingVertex.wgsl';
import billboardEntryPointShadowVertex_wgsl from './shader/entryPoint/billboard/entryPointShadowVertex.wgsl';
import emptyEntryPointPickingVertex_wgsl from './shader/entryPoint/empty/entryPointPickingVertex.wgsl';
import FragmentOutput_wgsl from './shader/systemStruct/FragmentOutput.wgsl';
import OutputShadowData_wgsl from './shader/systemStruct/OutputShadowData.wgsl';
import SYSTEM_UNIFORM_wgsl from '../resources/systemCode/shader/SYSTEM_UNIFORM.wgsl';
import SystemVertexCode from '../resources/systemCode/shader/vertex';
import SystemFragmentCode from '../resources/systemCode/shader/fragment';

/**
 * [KO] 수학 관련 셰이더 함수 라이브러리
 * [EN] Math related shader function library
 */
export namespace MathLibrary {
    /** [KO] 해시(Hash) 관련 셰이더 함수 [EN] Hash related shader functions */
    export namespace hash {
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
    }

    export const getInterleavedGradientNoise = getInterleavedGradientNoise_wgsl;
    export const getMotionVector = getMotionVector_wgsl;
    export const getIsFinite = getIsFinite_wgsl;

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
 * [KO] glTF KHR 확장 관련 셰이더 함수 라이브러리
 * [EN] Shader function library for glTF KHR extensions
 */
export namespace KHRLibrary {
    /** [KO] KHR_texture_transform [EN] KHR_texture_transform */
    export namespace KHR_texture_transform {
        export const getKHRTextureTransformUV = getKHRTextureTransformUV_wgsl;
    }
    /** [KO] KHR_materials_sheen [EN] KHR_materials_sheen */
    export namespace KHR_materials_sheen {
        export const getSheenCharlieDFG = getSheenCharlieDFG_wgsl;
        export const getSheenCharlieE = getSheenCharlieE_wgsl;
        export const getSheenLambda = getSheenLambda_wgsl;
        export const getSheenIBL = getSheenIBL_wgsl;
    }
    /** [KO] KHR_materials_anisotropy [EN] KHR_materials_anisotropy */
    export namespace KHR_materials_anisotropy {
        export const getAnisotropicNDF = getAnisotropicNDF_wgsl;
        export const getAnisotropicVisibility = getAnisotropicVisibility_wgsl;
        export const getAnisotropicSpecularBRDF = getAnisotropicSpecularBRDF_wgsl;
    }
}

/**
 * [KO] 그림자 관련 셰이더 함수 라이브러리
 * [EN] Shadow related shader function library
 */
export namespace ShadowLibrary {
    export const getShadowCoord = getShadowCoord_wgsl;
    export const getShadowClipPosition = getShadowClipPosition_wgsl;
    export const getDirectionalShadowVisibility = getDirectionalShadowVisibility_wgsl;
}

/**
 * [KO] 색상 관련 셰이더 함수 라이브러리
 * [EN] Color related shader function library
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
 * [KO] 깊이 관련 셰이더 함수 라이브러리
 * [EN] Depth related shader function library
 */
export namespace DepthLibrary {
    export const getLinearizeDepth = getLinearizeDepth_wgsl;
}

/**
 * [KO] 조명 및 BRDF 관련 셰이더 함수 라이브러리
 * [EN] Lighting and BRDF related shader function library
 */
export namespace LightingLibrary {
    export const getLightDistanceAttenuation = getLightDistanceAttenuation_wgsl;
    export const getLightAngleAttenuation = getLightAngleAttenuation_wgsl;
    export const getDiffuseBRDFDisney = diffuseBRDFDisney_wgsl;
    export const getFresnelSchlick = fresnelSchlick_wgsl;
    export const getConductorFresnel = conductorFresnel_wgsl;
    export const getIridescentFresnel = iridescentFresnel_wgsl;
    export const getDistributionGGX = distributionGGX_wgsl;
    export const getGeometrySmith = geometrySmith_wgsl;
    export const getSpecularBRDF = specularBRDF_wgsl;
    export const getSpecularBTDF = specularBTDF_wgsl;
    export const getDiffuseBTDF = diffuseBTDF_wgsl;
    export const getFresnelMix = fresnelMix_wgsl;
    export const getFresnelCoat = fresnelCoat_wgsl;
    export const getTransmissionRefraction = getTransmissionRefraction_wgsl;
}

/**
 * [KO] 엔트리 포인트 관련 셰이더 함수 라이브러리
 * [EN] Entry point related shader function library
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
        export const entryPointShadowVertex = billboardEntryPointShadowVertex_wgsl;
    }
    /** [KO] 빈 엔트리 포인트 (미지원 객체용) [EN] Empty entry points (for unsupported objects) */
    export namespace empty {
        export const entryPointPickingVertex = emptyEntryPointPickingVertex_wgsl;
    }
}

/**
 * [KO] 시스템 공통 구조체 라이브러리
 * [EN] System common structure library
 */
export namespace SystemStructLibrary {
    export const FragmentOutput = FragmentOutput_wgsl;
    export const OutputShadowData = OutputShadowData_wgsl;
}

/**
 * [KO] 엔진 시스템에서 전역적으로 사용되는 셰이더 코드 및 공통 라이브러리를 통합 관리하는 레지스트리입니다.
 * [EN] A registry that integrates and manages shader code and common libraries used globally in the engine.
 * 
 * @category Shader
 */
export namespace SystemCodeManager {
    /** [KO] 전역 시스템 유니폼 정의 [EN] Global system uniform definitions */
    export const SYSTEM_UNIFORM = SYSTEM_UNIFORM_wgsl;

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
    /** [KO] 엔트리 포인트 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for entry points. */
    export import entryPoint = EntryPointLibrary;
    /** [KO] 시스템 공통 구조체 라이브러리입니다. [EN] Common shader structure library for system. */
    export import systemStruct = SystemStructLibrary;
    /** [KO] glTF KHR 확장 관련 공통 셰이더 함수 라이브러리입니다. [EN] Common shader function library for glTF KHR extensions. */
    export import KHR = KHRLibrary;

    /** [KO] 시스템 Vertex 관련 레거시 코드 [EN] System Vertex related legacy code */
    export const vertex = SystemVertexCode;
    /** [KO] 시스템 Fragment 관련 레거시 코드 [EN] System Fragment related legacy code */
    export const fragment = SystemFragmentCode;

    // [KO] 레거시 직접 참조 지원 (전처리기 호환성)
    export const FragmentOutput = FragmentOutput_wgsl;
    export const OutputShadowData = OutputShadowData_wgsl;
    export const calcTintBlendMode = getTintBlendMode_wgsl;
    export const calcDirectionalShadowVisibility = getDirectionalShadowVisibility_wgsl;
    export const drawDirectionalShadowDepth = meshEntryPointShadowVertex_wgsl;
    export const calcPrePathBackground = getTransmissionRefraction_wgsl;
    export const calculateMotionVector = getMotionVector_wgsl;
    export const getKHRTextureTransformUV = getKHRTextureTransformUV_wgsl;
    export const entryPointPickingVertex = meshEntryPointPickingVertex_wgsl;
    export const entryPointPickingFragment = meshEntryPointPickingFragment_wgsl;

    export const billboardPicking = billboardEntryPointPickingVertex_wgsl;
    export const billboardShadow = billboardEntryPointShadowVertex_wgsl;
    export const calcBillboard = SystemVertexCode.calcBillboard;
    export const calcDisplacements = SystemVertexCode.calcDisplacements;
    export const getBillboardMatrix = SystemVertexCode.getBillboardMatrix;
    export const meshVertexBasicUniform = SystemVertexCode.meshVertexBasicUniform;
}

export default SystemCodeManager;
