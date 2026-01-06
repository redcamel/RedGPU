import AntialiasingManager from "../../context/core/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import { getComputeBindGroupLayoutDescriptorFromShaderInfo } from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import { keepLog } from "../../utils";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";

export type ASinglePassPostEffectResult = {
	texture: GPUTexture;
	textureView: GPUTextureView;
};

/**
 * 단일 패스 후처리 이펙트(ASinglePassPostEffect) 추상 클래스
 * 한 번의 compute 패스로 동작하는 후처리 이펙트의 기반이 됩니다.
 */
abstract class ASinglePassPostEffect {
	// --- Compute Pipeline & Shader ---
	#computeShaderMSAA: GPUShaderModule;
	#computeShaderNonMSAA: GPUShaderModule;
	#computePipeline: GPUComputePipeline;

	// --- Bind Groups ---
	#computeBindGroupLayout0: GPUBindGroupLayout;
	#computeBindGroupLayout1: GPUBindGroupLayout;
	#computeBindGroup0List_swap0: GPUBindGroup;
	#computeBindGroup0List_swap1: GPUBindGroup;
	#computeBindGroup1: GPUBindGroup;
	#computeBindGroupEntries0_swap0: GPUBindGroupEntry[];
	#computeBindGroupEntries0_swap1: GPUBindGroupEntry[];
	#computeBindGroupEntries1: GPUBindGroupEntry[];

	// --- Uniforms & Info ---
	#uniformBuffer: UniformBuffer;
	#uniformsInfo: any;
	#systemUuniformsInfo: any;
	#storageInfo: any;
	#name: string;
	#SHADER_INFO_MSAA: any;
	#SHADER_INFO_NON_MSAA: any;
	#prevInfo: { width: number; height: number };

	// --- Output Resources ---
	#outputTexture: GPUTexture;
	#outputTextureView: GPUTextureView;
	#videoMemorySize: number = 0;

