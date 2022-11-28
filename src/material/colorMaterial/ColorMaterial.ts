import RedGPUContext from "../../context/RedGPUContext";
import vertexSource from './vertex.wgsl';
import fragmentSource from './fragment.wgsl';
import TypeSize from "../../resource/buffers/TypeSize";
import BaseMaterial from "../BaseMaterial";
import hexadecimalToRgb from "../../util/color/hexadecimalToRgb";

const fragmentUniformBufferDescriptor = [
    {size: TypeSize.float32x4, valueName: 'color'},
    {size: TypeSize.float32, valueName: 'alpha'},
]
const fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: 'uniform',
            },
        }
    ]
};

class ColorMaterial extends BaseMaterial {
    // TODO - 컬러는 color, rgba로 무조건 구성하도록 때려야하나?
    #color: number
    get color(): number {
        return this.#color;
    }

    set color(value: number) {
        this.#color = value;
        this.#rgb = hexadecimalToRgb(value, true)
    }

    #rgb
    get rgb() {
        return this.#rgb;
    }

    #alpha: number = 1

    get alpha(): number {
        return this.#alpha;
    }

    set alpha(value: number) {
        this.#alpha = value;
    }

    /**
     *
     * @param redGPUContext
     */
    constructor(redGPUContext: RedGPUContext, color?, alpha: number = 1) {
        super(
            redGPUContext,
            vertexSource, fragmentSource,
            fragmentUniformBufferDescriptor,
            fragmentUniformBindGroupLayoutDescriptor
        )
        const t0 = color || `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
        this.color = t0
        // console.log(this)
        this.#alpha = alpha

        this.#initFragmentUniformInfo()
        // console.log(this)

    }

    #initFragmentUniformInfo() {
        this.initUniformValue()
        this.updateBindGroup()
    }

    initUniformValue() {
        const gpuDevice = this.redGPUContext.gpuDevice
        gpuDevice.queue.writeBuffer(
            this.fragmentUniformBuffer.gpuBuffer,
            0,
            new Float32Array([
                    this.rgb[0],
                    this.rgb[1],
                    this.rgb[2],
                    this.alpha
                ]
            )
        );
    }

    updateBindGroup() {
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
            ]
        })

    }
}

export default ColorMaterial
