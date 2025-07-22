import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import DefineForFragment from "../../../resources/defineProperty/DefineForFragment";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import SkyBoxMaterial from "../../skyboxs/skyBox/SkyBoxMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface WaterMaterial {
	color: ColorRGB;
	shininess: number
	specularStrength: number
	ior: number
	foamTexture: BitmapTexture
	foamTextureSampler: Sampler

}

class WaterMaterial extends ABitmapBaseMaterial {
	constructor(redGPUContext: RedGPUContext, color: string = '#006994', name?: string) {
		super(
			redGPUContext,
			'WATER_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.initGPURenderInfos()
		this.color.setColorByHEX(color)
		this.use2PathRender = true
	}
}

DefineForFragment.defineByPreset(WaterMaterial, [
	DefineForFragment.PRESET_COLOR_RGB.COLOR,
	//
	DefineForFragment.PRESET_POSITIVE_NUMBER.SPECULAR_STRENGTH,
	//
	[DefineForFragment.PRESET_POSITIVE_NUMBER.SHININESS, 32],
])
DefineForFragment.defineTexture(WaterMaterial,[
	'foamTexture',
])
DefineForFragment.defineSampler(WaterMaterial, [
	'foamTextureSampler',
])
DefineForFragment.definePositiveNumber(WaterMaterial, [
	['ior',1.333,1,1.6]
])
Object.freeze(WaterMaterial)
export default WaterMaterial
