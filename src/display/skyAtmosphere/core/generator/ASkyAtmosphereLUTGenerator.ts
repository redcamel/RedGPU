import RedGPUContext from "../../../../context/RedGPUContext";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import RedGPUObject from "../../../../base/RedGPUObject";

abstract class ASkyAtmosphereLUTGenerator  extends RedGPUObject{
    #sharedUniformBuffer: UniformBuffer;
    #sampler: Sampler;
    #label: string;
    #width: number;
    #height: number;
    #depth: number;

    protected constructor(
        redGPUContext: RedGPUContext,
        sharedUniformBuffer: UniformBuffer,
        sampler: Sampler,
        label: string,
        width: number, height: number, depth: number = 1
    ) {
      super(redGPUContext);
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = sampler;
        this.#label = label;
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
    }


    get sharedUniformBuffer(): UniformBuffer {
        return this.#sharedUniformBuffer;
    }

    get sampler(): Sampler {
        return this.#sampler;
    }

    get label(): string {
        return this.#label;
    }

    get width(): number {
        return this.#width;
    }

    get height(): number {
        return this.#height;
    }

    get depth(): number {
        return this.#depth;
    }

    abstract get lutTexture(): DirectTexture | DirectCubeTexture;

    executeComputePass(
        pipeline: GPUComputePipeline,
        bindGroup: GPUBindGroup,
        workgroupSize: [number, number, number] = [16, 16, 1]
    ): void {
        const {commandEncoderManager} = this;
        commandEncoderManager.addResourceComputePass(`SkyAtmosphere_${this.#label}_ComputePass`, (passEncoder) => {
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(
                Math.ceil(this.#width / workgroupSize[0]),
                Math.ceil(this.#height / workgroupSize[1]),
                Math.ceil(this.#depth / workgroupSize[2])
            );
        });
        this.lutTexture.notifyUpdate();
    }

    createLUTTexture(is3D: boolean = false, format: GPUTextureFormat = 'rgba16float'): GPUTexture {
        const {resourceManager} = this;
        return resourceManager.createManagedTexture({
            label: `SkyAtmosphere_${this.#label}_Texture`,
            size: [this.#width, this.#height, this.#depth],
            dimension: is3D ? '3d' : '2d',
            format: format,
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });
    }

    protected createComputePipeline(label: string, shaderCode: string): GPUComputePipeline {
        const {gpuDevice} = this;
        return gpuDevice.createComputePipeline({
            label,
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: shaderCode}),
                entryPoint: 'main'
            }
        });
    }

    protected createBindGroup(label: string, pipeline: GPUComputePipeline, entries: GPUBindGroupEntry[]): GPUBindGroup {
        return this.gpuDevice.createBindGroup({
            label,
            layout: pipeline.getBindGroupLayout(0),
            entries
        });
    }
}
Object.freeze(ASkyAtmosphereLUTGenerator);
export default ASkyAtmosphereLUTGenerator;