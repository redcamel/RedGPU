import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import throwError from "../util/errorFunc/throwError";
import PostEffectManager from "./PostEffectManager";
import makeShaderModule from "../resource/makeShaderModule";
import vertexSource from "./invert/vertex.wgsl";
import fragmentSource from "./invert/fragment.wgsl";

class PostEffectBase extends RedGPUContextBase {
    #subPassList: [] = []
    get subPassList(): [] {
        return this.#subPassList;
    }

    uniformsBindGroupLayout: GPUBindGroupLayout
    uniformBindGroup: GPUBindGroup
    pipeline: GPURenderPipeline

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    setPipeline(postEffectManager) {
        const {gpuDevice} = this.redGPUContext
        const vShaderModule = makeShaderModule(gpuDevice, vertexSource, `vertex_${this.constructor.name}`)
        const fShaderModule = makeShaderModule(gpuDevice, fragmentSource, `fragment_${this.constructor.name}`)

        const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        const pipeLineDescriptor: GPURenderPipelineDescriptor = {
            // set bindGroupLayouts
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.uniformsBindGroupLayout]}),
            vertex: {
                module: vShaderModule,
                entryPoint: 'main',

                buffers: [
                    {
                        arrayStride: postEffectManager.vertexBuffer.arrayStride,
                        attributes: postEffectManager.vertexBuffer.attributes.map((v, index) => {
                            return {
                                // position
                                shaderLocation: index,
                                offset: v.offset,
                                format: v.format
                            }
                        })
                    }
                ]
            },
            fragment: {
                module: fShaderModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: presentationFormat,
                        blend: {
                            color: {
                                srcFactor: "src-alpha",
                                dstFactor: "one-minus-src-alpha",
                                operation: "add"
                            },
                            alpha: {
                                srcFactor: "one",
                                dstFactor: "one-minus-src-alpha",
                                operation: "add"
                            }
                        }
                    },
                ],
            },
        }
        this.pipeline = gpuDevice.createRenderPipeline(pipeLineDescriptor);
    }

    render(postEffectManager: PostEffectManager, sourceTextureView: GPUTextureView): GPUTextureView {
        throwError('Must Override')
        return
    }
}

export default PostEffectBase
