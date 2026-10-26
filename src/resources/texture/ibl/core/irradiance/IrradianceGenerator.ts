import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import DirectCubeTexture from "../../../DirectCubeTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../../base/RedGPUObject";

/**
 * [KO] 큐브맵으로부터 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map for diffuse lighting from a cubemap.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const irradianceGenerator = redGPUContext.resourceManager.irradianceGenerator;
 * ```
 *
 * @see [IBL irradiance test example](/RedGPU/examples/3d/skybox/ibl/irradianceTest/)
 * @category IBL
 */
class IrradianceGenerator extends RedGPUObject {
    #sampler: Sampler;
    #pipeline: GPUComputePipeline;
    #shaderModule: GPUShaderModule;
    #uniformBuffer: GPUBuffer;

    /**
     * [KO] IrradianceGenerator 인스턴스를 생성합니다.
     * [EN] Creates an IrradianceGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#sampler = new Sampler(redGPUContext, {
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
     * // [KO] Irradiance 맵 생성
     * // [EN] Generate Irradiance map
     * const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param size -
     * [KO] 생성할 Irradiance 맵의 한 면 크기 (기본값: 32)
     * [EN] Size of one side of the Irradiance map to generate (default: 32)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 생성된 Irradiance `Promise<DirectCubeTexture>`
     * [EN] Generated Irradiance `Promise<DirectCubeTexture>`
     */
    async generate(
        sourceCubeTexture: GPUTexture,
        size: number = 32,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): Promise<DirectCubeTexture> {
        const {resourceManager, redGPUContext} = this;
        const format: GPUTextureFormat = 'rgba16float';

        const irradianceGPUTexture = resourceManager.createManagedTexture({
            size: [size, size, 6],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            dimension: '2d',
            mipLevelCount: 1,
            label: `Irradiance_Map_Texture_${createUUID()}`
        });

        await this.render(sourceCubeTexture, irradianceGPUTexture, phase);

        return new DirectCubeTexture(redGPUContext, `Irradiance_Map_${createUUID()}`, irradianceGPUTexture);
    }

    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance를 계산하여 대상 `GPUTexture`에 기록합니다.
     * [EN] Calculates Irradiance from the source cube texture and writes it to the target `GPUTexture`.
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param targetTexture -
     * [KO] 결과를 기록할 대상 `GPUTexture` (2D Array, 6개 레이어)
     * [EN] Target `GPUTexture` to write the result (2D Array, 6 layers)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 작업 완료 `Promise<void>`
     * [EN] Completion `Promise<void>`
     */
    async render(
        sourceCubeTexture: GPUTexture,
        targetTexture: GPUTexture,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): Promise<void> {
        const {gpuDevice, resourceManager, commandEncoderManager} = this;
        const size = targetTexture.width;

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

    /**
     * [KO] 내부 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases internal GPU buffer and pipeline resources.
     */
    destroy() {
        if (this.#uniformBuffer) {
            try {
                this.#uniformBuffer.destroy();
            } catch (e) {
            }
            this.#uniformBuffer = null;
        }
        this.#sampler = null;
        this.#pipeline = null;
        this.#shaderModule = null;
    }
}

Object.freeze(IrradianceGenerator);
export default IrradianceGenerator;
