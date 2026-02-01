import {createDefineByPreset, defineProperties} from "./core/createDefineByPreset";
import defineBoolean from "./funcs/defineBoolean";
import definePositiveNumberRange from "./funcs/definePositiveNumberRange";
import defineUintRange from "./funcs/defineUintRange";
import defineVector from "./funcs/defineVector";

function defineProperty_boolean(propertyKey: string, initValue: boolean = false) {
    return defineBoolean(propertyKey, initValue, false)
}

function defineProperty_uintRange(propertyKey: string, initValue: number = 0, min?: number, max?: number) {
    return defineUintRange(propertyKey, initValue, false, min, max)
}

function defineProperty_PositiveNumberRange(propertyKey: string, initValue: number = 1, min?: number, max?: number) {
    return definePositiveNumberRange(propertyKey, initValue, false, min, max)
}

function defineProperty_vec4(propertyKey: string, initValue: number[] = [0, 0, 0, 0]) {
    return defineVector(propertyKey, initValue, false)
}

function defineProperty_vec3(propertyKey: string, initValue: number[] = [0, 0, 0]) {
    return defineVector(propertyKey, initValue, false)
}

function defineProperty_vec2(propertyKey: string, initValue: number[] = [0, 0]) {
    return defineVector(propertyKey, initValue, false)
}

const PRESET_BOOLEAN = {
    USE_BILLBOARD: 'useBillboard',
    RECEIVE_SHADOW: 'receiveShadow',
    USE_PIXEL_SIZE: 'usePixelSize',
};
const PRESET_POSITIVE_NUMBER = {
    PIXEL_SIZE: 'pixelSize'
};
const PRESET_UINT = {};
const PRESET_SAMPLER = {};
const PRESET_CUBE_TEXTURE = {};
const PRESET_VEC2 = {};
const PRESET_VEC3 = {};
const PRESET_VEC4 = {};
const PRESET_TEXTURE = {};
const PRESET_COLOR_RGB = {};
/**
 * [KO] 버텍스 쉐이더(Vertex Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.
 * [EN] Namespace that defines properties used in Vertex Shaders.
 *
 * [KO] 빌보드 설정, 그림자 수신 여부 등 버텍스 단계의 기하학적 연산에 필요한 속성 정의 기능을 제공합니다.
 * [EN] Provides property definition features required for vertex-stage geometric operations, such as billboard settings and shadow reception.
 *
 * * ### Example
 * ```typescript
 * const material = new RedGPU.Material.BaseMaterial(redGPUContext);
 * RedGPU.DefineForVertex.USE_BILLBOARD('useBillboard', true);
 * ```
 * @namespace DefineForVertex
 */
const DefineForVertex = {
    ...createDefineByPreset(
        {
            defineBoolean: [defineProperty_boolean, PRESET_BOOLEAN],
            defineUint: [defineProperty_uintRange, PRESET_UINT],
            definePositiveNumber: [defineProperty_PositiveNumberRange, PRESET_POSITIVE_NUMBER],
        }
    ),
    //
    defineBoolean: defineProperties(defineProperty_boolean),
    defineUint: defineProperties(defineProperty_uintRange),
    definePositiveNumber: defineProperties(defineProperty_PositiveNumberRange),
    defineVec4: defineProperties(defineProperty_vec4),
    defineVec3: defineProperties(defineProperty_vec3),
    defineVec2: defineProperties(defineProperty_vec2),
    //
    PRESET_BOOLEAN,
    PRESET_POSITIVE_NUMBER,
    PRESET_UINT,
    PRESET_SAMPLER,
    PRESET_TEXTURE,
    PRESET_CUBE_TEXTURE,
    PRESET_VEC2,
    PRESET_VEC3,
    PRESET_VEC4,
    PRESET_COLOR_RGB
}
Object.freeze(DefineForVertex)
export default DefineForVertex
