import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface WaterMaterial {
	color: ColorRGB;
	specularColor: ColorRGB;
	specularStrength: number;
	normalTexture: BitmapTexture;
	normalTextureSampler: Sampler;
	transmissionFactor: number;
	use2PathRender: boolean
}

class WaterMaterial extends ABitmapBaseMaterial {
	#displacementTexture: BitmapTexture
	#displacementScale: number = 1
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

	constructor(redGPUContext: RedGPUContext, color: string = '#fff', name?: string) {
		super(
			redGPUContext,
			'WATER_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.initGPURenderInfos()
		this.color.setColorByHEX(color)
		this.specularColor.setColorByHEX('#ffffff')
		// 물에 적합한 기본 설정
		this.transmissionFactor = 0.7
		this.specularStrength = 0.8
		this.use2PathRender = true
		//TODO 보강
	}
}

DefineForFragment.defineByPreset(WaterMaterial, [
	DefineForFragment.PRESET_COLOR_RGB.COLOR,
	//
	DefineForFragment.PRESET_TEXTURE.NORMAL_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.NORMAL_TEXTURE_SAMPLER,
	//
	DefineForFragment.PRESET_POSITIVE_NUMBER.OPACITY,
	//
	DefineForFragment.PRESET_POSITIVE_NUMBER.SPECULAR_STRENGTH,
	[DefineForFragment.PRESET_COLOR_RGB.SPECULAR_COLOR, '#ffffff'],
	//
	[DefineForFragment.PRESET_POSITIVE_NUMBER.SHININESS, 64],
])
Object.freeze(WaterMaterial)
DefineForFragment.definePositiveNumber(WaterMaterial, [
	['transmissionFactor', 1]
])
export default WaterMaterial
const WATER_DEFAULTS = {
	// Transmission
	useKHR_materials_transmission: true,
	KHR_transmissionFactor: 0.9,
	// Volume
	useKHR_materials_volume: true,
	KHR_thicknessFactor: 1.0,
	KHR_attenuationDistance: 10.0,
	KHR_attenuationColor: [0.2, 0.6, 0.8],  // 파란색 감쇠
	// IOR
	KHR_materials_ior: 1.33,                 // 물의 굴절률
	// 표면 특성
	roughnessFactor: 0.1,                    // 매끄러운 표면
	metallicFactor: 0.0,                     // 비금속
	// 베이스 컬러
	baseColorFactor: [0.2, 0.6, 0.8, 1.0],
};
