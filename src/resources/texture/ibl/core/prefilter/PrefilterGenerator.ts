import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import DirectCubeTexture from "../../../DirectCubeTexture";
import prefilterShaderCode from "./prefilterShaderCode.wgsl";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../../base/RedGPUObject";

/**
 * [KO] 큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 밉맵에 저장하는 클래스입니다.
 * [EN] Class that extracts filtered reflection information for each roughness level from a cubemap and stores it in mipmaps.
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
 * const prefilterGenerator = redGPUContext.resourceManager.prefilterGenerator;
 * ```
 *
 * @see [IBL test example](/RedGPU/examples/3d/skybox/ibl/iblTest/)
 * @category IBL
 */
class PrefilterGenerator extends RedGPUObject {
    #sampler: Sampler;
    #pipeline: GPUComputePipeline;
    #shaderModule: GPUShaderModule;
    #uniformBuffers: GPUBuffer[] = [];

    /**
     * [KO] PrefilterGenerator 인스턴스를 생성합니다.
     * [EN] Creates a PrefilterGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
        this.#sampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
    }

    /**
     * [KO] 소스 큐브 텍스처로부터 프리필터링된 큐브맵을 생성하여 반환합니다.
     * [EN] Generates and returns a pre-filtered cubemap from the source cube texture.
     *
     * ### Example
     * ```typescript
     * // [KO] Prefilter 맵 생성
     * // [EN] Generate Prefilter map
     * const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @param destinationTexture -
     * [KO] 결과물을 저장할 대상 텍스처 (선택)
     * [EN] Target texture to store the result (optional)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 생성되거나 업데이트된 Prefilter `Promise<DirectCubeTexture>`
     * [EN] Generated or updated Prefilter `Promise<DirectCubeTexture>`
     */
    async generate(
        sourceCubeTexture: GPUTexture,
        size: number = 512,
        destinationTexture?: GPUTexture | DirectCubeTexture,
        phase: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): Promise<DirectCubeTexture> {
        const {gpuDevice, resourceManager, commandEncoderManager, redGPUContext} = this;
        const format: GPUTextureFormat = 'rgba16float';
        const mipLevelCount = getMipLevelCount(size, size);

        let prefilterGPUTexture: GPUTexture;
        if (destinationTexture) {
            prefilterGPUTexture = destinationTexture instanceof GPUTexture ? destinationTexture : destinationTexture.gpuTexture;
            if (!prefilterGPUTexture) {
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

        const faceMatrices = this.#getCubeMapFaceMatrices();

        for (let mip = 0; mip < mipLevelCount; mip++) {
            const mipSize = Math.max(1, size >> mip);
            const roughness = mip / (mipLevelCount - 1);

            const uniformData = new Float32Array(16 * 6 + 4);
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
        return new DirectCubeTexture(redGPUContext, `Prefilter_Map_${createUUID()}`, prefilterGPUTexture);
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
        this.#uniformBuffers.forEach(buffer => {
            if (buffer) {
                try {
                    buffer.destroy();
                } catch (e) {
                }
            }
        });
        this.#uniformBuffers.length = 0;
        this.#sampler = null;
        this.#pipeline = null;
        this.#shaderModule = null;
    }
}

Object.freeze(PrefilterGenerator);
export default PrefilterGenerator;
