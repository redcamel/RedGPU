import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import brdfShaderCode from "./brdfShaderCode.wgsl";

/**
 * [KO] BRDF LUT(Look-Up Table)를 생성하는 클래스입니다.
 * [EN] Class that generates BRDF LUT (Look-Up Table).
 *
 * [KO] Split Sum Approximation 기법을 위해 2D BRDF 통합 텍스처를 사전 베이킹합니다.
 * [EN] Pre-bakes a 2D BRDF integration texture for the Split Sum Approximation technique.
 *
 * @category IBL
 */
class BRDFGenerator {
    readonly #redGPUContext: RedGPUContext;
    #brdfShaderModule: GPUShaderModule;
    #pipeline: GPUComputePipeline;
    #brdfLUTTexture: GPUTexture;

    /**
     * [KO] BRDFGenerator 인스턴스를 생성합니다.
     * [EN] Creates a BRDFGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

	/**
	 * [KO] BRDF LUT 텍스처를 반환합니다.
	 * [EN] Returns the BRDF LUT texture.
     *
     * ### Example
     * ```typescript
     * const brdfLUT = redGPUContext.resourceManager.brdfGenerator.brdfLUTTexture;
     * ```
	 */
	get brdfLUTTexture(): GPUTexture {
		if (!this.#brdfLUTTexture) {
			this.#generateBRDFLUT();
		}
		return this.#brdfLUTTexture;
	}

    /**
     * [KO] BRDF LUT를 생성합니다.
     * [EN] Generates the BRDF LUT.
     */
	async #generateBRDFLUT() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const size = 512;
        const format: GPUTextureFormat = 'rgba16float';

        // 텍스처 생성
        this.#brdfLUTTexture = resourceManager.createManagedTexture({
            size: [size, size],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'BRDF_LUT_Texture'
        });

        if (!this.#brdfShaderModule) {
            this.#brdfShaderModule = resourceManager.createGPUShaderModule(
                'BRDF_GENERATOR_SHADER_MODULE',
                {code: brdfShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createComputePipeline({
                label: 'BRDF_GENERATOR_PIPELINE',
                layout: 'auto',
                compute: {
                    module: this.#brdfShaderModule,
                    entryPoint: 'cs_main',
                }
            });
        }

        const commandEncoder = gpuDevice.createCommandEncoder({
            label: 'BRDF_GENERATOR_COMMAND_ENCODER'
        });

        const passEncoder = commandEncoder.beginComputePass({
            label: 'BRDF_GENERATOR_COMPUTE_PASS'
        });

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: this.#brdfLUTTexture.createView()
                }
            ]
        });

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(size / 16), Math.ceil(size / 16));
        passEncoder.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
        await gpuDevice.queue.onSubmittedWorkDone();
    }
}

Object.freeze(BRDFGenerator);
export default BRDFGenerator;
