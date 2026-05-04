import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import DirectCubeTexture from "../../../DirectCubeTexture";
import prefilterShaderCode from "./prefilterShaderCode.wgsl";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "../../../../../renderer/commandEncoder/COMMAND_ENCODER_TYPE";

/**
 * [KO] Prefilter 맵을 생성하는 클래스입니다.
 * [EN] Class that generates a Prefilter map.
 *
 * [KO] 큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 큐브맵의 밉맵에 저장합니다.
 * [EN] Extracts filtered reflection information for each roughness level from a cubemap and stores it in the cubemap's mipmaps.
 *
 * @category IBL
 */
class PrefilterGenerator {
    readonly #redGPUContext: RedGPUContext;
    #sampler: Sampler;
    #pipeline: GPUComputePipeline;
    #shaderModule: GPUShaderModule;

    /**
     * [KO] PrefilterGenerator 인스턴스를 생성합니다.
     * [EN] Creates a PrefilterGenerator instance.
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
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
    }

    #uniformBuffers: GPUBuffer[] = [];

    /**
     * [KO] 소스 큐브 텍스처로부터 프리필터링된 큐브맵을 생성하여 반환합니다.
     * [EN] Generates and returns a pre-filtered cubemap from the source cube texture.
     *
     * ### Example
     * ```typescript
     * const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @param destinationTexture -
     * [KO] 결과물을 저장할 대상 텍스처 (선택)
     * [EN] Target texture to store the result (optional)
     * @param phase -
     * [KO] 커맨드 인코더 단계 (기본값: PRE_PROCESS)
     * [EN] Command encoder phase (default: PRE_PROCESS)
     * @returns
     * [KO] 생성된 또는 업데이트된 Prefilter DirectCubeTexture
     * [EN] Generated or updated Prefilter DirectCubeTexture
     */
    async generate(
        sourceCubeTexture: GPUTexture,
        size: number = 512,
        destinationTexture?: GPUTexture | DirectCubeTexture,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.PRE_PROCESS
    ): Promise<DirectCubeTexture> {
        const {gpuDevice, resourceManager, commandEncoderManager} = this.#redGPUContext;
        const format: GPUTextureFormat = 'rgba16float';
        const mipLevelCount = getMipLevelCount(size, size);

        // 1. 결과용 큐브 텍스처 확보 (주입받은 것이 없으면 새로 생성)
        let prefilterGPUTexture: GPUTexture;
        if (destinationTexture) {
            prefilterGPUTexture = destinationTexture instanceof GPUTexture ? destinationTexture : destinationTexture.gpuTexture;
            if (!prefilterGPUTexture) {
                // DirectCubeTexture는 있으나 내부 GPUTexture가 없는 경우 새로 생성하여 할당
                prefilterGPUTexture = resourceManager.createManagedTexture({
                    size: [size, size, 6],
                    format: format,
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                    dimension: '2d',
                    mipLevelCount: mipLevelCount,
                    label: `Prefilter_Map_Texture_${createUUID()}`
                });
                if (destinationTexture instanceof DirectCubeTexture) destinationTexture.gpuTexture = prefilterGPUTexture;
            }
        } else {
            prefilterGPUTexture = resourceManager.createManagedTexture({
                size: [size, size, 6],
                format: format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                dimension: '2d',
                mipLevelCount: mipLevelCount,
                label: `Prefilter_Map_Texture_${createUUID()}`
            });
        }

        // 2. 파이프라인 생성 (지연 생성 및 캐싱)
        if (!this.#shaderModule) {
            this.#shaderModule = resourceManager.createGPUShaderModule(
                'PREFILTER_GENERATOR_SHADER_MODULE',
                {code: prefilterShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createComputePipeline({
                label: 'PREFILTER_GENERATOR_PIPELINE',
                layout: 'auto',
                compute: {
                    module: this.#shaderModule,
                    entryPoint: 'cs_main'
                },
            });
        }

        // 3. 밉맵 레벨별 연산 (6개 면 포함)
        const faceMatrices = this.#getCubeMapFaceMatrices();

        for (let mip = 0; mip < mipLevelCount; mip++) {
            const mipSize = Math.max(1, size >> mip);
            const roughness = mip / (mipLevelCount - 1);

            const uniformData = new Float32Array(16 * 6 + 4); // faceMatrices(16*6) + roughness(1) + padding(3)
            faceMatrices.forEach((m, i) => uniformData.set(m, i * 16));
            uniformData[16 * 6] = roughness;

            if (!this.#uniformBuffers[mip]) {
                this.#uniformBuffers[mip] = gpuDevice.createBuffer({
                    size: uniformData.byteLength,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                    label: `Prefilter_UniformBuffer_Mip${mip}`
                });
            }
            gpuDevice.queue.writeBuffer(this.#uniformBuffers[mip], 0, uniformData);

            const bindGroup = gpuDevice.createBindGroup({
                layout: this.#pipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
                    {binding: 1, resource: this.#sampler.gpuSampler},
                    {
                        binding: 2,
                        resource: prefilterGPUTexture.createView({
                            dimension: '2d-array',
                            baseMipLevel: mip,
                            mipLevelCount: 1
                        })
                    },
                    {binding: 3, resource: {buffer: this.#uniformBuffers[mip]}}
                ]
            });

            const computePassLabel = `Prefilter_mip_${mip}_compute_pass`;
            const computePassExecutor = (computePass: GPUComputePassEncoder) => {
                computePass.setPipeline(this.#pipeline);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(Math.ceil(mipSize / 8), Math.ceil(mipSize / 8), 6);
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

        if (destinationTexture instanceof DirectCubeTexture) {
            destinationTexture.notifyUpdate();
            return destinationTexture;
        }
        return new DirectCubeTexture(this.#redGPUContext, `Prefilter_Map_${createUUID()}`, prefilterGPUTexture);
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

Object.freeze(PrefilterGenerator);
export default PrefilterGenerator;
