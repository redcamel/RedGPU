import RedGPUContext from "../../../../context/RedGPUContext";
import BaseMaterial from "../../../../material/BaseMaterial";
import UniformBufferDescriptor from "../../../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import fragmentSource from './fragment.wgsl';
import vertexSource from './vertex.wgsl';

const fragmentUniformBufferDescriptor: UniformBufferDescriptor = new UniformBufferDescriptor(
	[]
);
const fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
	entries: []
};

class NormalHelperMaterial extends BaseMaterial {
	/**
	 *
	 * @param redGPUContext
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			vertexSource, fragmentSource,
			fragmentUniformBufferDescriptor,
			fragmentUniformBindGroupLayoutDescriptor
		)
		const gpuDevice = this.redGPUContext.gpuDevice
		this.#initFragmentUniformInfo(gpuDevice)
		// console.log(this)
	}

	updateBindGroup() {
		this.updateFragmentUniformBindGroup({
			layout: this.renderInfo_FragmentUniformsBindGroupLayout,
			entries: []
		})
	}

	/**
	 * @constructs
	 * @private
	 */
	#initFragmentUniformInfo(gpuDevice: GPUDevice) {
		this.updateBindGroup()
	}
}

export default NormalHelperMaterial
