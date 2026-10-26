import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import DirectCubeTexture from "../../../DirectCubeTexture";
import equirectangularToCubeShaderCode from "./equirectangularToCubeShaderCode.wgsl";
import RedGPUObject from "../../../../../base/RedGPUObject";

/**
 * [KO] 2D Equirectangular(등장방형도법) 텍스처를 큐브맵으로 변환하는 클래스입니다.
 * [EN] Class that converts a 2D Equirectangular texture into a cubemap.
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
 * const equirectangularToCubeGenerator = redGPUContext.resourceManager.equirectangularToCubeGenerator;
 * ```
 *
 * @see [IBL test example](/RedGPU/examples/3d/skybox/ibl/iblTest/)
 * @category IBL
 */
class EquirectangularToCubeGenerator extends RedGPUObject {

    #shaderModule: GPUShaderModule;
    #pipeline: GPUComputePipeline;
    #sampler: Sampler;
    #uniformBuffer: GPUBuffer;

    /**
     * [KO] EquirectangularToCubeGenerator 인스턴스를 생성합니다.
     * [EN] Creates an EquirectangularToCubeGenerator instance.
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
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
    }

    /**
     * [KO] 2D Equirectangular 텍스처를 큐브맵으로 변환하여 반환합니다.
     * [EN] Converts a 2D Equirectangular texture into a cubemap and returns it.
     *
     * ### Example
     * ```typescript
     * // [KO] 2D HDR 텍스처를 큐브맵으로 변환
     * // [EN] Convert 2D HDR texture to cubemap
     * const cubeMap = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrTexture, 1024);
     * ```
     *
     * @param sourceTexture -
     * [KO] 소스 2D HDR 텍스처
     * [EN] Source 2D HDR texture
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @returns
     * [KO] 생성된 `Promise<DirectCubeTexture>`
     * [EN] Generated `Promise<DirectCubeTexture>`
     */
    async generate(sourceTexture: GPUTexture, size: number = 512): Promise<DirectCubeTexture> {
        const {gpuDevice, resourceManager, commandEncoderManager, redGPUContext} = this;
        const format: GPUTextureFormat = 'rgba16float';
        const mipLevelCount = getMipLevelCount(size, size);

        const textureDesc: GPUTextureDescriptor = {
            size: [size, size, 6],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            dimension: '2d',
            mipLevelCount: mipLevelCount,
            label: `EquirectangularToCube_Texture_${createUUID()}`
        };
        const cubeGPUTexture = resourceManager.createManagedTexture(textureDesc);

        if (!this.#shaderModule) {
            this.#shaderModule = resourceManager.createGPUShaderModule(
                'EQUIRECTANGULAR_TO_CUBE_GENERATOR_SHADER_MODULE',
                {code: equirectangularToCubeShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createComputePipeline({
                label: 'EQUIRECTANGULAR_TO_CUBE_GENERATOR_PIPELINE',
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
                label: `EquirectangularToCube_face_matrices_uniform`
            });
        }
        const combinedMatrices = new Float32Array(16 * 6);
        faceMatrices.forEach((m, i) => combinedMatrices.set(m, i * 16));
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, combinedMatrices);

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sourceTexture.createView()},
                {binding: 1, resource: this.#sampler.gpuSampler},
                {
                    binding: 2,
                    resource: cubeGPUTexture.createView({
                        dimension: '2d-array',
                        baseMipLevel: 0,
                        mipLevelCount: 1
                    })
                },
                {binding: 3, resource: {buffer: this.#uniformBuffer}}
            ]
        });

        commandEncoderManager.addResourceComputePass({
            label: 'EquirectangularToCube_Generator_Compute_Pass'
        }, (computePass) => {
            computePass.setPipeline(this.#pipeline);
            computePass.setBindGroup(0, bindGroup);
            computePass.dispatchWorkgroups(Math.ceil(size / 8), Math.ceil(size / 8), 6);
        });

        resourceManager.mipmapGenerator.generateMipmap(cubeGPUTexture, textureDesc, true);

        return new DirectCubeTexture(redGPUContext, `CubeMap_From_Equirect_${createUUID()}`, cubeGPUTexture);
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

Object.freeze(EquirectangularToCubeGenerator);
export default EquirectangularToCubeGenerator;
