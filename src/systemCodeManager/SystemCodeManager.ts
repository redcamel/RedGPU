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
import ycocg_to_rgb_wgsl from './shader/color/ycocg_to_rgb.wgsl';
import linear_to_srgb_vec3_wgsl from './shader/color/linear_to_srgb_vec3.wgsl';
import linear_to_srgb_vec4_wgsl from './shader/color/linear_to_srgb_vec4.wgsl';
import srgb_to_linear_vec3_wgsl from './shader/color/srgb_to_linear_vec3.wgsl';
import srgb_to_linear_vec4_wgsl from './shader/color/srgb_to_linear_vec4.wgsl';
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
    export const getHash1D = getHash1D_wgsl;
    export const getHash1D_vec2 = getHash1D_vec2_wgsl;
    export const getHash1D_vec3 = getHash1D_vec3_wgsl;
    export const getHash1D_vec4 = getHash1D_vec4_wgsl;
    export const getHash2D_vec2 = getHash2D_vec2_wgsl;
    export const getHash3D_vec3 = getHash3D_vec3_wgsl;
    export const getInterleavedGradientNoise = getInterleavedGradientNoise_wgsl;

    export const getBitHash1D = getBitHash1D_wgsl;
    export const getBitHash1D_vec2 = getBitHash1D_vec2_wgsl;
    export const getBitHash1D_vec3 = getBitHash1D_vec3_wgsl;
    export const getBitHash1D_vec4 = getBitHash1D_vec4_wgsl;
    export const getBitHash2D_vec2 = getBitHash2D_vec2_wgsl;
    export const getBitHash3D_vec3 = getBitHash3D_vec3_wgsl;
}

/**
 * [KO] 색상 관련 셰이더 함수 라이브러리
 * [EN] Color related shader function library
 */
export namespace ColorLibrary {
    export const rgb_to_ycocg = rgb_to_ycocg_wgsl;
    export const ycocg_to_rgb = ycocg_to_rgb_wgsl;
    export const linear_to_srgb_vec3 = linear_to_srgb_vec3_wgsl;
    export const linear_to_srgb_vec4 = linear_to_srgb_vec4_wgsl;
    export const srgb_to_linear_vec3 = srgb_to_linear_vec3_wgsl;
    export const srgb_to_linear_vec4 = srgb_to_linear_vec4_wgsl;
    export const get_luminance = get_luminance_wgsl;
}

/**
 * [KO] 깊이 관련 셰이더 함수 라이브러리
 * [EN] Depth related shader function library
 */
export namespace DepthLibrary {
    export const linearizeDepth = linearizeDepth_wgsl;
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

    // [KO] 레거시 직접 참조 지원 (전처리기 호환성)
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
