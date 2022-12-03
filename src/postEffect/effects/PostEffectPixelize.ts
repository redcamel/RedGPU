import {RedGPUContext} from "../../context";
import {PostEffectBase} from "../index";
import PostEffectManager from "../PostEffectManager";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import TypeSize from "../../resource/buffers/TypeSize";
import vertexSource from "./wgslVertex/baseVertex.wgsl";
import fragmentSource from "./wgslFragment/pixelizeFragment.wgsl";

let float32Array_1 = new Float32Array(1);
let float32Array_2 = new Float32Array(2);

class PostEffectPixelize extends PostEffectBase {
    uniformBuffer: UniformBufferFloat32
    #width: number = 5

    get width(): number {
        return this.#width;
    }

    set width(value: number) {
        this.#width = value;
        float32Array_1[0] = value
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.uniformBuffer.gpuBuffer,
            this.uniformBuffer.descriptor.redGpuStructOffsetMap['width'],
            float32Array_1
        );
    }

    #height: number = 5

    get height(): number {
        return this.#height;
    }

    set height(value: number) {
        this.#height = value;
        float32Array_1[0] = value
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.uniformBuffer.gpuBuffer,
            this.uniformBuffer.descriptor.redGpuStructOffsetMap['height'],
            float32Array_1
        );
    }

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, vertexSource, fragmentSource);
    }

    #init(postEffectManager: PostEffectManager) {
        const {gpuDevice} = this.redGPUContext
        this.uniformBuffer = new UniformBufferFloat32(this.redGPUContext, new UniformBufferDescriptor(
            [
                {size: TypeSize.float32x2, valueName: 'resolution'},
                {size: TypeSize.float32, valueName: 'width'},
                {size: TypeSize.float32, valueName: 'height'},
            ]
        ))
        this.width = 25
        this.height = 25

        this.uniformsBindGroupLayout = gpuDevice.createBindGroupLayout({
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
        });
        this.setPipeline(postEffectManager)

    }

    render(postEffectManager: PostEffectManager, sourceTextureView: GPUTextureView): GPUTextureView {
        const redGPUContext = this.redGPUContext
        const {gpuDevice} = redGPUContext
        const {textureView, renderPassDescriptor} = this.getRenderInfo(postEffectManager)
        if (!this.pipeline) this.#init(postEffectManager)
        //
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
        float32Array_2[0] = postEffectManager.view.pixelViewRect[2] / this.redGPUContext.renderScale
        float32Array_2[1] = postEffectManager.view.pixelViewRect[3] / this.redGPUContext.renderScale
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.uniformBuffer.gpuBuffer,
            this.uniformBuffer.descriptor.redGpuStructOffsetMap['resolution'],
            float32Array_2
        );
        //
        const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setVertexBuffer(0, postEffectManager.vertexBuffer.gpuBuffer);
        passEncoder.setBindGroup(0, this.uniformBindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        return textureView
    }
}

export default PostEffectPixelize
