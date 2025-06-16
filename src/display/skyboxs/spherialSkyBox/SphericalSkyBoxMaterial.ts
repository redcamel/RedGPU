import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import DefineForFragment from "../../../resources/defineProperty/DefineForFragment";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "./shader/sphericalFragment.wgsl"

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface SphericalSkyBoxMaterial {
	skyboxTexture: BitmapTexture
	skyboxTextureSampler: Sampler
}

class SphericalSkyBoxMaterial extends ABitmapBaseMaterial {
	/**
	 * Indicates if the pipeline is dirty or not.
	 *
	 * @type {boolean}
	 */
	dirtyPipeline: boolean = false

	constructor(redGPUContext: RedGPUContext, skyboxTexture: BitmapTexture) {
		super(
			redGPUContext,
			'SPHERICAL_SKYBOX_MATERIAL',
			SHADER_INFO,
			2
		)
		this.skyboxTexture = skyboxTexture
		this.skyboxTextureSampler = new Sampler(this.redGPUContext)
		this.initGPURenderInfos()
	}
}

DefineForFragment.defineCubeTexture(SphericalSkyBoxMaterial, [
	'skyboxTexture',
])
DefineForFragment.defineSampler(SphericalSkyBoxMaterial, [
	'skyboxTextureSampler',
])
Object.freeze(SphericalSkyBoxMaterial)
export default SphericalSkyBoxMaterial
