import AntialiasingManager from "../../context/antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import {keepLog} from "../../utils";
import copyToTextureArray from "../../utils/copyToTextureArray";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import {ASinglePassPostEffectResult} from "../core/ASinglePassPostEffect";
import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class TAA {
	// 기본 WebGPU 관련 필드들
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

	// 캐싱 관련 필드들
	#cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map()
	#cachedPipelineLayouts: Map<string, GPUPipelineLayout> = new Map()
	#cachedComputePipelines: Map<string, GPUComputePipeline> = new Map()
	#currentMSAAState: boolean | null = null

	// 8개 프레임 버퍼 배열 텍스처 관련
	#frameBufferArrayTexture: GPUTexture
	#frameBufferArrayTextureView: GPUTextureView
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

	// TAA 전용 속성들
	#jitterStrength: number = 1.2;
	#temporalBlendFactor: number = 0.95;
	#varianceClipping: boolean = true;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#antialiasingManager = redGPUContext.antialiasingManager

		// 직접 WGSL 코드 생성 (8개 배열 텍스처 사용)
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
	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult):ASinglePassPostEffectResult {
		const currentFrameTextureView = sourceTextureInfo.textureView
		const jitterX = (Math.random() - 0.5) * this.#jitterStrength;
		const jitterY = (Math.random() - 0.5) * this.#jitterStrength;
		view.setJitterOffset(jitterX, jitterY)

		const {gpuDevice, antialiasingManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager

		// 프레임 인덱스 증가를 맨 처음에 수행
		this.#frameIndex++;

		// 현재 슬라이스 인덱스를 한 번만 계산하여 일관성 보장
		const currentSliceIndex = this.#frameIndex % this.#frameBufferCount;

		// uniform 버퍼 업데이트 (이전 프레임 상태 기준)
		if (this.#uniformBuffer) {
			this.updateUniform('frameIndex', this.#frameIndex);
			this.updateUniform('currentFrameSliceIndex', currentSliceIndex);
		}

		// 텍스처 생성 및 바인드 그룹 설정
		const dimensionsChanged = this.#createRenderTexture(view)
		const msaaChanged = antialiasingManager.changedMSAA;
		const sourceTextureChanged = this.#detectSourceTextureChange([currentFrameTextureView]);

		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			this.#createFrameBufferBindGroups(view, [currentFrameTextureView], useMSAA, this.#redGPUContext, gpuDevice);
		}

		// 먼저 TAA 처리 수행 (이전 프레임들 사용)
		this.#execute(gpuDevice, width, height);

		// TAA 처리 완료 후 현재 프레임을 배열에 저장 (다음 프레임을 위해)
		// GPUTextureView에서 GPUTexture를 얻기 위해 currentFrameTextureView의 texture 속성 사용
		// keepLog(currentFrameTextureView)
		const sourceTexture = sourceTextureInfo.texture;
		copyToTextureArray(
			gpuDevice,
			sourceTexture,
			this.#frameBufferArrayTexture,
			currentSliceIndex
		);

		// 디버깅 정보 출력 (개발용)
		if (this.#frameIndex <= 20 || this.#frameIndex % 60 === 0) {
			console.log(`TAA Frame ${this.#frameIndex}: SliceIndex=${currentSliceIndex}, JitterStrength=${this.#jitterStrength}`);
		}

		return {
			texture:this.#outputTexture,
			textureView:this.#outputTextureView
		}
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

		// 바인드 그룹 레이아웃 캐싱
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

		// MSAA 상태가 변경되었거나 캐시에 없는 경우에만 파이프라인 생성
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
			// 크리티컬: 프레임 인덱스 리셋 추가
			keepLog(`TAA 텍스처 재생성: ${width}x${height}, 이전 프레임 히스토리 리셋`);
			this.#frameIndex = 0;

			// 기존 텍스처들 정리
			this.clear();

			// 프레임 버퍼 배열 텍스처 생성 - RENDER_ATTACHMENT 사용권한 추가
			this.#frameBufferArrayTexture = resourceManager.createManagedTexture({
				size: {
					width,
					height,
					depthOrArrayLayers: this.#frameBufferCount
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.COPY_DST |
					GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.RENDER_ATTACHMENT, // 초기화를 위해 추가
				label: `${name}_${this.#name}_FrameBufferArray_${width}x${height}x${this.#frameBufferCount}`
			});

			// 프레임 버퍼 배열을 검은색으로 명시적 초기화
			const {gpuDevice} = redGPUContext;
			const initCommandEncoder = gpuDevice.createCommandEncoder({
				label: `${this.#name}_INIT_FRAME_BUFFER_ARRAY`
			});

			// 각 슬라이스를 개별적으로 초기화
			for (let arrayLayer = 0; arrayLayer < this.#frameBufferCount; arrayLayer++) {
				const sliceView = this.#frameBufferArrayTexture.createView({
					dimension: '2d',
					baseArrayLayer: arrayLayer,
					arrayLayerCount: 1,
					format: 'rgba8unorm',
					label: `${this.#name}_FrameBufferSlice_${arrayLayer}`
				});

				const renderPass = initCommandEncoder.beginRenderPass({
					label: `${this.#name}_INIT_SLICE_${arrayLayer}`,
					colorAttachments: [{
						view: sliceView,
						clearValue: [0.0, 0.0, 0.0, 0.0], // 완전히 검은색
						loadOp: 'clear',
						storeOp: 'store'
					}]
				});
				renderPass.end();
			}

			gpuDevice.queue.submit([initCommandEncoder.finish()]);
			console.log(`TAA 프레임 버퍼 배열 초기화 완료: ${this.#frameBufferCount}개 슬라이스`);

			// 2d-array 뷰 생성 (dimension을 명시적으로 '2d-array'로 설정)
			this.#frameBufferArrayTextureView = this.#frameBufferArrayTexture.createView({
				dimension: '2d-array',
				baseArrayLayer: 0,
				arrayLayerCount: this.#frameBufferCount,
				format: 'rgba8unorm',
				label: `${this.#name}_FrameBufferArray_View`
			});

			// 출력용 단일 텍스처 생성
			this.#outputTexture = resourceManager.createManagedTexture({
				size: {
					width,
					height,
				},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.COPY_SRC,
				label: `${name}_${this.#name}_Output_${width}x${height}`
			});

			// ResourceManager의 캐싱된 뷰 사용
			this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture, {
				dimension: '2d',
				format: 'rgba8unorm',
				label: `${this.#name}_Output_View`
			});

			// 디버깅: 텍스처 생성 확인
			console.log('TAA 텍스처 생성 완료:', {
				frameBufferArray: {
					width,
					height,
					layers: this.#frameBufferCount,
					format: this.#frameBufferArrayTexture.format,
					usage: this.#frameBufferArrayTexture.usage
				},
				outputTexture: {
					width: this.#outputTexture.width,
					height: this.#outputTexture.height,
					format: this.#outputTexture.format,
					usage: this.#outputTexture.usage
				}
			});
		}

		// 이전 정보 업데이트
		this.#prevInfo = {
			width,
			height,
		}

		// 비디오 메모리 계산
		this.#calcVideoMemory()

		return needChange
	}

	clear() {
		if (this.#frameBufferArrayTexture) {
			this.#frameBufferArrayTexture.destroy();
			this.#frameBufferArrayTexture = null;
			this.#frameBufferArrayTextureView = null;
		}
		if (this.#outputTexture) {
			this.#outputTexture.destroy();
			this.#outputTexture = null;
			this.#outputTextureView = null;
		}

		// 캐시 정리
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
		// keepLog(key,value)
		this.#uniformBuffer.writeBuffer(this.#uniformsInfo.members[key], value)
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

	get jitterStrength(): number {
		return this.#jitterStrength;
	}

	set jitterStrength(value: number) {
		validateNumberRange(value, 0.0, 10.0);
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
