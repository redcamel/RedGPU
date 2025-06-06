import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../resources/sampler/Sampler";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

class ASinglePassPostEffect {
	#computeShader: GPUShaderModule
	#computeBindGroupLayout: GPUBindGroupLayout
	#computeBindGroup: GPUBindGroup
	#computeBindGroupEntries: GPUBindGroupEntry[]
	#computePipeline: GPUComputePipeline
	///
	#uniformBuffer: UniformBuffer
	#uniformInfo
	#storageInfo
	#name
	#SHADER_INFO
	#bindGroupLayout: GPUBindGroupLayout
//
	#outputTexture: GPUTexture[] = []
	#outputTextureView: GPUTextureView[] = []
	#WORK_SIZE_X = 16
	#WORK_SIZE_Y = 16
	#WORK_SIZE_Z = 1
	#previousUseMSAA: boolean
	#redGPUContext:RedGPUContext
	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}

	constructor(redGPUContext:RedGPUContext) {
		this.#redGPUContext = redGPUContext
	}

	get storageInfo() {
		return this.#storageInfo;
	}

	get uniformBuffer(): UniformBuffer {
		return this.#uniformBuffer;
	}

	get uniformInfo() {
		return this.#uniformInfo;
	}

	get WORK_SIZE_X(): number {
		return this.#WORK_SIZE_X;
	}

	set WORK_SIZE_X(value: number) {
		this.#WORK_SIZE_X = value;
	}

	get WORK_SIZE_Y(): number {
		return this.#WORK_SIZE_Y;
	}

	set WORK_SIZE_Y(value: number) {
		this.#WORK_SIZE_Y = value;
	}

	get WORK_SIZE_Z(): number {
		return this.#WORK_SIZE_Z;
	}

	set WORK_SIZE_Z(value: number) {
		this.#WORK_SIZE_Z = value;
	}

	get outputTextureView(): GPUTextureView[] {
		return this.#outputTextureView;
	}

	getOutputTextureView(): GPUTextureView {
		return this.#outputTextureView[this.#outputTextureView.length - 1]
	}

	clear() {
		if (this.#outputTexture) {
			this.#outputTexture.forEach(v => v.destroy())
			this.#outputTexture.length = 0
			this.#outputTextureView.length = 0
		}
	}

	init(redGPUContext: RedGPUContext, name: string, computeCode: string, bindGroupLayout?: GPUBindGroupLayout) {
		this.#name = name
		this.#bindGroupLayout = bindGroupLayout
		const {resourceManager, gpuDevice, useMSAA} = redGPUContext
		this.#computeShader = resourceManager.createGPUShaderModule(
			name,
			{code: computeCode}
		)
		this.#SHADER_INFO = parseWGSL(computeCode)
		const STORAGE_STRUCT = this.#SHADER_INFO.storage;
		const UNIFORM_STRUCT = this.#SHADER_INFO.uniforms.uniforms;
		this.#storageInfo = STORAGE_STRUCT
		// console.log(name, 'UNIFORM_STRUCT', UNIFORM_STRUCT)
		// console.log(name, 'STORAGE_STRUCT', STORAGE_STRUCT)
		if (UNIFORM_STRUCT) {
			this.#uniformInfo = UNIFORM_STRUCT
			const uniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
			this.#uniformBuffer = new UniformBuffer(
				redGPUContext,
				uniformData,
				`${this.constructor.name}_UniformBuffer`,

			)
		}
	}

	execute(gpuDevice: GPUDevice, width: number, height: number) {
		const commentEncode_compute = gpuDevice.createCommandEncoder()
		const computePassEncoder = commentEncode_compute.beginComputePass()
		computePassEncoder.setPipeline(this.#computePipeline)
		computePassEncoder.setBindGroup(0, this.#computeBindGroup)
		computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
		computePassEncoder.end();
		gpuDevice.queue.submit([commentEncode_compute.finish()]);
	}

	render(view: View3D, width: number, height: number, ...sourceTextureView) {
		const dimensionsChanged = this.#createRenderTexture(view)
		const msaaChanged = this.#previousUseMSAA !== view.redGPUContext.useMSAA;
		const targetOutputView = this.getOutputTextureView()
		const {redGPUContext} = view
		const {gpuDevice, useMSAA} = redGPUContext
		if (dimensionsChanged || msaaChanged) {



			this.#computeBindGroupEntries = []
			for (const k in this.#storageInfo) {
				const info = this.#storageInfo[k]
				const {binding, name} = info
				this.#computeBindGroupEntries.push(
					{
						binding: binding,
						resource: name === 'outputTexture' ? targetOutputView : sourceTextureView[binding],
					}
				)
			}
			this.#computeBindGroupEntries.push(
				{
					binding: 2,
					resource: view.viewRenderTextureManager.depthTextureView
				}
			)
			this.#computeBindGroupEntries.push(
				{
					binding: 3,
					resource: new Sampler(redGPUContext).gpuSampler
				}
			)
			if (this.#uniformBuffer) {
				this.#computeBindGroupEntries.push(
					{
						binding: this.#uniformInfo.binding,
						resource: {
							buffer: this.#uniformBuffer.gpuBuffer,
							offset: 0,
							size: this.#uniformBuffer.size
						},
					}
				)
			}
			// console.log(entries)
			// console.log(this.#computeBindGroupLayout)
		}
		if (dimensionsChanged || msaaChanged) {
			this.#computeBindGroupLayout = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_USE_MSAA_${useMSAA}`) ||
				redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_USE_MSAA_${useMSAA}`,
				getComputeBindGroupLayoutDescriptorFromShaderInfo(this.#SHADER_INFO, 0, useMSAA)
			)
			this.#computeBindGroup = gpuDevice.createBindGroup({
				layout: this.#computeBindGroupLayout,
				entries: this.#computeBindGroupEntries
			})
			this.#computePipeline = gpuDevice.createComputePipeline({
				label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
				layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout]}),
				compute: {module: this.#computeShader, entryPoint: 'main',}
			})
		}
		this.update(performance.now())
		this.execute(gpuDevice, width, height)
		this.#previousUseMSAA = view.redGPUContext.useMSAA
		return targetOutputView
	}

	#prevInfo

	update(deltaTime: number) {
	}

	#createRenderTexture(view: View3D): boolean {
		const {redGPUContext, viewRenderTextureManager} = view
		const {colorTexture} = viewRenderTextureManager
		const {gpuDevice} = redGPUContext
		const {width, height} = colorTexture
		const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height
		if (needChange) {
			this.clear()
			const newTexture = gpuDevice.createTexture({
				size: {
					width,
					height,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
			})
			this.#outputTexture.push(newTexture)
			this.#outputTextureView.push(newTexture.createView())
		}
		this.#prevInfo = {
			width,
			height,
		}
		return needChange
	}
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
