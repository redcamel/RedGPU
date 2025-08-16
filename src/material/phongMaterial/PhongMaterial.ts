import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface PhongMaterial {
	color: ColorRGB;
	emissiveColor: ColorRGB;
	emissiveStrength: number
	specularColor: ColorRGB;
	specularStrength: number
	alphaTexture: BitmapTexture
	alphaTextureSampler: Sampler
	diffuseTexture: BitmapTexture
	diffuseTextureSampler: Sampler
	specularTexture: BitmapTexture
	specularTextureSampler: Sampler
	emissiveTexture: BitmapTexture
	emissiveTextureSampler: Sampler
	aoTexture: BitmapTexture
	aoTextureSampler: Sampler
	normalTexture: BitmapTexture
	normalTextureSampler: Sampler
	normalScale: number
}

class PhongMaterial extends ABitmapBaseMaterial {
	#displacementTexture: BitmapTexture
	#displacementScale: number = 1

	constructor(redGPUContext: RedGPUContext, color: string = '#fff', name?: string) {
		super(
			redGPUContext,
			'PHONG_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.initGPURenderInfos()
		this.color.setColorByHEX(color)
		this.emissiveColor.setColorByHEX(this.emissiveColor.hex)
		this.specularColor.setColorByHEX(this.specularColor.hex)
		//TODO 보강
	}

	get displacementScale(): number {
		return this.#displacementScale;
	}

	set displacementScale(value: number) {
		this.#displacementScale = value;
	}

	get displacementTexture(): BitmapTexture {
		return this.#displacementTexture;
	}

	set displacementTexture(value: BitmapTexture) {
		const prevTexture: BitmapTexture = this.#displacementTexture
		this.#displacementTexture = value;
		this.updateTexture(prevTexture, value)
		this.dirtyPipeline = true
	}
}

DefineForFragment.defineByPreset(PhongMaterial, [
	DefineForFragment.PRESET_COLOR_RGB.COLOR,
	//
	DefineForFragment.PRESET_TEXTURE.ALPHA_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.ALPHA_TEXTURE_SAMPLER,
	//
	DefineForFragment.PRESET_TEXTURE.AO_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.AO_TEXTURE_SAMPLER,
	DefineForFragment.PRESET_POSITIVE_NUMBER.AO_STRENGTH,
	//
	DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
	//
	DefineForFragment.PRESET_TEXTURE.EMISSIVE_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.EMISSIVE_TEXTURE_SAMPLER,
	DefineForFragment.PRESET_POSITIVE_NUMBER.EMISSIVE_STRENGTH,
	[DefineForFragment.PRESET_COLOR_RGB.EMISSIVE_COLOR, '#000000'],
	//
	DefineForFragment.PRESET_TEXTURE.NORMAL_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.NORMAL_TEXTURE_SAMPLER,
	DefineForFragment.PRESET_POSITIVE_NUMBER.NORMAL_SCALE,
	//
	DefineForFragment.PRESET_TEXTURE.SPECULAR_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.SPECULAR_TEXTURE_SAMPLER,
	DefineForFragment.PRESET_POSITIVE_NUMBER.SPECULAR_STRENGTH,
	[DefineForFragment.PRESET_COLOR_RGB.SPECULAR_COLOR, '#ffffff'],
	//
	[DefineForFragment.PRESET_POSITIVE_NUMBER.SHININESS, 32],
])
DefineForFragment.defineBoolean(PhongMaterial, [
	['useSSR',true]
])
Object.freeze(PhongMaterial)
export default PhongMaterial
