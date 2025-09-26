import RedGPUContext from "../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import {keepLog} from "../../../utils";
import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/math/getMipLevelCount";
import ManagementResourceBase from "../../ManagementResourceBase";
import ResourceManager from "../../resourceManager/ResourceManager";
import ResourceStateHDRTexture from "../../resourceManager/resourceState/texture/ResourceStateHDRTexture";
import Sampler from "../../sampler/Sampler";
import CubeTexture from "../CubeTexture";
import generateCubeMapFromEquirectangularCode from "./generateCubeMapFromEquirectangularCode.wgsl"
import HDRLoader, {HDRData} from "./HDRLoader";
import {float32ToFloat16WithToneMapping} from "./tone/float32ToFloat16WithToneMapping";
import {float32ToUint8WithToneMapping} from "./tone/float32ToUint8WithToneMapping";

const MANAGED_STATE_KEY = 'managedHDRTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

interface LuminanceAnalysis {
	averageLuminance: number;
	maxLuminance: number;
	minLuminance: number;
	medianLuminance: number;
	percentile95: number;
	percentile99: number;
	recommendedExposure: number;
}

/**
 * HDRTexture 클래스
 * 지원 형식: .hdr (Radiance HDR/RGBE) 형식만 지원
 */
class HDRTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture
	#src: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#videoMemorySize: number = 0
	#cubeMapSize: number = 1024
	#hdrLoader: HDRLoader = new HDRLoader()
	#format: GPUTextureFormat
	#exposure: number = 1.0
	#recommendedExposure: number = 1.0
	#luminanceAnalysis: LuminanceAnalysis
	#onLoad: (textureInstance: HDRTexture) => void;
	#onError: (error: Error) => void;
	#isCubeMapInitialized: boolean = false;
	#exposureUpdateTimeout: number | null = null;

	constructor(
		redGPUContext: RedGPUContext,
		src: SrcInfo,
		onLoad?: (textureInstance?: HDRTexture) => void,
		onError?: (error: Error) => void,
		cubeMapSize: number = 1024,
		useMipMap: boolean = true,
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		// this.#format = 'rgba8unorm'
		this.#format = 'rgba16float'
		this.#cubeMapSize = cubeMapSize
		this.useMipmap = useMipMap
		if (src) {
			const parsedSrc = this.#getParsedSrc(src)
			this.#validateHDRFormat(parsedSrc);
			this.#src = parsedSrc;
			this.cacheKey = this.#getCacheKey(src)
			const {table} = this.targetResourceManagedState
			// keepLog(table)
			let target: ResourceStateHDRTexture = table.get(this.cacheKey)
			if (target) {
				// keepLog('cache target', target)
				const targetTexture = target.texture
				this.#onLoad?.(targetTexture)
				return targetTexture
			} else {
				this.src = src;
				this.#registerResource()
			}
		}
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	get mipLevelCount(): number {
		return this.#mipLevelCount;
	}

	get src(): string {
		return this.#src;
	}

	set src(value: SrcInfo) {
		const newSrc = this.#getParsedSrc(value)
		this.#validateHDRFormat(newSrc);
		this.#src = newSrc;
		this.cacheKey = this.#getCacheKey(value);
		this.#isCubeMapInitialized = false;
		if (this.#src) this.#loadHDRTexture(this.#src);
	}

	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	set useMipmap(value: boolean) {
		if (this.#useMipmap !== value) {
			this.#useMipmap = value;
			this.#mipLevelCount = this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1
			this.#isCubeMapInitialized = false;
			this.#createGPUTexture();
		}
	}

	get exposure(): number {
		return this.#exposure;
	}

	set exposure(value: number) {
		const newExposure = Math.max(0.01, Math.min(20.0, value));
		if (this.#exposure === newExposure) return;
		this.#exposure = newExposure;
		if (this.#exposureUpdateTimeout) {
			clearTimeout(this.#exposureUpdateTimeout);
		}
		this.#exposureUpdateTimeout = setTimeout(() => {
			if (this.#hdrData) {
				if (this.#isCubeMapInitialized && this.#gpuTexture) {
					this.#updateCubeMapContent();
				} else {
					this.#createGPUTexture();
				}
			}
			this.#exposureUpdateTimeout = null;
		}, 50);
	}

	get recommendedExposure(): number {
		return this.#recommendedExposure;
	}

	get luminanceAnalysis(): LuminanceAnalysis {
		return this.#luminanceAnalysis;
	}

	get viewDescriptor() {
		return {
			...CubeTexture.defaultViewDescriptor,
			mipLevelCount: this.#mipLevelCount
		}
	}

	/**
	 * 지원되는 HDR 형식 확인
	 */
	static isSupportedFormat(src: string): boolean {
		if (!src || typeof src !== 'string') return false;
		return src.toLowerCase().endsWith('.hdr');
	}

	/**
	 * 지원되는 형식 목록 반환
	 */
	static getSupportedFormats(): string[] {
		return ['.hdr'];
	}

	resetToRecommendedExposure(): void {
		this.exposure = this.#recommendedExposure;
	}

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.#isCubeMapInitialized = false;
		this.__fireListenerList(true)
		this.#luminanceAnalysis = null
		this.#unregisterResource()
		this.#src = null
		this.cacheKey = null
		if (temp) temp.destroy()
	}

	#getCacheKey(srcInfo?: SrcInfo): string {
		let result
		if (!srcInfo) result = this.uuid;
		if (typeof srcInfo === 'string') {
			result = getAbsoluteURL(window.location.href, srcInfo);
		} else {
			result = srcInfo.cacheKey || getAbsoluteURL(window.location.href, srcInfo.src);
		}
		return `HDRTexture_${result}`
	}

	#getParsedSrc(srcInfo?: SrcInfo): string {
		return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
	}

	/**
	 * HDR 파일 형식 검증 (.hdr 형식만 허용)
	 */
	#validateHDRFormat(src: string): void {
		if (!src || typeof src !== 'string') {
			throw new Error('HDR 파일 경로가 필요합니다');
		}
		// 쿼리 파라미터와 해시를 제거한 후 확장자 검사
		const cleanSrc = src.split('?')[0].split('#')[0].toLowerCase();
		if (!cleanSrc.endsWith('.hdr')) {
			throw new Error(`지원되지 않는 형식입니다. .hdr 형식만 지원됩니다. 입력된 파일: ${src}`);
		}
	}

	async #loadHDRTexture(src: string) {
		try {
			console.log('HDR 텍스처 로딩 시작 (.hdr 형식):', src);
			const hdrData = await this.#hdrLoader.loadHDRFile(src);
			this.#hdrData = hdrData;
			this.#recommendedExposure = hdrData.recommendedExposure || 1.0;
			this.#exposure = this.#recommendedExposure;
			if (hdrData.luminanceStats) {
				this.#luminanceAnalysis = {
					averageLuminance: hdrData.luminanceStats.average,
					maxLuminance: hdrData.luminanceStats.max,
					minLuminance: hdrData.luminanceStats.min,
					medianLuminance: hdrData.luminanceStats.median,
					percentile95: hdrData.luminanceStats.max * 0.95,
					percentile99: hdrData.luminanceStats.max * 0.99,
					recommendedExposure: this.#recommendedExposure
				};
				keepLog('휘도 분석 완료:', this.#luminanceAnalysis);
			}
			keepLog(`HDR 데이터 로드 완료: ${hdrData.width}x${hdrData.height}, 권장 노출: ${this.#recommendedExposure.toFixed(3)}, 현재 노출: ${this.#exposure.toFixed(3)}`);
			await this.#createGPUTexture();
			this.#onLoad?.(this);
		} catch (error) {
			console.error('HDR loading error (.hdr 형식):', error);
			this.#onError?.(error);
		}
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) {
			this.#hdrData = null
			this.#isCubeMapInitialized = false;
		}
		this.__fireListenerList();
	}

	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateHDRTexture(this));
	}

	#unregisterResource() {
		this.redGPUContext.resourceManager.unregisterManagementResource(this);
	}

	async #createGPUTexture() {
		const {gpuDevice, resourceManager} = this.redGPUContext
		if (this.#isCubeMapInitialized && this.#gpuTexture) {
			await this.#updateCubeMapContent();
			return;
		}
		await gpuDevice.queue.onSubmittedWorkDone();
		const oldTexture = this.#gpuTexture;
		this.#gpuTexture = null;
		const cubeDescriptor: GPUTextureDescriptor = {
			size: [this.#cubeMapSize, this.#cubeMapSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
			mipLevelCount: this.#mipLevelCount,
			dimension: '2d',
			label: `${this.#src}_cubemap_exp${this.#exposure.toFixed(2)}`
		};
		const newGPUTexture = resourceManager.createManagedTexture(cubeDescriptor);
		this.#setGpuTexture(newGPUTexture);
		this.#mipLevelCount = cubeDescriptor.mipLevelCount || 1
		await this.#updateCubeMapContent();
		this.#isCubeMapInitialized = true;
		if (oldTexture) {
			await gpuDevice.queue.onSubmittedWorkDone();
			oldTexture.destroy();
		}
		console.log(`HDR 큐브맵 텍스처 생성 완료: ${this.#cubeMapSize}x${this.#cubeMapSize}x6, 밉맵: ${this.#mipLevelCount}레벨, 노출: ${this.#exposure.toFixed(3)}`);
	}

	async #updateCubeMapContent() {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const {mipmapGenerator} = resourceManager;
		if (!this.#gpuTexture) {
			console.warn('큐브맵 텍스처가 없어 업데이트를 건너뜁니다.');
			return;
		}
		if (!this.#hdrData) {
			// console.warn('HDR 데이터가 없어 업데이트를 건너뜁니다.');
			return;
		}
		console.log(`HDR 큐브맵 내용 업데이트 시작 (노출: ${this.#exposure.toFixed(3)})`);
		const {width: W, height: H} = this.#hdrData
		const tempTextureDescriptor: GPUTextureDescriptor = {
			size: [W, H],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: `${this.#src}_temp_exp${this.#exposure.toFixed(2)}`
		};
		const tempTexture = await this.#hdrDataToGPUTexture(gpuDevice, resourceManager, this.#hdrData, tempTextureDescriptor);
		await this.#generateCubeMapFromEquirectangular(tempTexture);
		tempTexture.destroy();
		if (this.#useMipmap) {
			console.log('HDR 큐브맵 밉맵 재생성 중...');
			mipmapGenerator.generateMipmap(this.#gpuTexture, {
				size: [this.#cubeMapSize, this.#cubeMapSize, 6],
				format: this.#format,
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
				mipLevelCount: this.#mipLevelCount,
				dimension: '2d'
			});
			// keepLog(this.#gpuTexture)
			console.log('HDR 큐브맵 밉맵 재생성 완료');
		}
		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
		this.#videoMemorySize = 0
		this.#videoMemorySize = calculateTextureByteSize(this.#gpuTexture)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize
		console.log(`HDR 큐브맵 내용 업데이트 완료 (노출: ${this.#exposure.toFixed(3)})`);
	}

	async #generateCubeMapFromEquirectangular(sourceTexture: GPUTexture) {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const shaderModule = gpuDevice.createShaderModule({
			code: generateCubeMapFromEquirectangularCode
		});
		const renderPipeline = gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: shaderModule,
				entryPoint: 'vs_main'
			},
			fragment: {
				module: shaderModule,
				entryPoint: 'fs_main',
				targets: [{format: this.#format}]
			},
		});
		const sampler = new Sampler(this.redGPUContext, {
			magFilter: GPU_FILTER_MODE.LINEAR,
			minFilter: GPU_FILTER_MODE.LINEAR,
			mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
		})
		const faceMatrices = this.#getCubeMapFaceMatrices();
		for (let face = 0; face < 6; face++) {
			await this.#renderCubeMapFace(renderPipeline, sampler, face, faceMatrices[face], sourceTexture);
		}
	}

	async #float32ToFloat16WithToneMapping(float32Data: Float32Array): Promise<Uint16Array> {
		const result = await float32ToFloat16WithToneMapping(
			this.redGPUContext,
			float32Data,
			{
				exposure: this.#exposure,
				width: this.#hdrData.width,
				height: this.#hdrData.height,
				workgroupSize: [8, 8]
			}
		);
		return result.data;
	}

	async #hdrDataToGPUTexture(device: GPUDevice, resourceManager: ResourceManager, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): Promise<GPUTexture> {
		// const texture = resourceManager.createManagedTexture(textureDescriptor);
		const texture = device.createTexture(textureDescriptor);
		let bytesPerPixel: number;
		let uploadData: ArrayBuffer;
		switch (this.#format) {
			case 'rgba16float':
				bytesPerPixel = 8;
				const float16Data = await this.#float32ToFloat16WithToneMapping(hdrData.data);
				uploadData = float16Data.buffer as ArrayBuffer;
				break;
			case 'rgba8unorm':
				bytesPerPixel = 4;
				const uint8Data = await this.#float32ToUint8WithToneMapping(hdrData.data);
				uploadData = uint8Data.buffer as ArrayBuffer;
				break;
			default:
				throw new Error(`지원되지 않는 텍스처 포맷: ${this.#format}`);
		}
		console.log(`HDR 텍스처 포맷: ${this.#format}, 노출값: ${this.#exposure.toFixed(3)}`);
		console.log(`바이트/픽셀: ${bytesPerPixel}`);
		console.log(`업로드 데이터 크기: ${uploadData.byteLength} bytes`);
		console.log(`예상 크기: ${hdrData.width * hdrData.height * bytesPerPixel} bytes`);
		device.queue.writeTexture(
			{texture},
			uploadData,
			{
				bytesPerRow: hdrData.width * bytesPerPixel,
				rowsPerImage: hdrData.height
			},
			{width: hdrData.width, height: hdrData.height}
		);
		return texture;
	}

	async #float32ToUint8WithToneMapping(float32Data: Float32Array): Promise<Uint8Array> {
		const result = await float32ToUint8WithToneMapping(
			this.redGPUContext,
			float32Data,
			{
				exposure: this.#exposure,
				width: this.#hdrData.width,
				height: this.#hdrData.height,
				workgroupSize: [8, 8]
			}
		);
		return result.data;
	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		return [
			new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]),
			new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
		];
	}

	async #renderCubeMapFace(renderPipeline: GPURenderPipeline, sampler: Sampler, face: number, faceMatrix: Float32Array, sourceTexture: GPUTexture) {
		const {gpuDevice} = this.redGPUContext;
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `hdr_face_${face}_uniform`
		});
		gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix);
		const bindGroup = gpuDevice.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: sourceTexture.createView()},
				{binding: 1, resource: sampler.gpuSampler},
				{binding: 2, resource: {buffer: uniformBuffer}}
			]
		});
		const commandEncoder = gpuDevice.createCommandEncoder();
		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: this.#gpuTexture.createView({
					dimension: '2d',
					baseMipLevel: 0,
					mipLevelCount: 1,
					baseArrayLayer: face,
					arrayLayerCount: 1
				}),
				clearValue: {r: 0, g: 0, b: 0, a: 0},
				loadOp: 'clear',
				storeOp: 'store'
			}]
		});
		renderPass.setPipeline(renderPipeline);
		renderPass.setBindGroup(0, bindGroup);
		renderPass.draw(6, 1, 0, 0);
		renderPass.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		uniformBuffer.destroy();
	}
}

Object.freeze(HDRTexture)
export default HDRTexture
