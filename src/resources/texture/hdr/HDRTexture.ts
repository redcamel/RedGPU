import RedGPUContext from "../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import {keepLog} from "../../../utils";
import calculateTextureByteSize from "../../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/math/getMipLevelCount";
import ManagedResourceBase from "../../ManagedResourceBase";
import basicRegisterResource from "../../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../../resourceManager/core/basicUnregisterResource";
import ResourceStateHDRTexture from "../../resourceManager/resourceState/ResourceStateHDRTexture";
import Sampler from "../../sampler/Sampler";
import {float32ToUint8WithToneMapping} from "./tone/float32ToUint8WithToneMapping";
import generateCubeMapFromEquirectangularCode from "./generateCubeMapFromEquirectangularCode.wgsl"
import HDRLoader, {HDRData} from "./HDRLoader";

const MANAGED_STATE_KEY = 'managedHDRTextureState'

interface LuminanceAnalysis {
	averageLuminance: number;
	maxLuminance: number;
	minLuminance: number;
	medianLuminance: number;
	percentile95: number;
	percentile99: number;
	recommendedExposure: number;
}

class HDRTexture extends ManagedResourceBase {
	#gpuTexture: GPUTexture // 큐브맵만 유지
	#src: string
	#cacheKey: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#videoMemorySize: number = 0
	#cubeMapSize: number = 1024
	#hdrLoader: HDRLoader = new HDRLoader()
	#format: GPUTextureFormat
	#exposure: number = 1.0 // 현재 사용자가 설정한 노출값
	#recommendedExposure: number = 1.0 // 자동 계산된 권장 노출값 (별도 저장)
	#luminanceAnalysis: LuminanceAnalysis
	#onLoad: (textureInstance: HDRTexture) => void;
	#onError: (error: Error) => void;

	constructor(
		redGPUContext: RedGPUContext,
		src?: any,
		onLoad?: (textureInstance?: HDRTexture) => void,
		onError?: (error: Error) => void,
		cubeMapSize: number = 1024,
		useMipMap: boolean = true,
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#useMipmap = useMipMap
		this.#format = 'rgba8unorm'
		this.#cubeMapSize = cubeMapSize
		if (src) {
			this.#src = src?.src || src;
			this.#cacheKey = src?.cacheKey || src || this.uuid;
			const {table} = this.targetResourceManagedState
			let target: ResourceStateHDRTexture
			for (const k in table) {
				if (table[k].cacheKey === this.#cacheKey) {
					target = table[k]
					break
				}
			}
			if (target) {
				const targetTexture = table[target.uuid].texture
				this.#onLoad?.(targetTexture)
				return targetTexture
			} else {
				this.src = src;
				this.#registerResource()
			}
		}
	}

	get cacheKey(): string {
		return this.#cacheKey;
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

	set src(value: string | any) {
		this.#src = value?.src || value;
		this.#cacheKey = value?.cacheKey || value || this.uuid;
		if (this.#src) this.#loadHDRTexture(this.#src);
	}

	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	set useMipmap(value: boolean) {
		this.#useMipmap = value;
		this.#createGPUTexture()
	}

	// 🎯 현재 노출값 (사용자가 설정 가능)
	get exposure(): number {
		return this.#exposure;
	}

	#exposureUpdateTimeout: number | null = null;

	set exposure(value: number) {
		const newExposure = Math.max(0.01, Math.min(20.0, value));
		this.#exposure = newExposure;
		if (this.#exposureUpdateTimeout) {
			clearTimeout(this.#exposureUpdateTimeout);
		}
		this.#exposureUpdateTimeout = setTimeout(() => {
			if (this.#hdrData) {
				this.#createGPUTexture();
			}
			this.#exposureUpdateTimeout = null;
		}, 50);
	}

	// 🔍 자동 계산된 권장 노출값 (읽기 전용)
	get recommendedExposure(): number {
		return this.#recommendedExposure;
	}

	// 🔍 휘도 분석 결과 (읽기 전용)
	get luminanceAnalysis(): LuminanceAnalysis {
		return this.#luminanceAnalysis;
	}

	// 🎯 권장 노출값으로 리셋
	resetToRecommendedExposure(): void {
		this.exposure = this.#recommendedExposure;
	}

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#src = null
		this.#cacheKey = null
		this.#luminanceAnalysis = null
		this.#unregisterResource()
		if (temp) temp.destroy()
	}

