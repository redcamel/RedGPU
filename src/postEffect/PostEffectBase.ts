import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import throwError from "../util/errorFunc/throwError";
import PostEffectManager from "./PostEffectManager";
import makeShaderModule from "../resource/makeShaderModule";


class PostEffectBase extends RedGPUContextBase {
    #subPassList: [] = []
    #effectRenderTime:number = 0
    get effectRenderTime(): number {
        return this.#effectRenderTime;
    }
    get effectRenderTimeString(): string {
        return this.#effectRenderTime.toString().substring(0,7);
    }
    set effectRenderTime(value: number) {
        this.#effectRenderTime = value;
    }

    get subPassList(): [] {
        return this.#subPassList;
    }

    uniformsBindGroupLayout: GPUBindGroupLayout
    uniformBindGroup: GPUBindGroup
    pipeline: GPURenderPipeline
    #vShaderModule:GPUShaderModule
    get vShaderModule(): GPUShaderModule {
        return this.#vShaderModule;
    }

    #fShaderModule:GPUShaderModule

    get fShaderModule(): GPUShaderModule {
        return this.#fShaderModule;
    }

    constructor(redGPUContext: RedGPUContext,vertexSource:string,fragmentSource:string) {
        super(redGPUContext);
        const {gpuDevice} = this.redGPUContext
        this.#vShaderModule = makeShaderModule(gpuDevice, vertexSource, `vertex_${this.constructor.name}`)
        this.#fShaderModule = makeShaderModule(gpuDevice, fragmentSource, `fragment_${this.constructor.name}`)
    }

    setPipeline(postEffectManager) {
        const {gpuDevice} = this.redGPUContext
        const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        const pipeLineDescriptor: GPURenderPipelineDescriptor = {
            // set bindGroupLayouts
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.uniformsBindGroupLayout]}),
            vertex: {
                module: this.#vShaderModule,
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
                module: this.#fShaderModule,
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

    #renderTexture:GPUTexture
    #renderTextureView:GPUTextureView
    getRenderInfo(postEffectManager : PostEffectManager){
        const redGPUContext = this.redGPUContext
        const {gpuDevice} = redGPUContext
        if(this.#renderTexture){
            if(
                this.#renderTexture.width !== Math.floor(postEffectManager.view.pixelViewRect[2])
                || this.#renderTexture.height !== Math.floor(postEffectManager.view.pixelViewRect[3])
            ){
                this.#renderTexture.destroy()
                this.#renderTexture = null
            }
        }
        this.#renderTexture = gpuDevice.createTexture({
            label: `${this.constructor.name}_texture`,
            size: {
                width: Math.floor(postEffectManager.view.pixelViewRect[2]),
                height: Math.floor(postEffectManager.view.pixelViewRect[3]),
                depthOrArrayLayers: 1
            },
            sampleCount: 1,
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        })
        this.#renderTextureView = this.#renderTexture.createView();
        const renderPassDescriptor: GPURenderPassDescriptor = {
            /**
             * @typedef {GPURenderPassColorAttachment}
             */
            colorAttachments: [
                {
                    view: this.#renderTextureView,
                    clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ]
        };
        return {
            texture : this.#renderTexture,
            textureView : this.#renderTextureView,
            renderPassDescriptor
        }
    }
    render(postEffectManager: PostEffectManager, sourceTextureView: GPUTextureView): GPUTextureView {
        throwError('Must Override')
        return
    }
}

export default PostEffectBase
