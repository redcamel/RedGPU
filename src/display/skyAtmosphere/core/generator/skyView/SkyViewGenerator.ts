import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import SkyViewLUTTexture from "./SkyViewLUTTexture";
import skyViewShaderCode from "./skyViewShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "../multiScattering/MultiScatteringLUTTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(skyViewShaderCode);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

class SkyViewGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: SkyViewLUTTexture;
	#pipeline: GPUComputePipeline;
	#uniformBuffer: UniformBuffer;
	#sampler: Sampler;

	readonly width: number = 512;
	readonly height: number = 512;

	earthRadius: number = 6360.0;
	atmosphereHeight: number = 60.0;
	mieScattering: number = 0.021;
	mieExtinction: number = 0.021;
	rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	mieAnisotropy: number = 0.8;
	rayleighScaleHeight: number = 8.0;
	mieScaleHeight: number = 1.2;
	cameraHeight: number = 0.2;
	multiScatteringAmbient: number = 0.05;
	ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];
	ozoneLayerCenter: number = 25.0;
	ozoneLayerWidth: number = 15.0;
	sunDirection: [number, number, number] = [0, 1, 0];

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, { magFilter: 'linear', minFilter: 'linear' });
		this.#init();
	}

	get lutTexture(): SkyViewLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new SkyViewLUTTexture(this.#redGPUContext, this.width, this.height);

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'SKY_VIEW_GEN_UNIFORM_BUFFER');

		const shaderModule = gpuDevice.createShaderModule({ code: skyViewShaderCode });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});
	}

	render(transmittance: TransmittanceLUTTexture, multiScat: MultiScatteringLUTTexture): void {
		const {gpuDevice} = this.#redGPUContext;

		const {members} = UNIFORM_STRUCT;
		for (const [key, member] of Object.entries(members)) {
			const value = (this as any)[key];
			if (value !== undefined) this.#uniformBuffer.writeOnlyBuffer(member, value);
		}

		const bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#lutTexture.gpuTextureView },
				{ binding: 1, resource: transmittance.gpuTextureView },
				{ binding: 2, resource: multiScat.gpuTextureView },
				{ binding: 3, resource: this.#sampler.gpuSampler },
				{ binding: 4, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
			]
		});

		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, bindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		this.#lutTexture.notifyUpdate();
	}
}

export default SkyViewGenerator;