	async #loadHDRTexture(src: string) {
		try {
			console.log('HDR 텍스처 로딩 시작:', src);
			// 🎯 HDRLoader에서 원본 데이터와 분석 결과 받기
			const hdrData = await this.#hdrLoader.loadHDRFile(src);
			// 원본 데이터 저장
			this.#hdrData = hdrData;
			// 권장 노출값 저장 (자동 계산된 값)
			this.#recommendedExposure = hdrData.recommendedExposure || 1.0;
			// 초기 노출값을 권장값으로 설정
			this.#exposure = this.#recommendedExposure;
			// 🆕 휘도 분석 결과 사용
			if (hdrData.luminanceStats) {
				this.#luminanceAnalysis = {
					averageLuminance: hdrData.luminanceStats.average,
					maxLuminance: hdrData.luminanceStats.max,
					minLuminance: hdrData.luminanceStats.min,
					medianLuminance: hdrData.luminanceStats.median,
					percentile95: hdrData.luminanceStats.max * 0.95, // 근사
					percentile99: hdrData.luminanceStats.max * 0.99, // 근사
					recommendedExposure: this.#recommendedExposure
				};
				keepLog('휘도 분석 완료:', this.#luminanceAnalysis);
			}
			keepLog(`HDR 데이터 로드 완료: ${hdrData.width}x${hdrData.height}, 권장 노출: ${this.#recommendedExposure.toFixed(3)}, 현재 노출: ${this.#exposure.toFixed(3)}`);
			await this.#createGPUTexture();
			this.#onLoad?.(this);
		} catch (error) {
			console.error('HDR loading error:', error);
			this.#onError?.(error);
		}
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) {
			this.#hdrData = null
		}
		this.__fireListenerList();
	}

	#registerResource() {
		basicRegisterResource(
			this,
			new ResourceStateHDRTexture(this)
		)
	}

	#unregisterResource() {
		basicUnregisterResource(this)
	}

	async #createGPUTexture() {
		const {gpuDevice, resourceManager} = this.redGPUContext
		/* GPU 작업 완료 대기 */
		await gpuDevice.queue.onSubmittedWorkDone();
		/* 기존 텍스처 정리 */
		const oldTexture = this.#gpuTexture;
		this.#gpuTexture = null; // 먼저 참조 해제
		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
		this.#videoMemorySize = 0
		/* 임시 Equirectangular 텍스처 생성 (현재 노출값 적용) */
		const {width: W, height: H} = this.#hdrData
		const tempTextureDescriptor: GPUTextureDescriptor = {
			size: [W, H],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: `${this.#src}_temp_exp${this.#exposure.toFixed(2)}`
		};
		const tempTexture = await this.#hdrDataToGPUTexture(gpuDevice, this.#hdrData, tempTextureDescriptor)
		/* 큐브맵 생성 */
		await this.#generateCubeMapFromEquirectangular(tempTexture)
		/* 임시 텍스처 즉시 삭제 */
		tempTexture.destroy()
		/* 이전 텍스처 안전하게 파괴 */
		if (oldTexture) {
			await gpuDevice.queue.onSubmittedWorkDone(); // GPU 작업 완료 대기
			oldTexture.destroy();
		}
		/* 큐브맵 메모리만 계산 */
		const cubeDescriptor: GPUTextureDescriptor = {
			size: [this.#cubeMapSize, this.#cubeMapSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
			mipLevelCount: this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1,
			dimension: '2d'
		};
		this.#mipLevelCount = cubeDescriptor.mipLevelCount || 1
		this.#videoMemorySize = calculateTextureByteSize(cubeDescriptor)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize
		console.log(`큐브맵 텍스처 생성 완료: ${this.#cubeMapSize}x${this.#cubeMapSize}x6, 밉맵: ${this.#mipLevelCount}레벨, 노출: ${this.#exposure.toFixed(3)}`);
	}

	async #generateCubeMapFromEquirectangular(sourceTexture: GPUTexture) {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const {mipmapGenerator} = resourceManager;
		const cubeMapDescriptor: GPUTextureDescriptor = {
			size: [this.#cubeMapSize, this.#cubeMapSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
			dimension: '2d',
			mipLevelCount: this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1,
			label: `${this.#src}_cubemap_exp${this.#exposure.toFixed(2)}`
		};
		// 🔧 #setGpuTexture 메서드를 사용하여 GPU 텍스처 설정
		const newGPUTexture = gpuDevice.createTexture(cubeMapDescriptor);
		this.#setGpuTexture(newGPUTexture);
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
		if (this.#useMipmap) {
			console.log('큐브맵 밉맵 생성 중...');
			mipmapGenerator.generateMipmap(this.#gpuTexture, cubeMapDescriptor);
			console.log('큐브맵 밉맵 생성 완료');
		}
	}

	async #hdrDataToGPUTexture(device: GPUDevice, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): Promise<GPUTexture> {
		const texture = device.createTexture(textureDescriptor);
		let bytesPerPixel: number;
		let uploadData: ArrayBuffer;
		switch (this.#format) {
			case 'rgba8unorm':
				bytesPerPixel = 4; // 8bit × 4 = 32bit = 4bytes
				const uint8Data = await this.#float32ToUint8WithToneMapping(hdrData.data);
				uploadData = uint8Data.buffer as ArrayBuffer;
				break;
			default:
				throw new Error(`지원되지 않는 텍스처 포맷: ${this.#format}`);
		}
		console.log(`텍스처 포맷: ${this.#format}, 노출값: ${this.#exposure.toFixed(3)}`);
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
				workgroupSize: [8, 8] // 또는 동적으로 계산
			}
		);

		return result.data;
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
