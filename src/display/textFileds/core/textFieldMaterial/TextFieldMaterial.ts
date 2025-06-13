import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import DefineForFragment from "../../../../resources/defineProperty/DefineForFragment";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl';

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface TextFieldMaterial {
	diffuseTexture: BitmapTexture
	diffuseTextureSampler: Sampler
}

class TextFieldMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
		super(
			redGPUContext,
			'TEXT_FILED_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.diffuseTexture = diffuseTexture
		this.diffuseTextureSampler = new Sampler(this.redGPUContext)
		this.initGPURenderInfos()
	}
}

DefineForFragment.defineByPreset(TextFieldMaterial, [
	DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
])
Object.freeze(TextFieldMaterial)
export default TextFieldMaterial
