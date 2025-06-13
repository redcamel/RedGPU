import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface BitmapMaterial {
	diffuseTexture: BitmapTexture
	diffuseTextureSampler: Sampler
}

class BitmapMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
		super(
			redGPUContext,
			'BITMAP_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.diffuseTexture = diffuseTexture
		this.diffuseTextureSampler = new Sampler(this.redGPUContext)
		this.initGPURenderInfos()
	}
}

DefineForFragment.defineByPreset(BitmapMaterial, [
	DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
])
Object.freeze(BitmapMaterial)
export default BitmapMaterial
