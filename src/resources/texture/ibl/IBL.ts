import RedGPUContext from "../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import createUUID from "../../../utils/createUUID";
import Sampler from "../../sampler/Sampler";
import CubeTexture from "../CubeTexture";
import HDRTexture from "../hdr/HDRTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl"

class IBL {
	#redGPUContext: RedGPUContext
	#sourceCubeTexture: GPUTexture
	//
	#environmentTexture: CubeTexture;
	#irradianceTexture: CubeTexture;
	#iblTexture: CubeTexture
	#prefilterMap: GPUTexture; //TODO - 일단없어도되니 나중에
	#brdfLUT: GPUTexture; //TODO - 일단없어도되니 나중에
	#uuid = createUUID()
	#format: GPUTextureFormat = 'rgba8unorm'
	#targetTexture: HDRTexture | CubeTexture
	#envCubeSize: number
	#iblCubeSize: number

	constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string],
	            envCubeSize: number = 1024, iblCubeSize: number = 512) {
		this.#iblCubeSize = iblCubeSize
		this.#envCubeSize = envCubeSize
		this.#redGPUContext = redGPUContext
		this.#environmentTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		this.#iblTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		this.#irradianceTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		if (typeof srcInfo === 'string') {
			this.#targetTexture = new HDRTexture(
				redGPUContext,
				srcInfo,
				(v: HDRTexture) => {
					this.#sourceCubeTexture = v.gpuTexture
					this.#init()
				},
				undefined,
				envCubeSize,
				true
			);
		} else {
			this.#targetTexture = new CubeTexture(
				redGPUContext,
				srcInfo,
				true,
				(v: CubeTexture) => {
					this.#sourceCubeTexture = v.gpuTexture
					this.#init()
				}
			);
		}
	}

	get exposure(): number {
		if (this.#targetTexture instanceof HDRTexture) return this.#targetTexture.exposure
	}

	set exposure(value) {
		validatePositiveNumberRange(value)
		if (this.#targetTexture instanceof HDRTexture) {
			this.#targetTexture.exposure = value
		}
	}

	get envCubeSize(): number {
		return this.#envCubeSize;
	}

	get iblCubeSize(): number {
		return this.#iblCubeSize;
	}

	get irradianceTexture(): CubeTexture {
		return this.#irradianceTexture;
	}

	get environmentTexture(): CubeTexture {
		return this.#environmentTexture;
	}

	get iblTexture(): CubeTexture {
		return this.#iblTexture;
	}

	async #init() {
		console.log('sourceCubeTexture', this.#sourceCubeTexture)
		const {downSampleCubeMapGenerator} = this.#redGPUContext.resourceManager
		const iblTexture = await downSampleCubeMapGenerator.downsampleCubemap(this.#sourceCubeTexture, this.#iblCubeSize)
		this.#iblTexture.setGPUTextureDirectly(iblTexture, `${this.#uuid}_iblTexture`)
		this.#environmentTexture.setGPUTextureDirectly(this.#sourceCubeTexture, `${this.#uuid}_environmentTexture`)
		const irradianceGPUTexture = await this.#generateIrradianceMap(this.#sourceCubeTexture);
		this.#irradianceTexture.setGPUTextureDirectly(irradianceGPUTexture, `${this.#uuid}_irradianceTexture`, false);
	}

	async #generateIrradianceMap(sourceCubeTexture: GPUTexture): Promise<GPUTexture> {
		const {gpuDevice,resourceManager} = this.#redGPUContext;
		const irradianceSize = 32;
		const irradianceMipLevels = 1;
		const irradianceTexture = resourceManager.createManagedTexture({
			size: [irradianceSize, irradianceSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: irradianceMipLevels,
			label: `IBL_${this.#uuid}_irradianceTexture`
		});
		const irradianceShader = gpuDevice.createShaderModule({
			code: irradianceShaderCode
		});
		const irradiancePipeline = gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: irradianceShader,
				entryPoint: 'vs_main'
			},
			fragment: {
				module: irradianceShader,
				entryPoint: 'fs_main',
				targets: [{format: this.#format}]
			},
		});
		const sampler = new Sampler(this.#redGPUContext, {
			magFilter: GPU_FILTER_MODE.LINEAR,
			minFilter: GPU_FILTER_MODE.LINEAR,
			mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
		});
		const faceMatrices = this.#getCubeMapFaceMatrices();
		// ✅ 각 면을 개별적으로 렌더링
		for (let face = 0; face < 6; face++) {
			await this.#renderIrradianceFace(irradiancePipeline, sampler, face, faceMatrices[face], sourceCubeTexture, irradianceTexture);
		}
		console.log(`Irradiance Map 생성 완료: ${irradianceSize}x${irradianceSize}`);
		return irradianceTexture;
	}

	async #renderIrradianceFace(renderPipeline: GPURenderPipeline, sampler: Sampler, face: number, faceMatrix: Float32Array, sourceCubeTexture: GPUTexture, irradianceTexture: GPUTexture): Promise<void> {
		const {gpuDevice} = this.#redGPUContext;
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `irradiance_face_${face}_uniform`
		});
		gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix);
		const bindGroup = gpuDevice.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
				{binding: 1, resource: sampler.gpuSampler},
				{binding: 2, resource: {buffer: uniformBuffer}}
			]
		});
		const commandEncoder = gpuDevice.createCommandEncoder({
			label: `ibl_irradiance_face_${face}_encoder`
		});
		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: irradianceTexture.createView({
					dimension: '2d',
					baseMipLevel: 0,
					mipLevelCount: 1,
					baseArrayLayer: face,
					arrayLayerCount: 1
				}),
				clearValue: {r: 0, g: 0, b: 0, a: 1},
				loadOp: 'clear',
				storeOp: 'store'
			}],
			label: `irradiance_face_${face}_renderpass`
		});
		renderPass.setPipeline(renderPipeline);
		renderPass.setBindGroup(0, bindGroup);
		renderPass.draw(6, 1, 0, 0);
		renderPass.end();
		gpuDevice.queue.submit([commandEncoder.finish()])
		uniformBuffer.destroy();
	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		return [
			// +X (Right)
			new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
			// -X (Left)
			new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
			// +Y (Top)
			new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
			// -Y (Bottom)
			new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
			// +Z (Front)
			new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]),
			// -Z (Back)
			new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
		];
	}
}

Object.freeze(IBL)
export default IBL;
