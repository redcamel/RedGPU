import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import CubeTexture from "../../resources/texture/CubeTexture";
import ABaseMaterial from "./ABaseMaterial";

/**
 * Represents a material with a bitmap texture.
 * @extends ABaseMaterial
 */
class ABitmapBaseMaterial extends ABaseMaterial {
	__packingList: any[]

	constructor(
		redGPUContext: RedGPUContext,
		moduleName: string,
		SHADER_INFO: any,
		targetGroupIndex: number
	) {
		super(redGPUContext, moduleName, SHADER_INFO, targetGroupIndex)
	}

	/**
	 * Updates the texture and its listener.
	 *
	 * @param {BitmapTexture|CubeTexture} prevTexture - The previous texture to remove listener from.
	 * @param {BitmapTexture|CubeTexture} texture - The new texture to update and add listener to.
	 *
	 */
	updateTexture(prevTexture: BitmapTexture | CubeTexture, texture: BitmapTexture | CubeTexture) {
		if (prevTexture) prevTexture.__removeDirtyPipelineListener(this.#updateFragmentState);
		if (texture) texture.__addDirtyPipelineListener(this.#updateFragmentState);
		this.#updateFragmentState()
	}

	updateSampler(prevSampler: Sampler, newSampler: Sampler) {
		if (prevSampler) prevSampler.__removeDirtyPipelineListener(this.#updateFragmentState);
		if (newSampler) newSampler.__addDirtyPipelineListener(this.#updateFragmentState);
		this.#updateFragmentState()
	}

	/**
	 * Updates the fragment state.
	 *
	 * This method sets the 'dirtyPipeline' flag to true, indicating that the pipeline needs to be updated.
	 * If the 'shaderModule' property of the 'gpuRenderInfo' object is not null or undefined, the '_updateFragmentState()' method is called.
	 * Otherwise, the 'initGPURenderInfos()' method is called with the 'redGPUContext' parameter to initialize the GPU render infos.
	 */
	#updateFragmentState = () => {
		this.dirtyPipeline = true;
		// console.log('this.__packingList',this.__packingList)
		{
			let i = (this.__packingList || []).length
			while (i--) {
				this.__packingList[i]()
			}
		}
		if (this.gpuRenderInfo?.fragmentShaderModule) this._updateFragmentState()
		else this.initGPURenderInfos();
	}
}

Object.freeze(ABitmapBaseMaterial)
export default ABitmapBaseMaterial
