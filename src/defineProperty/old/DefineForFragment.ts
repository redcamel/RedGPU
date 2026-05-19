import {createDefineByPreset, defineProperties} from "./core/createDefineByPreset";

import defineColorRGB from "./funcs/defineColorRGB";
import defineColorRGBA from "./funcs/defineColorRGBA";
import defineCubeTexture from "./funcs/defineCubeTexture";
import defineTexture from "./funcs/defineTexture";
import defineTexture3D from "./funcs/defineTexture3D";
import defineVector from "./funcs/defineVector";

function defineProperty_vec4(propertyKey: string, initValue: number[] = [0, 0, 0, 0]) {
    return defineVector(propertyKey, initValue)
}

function defineProperty_vec3(propertyKey: string, initValue: number[] = [0, 0, 0]) {
    return defineVector(propertyKey, initValue)
}

function defineProperty_vec2(propertyKey: string, initValue: number[] = [0, 0]) {
    return defineVector(propertyKey, initValue)
}

const PRESET_CUBE_TEXTURE = {
    ENVIRONMENT_TEXTURE: 'environmentTexture',
};
const PRESET_VEC2 = {};
const PRESET_VEC3 = {};
const PRESET_VEC4 = {};
const PRESET_TEXTURE = {
    ALPHA_TEXTURE: 'alphaTexture',
    AO_TEXTURE: 'aoTexture',
    DIFFUSE_TEXTURE: 'diffuseTexture',
    EMISSIVE_TEXTURE: 'emissiveTexture',
    NORMAL_TEXTURE: 'normalTexture',
    SPECULAR_TEXTURE: 'specularTexture',
};
const PRESET_COLOR_RGB = {
    COLOR: 'color',
    EMISSIVE_COLOR: 'emissiveColor',
    SPECULAR_COLOR: 'specularColor',
};
/**
 * [KO] 프래그먼트 쉐이더(Fragment Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.
 * [EN] Namespace that defines properties used in Fragment Shaders.
 *
 * [KO] 텍스처, 샘플러, 색상 등 프래그먼트 단계의 렌더링에 필요한 다양한 속성 정의 기능을 제공합니다.
 * [EN] Provides various property definition features required for fragment-stage rendering, such as textures, samplers, and colors.
 *
 * * ### Example
 * ```typescript
 * const material = new RedGPU.Material.BaseMaterial(redGPUContext);
 * RedGPU.DefineForFragment.COLOR('color', [1, 0, 0]);
 * ```
 * @namespace DefineForFragment
 */
const DefineForFragment = {
    ...createDefineByPreset(
        {
            defineVec2: [defineProperty_vec2, PRESET_VEC2],
            defineVec3: [defineProperty_vec3, PRESET_VEC3],
            defineVec4: [defineProperty_vec4, PRESET_VEC4],
            defineColorRGB: [defineColorRGB, PRESET_COLOR_RGB],
            defineTexture: [defineTexture, PRESET_TEXTURE],
            defineTexture3D: [defineTexture3D, {}],
            defineCubeTexture: [defineCubeTexture, PRESET_CUBE_TEXTURE],
        }
    ),
    //
    defineVec2: defineProperties(defineProperty_vec2),
    defineVec3: defineProperties(defineProperty_vec3),
    defineVec4: defineProperties(defineProperty_vec4),
    defineColorRGB: defineProperties(defineColorRGB),
    defineColorRGBA: defineProperties(defineColorRGBA),
    defineTexture: defineProperties(defineTexture),
    defineTexture3D: defineProperties(defineTexture3D),
    defineCubeTexture: defineProperties(defineCubeTexture),
    //
    PRESET_TEXTURE,
    PRESET_CUBE_TEXTURE,
    PRESET_VEC2,
    PRESET_VEC3,
    PRESET_VEC4,
    PRESET_COLOR_RGB
}
Object.freeze(DefineForFragment)
export default DefineForFragment
