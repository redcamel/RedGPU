import {createDefineByPreset, defineProperties} from "./core/createDefineByPreset";
import defineBoolean from "./funcs/defineBoolean";
import definePositiveNumberRange from "./funcs/definePositiveNumberRange";
import defineUintRange from "./funcs/defineUintRange";

function defineProperty_boolean(propertyKey: string, initValue: boolean = false) {
	return defineBoolean(propertyKey, initValue, false)
}

function defineProperty_uintRange(propertyKey: string, initValue: number = 0, min?: number, max?: number) {
	return defineUintRange(propertyKey, initValue, false, min, max)
}

function defineProperty_PositiveNumberRange(propertyKey: string, initValue: number = 0, min?: number, max?: number) {
	return definePositiveNumberRange(propertyKey, initValue, false, min, max)
}

const PRESET_BOOLEAN = {
	USE_BILLBOARD_PERSPECTIVE: 'useBillboardPerspective',
	USE_BILLBOARD: 'useBillboard',
	RECEIVE_SHADOW: 'receiveShadow',
};
const PRESET_POSITIVE_NUMBER = {
	BILLBOARD_FIXED_SCALE: 'billboardFixedScale',
};
const PRESET_UINT = {};
const PRESET_SAMPLER = {};
const PRESET_CUBE_TEXTURE = {};
const PRESET_VEC2 = {};
const PRESET_VEC3 = {};
const PRESET_VEC4 = {};
const PRESET_TEXTURE = {};
const PRESET_COLOR_RGB = {};
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
