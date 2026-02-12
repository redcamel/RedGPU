import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(transmittanceShaderCode);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

class TransmittanceGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: TransmittanceLUTTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;
	#uniformBuffer: UniformBuffer;

	readonly width: number = 256;
	readonly height: number = 64;

	earthRadius: number = 6360.0;
	atmosphereHeight: number = 60.0;
	mieExtinction: number = 0.021;
	rayleighScaleHeight: number = 8.0;
	mieScaleHeight: number = 1.2;
	ozoneLayerCenter: number = 25.0;
	ozoneLayerWidth: number = 15.0;
	rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#init();
	}

	get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'TRANS_GEN_UNIFORM_BUFFER');

		const shaderModule = gpuDevice.createShaderModule({ code: transmittanceShaderCode });
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

	render(): void {
		const {gpuDevice} = this.#redGPUContext;

		const {members} = UNIFORM_STRUCT;
		for (const [key, member] of Object.entries(members)) {
			const value = (this as any)[key];
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
