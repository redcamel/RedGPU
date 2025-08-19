import AntialiasingManager from "../../context/antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class TAA {
	// 🎯 기본 WebGPU 관련 필드들
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

	// 🎯 캐싱 관련 필드들
	#cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map()
	#cachedPipelineLayouts: Map<string, GPUPipelineLayout> = new Map()
	#cachedComputePipelines: Map<string, GPUComputePipeline> = new Map()
	#currentMSAAState: boolean | null = null

	// 🎯 8개 프레임 버퍼 배열 텍스처 관련
	#frameBufferArrayTexture: GPUTexture
	#frameBufferArrayTextureView: GPUTextureView
	#frameBufferSliceViews: GPUTextureView[] = []
	#outputTextureView: GPUTextureView
	#outputTexture: GPUTexture
	#frameBufferBindGroup0: GPUBindGroup
	#frameBufferBindGroup1: GPUBindGroup
	#frameBufferCount: number = 8 // TAA는 8개 사용
	#WORK_SIZE_X = 8
	#WORK_SIZE_Y = 8
	#WORK_SIZE_Z = 1
	#previousSourceTextureReferences: GPUTextureView[] = [];
	#videoMemorySize: number = 0
	#frameIndex: number = 0

	// 🎯 TAA 전용 속성들
	#temporalBlendFactor: number = 0.95;
	#motionThreshold: number = 0.01;
	#colorBoxSize: number = 1.0;
	#jitterStrength: number = 0.5;
	#varianceClipping: boolean = true;
	#jitterSequence: number[][] = this.#generateHaltonSequence(64);

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#antialiasingManager = redGPUContext.antialiasingManager

		// 🎯 직접 WGSL 코드 생성 (8개 배열 텍스처 사용)
		const shaderCode = this.#createTAAShaderCode();

		this.#init(
			redGPUContext,
			'POST_EFFECT_TAA',
			{
				msaa: shaderCode.msaa,
				nonMsaa: shaderCode.nonMsaa
			}
		);

		// 초기값 설정
		this.temporalBlendFactor = this.#temporalBlendFactor;
		this.motionThreshold = this.#motionThreshold;
		this.colorBoxSize = this.#colorBoxSize;
		this.jitterStrength = this.#jitterStrength;
		this.varianceClipping = this.#varianceClipping;
	}

	#createTAAShaderCode() {
		const createCode = (useMSAA: boolean) => {
			return `
				${uniformStructCode}
				
				@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(1) var frameBufferArray : texture_2d_array<f32>;
				
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

		// MSAA/Non-MSAA 셰이더 생성
		this.#computeShaderMSAA = resourceManager.createGPUShaderModule(
			`${name}_MSAA`,
			{code: computeCodes.msaa}
		)
		this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(
			`${name}_NonMSAA`,
			{code: computeCodes.nonMsaa}
		)

		// SHADER_INFO 파싱
		this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa)
		this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa)

		// 셰이더 정보 저장
		const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
		const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;
		this.#storageInfo = STORAGE_STRUCT
		this.#uniformsInfo = UNIFORM_STRUCT.uniforms
		this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms

		// UniformBuffer 생성
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
		const commentEncode_compute = gpuDevice.createCommandEncoder()
		const computePassEncoder = commentEncode_compute.beginComputePass()
		computePassEncoder.setPipeline(this.#computePipeline)

		computePassEncoder.setBindGroup(0, this.#frameBufferBindGroup0)
		computePassEncoder.setBindGroup(1, this.#frameBufferBindGroup1)

		computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#WORK_SIZE_X), Math.ceil(height / this.#WORK_SIZE_Y));
		computePassEncoder.end();
		gpuDevice.queue.submit([commentEncode_compute.finish()]);
	}

	// TAA용 render 메서드
	render(view: View3D, width: number, height: number, currentFrameTextureView: GPUTextureView) {
		const {gpuDevice, antialiasingManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager
		this.#frameIndex++;
		const jitter = this.currentJitter;

		// 지터 값을 uniform 버퍼에 업데이트
		if (this.#uniformBuffer) {
			this.updateUniform('currentJitterX', jitter[0]);
			this.updateUniform('currentJitterY', jitter[1]);
			this.updateUniform('frameIndex', this.#frameIndex);
			this.updateUniform('currentFrameSliceIndex', this.#frameIndex % 8);
		}

		// 텍스처 생성 및 바인드 그룹 설정
		const dimensionsChanged = this.#createRenderTexture(view)
		const msaaChanged = antialiasingManager.changedMSAA;
		const sourceTextureChanged = this.#detectSourceTextureChange([currentFrameTextureView]);

		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			this.#createFrameBufferBindGroups(view, [currentFrameTextureView], useMSAA, this.#redGPUContext, gpuDevice);
		}

		// 실행
		this.#execute(gpuDevice, width, height)

		// 🎯 프레임 완료 후 현재 프레임의 결과를 텍스처 배열에 복사
		this.#copyCurrentFrameToArray(gpuDevice);

		return this.#outputTextureView
	}

	/**
	 * 현재 프레임 결과를 8개 배열 텍스처의 해당 슬라이스에 복사
	 */
	#copyCurrentFrameToArray(gpuDevice: GPUDevice) {
		const currentSliceIndex = this.#frameIndex % this.#frameBufferCount;

		const commandEncoder = gpuDevice.createCommandEncoder();
		commandEncoder.copyTextureToTexture(
			{ texture: this.#outputTexture },
			{
				texture: this.#frameBufferArrayTexture,
				origin: { x: 0, y: 0, z: currentSliceIndex }
			},
			{
				width: this.#outputTexture.width,
				height: this.#outputTexture.height,
				depthOrArrayLayers: 1
			}
		);
		gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	#createFrameBufferBindGroups(view: View3D, sourceTextureView: GPUTextureView[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const computeBindGroupEntries0: GPUBindGroupEntry[] = []
		const computeBindGroupEntries1: GPUBindGroupEntry[] = []

		// Group 0: sourceTexture (binding 0) + frameBufferArray (binding 1)
		computeBindGroupEntries0.push({
			binding: 0, // sourceTexture
			resource: sourceTextureView[0],
		});

		computeBindGroupEntries0.push({
			binding: 1, // frameBufferArray - 8개 배열 텍스처
			resource: this.#frameBufferArrayTextureView,
		});

		// Group 1: output texture + uniforms
		computeBindGroupEntries1.push({
			binding: 0,
			resource: this.#outputTextureView,
		});

		// system uniform buffer 바인딩
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

		// TAA uniform buffer 바인딩
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

		// 바인드 그룹 생성
		this.#createBindGroups(computeBindGroupEntries0, computeBindGroupEntries1, useMSAA, redGPUContext, gpuDevice);

		// 파이프라인 생성
		this.#createComputePipeline(useMSAA, redGPUContext, gpuDevice);
	}

	#createBindGroups(entries0: GPUBindGroupEntry[], entries1: GPUBindGroupEntry[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
		const layoutKey0 = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
		const layoutKey1 = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;

		// 🎯 바인드 그룹 레이아웃 캐싱
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

		// 캐시에서 바인드 그룹 레이아웃 가져오기
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

		// 🎯 MSAA 상태가 변경되었거나 캐시에 없는 경우에만 파이프라인 생성
		if (this.#currentMSAAState !== useMSAA || !this.#cachedComputePipelines.has(pipelineKey)) {

			// 파이프라인 레이아웃 캐싱
			if (!this.#cachedPipelineLayouts.has(pipelineLayoutKey)) {
				const pipelineLayout = gpuDevice.createPipelineLayout({
					label: `${this.#name}_PIPELINE_LAYOUT_USE_MSAA_${useMSAA}`,
					bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]
				});
				this.#cachedPipelineLayouts.set(pipelineLayoutKey, pipelineLayout);
			}

			// 컴퓨트 파이프라인 생성 및 캐싱
			const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;
			const computePipeline = gpuDevice.createComputePipeline({
				label: pipelineKey,
				layout: this.#cachedPipelineLayouts.get(pipelineLayoutKey)!,
				compute: { module: currentShader, entryPoint: 'main' }
			});

			this.#cachedComputePipelines.set(pipelineKey, computePipeline);
			this.#currentMSAAState = useMSAA;
		}

		// 캐시에서 파이프라인 가져오기
		this.#computePipeline = this.#cachedComputePipelines.get(pipelineKey)!;
	}

	#createRenderTexture(view: View3D): boolean {
		const {redGPUContext, viewRenderTextureManager, name} = view
		const {gBufferColorTexture} = viewRenderTextureManager
		const {resourceManager} = redGPUContext
		const {width, height} = gBufferColorTexture
		const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height ||
			!this.#frameBufferArrayTexture || !this.#outputTexture;

		if (needChange) {
			// 기존 텍스처들 정리
			this.clear();

			// 🎯 8개 프레임 버퍼 텍스처 배열 생성
			this.#frameBufferArrayTexture = resourceManager.createManagedTexture({
				size: {
					width,
					height,
					depthOrArrayLayers: this.#frameBufferCount
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING,
				label: `${name}_${this.#name}_FrameBufferArray_${width}x${height}x${this.#frameBufferCount}`
			});

			// 🎯 2d-array 뷰 생성 (dimension을 명시적으로 '2d-array'로 설정)
			this.#frameBufferArrayTextureView = this.#frameBufferArrayTexture.createView({
				dimension: '2d-array',
				baseArrayLayer: 0,
				arrayLayerCount: this.#frameBufferCount,
			});

			// 각 슬라이스별 뷰 생성
			this.#frameBufferSliceViews = [];
			for (let i = 0; i < this.#frameBufferCount; i++) {
				const sliceView = this.#frameBufferArrayTexture.createView({
					dimension: '2d',
					baseArrayLayer: i,
					arrayLayerCount: 1,
				});
				this.#frameBufferSliceViews.push(sliceView);
			}

			// 출력용 단일 텍스처 생성
			this.#outputTexture = resourceManager.createManagedTexture({
				size: {
					width,
					height,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
				label: `${name}_${this.#name}_Output_${width}x${height}`
			});
			this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture);
		}

		this.#prevInfo = {
			width,
			height,
		}
		this.#calcVideoMemory()
		return needChange
	}

	clear() {
		if (this.#frameBufferArrayTexture) {
			this.#frameBufferArrayTexture.destroy();
			this.#frameBufferArrayTexture = null;
			this.#frameBufferArrayTextureView = null;
			this.#frameBufferSliceViews.length = 0;
		}
		if (this.#outputTexture) {
			this.#outputTexture.destroy();
			this.#outputTexture = null;
			this.#outputTextureView = null;
		}

		// 🎯 캐시 정리
		this.#cachedBindGroupLayouts.clear();
		this.#cachedPipelineLayouts.clear();
		this.#cachedComputePipelines.clear();
		this.#currentMSAAState = null;
	}

	#calcVideoMemory() {
		this.#videoMemorySize = 0;
		if (this.#frameBufferArrayTexture) {
			this.#videoMemorySize += calculateTextureByteSize(this.#frameBufferArrayTexture);
		}
		if (this.#outputTexture) {
			this.#videoMemorySize += calculateTextureByteSize(this.#outputTexture);
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

	updateUniform(key: string, value: number | number[] | boolean) {
		this.#uniformBuffer.writeBuffer(this.#uniformsInfo.members[key], value)
	}

	// Halton 시퀀스 생성 (지터링용)
	#generateHaltonSequence(count: number): number[][] {
		const sequence: number[][] = [];

		const halton = (index: number, base: number): number => {
			let result = 0;
			let fraction = 1;
			let i = index;

			while (i > 0) {
				fraction /= base;
				result += (i % base) * fraction;
				i = Math.floor(i / base);
			}

			return result;
		};

		for (let i = 0; i < count; i++) {
			const x = halton(i + 1, 2) * 2 - 1; // -1 to 1
			const y = halton(i + 1, 3) * 2 - 1; // -1 to 1
			sequence.push([x, y]);
		}

		return sequence;
	}

	get currentJitter(): number[] {
		const jitterIndex = this.#frameIndex % this.#jitterSequence.length;
		return this.#jitterSequence[jitterIndex].map(v => v * this.#jitterStrength);
	}

	get frameIndex(): number {
		return this.#frameIndex;
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize
	}

	get outputTextureView(): GPUTextureView {
		return this.#outputTextureView;
	}

	// Getter/Setter들
	get temporalBlendFactor(): number {
		return this.#temporalBlendFactor;
	}

	set temporalBlendFactor(value: number) {
		validateNumberRange(value, 0.0, 1.0);
		this.#temporalBlendFactor = value;
		this.updateUniform('temporalBlendFactor', value);
	}

	get motionThreshold(): number {
		return this.#motionThreshold;
	}

	set motionThreshold(value: number) {
		validatePositiveNumberRange(value, 0.001, 1.0);
		this.#motionThreshold = value;
		this.updateUniform('motionThreshold', value);
	}

	get colorBoxSize(): number {
		return this.#colorBoxSize;
	}

	set colorBoxSize(value: number) {
		validatePositiveNumberRange(value, 0.1, 5.0);
		this.#colorBoxSize = value;
		this.updateUniform('colorBoxSize', value);
	}

	get jitterStrength(): number {
		return this.#jitterStrength;
	}

	set jitterStrength(value: number) {
		validateNumberRange(value, 0.0, 2.0);
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
}

Object.freeze(TAA);
export default TAA;
