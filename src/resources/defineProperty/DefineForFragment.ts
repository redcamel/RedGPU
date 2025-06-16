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
const DefineForFragment = {
	...createDefineByPreset(
		{
			defineBoolean: [defineBoolean, PRESET_BOOLEAN],
			definePositiveNumber: [definePositiveNumberRange, PRESET_POSITIVE_NUMBER],
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
	definePositiveNumber: defineProperties(definePositiveNumberRange),
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
