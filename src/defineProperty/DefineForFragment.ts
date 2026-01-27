import {createDefineByPreset, defineProperties} from "./core/createDefineByPreset";
import defineBoolean from "./funcs/defineBoolean";
import defineColorRGB from "./funcs/defineColorRGB";
import defineColorRGBA from "./funcs/defineColorRGBA";
import defineCubeTexture from "./funcs/defineCubeTexture";
import definePositiveNumberRange from "./funcs/definePositiveNumberRange";
import defineSampler from "./funcs/defineSampler";
import defineTexture from "./funcs/defineTexture";
import defineUintRange from "./funcs/defineUintRange";
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

function defineProperty_PositiveNumberRange(propertyKey: string, initValue: number = 1, min?: number, max?: number) {
    return definePositiveNumberRange(propertyKey, initValue, true, min, max)
}

const PRESET_BOOLEAN = {};
const PRESET_POSITIVE_NUMBER = {
    AO_STRENGTH: 'aoStrength',
    SPECULAR_STRENGTH: 'specularStrength',
    EMISSIVE_STRENGTH: 'emissiveStrength',
    OPACITY: 'opacity',
    SHININESS: 'shininess',
    NORMAL_SCALE: 'normalScale',
};
const PRESET_UINT = {};
const PRESET_SAMPLER = {
    ALPHA_TEXTURE_SAMPLER: 'alphaTextureSampler',
    AO_TEXTURE_SAMPLER: 'aoTextureSampler',
    DIFFUSE_TEXTURE_SAMPLER: 'diffuseTextureSampler',
    EMISSIVE_TEXTURE_SAMPLER: 'emissiveTextureSampler',
    ENVIRONMENT_TEXTURE_SAMPLER: 'environmentTextureSampler',
    NORMAL_TEXTURE_SAMPLER: 'normalTextureSampler',
    SPECULAR_TEXTURE_SAMPLER: 'specularTextureSampler',
};
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
            defineBoolean: [defineBoolean, PRESET_BOOLEAN],
            definePositiveNumber: [defineProperty_PositiveNumberRange, PRESET_POSITIVE_NUMBER],
            defineUint: [defineUintRange, PRESET_UINT],
            defineVec2: [defineProperty_vec2, PRESET_VEC2],
            defineVec3: [defineProperty_vec3, PRESET_VEC3],
            defineVec4: [defineProperty_vec4, PRESET_VEC4],
            defineColorRGB: [defineColorRGB, PRESET_COLOR_RGB],
            defineSampler: [defineSampler, PRESET_SAMPLER],
            defineTexture: [defineTexture, PRESET_TEXTURE],
            defineCubeTexture: [defineCubeTexture, PRESET_CUBE_TEXTURE],
        }
    ),
    //
    defineBoolean: defineProperties(defineBoolean),
    definePositiveNumber: defineProperties(defineProperty_PositiveNumberRange),
    defineUint: defineProperties(defineUintRange),
    defineVec2: defineProperties(defineProperty_vec2),
    defineVec3: defineProperties(defineProperty_vec3),
    defineVec4: defineProperties(defineProperty_vec4),
    defineColorRGB: defineProperties(defineColorRGB),
    defineColorRGBA: defineProperties(defineColorRGBA),
    defineSampler: defineProperties(defineSampler),
    defineTexture: defineProperties(defineTexture),
    defineCubeTexture: defineProperties(defineCubeTexture),
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
Object.freeze(DefineForFragment)
export default DefineForFragment
