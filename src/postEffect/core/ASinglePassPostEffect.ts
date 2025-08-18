import AntialiasingManager from "../../context/antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";

class ASinglePassPostEffect {
	#computeShaderMSAA: GPUShaderModule
	#computeShaderNonMSAA: GPUShaderModule
	#computeBindGroupLayout0: GPUBindGroupLayout
	#computeBindGroupLayout1: GPUBindGroupLayout
	#computeBindGroup0: GPUBindGroup
	#computeBindGroup1: GPUBindGroup
	#computeBindGroupEntries0: GPUBindGroupEntry[]
	#computeBindGroupEntries1: GPUBindGroupEntry[]
	#computePipeline: GPUComputePipeline
	///
	#uniformBuffer: UniformBuffer
	#uniformsInfo
	#systemUuniformsInfo
	#storageInfo
	#name
	#SHADER_INFO_MSAA
	#SHADER_INFO_NON_MSAA
	#prevInfo
//
	#outputTexture: GPUTexture[] = []
	#outputTextureView: GPUTextureView[] = []
	#WORK_SIZE_X = 16
	#WORK_SIZE_Y = 16
	#WORK_SIZE_Z = 1
	#useDepthTexture: boolean = false
	#redGPUContext: RedGPUContext
	#antialiasingManager: AntialiasingManager
	#previousSourceTextureReferences: GPUTextureView[] = [];
	#videoMemorySize: number = 0

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#antialiasingManager = redGPUContext.antialiasingManager
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize
	}

	get useDepthTexture(): boolean {
		return this.#useDepthTexture;
	}

	set useDepthTexture(value: boolean) {
		this.#useDepthTexture = value;
	}

	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}

	get storageInfo() {
		return this.#storageInfo
	}

	get shaderInfo() {
		const useMSAA = this.#antialiasingManager.useMSAA;
		return useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
	}

	get uniformBuffer(): UniformBuffer {
		return this.#uniformBuffer;
	}

	get uniformsInfo
	() {
		return this.#uniformsInfo
	}

	get systemUuniformsInfo
	() {
		return this.#systemUuniformsInfo
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

	init(redGPUContext: RedGPUContext, name: string, computeCodes: {
		msaa: string,
		nonMsaa: string
	}, bindGroupLayout?: GPUBindGroupLayout) {
		this.#name = name
		// this.#bindGroupLayout = bindGroupLayout
		const {resourceManager,} = redGPUContext
		// MSAA 셰이더 생성
		this.#computeShaderMSAA = resourceManager.createGPUShaderModule(
			`${name}_MSAA`,
			{code: computeCodes.msaa}
		)
		// Non-MSAA 셰이더 생성
		this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(
			`${name}_NonMSAA`,
			{code: computeCodes.nonMsaa}
		)
		// SHADER_INFO 파싱
		this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa)
		this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa)
		// console.log('MSAA Shader Code:', computeCodes.msaa);
		// console.log('Non-MSAA Shader Code:', computeCodes.nonMsaa);
		// MSAA 정보 저장
		const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
		const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;
		this.#storageInfo = STORAGE_STRUCT
		this.#uniformsInfo = UNIFORM_STRUCT.uniforms
		this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms
		// UniformBuffer는 구조가 동일하므로 하나만 생성 (Non-MSAA 기준)
		if (this.#uniformsInfo) {
			const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength)
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
		computePassEncoder.setBindGroup(0, this.#computeBindGroup0)
		computePassEncoder.setBindGroup(1, this.#computeBindGroup1)
		computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
		computePassEncoder.end();
		gpuDevice.queue.submit([commentEncode_compute.finish()]);
	}

	render(view: View3D, width: number, height: number, ...sourceTextureView) {
		const {gpuDevice, antialiasingManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager
		const dimensionsChanged = this.#createRenderTexture(view)
		const msaaChanged = antialiasingManager.changedMSAA;
		// 소스 텍스처 변경 감지
		const sourceTextureChanged = this.#detectSourceTextureChange(sourceTextureView);
		const targetOutputView = this.getOutputTextureView()
		const {redGPUContext} = view
		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			const currentStorageInfo = this.storageInfo;
			const currentUniformsInfo = this.uniformsInfo
			const currentSystemUniformsInfo = this.systemUuniformsInfo
			;
			this.#computeBindGroupEntries0 = []
			this.#computeBindGroupEntries1 = []
			// Group 0: source textures (outputTexture 제외)
			// keepLog('info', this.#SHADER_INFO_MSAA)
			// keepLog('info', this.#SHADER_INFO_MSAA.uniforms.systemUniforms)
			// keepLog('info', currentUniformsInfo)
			for (const k in currentStorageInfo) {
				const info = currentStorageInfo[k]
				const {binding, name} = info
				// keepLog('info', name, binding, info, sourceTextureView)
				if (name !== 'outputTexture') {
					this.#computeBindGroupEntries0.push(
						{
							binding: binding,
							resource: sourceTextureView[binding],
						}
					)
				}
			}
			// Group 1: output texture
			this.#computeBindGroupEntries1.push({
				binding: 0,
				resource: targetOutputView,
			})
			// Group 0에 추가 리소스들 (depth, sampler, uniform)
			this.shaderInfo.textures.forEach(texture => {
				const {name, binding} = texture
				if (name === "depthTexture") {
					this.#computeBindGroupEntries0.push({
						binding: binding,
						resource: view.viewRenderTextureManager.depthTextureView
					})
				}
				if (name === "gBufferNormalTexture") {
					this.#computeBindGroupEntries0.push({
						binding: binding,
						resource: view.redGPUContext.antialiasingManager.useMSAA ? view.viewRenderTextureManager.gBufferNormalResolveTextureView : view.viewRenderTextureManager.gBufferNormalTextureView
					})
				}
			})
			// keepLog('info this.#computeBindGroupEntries0', this.#computeBindGroupEntries0, this.#computeBindGroupEntries1)
			// uniform buffer는 마지막에 추가
			if (currentSystemUniformsInfo) {
				this.#computeBindGroupEntries1.push(
					{
						binding: currentSystemUniformsInfo.binding,
						resource: {
							buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
							offset: 0,
							size: view.postEffectManager.postEffectSystemUniformBuffer.size
						}
					}
				)
			}
			if (this.#uniformBuffer && currentUniformsInfo) {
				this.#computeBindGroupEntries1.push({
					binding: currentUniformsInfo.binding,
					resource: {
						buffer: this.#uniformBuffer.gpuBuffer,
						offset: 0,
						size: this.#uniformBuffer.size
					},
				})
			}
		}
		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
			const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;
			this.#computeBindGroupLayout0 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`) ||
				redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`,
					getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA)
				)
			this.#computeBindGroupLayout1 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`) ||
				redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`,
					getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA)
				)
			console.log('this.#computeBindGroupLayout0 ', this.#computeBindGroupLayout0, this.#computeBindGroupEntries0)
			console.log('this.#computeBindGroupLayout1 ', this.#computeBindGroupLayout1, this.#computeBindGroupEntries1)
			this.#computeBindGroup0 = gpuDevice.createBindGroup({
				label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}`,
				layout: this.#computeBindGroupLayout0,
				entries: this.#computeBindGroupEntries0
			})
			this.#computeBindGroup1 = gpuDevice.createBindGroup({
				label: `${this.#name}_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
				layout: this.#computeBindGroupLayout1,
				entries: this.#computeBindGroupEntries1
			})
			this.#computePipeline = gpuDevice.createComputePipeline({
				label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
				layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]}),
				compute: {module: currentShader, entryPoint: 'main',}
			})
			// 소스 텍스처 참조 저장
			this.#saveCurrentSourceTextureReferences(sourceTextureView);
		}
		this.update(performance.now())
		this.execute(gpuDevice, width, height)
		return targetOutputView
	}

	update(deltaTime: number) {
	}

	updateUniform(key: string, value: number | number[] | boolean) {
		this.uniformBuffer.writeBuffer(this.uniformsInfo
			.members[key], value)
	}

	#calcVideoMemory() {
		this.#videoMemorySize = 0
		this.#outputTexture.forEach(texture => {
			this.#videoMemorySize += calculateTextureByteSize(texture)
		})
	}

	#detectSourceTextureChange(sourceTextureView: GPUTextureView[]): boolean {
		if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureView.length) {
			return true;
		}
		for (let i = 0; i < sourceTextureView.length; i++) {
			if (this.#previousSourceTextureReferences[i] !== sourceTextureView[i]) {
				return true;
			}
		}
		return false;
	}

	#saveCurrentSourceTextureReferences(sourceTextureView: GPUTextureView[]) {
		this.#previousSourceTextureReferences = [...sourceTextureView];
	}

	#createRenderTexture(view: View3D): boolean {
		const {redGPUContext, viewRenderTextureManager, name} = view
		const {colorTexture} = viewRenderTextureManager
		const {gpuDevice, resourceManager} = redGPUContext
		const {width, height} = colorTexture
		const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height || this.#outputTexture.length === 0;
		if (needChange) {
			this.clear()
			const newTexture = resourceManager.createManagedTexture({
				size: {
					width,
					height,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
				label: `${name}_${this.#name}_${width}x${height}}`
			})
			this.#outputTexture.push(newTexture)
			this.#outputTextureView.push(resourceManager.getGPUResourceBitmapTextureView(newTexture))
		}
		this.#prevInfo = {
			width,
			height,
		}
		this.#calcVideoMemory()
		return needChange
	}
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
