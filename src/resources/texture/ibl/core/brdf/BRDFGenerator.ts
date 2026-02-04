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
    #pipeline: GPURenderPipeline;
    #brdfLUTTexture: GPUTexture;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

	/**
	 * [KO] BRDF LUT 텍스처를 반환합니다.
	 * [EN] Returns the BRDF LUT texture.
	 */
	get brdfLUTTexture(): GPUTexture {
		if (!this.#brdfLUTTexture) {
			this.#generateBRDFLUT();
		}
		return this.#brdfLUTTexture;
	}

	async #generateBRDFLUT() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const size = 512;
        const format: GPUTextureFormat = 'rgba16float';

        // 텍스처 생성
        this.#brdfLUTTexture = resourceManager.createManagedTexture({
            size: [size, size],
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'BRDF_LUT_Texture'
        });

        if (!this.#brdfShaderModule) {
            this.#brdfShaderModule = resourceManager.createGPUShaderModule(
                'BRDF_GENERATOR_SHADER_MODULE',
                {code: brdfShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createRenderPipeline({
                label: 'BRDF_GENERATOR_PIPELINE',
                layout: 'auto',
                vertex: {
                    module: this.#brdfShaderModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: this.#brdfShaderModule,
                    entryPoint: 'fs_main',
                    targets: [{format}],
                }
            });
        }

        const commandEncoder = gpuDevice.createCommandEncoder({
            label: 'BRDF_GENERATOR_COMMAND_ENCODER'
        });

        const passEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.#brdfLUTTexture.createView(),
                clearValue: {r: 0, g: 0, b: 0, a: 1},
                loadOp: GPU_LOAD_OP.CLEAR,
                storeOp: GPU_STORE_OP.STORE
            }],
            label: 'BRDF_GENERATOR_RENDER_PASS'
        });

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
        await gpuDevice.queue.onSubmittedWorkDone();
    }
}

Object.freeze(BRDFGenerator);
export default BRDFGenerator;
