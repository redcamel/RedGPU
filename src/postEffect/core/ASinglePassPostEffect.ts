import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

class ASinglePassPostEffect {
    #computeShader: GPUShaderModule
    #computeBindGroupLayout: GPUBindGroupLayout
    #computeBindGroup: GPUBindGroup
    #computePipeline: GPUComputePipeline
    ///
    #uniformBuffer: UniformBuffer
    #uniformInfo
    #storageInfo
//
    #outputTexture: GPUTexture[] = []
    #outputTextureView: GPUTextureView[] = []
    #WORK_SIZE_X = 16
    #WORK_SIZE_Y = 16
    #WORK_SIZE_Z = 1

    constructor() {
    }

    get storageInfo() {
        return this.#storageInfo;
    }

    get uniformBuffer(): UniformBuffer {
        return this.#uniformBuffer;
    }

    get uniformInfo() {
        return this.#uniformInfo;
    }

    get WORK_SIZE_X(): number {
        return this.#WORK_SIZE_X;
    }

    set WORK_SIZE_X(value: number) {
        this.#WORK_SIZE_X = value;
    }

    get WORK_SIZE_Y(): number {
        return this.#WORK_SIZE_Y;
    }

    set WORK_SIZE_Y(value: number) {
        this.#WORK_SIZE_Y = value;
    }

    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
    }

    set WORK_SIZE_Z(value: number) {
        this.#WORK_SIZE_Z = value;
    }

    get outputTextureView(): GPUTextureView[] {
        return this.#outputTextureView;
    }

    getOutputTextureView(): GPUTextureView {
        return this.#outputTextureView[this.#outputTextureView.length - 1]
    }

    clear() {
        if (this.#outputTexture) {
            this.#outputTexture.forEach(v => v.destroy())
            this.#outputTexture.length = 0
            this.#outputTextureView.length = 0
        }
    }

    init(redGPUContext: RedGPUContext, name: string, computeCode: string, bindGroupLayout?: GPUBindGroupLayout) {
        const {resourceManager} = redGPUContext
        this.#computeShader = resourceManager.createGPUShaderModule(
            name,
            {code: computeCode}
        )
        const SHADER_INFO = parseWGSL(computeCode)
        const STORAGE_STRUCT = SHADER_INFO.storage;
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.uniforms;
        this.#storageInfo = STORAGE_STRUCT
        // console.log(name, 'UNIFORM_STRUCT', UNIFORM_STRUCT)
        // console.log(name, 'STORAGE_STRUCT', STORAGE_STRUCT)
        if (UNIFORM_STRUCT) {
            this.#uniformInfo = UNIFORM_STRUCT
            const uniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
            this.#uniformBuffer = new UniformBuffer(
                redGPUContext,
                uniformData,
                `${this.constructor.name}_UniformBuffer`
            )
        }
        this.#computeBindGroupLayout = bindGroupLayout || redGPUContext.resourceManager.getGPUBindGroupLayout(`${name}_BIND_GROUP_LAYOUT`) || redGPUContext.resourceManager.createBindGroupLayout(
            `${name}_BIND_GROUP_LAYOUT`,
            getComputeBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 0)
        )
    }

    execute(gpuDevice: GPUDevice, width: number, height: number) {
        this.#computePipeline = gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout]}),
            compute: {module: this.#computeShader, entryPoint: 'main',}
        })
        const commentEncode_compute = gpuDevice.createCommandEncoder()
        const computePassEncoder = commentEncode_compute.beginComputePass()
        computePassEncoder.setPipeline(this.#computePipeline)
        computePassEncoder.setBindGroup(0, this.#computeBindGroup)
        computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
        computePassEncoder.end();
        gpuDevice.queue.submit([commentEncode_compute.finish()]);
    }

    render(view: View3D, width: number, height: number, ...sourceTextureView) {
        this.#createRenderTexture(view)
        const targetOutputView = this.getOutputTextureView()
        const {redGPUContext} = view
        const {gpuDevice} = redGPUContext
        const entries: GPUBindGroupEntry[] = []
        for (const k in this.#storageInfo) {
            const info = this.#storageInfo[k]
            const {binding, name} = info
            entries.push(
                {
                    binding: binding,
                    resource: name === 'outputTexture' ? targetOutputView : sourceTextureView[binding],
                }
            )
        }
        if (this.#uniformBuffer) {
            entries.push(
                {
                    binding: this.#uniformInfo.binding,
                    resource: {
                        buffer: this.#uniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.#uniformBuffer.size
                    },
                }
            )
        }
        // console.log(entries)
        // console.log(this.#computeBindGroupLayout)
        this.#computeBindGroup = gpuDevice.createBindGroup({
            layout: this.#computeBindGroupLayout,
            entries
        })
        this.execute(gpuDevice, width, height)
        return targetOutputView
    }

    #createRenderTexture(view: View3D) {
        const {redGPUContext, viewRenderTextureManager} = view
        const {colorTexture} = viewRenderTextureManager
        const {gpuDevice} = redGPUContext
        const {width: W, height: H} = colorTexture
        const newTexture = gpuDevice.createTexture({
            size: {
                width: W,
                height: H,
            },
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
        })
        this.#outputTexture.push(newTexture)
        this.#outputTextureView.push(newTexture.createView())
    }
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
