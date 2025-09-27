import AntialiasingManager from "../../context/antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import {keepLog} from "../../utils";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import {ASinglePassPostEffectResult} from "../core/ASinglePassPostEffect";
import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class TAA {
	#redGPUContext: RedGPUContext
	#antialiasingManager: AntialiasingManager
	#computeShaderMSAA: GPUShaderModule
	#computeShaderNonMSAA: GPUShaderModule
	#computeBindGroupLayout0: GPUBindGroupLayout
	#computeBindGroupLayout1: GPUBindGroupLayout
	#computePipeline: GPUComputePipeline
	#uniformBuffer: UniformBuffer
	#uniformsInfo: any
	#systemUuniformsInfo: any
	#storageInfo: any
	#name: string
	#SHADER_INFO_MSAA: any
	#SHADER_INFO_NON_MSAA: any
	#prevInfo: any
	#cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map()
	#cachedPipelineLayouts: Map<string, GPUPipelineLayout> = new Map()
	#cachedComputePipelines: Map<string, GPUComputePipeline> = new Map()
	#currentMSAAState: boolean | null = null
	// 스왑 버퍼 구조로 변경
	#currentFrameTexture: GPUTexture
	#currentFrameTextureView: GPUTextureView
	#previousFrameTexture: GPUTexture
	#previousFrameTextureView: GPUTextureView
	#frameBufferBindGroup0: GPUBindGroup
	#frameBufferBindGroup1: GPUBindGroup
	#WORK_SIZE_X = 8
	#WORK_SIZE_Y = 8
	#WORK_SIZE_Z = 1
	#previousSourceTextureReferences: GPUTextureView[] = [];
	#videoMemorySize: number = 0
	#frameIndex: number = 0
	#jitterStrength: number = 0.5;
	#temporalBlendFactor: number = 0.08;
	#varianceClipping: boolean = true;
	// 모션벡터 기반 TAA를 위한 새로운 속성들
	#useMotionVectors: boolean = true;
	#motionBlurReduction: number = 0.8;
	#disocclusionThreshold: number = 0.1;
	#prevMSAA: Boolean
	#prevMSAAID: string

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#antialiasingManager = redGPUContext.antialiasingManager
		const shaderCode = this.#createTAAShaderCode();
		this.#init(
			redGPUContext,
			'POST_EFFECT_TAA',
			{
				msaa: shaderCode.msaa,
				nonMsaa: shaderCode.nonMsaa
			}
		);
		this.temporalBlendFactor = this.#temporalBlendFactor;
		this.jitterStrength = this.#jitterStrength;
		this.varianceClipping = this.#varianceClipping;
		// 모션벡터 관련 초기값 설정
		this.useMotionVectors = this.#useMotionVectors;
		this.motionBlurReduction = this.#motionBlurReduction;
		this.disocclusionThreshold = this.#disocclusionThreshold;
	}

	get frameIndex(): number {
		return this.#frameIndex;
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize
	}

	get currentFrameTextureView(): GPUTextureView {
		return this.#currentFrameTextureView;
	}

	get temporalBlendFactor(): number {
		return this.#temporalBlendFactor;
	}

	set temporalBlendFactor(value: number) {
		validateNumberRange(value, 0.0, 1.0);
		this.#temporalBlendFactor = value;
		this.updateUniform('temporalBlendFactor', value);
	}

	get jitterStrength(): number {
		return this.#jitterStrength;
	}

	set jitterStrength(value: number) {
		validateNumberRange(value, 0.0, 1.0);
		this.#jitterStrength = value;
		this.updateUniform('jitterStrength', value);
	}

	get varianceClipping(): boolean {
		return this.#varianceClipping;
	}

	set varianceClipping(value: boolean) {
		this.#varianceClipping = value;
		this.updateUniform('varianceClipping', value ? 1.0 : 0.0);
	}

	// 모션벡터 관련 getter/setter 추가
	get useMotionVectors(): boolean {
		return this.#useMotionVectors;
	}

	set useMotionVectors(value: boolean) {
		this.#useMotionVectors = value;
		this.updateUniform('useMotionVectors', value ? 1.0 : 0.0);
	}

	get motionBlurReduction(): number {
		return this.#motionBlurReduction;
	}

	set motionBlurReduction(value: number) {
		validateNumberRange(value, 0.0, 1.0);
		this.#motionBlurReduction = value;
		this.updateUniform('motionBlurReduction', value);
	}

	get disocclusionThreshold(): number {
		return this.#disocclusionThreshold;
	}

	set disocclusionThreshold(value: number) {
		validateNumberRange(value, 0.01, 1.0);
		this.#disocclusionThreshold = value;
		this.updateUniform('disocclusionThreshold', value);
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
		const sourceTextureView = sourceTextureInfo.textureView
		const sourceTexture = sourceTextureInfo.texture;
		const {gpuDevice, antialiasingManager} = this.#redGPUContext
		const {useMSAA, msaaID} = antialiasingManager
		this.#frameIndex++;
		if (this.#uniformBuffer) {
			this.updateUniform('frameIndex', this.#frameIndex);
		}
		const dimensionsChanged = this.#createRenderTexture(view)
		const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
		const sourceTextureChanged = this.#detectSourceTextureChange([sourceTextureView]);
		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			this.#createFrameBufferBindGroups(view, [sourceTextureView], useMSAA, this.#redGPUContext, gpuDevice);
		}
		this.#execute(gpuDevice, width, height);
		{
			const commentEncode_compute = gpuDevice.createCommandEncoder({
				label: 'TAA_CopyTexture_CommandEncoder_compute'
			})
			commentEncode_compute.copyTextureToTexture(
				{texture: this.#currentFrameTexture},
				{texture: this.#previousFrameTexture},
				[width, height, 1]
			);
			gpuDevice.queue.submit([commentEncode_compute.finish()]);
		}
		if (this.#frameIndex <= 20 || this.#frameIndex % 60 === 0) {
			console.log(`TAA Frame ${this.#frameIndex}: BuffersSwapped, JitterStrength=${this.#jitterStrength}, MotionVectors=${this.#useMotionVectors}`);
		}
		this.#prevMSAA = useMSAA;
		this.#prevMSAAID = msaaID;
		return {
			texture: this.#currentFrameTexture,
			textureView: this.#currentFrameTextureView
		}
	}

	clear() {
		if (this.#previousFrameTexture) {
			this.#previousFrameTexture.destroy();
			this.#previousFrameTexture = null;
			this.#previousFrameTextureView = null;
		}
		if (this.#currentFrameTexture) {
			this.#currentFrameTexture.destroy();
			this.#currentFrameTexture = null;
			this.#currentFrameTextureView = null;
		}
		this.#cachedBindGroupLayouts.clear();
		this.#cachedPipelineLayouts.clear();
		this.#cachedComputePipelines.clear();
		this.#currentMSAAState = null;
	}

	updateUniform(key: string, value: number | number[] | boolean) {
		this.#uniformBuffer.writeBuffer(this.#uniformsInfo.members[key], value)
	}

	#createTAAShaderCode() {
		const createCode = (useMSAA: boolean) => {
			return `
				${uniformStructCode}
				
				@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(1) var previousFrameTexture : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(2) var motionVectorTexture : texture_2d<f32>;
				
				@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
				${postEffectSystemUniform}
				@group(1) @binding(2) var<uniform> uniforms: Uniforms;
				
				@compute @workgroup_size(${this.#WORK_SIZE_X}, ${this.#WORK_SIZE_Y}, ${this.#WORK_SIZE_Z})
				fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
					${computeCode}
				}
			`;
		};
		return {
			msaa: createCode(true),
			nonMsaa: createCode(false)
		};
	}

	#init(redGPUContext: RedGPUContext, name: string, computeCodes: {
		msaa: string,
		nonMsaa: string
	}) {
		this.#name = name
		const {resourceManager} = redGPUContext
		this.#computeShaderMSAA = resourceManager.createGPUShaderModule(
			`${name}_MSAA`,
			{code: computeCodes.msaa}
		)
		this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(
			`${name}_NonMSAA`,
			{code: computeCodes.nonMsaa}
		)
		this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa)
		this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa)
		const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
		const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;
		this.#storageInfo = STORAGE_STRUCT
		this.#uniformsInfo = UNIFORM_STRUCT.uniforms
		this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms
		if (this.#uniformsInfo) {
			const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength)
			this.#uniformBuffer = new UniformBuffer(
				redGPUContext,
				uniformData,
				`TAA_UniformBuffer`,
			)
		}
	}

	#execute(gpuDevice: GPUDevice, width: number, height: number) {
		const commentEncode_compute = gpuDevice.createCommandEncoder({
			label: 'TAA_Execute_CommandEncoder_compute'
		})
		const computePassEncoder = commentEncode_compute.beginComputePass()
		computePassEncoder.setPipeline(this.#computePipeline)
		computePassEncoder.setBindGroup(0, this.#frameBufferBindGroup0)
		computePassEncoder.setBindGroup(1, this.#frameBufferBindGroup1)
		computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#WORK_SIZE_X), Math.ceil(height / this.#WORK_SIZE_Y));
		computePassEncoder.end();
		gpuDevice.queue.submit([commentEncode_compute.finish()]);
	}

	#createFrameBufferBindGroups(view: View3D, sourceTextureView: GPUTextureView[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const computeBindGroupEntries0: GPUBindGroupEntry[] = []
		const computeBindGroupEntries1: GPUBindGroupEntry[] = []
		computeBindGroupEntries0.push({
			binding: 0,
			resource: sourceTextureView[0],
		});
		computeBindGroupEntries0.push({
			binding: 1,
			resource: this.#previousFrameTextureView,
		});
		// 모션벡터 텍스처 추가
		const motionVectorTextureView = useMSAA ? view.viewRenderTextureManager.gBufferMotionVectorResolveTextureView : view.viewRenderTextureManager.gBufferMotionVectorTextureView;
		computeBindGroupEntries0.push({
			binding: 2,
			resource: motionVectorTextureView,
		});
		computeBindGroupEntries1.push({
			binding: 0,
			resource: this.#currentFrameTextureView,
		});
		if (this.#systemUuniformsInfo) {
			computeBindGroupEntries1.push({
				binding: this.#systemUuniformsInfo.binding,
				resource: {
					buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
					offset: 0,
					size: view.postEffectManager.postEffectSystemUniformBuffer.size
				}
			});
		}
		if (this.#uniformBuffer && this.#uniformsInfo) {
			computeBindGroupEntries1.push({
				binding: this.#uniformsInfo.binding,
				resource: {
					buffer: this.#uniformBuffer.gpuBuffer,
					offset: 0,
					size: this.#uniformBuffer.size
				},
			});
		}
		this.#createBindGroups(computeBindGroupEntries0, computeBindGroupEntries1, useMSAA, redGPUContext, gpuDevice);
		this.#createComputePipeline(useMSAA, redGPUContext, gpuDevice);
	}

	#createBindGroups(entries0: GPUBindGroupEntry[], entries1: GPUBindGroupEntry[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
		const layoutKey0 = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
		const layoutKey1 = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;
		if (!this.#cachedBindGroupLayouts.has(layoutKey0)) {
			const layout0 = redGPUContext.resourceManager.getGPUBindGroupLayout(layoutKey0) ||
				redGPUContext.resourceManager.createBindGroupLayout(layoutKey0,
					getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA)
				);
			this.#cachedBindGroupLayouts.set(layoutKey0, layout0);
		}
		if (!this.#cachedBindGroupLayouts.has(layoutKey1)) {
			const layout1 = redGPUContext.resourceManager.getGPUBindGroupLayout(layoutKey1) ||
				redGPUContext.resourceManager.createBindGroupLayout(layoutKey1,
					getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA)
				);
			this.#cachedBindGroupLayouts.set(layoutKey1, layout1);
		}
		this.#computeBindGroupLayout0 = this.#cachedBindGroupLayouts.get(layoutKey0)!;
		this.#computeBindGroupLayout1 = this.#cachedBindGroupLayouts.get(layoutKey1)!;
		this.#frameBufferBindGroup0 = gpuDevice.createBindGroup({
			label: `${this.#name}_FRAME_BIND_GROUP_0_USE_MSAA_${useMSAA}`,
			layout: this.#computeBindGroupLayout0,
			entries: entries0
		});
		this.#frameBufferBindGroup1 = gpuDevice.createBindGroup({
			label: `${this.#name}_FRAME_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
			layout: this.#computeBindGroupLayout1,
			entries: entries1
		});
	}

	#createComputePipeline(useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const pipelineKey = `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`;
		const pipelineLayoutKey = `${this.#name}_PIPELINE_LAYOUT_USE_MSAA_${useMSAA}`;
		if (this.#currentMSAAState !== useMSAA || !this.#cachedComputePipelines.has(pipelineKey)) {
			if (!this.#cachedPipelineLayouts.has(pipelineLayoutKey)) {
				const pipelineLayout = gpuDevice.createPipelineLayout({
					label: `${this.#name}_PIPELINE_LAYOUT_USE_MSAA_${useMSAA}`,
					bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]
				});
				this.#cachedPipelineLayouts.set(pipelineLayoutKey, pipelineLayout);
			}
			const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;
			const computePipeline = gpuDevice.createComputePipeline({
				label: pipelineKey,
				layout: this.#cachedPipelineLayouts.get(pipelineLayoutKey)!,
				compute: {module: currentShader, entryPoint: 'main'}
			});
			this.#cachedComputePipelines.set(pipelineKey, computePipeline);
			this.#currentMSAAState = useMSAA;
		}
		this.#computePipeline = this.#cachedComputePipelines.get(pipelineKey)!;
	}

	#createRenderTexture(view: View3D): boolean {
		const {redGPUContext, viewRenderTextureManager, name} = view
		const {gBufferColorTexture} = viewRenderTextureManager
		const {resourceManager} = redGPUContext
		const {width, height} = gBufferColorTexture
		const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height ||
			!this.#currentFrameTexture || !this.#previousFrameTexture || !this.#currentFrameTexture;
		if (needChange) {
			keepLog(`TAA 텍스처 재생성: ${width}x${height}, 이전 프레임 히스토리 리셋`);
			this.#frameIndex = 0;
			this.clear();
			console.log(`TAA 프레임 텍스처 초기화 완료: CurrentFrame + PreviousFrame`);
			this.#currentFrameTexture = resourceManager.createManagedTexture({
				size: {width, height},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
				label: `${name}_${this.#name}_currentFrame_${width}x${height}`
			});
			this.#currentFrameTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#currentFrameTexture, {
				dimension: '2d',
				format: 'rgba8unorm',
				label: `${this.#name}_currentFrame_View`
			});
			this.#previousFrameTexture = resourceManager.createManagedTexture({
				size: {width, height},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.COPY_DST,
				label: `${name}_${this.#name}_previousFrame_${width}x${height}`
			});
			this.#previousFrameTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#previousFrameTexture, {
				dimension: '2d',
				format: 'rgba8unorm',
				label: `${this.#name}_previousFrame`
			});
			console.log('TAA 텍스처 생성 완료:', {
				previousFrame: {
					width,
					height,
					format: this.#previousFrameTexture.format,
					usage: this.#previousFrameTexture.usage
				},
				currentFrameTexture: {
					width: this.#currentFrameTexture.width,
					height: this.#currentFrameTexture.height,
					format: this.#currentFrameTexture.format,
					usage: this.#currentFrameTexture.usage
				}
			});
		}
		this.#prevInfo = {
			width,
			height,
		}
		this.#calcVideoMemory()
		return needChange
	}

	#calcVideoMemory() {
		this.#videoMemorySize = 0;
		if (this.#currentFrameTexture) {
			this.#videoMemorySize += calculateTextureByteSize(this.#currentFrameTexture);
		}
		if (this.#previousFrameTexture) {
			this.#videoMemorySize += calculateTextureByteSize(this.#previousFrameTexture);
		}
	}

	#detectSourceTextureChange(sourceTextureView: GPUTextureView[]): boolean {
		if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureView.length) {
			this.#previousSourceTextureReferences = [...sourceTextureView];
			return true;
		}
		for (let i = 0; i < sourceTextureView.length; i++) {
			if (this.#previousSourceTextureReferences[i] !== sourceTextureView[i]) {
				this.#previousSourceTextureReferences = [...sourceTextureView];
				return true;
			}
		}
		return false;
	}
}

Object.freeze(TAA);
export default TAA;
