import RedGPUContext from "../../../../context/RedGPUContext";
import vertexSource from './vertex.wgsl';
import fragmentSource from './fragment.wgsl';
import UniformBufferDescriptor from "../../../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import BaseMaterial from "../../../../material/BaseMaterial";

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

    /**
     * @constructs
     * @private
     */
    #initFragmentUniformInfo(gpuDevice: GPUDevice) {
        this.updateBindGroup()
    }

    updateBindGroup() {
        this.updateFragmentUniformBindGroup({
            layout: this.renderInfo_FragmentUniformsBindGroupLayout,
            entries: []
        })

    }
}

export default NormalHelperMaterial
