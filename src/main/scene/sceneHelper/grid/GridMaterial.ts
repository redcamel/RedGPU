import RedGPUContext from "../../../../context/RedGPUContext";
import BaseMaterial from "../../../../material/BaseMaterial";
import fragmentSource from './fragment.wgsl';
import vertexSource from './vertex.wgsl';

const fragmentUniformBufferDescriptor = [];
const fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
	entries: []
};

class GridMaterial extends BaseMaterial {
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
		this.#initFragmentUniformInfo()
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
	#initFragmentUniformInfo() {
		this.updateBindGroup()
	}
}

export default GridMaterial
