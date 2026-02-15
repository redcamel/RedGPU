import RedGPUContext from "../../../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + transmittanceShaderCode);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

/**
 * [KO] 대기 투과율(Transmittance) LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating Atmospheric Transmittance LUT.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class TransmittanceGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: TransmittanceLUTTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;
	#uniformBuffer: UniformBuffer;

	/** [KO] 텍스처 가로 크기 [EN] Texture width */
	readonly width: number = 256;
	/** [KO] 텍스처 세로 크기 [EN] Texture height */
	readonly height: number = 64;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#init();
	}

	/** [KO] 생성된 LUT 텍스처를 반환합니다. [EN] Returns the generated LUT texture. */
	get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'TRANS_GEN_UNIFORM_BUFFER');

		const shaderModule = gpuDevice.createShaderModule({ code: SHADER_INFO.defaultSource });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});

		this.#bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#lutTexture.gpuTextureView },
				{ binding: 1, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
			]
		});
	}

	/**
	 * [KO] 투과율 LUT를 렌더링합니다.
	 * [EN] Renders the Transmittance LUT.
	 *
	 * @param params - [KO] 대기 파라미터 [EN] Atmosphere parameters
	 */
	render(params: any): void {
		const {gpuDevice} = this.#redGPUContext;

		const {members} = UNIFORM_STRUCT;
		for (const [key, member] of Object.entries(members)) {
			const value = params[key];
			if (value !== undefined) this.#uniformBuffer.writeOnlyBuffer(member, value);
		}

		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, this.#bindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		this.#lutTexture.notifyUpdate();
	}
}

export default TransmittanceGenerator;
