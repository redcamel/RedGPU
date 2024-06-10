import RedGPUContext from "../../context/RedGPUContext";
import BitmapTexture from "../../resource/texture/BitmapTexture";
import TextureSampler from "../../resource/texture/TextureSampler";
import BaseMaterial from "../BaseMaterial";
import Mix from "../MaterialMix";
import fragmentSource from './fragment.wgsl';
import vertexSource from './vertex.wgsl';

const fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
	entries: [
		{
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			buffer: {
				type: 'uniform',
			},
		},
		{
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: {
				type: 'filtering',
			},
		},
		{
			binding: 2,
			visibility: GPUShaderStage.FRAGMENT,
			texture: {}
		}
	]
};
const fragmentUniformBufferDescriptor = [
	...Mix.alphaUniformDefine,
	...Mix.lightPropertyUniformDefine
];

class BitmapPhongMaterial extends Mix.mix(
	BaseMaterial,
	Mix.diffuseTexture,
	Mix.alpha,
	Mix.lightProperty,
) {
	/**
	 *
	 * @param redGPUContext
	 * @param diffuseTexture
	 */
	constructor(redGPUContext: RedGPUContext, diffuseTexture: BitmapTexture) {
		super(
			redGPUContext,
			vertexSource, fragmentSource,
			fragmentUniformBufferDescriptor,
			fragmentUniformBindGroupLayoutDescriptor
		)
		const gpuDevice = this.redGPUContext.gpuDevice
		this.diffuseTextureSampler = new TextureSampler(redGPUContext)
		this.#initFragmentUniformInfo(gpuDevice)
		this.diffuseTexture = diffuseTexture
		console.log(this)
	}

	updateBindGroup() {
		if (this.dirtyTexture) {
			this.updateFragmentUniformBindGroup({
				layout: this.renderInfo_FragmentUniformsBindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: {
							buffer: this.fragmentUniformBuffer.gpuBuffer,
							offset: 0,
							size: this.fragmentUniformBuffer.gpuBufferSize
						}
					},
					{
						binding: 1,
						resource: this.diffuseTextureSampler.gpuSampler,
					},
					{
						binding: 2,
						resource: this.diffuseTexture?.gpuTextureView || (this.redGPUContext.resourceManager.emptyTextureInfo.textureView)
					}
				]
			})
			this.dirtyTexture = false
			console.log(this)
		}
	}

	/**
	 *
	 * @param gpuDevice
	 * @private
	 */
	#initFragmentUniformInfo(gpuDevice: GPUDevice) {
		this.#initUniformValue()
		this.updateBindGroup()
	}

	#initUniformValue() {
		const offsetMap = this.fragmentUniformBuffer.descriptor.redStructOffsetMap
		for (const k in offsetMap) {
			this[k] = this[k]
		}
	}
}

export default BitmapPhongMaterial