	// --- Settings & State ---
	#WORK_SIZE_X = 16;
	#WORK_SIZE_Y = 16;
	#WORK_SIZE_Z = 1;
	#useDepthTexture: boolean = false;
	#useGBufferNormalTexture: boolean = false;
	#redGPUContext: RedGPUContext;
	#antialiasingManager: AntialiasingManager;
	#previousSourceTextureReferences: ASinglePassPostEffectResult[] = [];
	#prevMSAA: boolean;
	#prevMSAAID: string;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#antialiasingManager = redGPUContext.antialiasingManager;
	}

	// --- Getters & Setters ---
	get useGBufferNormalTexture(): boolean { return this.#useGBufferNormalTexture; }
	set useGBufferNormalTexture(value: boolean) { this.#useGBufferNormalTexture = value; }

	get useDepthTexture(): boolean { return this.#useDepthTexture; }
	set useDepthTexture(value: boolean) { this.#useDepthTexture = value; }

	get videoMemorySize(): number { return this.#videoMemorySize; }
	get redGPUContext(): RedGPUContext { return this.#redGPUContext; }
	get storageInfo() { return this.#storageInfo; }
	get uniformBuffer(): UniformBuffer { return this.#uniformBuffer; }
	get uniformsInfo() { return this.#uniformsInfo; }
	get systemUuniformsInfo() { return this.#systemUuniformsInfo; }
	get outputTextureView(): GPUTextureView { return this.#outputTextureView; }

	get shaderInfo() {
		keepLog(this);
		const useMSAA = this.#antialiasingManager.useMSAA;
		return useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
	}

	get WORK_SIZE_X(): number { return this.#WORK_SIZE_X; }
	set WORK_SIZE_X(value: number) { this.#WORK_SIZE_X = value; }
	get WORK_SIZE_Y(): number { return this.#WORK_SIZE_Y; }
	set WORK_SIZE_Y(value: number) { this.#WORK_SIZE_Y = value; }
	get WORK_SIZE_Z(): number { return this.#WORK_SIZE_Z; }
	set WORK_SIZE_Z(value: number) { this.#WORK_SIZE_Z = value; }

	// --- Public Methods ---

	/**
	 * 이펙트 초기화: 셰이더 생성 및 메타데이터 파싱
	 */
	init(redGPUContext: RedGPUContext, name: string, computeCodes: { msaa: string; nonMsaa: string }) {
		this.#name = name;
		const { resourceManager } = redGPUContext;

		// 셰이더 모듈 생성
		this.#computeShaderMSAA = resourceManager.createGPUShaderModule(`${name}_MSAA`, { code: computeCodes.msaa });
		this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(`${name}_NonMSAA`, { code: computeCodes.nonMsaa });

		// WGSL 파싱 및 정보 추출
		this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa);
		this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa);

		const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
		const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;

		this.#storageInfo = STORAGE_STRUCT;
		this.#uniformsInfo = UNIFORM_STRUCT.uniforms;
		this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms;

		// 유니폼 버퍼 생성
		if (this.#uniformsInfo) {
			const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
			this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
		}
	}

	/**
	 * 매 프레임 렌더링 호출
	 */
	render(view: View3D, width: number, height: number, ...sourceTextureInfo: ASinglePassPostEffectResult[]): ASinglePassPostEffectResult {
		const { gpuDevice, antialiasingManager } = this.#redGPUContext;
		const { useMSAA, msaaID } = antialiasingManager;

		// 변경사항 감지
		const dimensionsChanged = this.#createRenderTexture(view);
		const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
		const sourceTextureChanged = this.#detectSourceTextureChange(sourceTextureInfo);

		const targetOutputView = this.outputTextureView;
		const { redGPUContext } = view;

		// 리소스 재구성이 필요한 경우
		if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
			this.#createBindGroups(view, sourceTextureInfo, targetOutputView, useMSAA, redGPUContext, gpuDevice);
		}

		this.update(performance.now());
		this.execute(view, gpuDevice, width, height);

		this.#prevMSAA = useMSAA;
		this.#prevMSAAID = msaaID;

		return {
			texture: this.#outputTexture,
			textureView: targetOutputView,
		};
	}

	execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number) {
		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'ASinglePassPostEffect_Execute_CommandEncoder' });
		const computePassEncoder = commandEncoder.beginComputePass();

		computePassEncoder.setPipeline(this.#computePipeline);

		// 뷰의 스왑 인덱스에 따라 바인드 그룹 설정
		const bindGroup0 = view.renderViewStateData.swapBufferIndex ? this.#computeBindGroup0List_swap1 : this.#computeBindGroup0List_swap0;
		computePassEncoder.setBindGroup(0, bindGroup0);
		computePassEncoder.setBindGroup(1, this.#computeBindGroup1);

		computePassEncoder.dispatchWorkgroups(
			Math.ceil(width / this.WORK_SIZE_X),
			Math.ceil(height / this.WORK_SIZE_Y)
		);

		computePassEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	update(deltaTime: number) { /* 서브클래스에서 구현 */ }

	updateUniform(key: string, value: number | number[] | boolean) {
		this.uniformBuffer.writeOnlyBuffer(this.uniformsInfo.members[key], value);
	}

	clear() {
		if (this.#outputTexture) {
			this.#outputTexture.destroy();
			this.#outputTexture = null;
			this.#outputTextureView = null;
		}
	}

	// --- Private Methods ---

	#createBindGroups(view: View3D, sourceTextureInfoList: ASinglePassPostEffectResult[], targetOutputView: GPUTextureView, useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
		const currentStorageInfo = this.storageInfo;
		const currentUniformsInfo = this.uniformsInfo;
		const currentSystemUniformsInfo = this.systemUuniformsInfo;

		this.#computeBindGroupEntries0_swap0 = [];
		this.#computeBindGroupEntries0_swap1 = [];
		this.#computeBindGroupEntries1 = [];

		// Group 0: Source Textures
		for (const k in currentStorageInfo) {
			const { binding, name } = currentStorageInfo[k];
			if (name !== 'outputTexture') {
				const resource = { binding, resource: sourceTextureInfoList[binding].textureView };
				this.#computeBindGroupEntries0_swap0.push(resource);
				this.#computeBindGroupEntries0_swap1.push(resource);
			}
		}

		// Group 1: Output Texture
		this.#computeBindGroupEntries1.push({ binding: 0, resource: targetOutputView });

		// 추가 텍스처 리소스 (Depth, GBuffer 등)
		this.shaderInfo.textures.forEach(texture => {
			const { name, binding } = texture;
			if (name === "depthTexture") {
				this.#computeBindGroupEntries0_swap0.push({ binding, resource: view.viewRenderTextureManager.depthTextureView });
				this.#computeBindGroupEntries0_swap1.push({ binding, resource: view.viewRenderTextureManager.prevDepthTextureView });
			}
			if (name === "gBufferNormalTexture") {
				const normalView = view.redGPUContext.antialiasingManager.useMSAA
					? view.viewRenderTextureManager.gBufferNormalResolveTextureView
					: view.viewRenderTextureManager.gBufferNormalTextureView;
				this.#computeBindGroupEntries0_swap0.push({ binding, resource: normalView });
				this.#computeBindGroupEntries0_swap1.push({ binding, resource: normalView });
			}
		});

		// Uniform Buffers
		if (currentSystemUniformsInfo) {
			this.#computeBindGroupEntries1.push({
				binding: currentSystemUniformsInfo.binding,
				resource: {
					buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
					offset: 0,
					size: view.postEffectManager.postEffectSystemUniformBuffer.size
				}
			});
		}

		if (this.#uniformBuffer && currentUniformsInfo) {
			this.#computeBindGroupEntries1.push({
				binding: currentUniformsInfo.binding,
				resource: {
					buffer: this.#uniformBuffer.gpuBuffer,
					offset: 0,
					size: this.#uniformBuffer.size
				},
			});
		}

		// 레이아웃 및 파이프라인 생성
		const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
		const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;

		this.#computeBindGroupLayout0 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`) ||
			redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`,
				getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA)
			);

		this.#computeBindGroupLayout1 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`) ||
			redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`,
				getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA)
			);

		this.#computeBindGroup0List_swap0 = gpuDevice.createBindGroup({
			label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP0`,
			layout: this.#computeBindGroupLayout0,
			entries: this.#computeBindGroupEntries0_swap0
		});

		this.#computeBindGroup0List_swap1 = gpuDevice.createBindGroup({
			label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP1`,
			layout: this.#computeBindGroupLayout0,
			entries: this.#computeBindGroupEntries0_swap1
		});

		this.#computeBindGroup1 = gpuDevice.createBindGroup({
			label: `${this.#name}_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
			layout: this.#computeBindGroupLayout1,
			entries: this.#computeBindGroupEntries1
		});

		this.#computePipeline = gpuDevice.createComputePipeline({
			label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
			layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1] }),
			compute: { module: currentShader, entryPoint: 'main' }
		});

		this.#saveCurrentSourceTextureReferences(sourceTextureInfoList);
	}

	#createRenderTexture(view: View3D): boolean {
		const { redGPUContext, viewRenderTextureManager, name } = view;
		const { gBufferColorTexture } = viewRenderTextureManager;
		const { resourceManager } = redGPUContext;
		const { width, height } = gBufferColorTexture;

		const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height || !this.#outputTexture;

		if (needChange) {
			this.clear();
			this.#outputTexture = resourceManager.createManagedTexture({
				size: { width, height },
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
				label: `${name}_${this.#name}_${width}x${height}}`
			});
			this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture);
		}

		this.#prevInfo = { width, height };
		this.#calcVideoMemory();
		return needChange;
	}

	#detectSourceTextureChange(sourceTextureInfoList: ASinglePassPostEffectResult[]): boolean {
		if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureInfoList.length) return true;
		for (let i = 0; i < sourceTextureInfoList.length; i++) {
			if (this.#previousSourceTextureReferences[i].textureView !== sourceTextureInfoList[i].textureView) return true;
		}
		return false;
	}

	#saveCurrentSourceTextureReferences(sourceTextureInfoList: ASinglePassPostEffectResult[]) {
		this.#previousSourceTextureReferences = [...sourceTextureInfoList];
	}

	#calcVideoMemory() {
		this.#videoMemorySize = this.#outputTexture ? calculateTextureByteSize(this.#outputTexture) : 0;
	}
}

Object.freeze(ASinglePassPostEffect);
export default ASinglePassPostEffect;
