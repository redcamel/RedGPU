import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import DirectCubeTexture from "../../../DirectCubeTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "../../../../../renderer/commandEncoder/COMMAND_ENCODER_TYPE";

/**
 * [KO] Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map.
 *
 * [KO] 큐브맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.
 * [EN] Extracts low-frequency lighting information from a cubemap to bake an Irradiance map for diffuse lighting.
 *
 * @category IBL
 */
class IrradianceGenerator {
    readonly #redGPUContext: RedGPUContext;
    #sampler: Sampler;
    #pipeline: GPUComputePipeline;
    #shaderModule: GPUShaderModule;

    /**
     * [KO] IrradianceGenerator 인스턴스를 생성합니다.
     * [EN] Creates an IrradianceGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#sampler = new Sampler(this.#redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
    }

    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.
     * [EN] Generates and returns an Irradiance map from the source cube texture.
     *
     * ### Example
     * ```typescript
     * const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param size -
     * [KO] 생성될 Irradiance 맵의 크기 (기본값: 32)
     * [EN] Size of the generated Irradiance map (default: 32)
     * @param phase -
     * [KO] 커맨드 인코더 단계 (기본값: PRE_PROCESS)
     * [EN] Command encoder phase (default: PRE_PROCESS)
     * @returns
     * [KO] 생성된 Irradiance DirectCubeTexture
     * [EN] Generated Irradiance DirectCubeTexture
     */
    async generate(
        sourceCubeTexture: GPUTexture,
        size: number = 32,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): Promise<DirectCubeTexture> {
        const {resourceManager} = this.#redGPUContext;
        const format: GPUTextureFormat = 'rgba16float';

        // 1. 결과용 큐브 텍스처 생성
        const irradianceGPUTexture = resourceManager.createManagedTexture({
            size: [size, size, 6],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            dimension: '2d',
            mipLevelCount: 1,
            label: `Irradiance_Map_Texture_${createUUID()}`
        });

        await this.render(sourceCubeTexture, irradianceGPUTexture, phase);

        return new DirectCubeTexture(this.#redGPUContext, `Irradiance_Map_${createUUID()}`, irradianceGPUTexture);
    }

    #uniformBuffer: GPUBuffer;

    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance를 계산하여 대상 GPUTexture에 렌더링합니다.
     * [EN] Calculates Irradiance from the source cube texture and renders it to the target GPUTexture.
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param targetTexture -
     * [KO] 대상 GPUTexture (2D Array, 6 layers)
     * [EN] Target GPUTexture (2D Array, 6 layers)
     * @param phase -
     * [KO] 커맨드 인코더 단계 (기본값: RESOURCE)
     * [EN] Command encoder phase (default: RESOURCE)
     */
    async render(
        sourceCubeTexture: GPUTexture,
        targetTexture: GPUTexture,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): Promise<void> {
        const {gpuDevice, resourceManager, commandEncoderManager} = this.#redGPUContext;
        const size = targetTexture.width;

        // 1. 파이프라인 생성 (지연 생성 및 캐싱)
        if (!this.#shaderModule) {
            this.#shaderModule = resourceManager.createGPUShaderModule(
                'IRRADIANCE_GENERATOR_SHADER_MODULE',
                {code: irradianceShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createComputePipeline({
                label: 'IRRADIANCE_GENERATOR_PIPELINE',
                layout: 'auto',
                compute: {
                    module: this.#shaderModule,
                    entryPoint: 'cs_main'
                },
            });
        }

        // 2. 6개 면 연산
        const faceMatrices = this.#getCubeMapFaceMatrices();

        if (!this.#uniformBuffer) {
            this.#uniformBuffer = gpuDevice.createBuffer({
                size: 64 * 6,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                label: `Irradiance_face_matrices_uniform`
            });
        }
        const combinedMatrices = new Float32Array(16 * 6);
        faceMatrices.forEach((m, i) => combinedMatrices.set(m, i * 16));
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, combinedMatrices);

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
                {binding: 1, resource: this.#sampler.gpuSampler},
                {binding: 2, resource: targetTexture.createView({dimension: '2d-array'})},
                {binding: 3, resource: {buffer: this.#uniformBuffer}}
            ]
        });

        const computePassLabel = 'Irradiance_Generator_Compute_Pass';
        const computePassExecutor = (computePass: GPUComputePassEncoder) => {
            computePass.setPipeline(this.#pipeline);
            computePass.setBindGroup(0, bindGroup);
            computePass.dispatchWorkgroups(Math.ceil(size / 8), Math.ceil(size / 8), 6);
        };

        if (phase === COMMAND_ENCODER_TYPE.RESOURCE) {
            commandEncoderManager.addResourceComputePass(computePassLabel, computePassExecutor);
        } else if (phase === COMMAND_ENCODER_TYPE.PRE_PROCESS) {
            commandEncoderManager.addPreProcessComputePass(computePassLabel, computePassExecutor);
        } else if (phase === COMMAND_ENCODER_TYPE.MAIN) {
            commandEncoderManager.addMainComputePass(computePassLabel, computePassExecutor);
        } else {
            commandEncoderManager.addPostProcessComputePass(computePassLabel, computePassExecutor);
        }
    }

    #getCubeMapFaceMatrices(): Float32Array[] {
        return [
            new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
        ];
    }
}

Object.freeze(IrradianceGenerator);
export default IrradianceGenerator;
