import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import DefineForFragment from "../../../resources/defineProperty/DefineForFragment";
import Sampler from "../../../resources/sampler/Sampler";
import CubeTexture from "../../../resources/texture/CubeTexture";
import HDRTexture from "../../../resources/texture/hdr/HDRTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "./shader/fragment.wgsl"

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface SkyBoxMaterial {
	skyboxTexture: CubeTexture
	skyboxTextureSampler: Sampler
}

class SkyBoxMaterial extends ABitmapBaseMaterial {
	/**
	 * Indicates if the pipeline is dirty or not.
	 *
	 * @type {boolean}
	 */
	dirtyPipeline: boolean = false

	/**
	 * Creates a new instance of the class.
	 *
	 * @constructor
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
	 * @param {CubeTexture} cubeTexture - The cube texture object.
	 */
	constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture) {
		super(
			redGPUContext,
			'SKYBOX_MATERIAL',
			SHADER_INFO,
			2
		)
		this.skyboxTexture = cubeTexture as CubeTexture
		this.skyboxTextureSampler = new Sampler(this.redGPUContext,{
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		})
		this.initGPURenderInfos()
	}
}

DefineForFragment.defineCubeTexture(SkyBoxMaterial, [
	'skyboxTexture',
])
DefineForFragment.defineSampler(SkyBoxMaterial, [
	'skyboxTextureSampler',
])
Object.freeze(SkyBoxMaterial)
export default SkyBoxMaterial
