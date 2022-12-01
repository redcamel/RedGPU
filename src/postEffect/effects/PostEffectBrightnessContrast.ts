import {RedGPUContext} from "../../context";
import {PostEffectBase} from "../index";
import PostEffectManager from "../PostEffectManager";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import TypeSize from "../../resource/buffers/TypeSize";
import vertexSource from "./wgslVertex/baseVertex.wgsl";
import fragmentSource from "./wgslFragment/brightnessContrastFragment.wgsl";

let float32Array_1 = new Float32Array(1);

class PostEffectBrightnessContrast extends PostEffectBase {
    uniformBuffer: UniformBufferFloat32
    #brightness: number = 0

    get brightness(): number {
        return this.#brightness;
    }

    set brightness(value: number) {
        if (value < -150) value = -150
        if (value > 150) value = 150
        this.#brightness = value;
        float32Array_1[0] = value/255
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.uniformBuffer.gpuBuffer,
            this.uniformBuffer.descriptor.redGpuStructOffsetMap['brightness'],
            float32Array_1
        );
    }

    #contrast: number = 0

    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        if (value < -50) value = -50
        if (value > 100) value = 100
        this.#contrast = value;
        float32Array_1[0] = value/255
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.uniformBuffer.gpuBuffer,
            this.uniformBuffer.descriptor.redGpuStructOffsetMap['contrast'],
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
                {size: TypeSize.float32, valueName: 'brightness'},
                {size: TypeSize.float32, valueName: 'contrast'},
            ]
        ))
        this.brightness = 0
        this.contrast = 0

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

export default PostEffectBrightnessContrast
