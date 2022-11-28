import RedGPUContext from "../../../../context/RedGPUContext";
import vertexSource from './vertex.wgsl';
import fragmentSource from './fragment.wgsl';
import BaseMaterial from "../../../../material/BaseMaterial";


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

    /**
     * @constructs
     * @private
     */
    #initFragmentUniformInfo() {
        this.updateBindGroup()
    }

    updateBindGroup() {
        this.updateFragmentUniformBindGroup({
            layout: this.renderInfo_FragmentUniformsBindGroupLayout,
            entries: []
        })

    }
}

export default GridMaterial
