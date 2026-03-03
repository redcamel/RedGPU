import RedGPUContext from "../../../../context/RedGPUContext";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";

/**
 * [KO] SkyAtmosphere용 LUT 생성기의 공통 기능을 제공하는 추상 클래스입니다.
 * [EN] Abstract base class providing common functionality for SkyAtmosphere LUT generators.
 */
abstract class ASkyAtmosphereLUTGenerator {
    protected redGPUContext: RedGPUContext;
    protected sharedUniformBuffer: UniformBuffer;
    protected sampler: Sampler;
    protected pipeline: GPUComputePipeline;
    
    readonly label: string;
    readonly width: number;
    readonly height: number;
    readonly depth: number;

    protected constructor(
        redGPUContext: RedGPUContext, 
        sharedUniformBuffer: UniformBuffer, 
        sampler: Sampler,
        label: string,
        width: number, height: number, depth: number = 1
    ) {
        this.redGPUContext = redGPUContext;
        this.sharedUniformBuffer = sharedUniformBuffer;
        this.sampler = sampler;
        this.label = label;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    /** [KO] 생성된 LUT 텍스처를 반환합니다. [EN] Returns the generated LUT texture. */
    abstract get lutTexture(): DirectTexture | DirectCubeTexture;

    /**
     * [KO] 표준 컴퓨팅 패스를 실행하여 LUT를 렌더링합니다.
     * [EN] Executes a standard compute pass to render the LUT.
     */
    protected gpuRender(
        bindGroup: GPUBindGroup, 
        workgroupSize: [number, number, number] = [16, 16, 1]
    ): void {
        const {gpuDevice} = this.redGPUContext;
        const commandEncoder = gpuDevice.createCommandEncoder({label: `${this.label}_COMMAND_ENCODER`});
        const passEncoder = commandEncoder.beginComputePass({label: `${this.label}_COMPUTE_PASS`});
        
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(
            Math.ceil(this.width / workgroupSize[0]),
            Math.ceil(this.height / workgroupSize[1]),
            Math.ceil(this.depth / workgroupSize[2])
        );
        passEncoder.end();
        
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.lutTexture.notifyUpdate();
    }

    /**
     * [KO] 3D 또는 2D LUT용 GPUTexture를 생성합니다.
     */
    protected createLUTTexture(is3D: boolean = false): GPUTexture {
        const {resourceManager} = this.redGPUContext;
        return resourceManager.createManagedTexture({
            label: `${this.label}_Texture`,
            size: [this.width, this.height, this.depth],
            dimension: is3D ? '3d' : '2d',
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });
    }
}

export default ASkyAtmosphereLUTGenerator;
