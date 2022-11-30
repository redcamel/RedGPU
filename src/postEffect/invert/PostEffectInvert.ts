import {RedGPUContext} from "../../context";
import {PostEffectBase} from "../index";
import PostEffectManager from "../PostEffectManager";
import makeShaderModule from "../../resource/makeShaderModule";
import vertexSource from "./vertex.wgsl";
import fragmentSource from "./fragment.wgsl";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import TypeSize from "../../resource/buffers/TypeSize";


class PostEffectInvert extends PostEffectBase {
    uniformBuffer:UniformBufferFloat32
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }
    #init(postEffectManager:PostEffectManager){
        const {gpuDevice} = this.redGPUContext
        const vShaderModule = makeShaderModule(gpuDevice, vertexSource, `vertex_${this.constructor.name}`)
        const fShaderModule = makeShaderModule(gpuDevice, fragmentSource, `fragment_${this.constructor.name}`)

        this.uniformBuffer = new UniformBufferFloat32(this.redGPUContext, new UniformBufferDescriptor(
            [
                {size: TypeSize.float32x2, valueName: 'resolution'},
            ]
        ))

        this.uniformsBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
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
        });
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

    render(postEffectManager:PostEffectManager,sourceTextureView:GPUTextureView):GPUTextureView{
        if(!this.pipeline) this.#init(postEffectManager)
        console.log('TODO - PostEffectInvert.render()')
        const redGPUContext = this.redGPUContext

        const {gpuDevice, gpuContext, pixelSize} = redGPUContext
        const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder();
        const texture:GPUTexture = gpuDevice.createTexture({
            size: {
                width: postEffectManager.view.pixelViewRect[2],
                height: postEffectManager.view.pixelViewRect[3],
                depthOrArrayLayers: 1
            },
            sampleCount: 1,
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        })
        const textureView: GPUTextureView = texture.createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            /**
             * @typedef {GPURenderPassColorAttachment}
             */
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ]

        };
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        const uniformBindGroupDescriptor = {
            layout: this.uniformsBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.uniformBuffer.gpuBuffer.size
                    }
                },
                {
                    binding: 1,
                    resource: postEffectManager.sampler.gpuSampler,
                },
                {
                    binding: 2,
                    resource: sourceTextureView,
                }
            ]
        };
        this.uniformBindGroup = gpuDevice.createBindGroup(uniformBindGroupDescriptor);
        passEncoder.setVertexBuffer(0, postEffectManager.vertexBuffer.gpuBuffer);
        passEncoder.setBindGroup(0, this.uniformBindGroup);
        // gpuDevice.queue.writeBuffer(view.finalRenderUniformBuffer, 0, this.#matrix);
        passEncoder.draw(6, 1, 0, 0);
        //
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        return textureView
    }
}

export default PostEffectInvert
