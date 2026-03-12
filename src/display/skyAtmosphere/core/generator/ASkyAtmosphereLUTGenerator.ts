import RedGPUContext from "../../../../context/RedGPUContext";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";

/**
 * [KO] SkyAtmosphere용 LUT 생성기의 공통 기능을 제공하는 추상 클래스입니다.
 * [EN] Abstract base class providing common functionality for SkyAtmosphere LUT generators.
 *
 * @category SkyAtmosphere
 */
abstract class ASkyAtmosphereLUTGenerator {
    #redGPUContext: RedGPUContext;
    #sharedUniformBuffer: UniformBuffer;
    #sampler: Sampler;
    #pipeline: GPUComputePipeline;

    /**
     * [KO] 생성기의 레이블입니다.
     * [EN] Label of the generator.
     */
    #label: string;

    /**
     * [KO] 생성할 LUT의 너비입니다.
     * [EN] Width of the LUT to be generated.
     */
    #width: number;

    /**
     * [KO] 생성할 LUT의 높이입니다.
     * [EN] Height of the LUT to be generated.
     */
    #height: number;

    /**
     * [KO] 생성할 LUT의 깊이(또는 레이어 수)입니다.
     * [EN] Depth (or number of layers) of the LUT to be generated.
     */
    #depth: number;

    /**
     * [KO] ASkyAtmosphereLUTGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes an ASkyAtmosphereLUTGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param sharedUniformBuffer -
     * [KO] 공유 유니폼 버퍼
     * [EN] Shared uniform buffer
     * @param sampler -
     * [KO] LUT 샘플링에 사용할 샘플러
     * [EN] Sampler to be used for LUT sampling
     * @param label -
     * [KO] 생성기 레이블
     * [EN] Generator label
     * @param width -
     * [KO] LUT 너비
     * [EN] LUT width
     * @param height -
     * [KO] LUT 높이
     * [EN] LUT height
     * @param depth -
     * [KO] LUT 깊이 (기본값: 1)
     * [EN] LUT depth (Default: 1)
     */
    constructor(
        redGPUContext: RedGPUContext,
        sharedUniformBuffer: UniformBuffer,
        sampler: Sampler,
        label: string,
        width: number, height: number, depth: number = 1
    ) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = sampler;
        this.#label = label;
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
    }

    get redGPUContext(): RedGPUContext { return this.#redGPUContext; }
    get sharedUniformBuffer(): UniformBuffer { return this.#sharedUniformBuffer; }
    get sampler(): Sampler { return this.#sampler; }
    get pipeline(): GPUComputePipeline { return this.#pipeline; }
    set pipeline(value: GPUComputePipeline) { this.#pipeline = value; }

    get label(): string { return this.#label; }
    get width(): number { return this.#width; }
    get height(): number { return this.#height; }
    get depth(): number { return this.#depth; }

    /**
     * [KO] 생성된 LUT 텍스처를 반환합니다.
     * [EN] Returns the generated LUT texture.
     */
    abstract get lutTexture(): DirectTexture | DirectCubeTexture;

    /**
     * [KO] 표준 컴퓨팅 패스를 실행하여 LUT를 렌더링합니다.
     * [EN] Executes a standard compute pass to render the LUT.
     *
     * @param bindGroup -
     * [KO] 컴퓨팅 패스에 사용할 바인드 그룹
     * [EN] Bind group to be used for the compute pass
     * @param workgroupSize -
     * [KO] 워크그룹 크기 (기본값: [16, 16, 1])
     * [EN] Workgroup size (Default: [16, 16, 1])
     */
    executeComputePass(
        bindGroup: GPUBindGroup,
        workgroupSize: [number, number, number] = [16, 16, 1]
    ): void {
        const {gpuDevice} = this.#redGPUContext;
        const commandEncoder = gpuDevice.createCommandEncoder({label: `${this.#label}_COMMAND_ENCODER`});
        const passEncoder = commandEncoder.beginComputePass({label: `${this.#label}_COMPUTE_PASS`});

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(
            Math.ceil(this.#width / workgroupSize[0]),
            Math.ceil(this.#height / workgroupSize[1]),
            Math.ceil(this.#depth / workgroupSize[2])
        );
        passEncoder.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.lutTexture.notifyUpdate();
    }

    /**
     * [KO] 3D 또는 2D LUT용 GPUTexture를 생성합니다.
     * [EN] Creates a GPUTexture for 3D or 2D LUT.
     *
     * @param is3D -
     * [KO] 3D 텍스처 여부 (기본값: false)
     * [EN] Whether it is a 3D texture (Default: false)
     * @returns
     * [KO] 생성된 GPUTexture
     * [EN] The generated GPUTexture
     */
    createLUTTexture(is3D: boolean = false): GPUTexture {
        const {resourceManager} = this.#redGPUContext;
        return resourceManager.createManagedTexture({
            label: `${this.#label}_Texture`,
            size: [this.#width, this.#height, this.#depth],
            dimension: is3D ? '3d' : '2d',
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });
    }
}

export default ASkyAtmosphereLUTGenerator;
