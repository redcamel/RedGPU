import RedGPUContext from "../../../context/RedGPUContext";
import calculateTextureByteSize from "../../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/math/getMipLevelCount";
import ManagedResourceBase from "../../ManagedResourceBase";
import basicRegisterResource from "../../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../../resourceManager/core/basicUnregisterResource";
import ResourceStateHDRTexture from "../../resourceManager/resourceState/ResourceStateHDRTexture";
import HDRLoader, { HDRData, HDRLoadOptions } from "./HDRLoader";

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
	#gpuTexture: GPUTexture
	#gpuCubeTexture: GPUTexture
	#src: string
	#cacheKey: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#originalHdrData: HDRData // 원본 데이터 보존
	#videoMemorySize: number = 0
	#cubeMapSize: number = 1024
	#hdrLoader: HDRLoader = new HDRLoader()
	#format: GPUTextureFormat
	#exposure: number = 1.0 // 자동 계산된 노출값
	#luminanceAnalysis: LuminanceAnalysis
	#onLoad: (textureInstance: HDRTexture) => void;
	#onError: (error: Error) => void;
	#hdrLoadOptions: HDRLoadOptions // 🆕 HDR 로드 옵션 저장

	constructor(
		redGPUContext: RedGPUContext,
		src?: any,
		onLoad?: (textureInstance?: HDRTexture) => void,
		onError?: (error: Error) => void,
		cubeMapSize: number = 1024,
		useMipMap: boolean = true,
		hdrOptions?: HDRLoadOptions // 🆕 HDR 옵션 추가
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#useMipmap = useMipMap
		this.#format = 'rgba8unorm'
		this.#cubeMapSize = cubeMapSize

		// 🆕 기본 HDR 로드 옵션 설정
		this.#hdrLoadOptions = {
			autoExposure: true,
			brightnessBias: 0.0,
			preprocess: true,
			...hdrOptions // 사용자 옵션으로 덮어쓰기
		};

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

	get gpuCubeTexture(): GPUTexture {
		return this.#gpuCubeTexture;
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

	// 🎯 자동 계산된 노출값 (읽기 전용)
	get exposure(): number {
		return this.#exposure;
	}

	// 🔍 휘도 분석 결과 (읽기 전용)
	get luminanceAnalysis(): LuminanceAnalysis {
		return this.#luminanceAnalysis;
	}

	// 🆕 HDR 로드 옵션 getter/setter
	get hdrLoadOptions(): HDRLoadOptions {
		return { ...this.#hdrLoadOptions };
	}

	set hdrLoadOptions(options: HDRLoadOptions) {
		this.#hdrLoadOptions = { ...this.#hdrLoadOptions, ...options };
		// 옵션 변경 시 재로드
		if (this.#src) {
			this.#loadHDRTexture(this.#src);
		}
	}

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#src = null
		this.#cacheKey = null
		this.#originalHdrData = null
		this.#luminanceAnalysis = null
		this.#unregisterResource()
		if (temp) temp.destroy()
		if (this.#gpuCubeTexture) this.#gpuCubeTexture.destroy()
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) {
			this.#hdrData = null
			this.#originalHdrData = null
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
		const {mipmapGenerator} = resourceManager
		if (this.#gpuTexture) {
			this.#gpuTexture.destroy()
			this.#gpuTexture = null
		}
		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
		this.#videoMemorySize = 0
		const {width: W, height: H} = this.#hdrData
		this.#mipLevelCount = 1
		// HDR 텍스처 생성
		const textureDescriptor: GPUTextureDescriptor = {
			size: [W, H],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: this.#src
		};
		// 밉맵 설정
		if (this.#useMipmap) {
			this.#mipLevelCount = getMipLevelCount(W, H)
			textureDescriptor.mipLevelCount = this.#mipLevelCount
			textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
		}
		const newGPUTexture = this.#hdrDataToGPUTexture(gpuDevice, this.#hdrData, textureDescriptor)
		this.#videoMemorySize = calculateTextureByteSize(textureDescriptor)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize
		if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
		this.#setGpuTexture(newGPUTexture)
		await this.#generateCubeMapFromEquirectangular()
	}

	#hdrDataToGPUTexture(device: GPUDevice, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): GPUTexture {
		const texture = device.createTexture(textureDescriptor);

		let bytesPerPixel: number;
		let uploadData: ArrayBuffer;

		switch (this.#format) {
			case 'rgba16float':
				bytesPerPixel = 8; // 16bit × 4 = 64bit = 8bytes
				uploadData = this.#float32ToFloat16(hdrData.data).buffer as ArrayBuffer;
				break;

			case 'rgba8unorm':
				bytesPerPixel = 4; // 8bit × 4 = 32bit = 4bytes
				// 🎯 개선된 톤매핑 적용
				uploadData = this.#float32ToUint8WithToneMapping(hdrData.data).buffer as ArrayBuffer;
				break;

			default:
				throw new Error(`지원되지 않는 텍스처 포맷: ${this.#format}`);
		}

		console.log(`텍스처 포맷: ${this.#format}`);
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

	// 🆕 Float32 → Float16 변환 함수
	#float32ToFloat16(float32Data: Float32Array): Uint16Array {
		const uint16Data = new Uint16Array(float32Data.length);
		console.log('Float32 → Float16 변환 (HDR 정보 보존):');

		for (let i = 0; i < float32Data.length; i++) {
			const floatVal = float32Data[i];
			uint16Data[i] = this.#floatToHalf(floatVal);

			if (i < 16) { // 첫 4픽셀만 로그
				console.log(`  [${i}] ${floatVal.toFixed(3)} → ${this.#halfToFloat(uint16Data[i]).toFixed(3)}`);
			}
		}

		return uint16Data;
	}

	// 🎬 개선된 Float32 → Uint8 변환 (톤매핑 적용)
	#float32ToUint8WithToneMapping(float32Data: Float32Array): Uint8Array {
		const uint8Data = new Uint8Array(float32Data.length);
		console.log('Float32 → Uint8 변환 (ACES 톤매핑 적용):');

		for (let i = 0; i < float32Data.length; i++) {
			const floatVal = float32Data[i];

			// 🎬 ACES 톤매핑 적용
			const toneMappedVal = this.#acesToneMapping(floatVal);

			// 🔧 감마 보정 적용 (sRGB)
			const gammaCorrectedVal = this.#linearToSRGB(toneMappedVal);

			// 🎯 최종 8bit 변환
			const uint8Val = Math.round(Math.min(1.0, Math.max(0.0, gammaCorrectedVal)) * 255);
			uint8Data[i] = uint8Val;

			if (i < 16) { // 첫 4픽셀만 로그
				console.log(`  [${i}] ${floatVal.toFixed(3)} → ${toneMappedVal.toFixed(3)} → ${uint8Val}`);
			}
		}

		return uint8Data;
	}

	// 🎬 ACES 톤매핑 (업계 표준)
	#acesToneMapping(x: number): number {
		const a = 2.51;
		const b = 0.03;
		const c = 2.43;
		const d = 0.59;
		const e = 0.14;

		return Math.max(0, (x * (a * x + b)) / (x * (c * x + d) + e));
	}

	// 🔧 Linear → sRGB 감마 보정
	#linearToSRGB(linearValue: number): number {
		if (linearValue <= 0.0031308) {
			return 12.92 * linearValue;
		} else {
			return 1.055 * Math.pow(linearValue, 1.0 / 2.4) - 0.055;
		}
	}

	// 🔧 IEEE 754 half-precision 변환 함수들
	#floatToHalf(value: number): number {
		const floatView = new Float32Array(1);
		const int32View = new Int32Array(floatView.buffer);
		floatView[0] = value;
		const x = int32View[0];

		let bits = (x >> 16) & 0x8000; // sign bit
		let m = (x >> 12) & 0x07ff; // mantissa
		const e = (x >> 23) & 0xff; // exponent

		if (e < 103) return bits;
		if (e > 142) {
			bits |= 0x7c00;
			bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
			return bits;
		}

		if (e < 113) {
			m |= 0x0800;
			bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
			return bits;
		}

		bits |= ((e - 112) << 10) | (m >> 1);
		bits += m & 1;
		return bits;
	}

	// 디버깅용 half → float 변환
	#halfToFloat(value: number): number {
		const s = (value & 0x8000) >> 15;
		const e = (value & 0x7C00) >> 10;
		const f = value & 0x03FF;

		if (e === 0) {
			return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10));
		} else if (e === 0x1F) {
			return f ? NaN : ((s ? -1 : 1) * Infinity);
		}

		return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / Math.pow(2, 10));
	}

	// Equirectangular을 CubeMap으로 변환
	async #generateCubeMapFromEquirectangular() {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const {mipmapGenerator} = resourceManager;

		const cubeMapDescriptor: GPUTextureDescriptor = {
			size: [this.#cubeMapSize, this.#cubeMapSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.RENDER_ATTACHMENT |
				GPUTextureUsage.COPY_DST,
			dimension: '2d',
			mipLevelCount: this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1,
			label: `${this.#src}_cubemap`
		};
		this.#gpuCubeTexture = gpuDevice.createTexture(cubeMapDescriptor);

		const shaderModule = gpuDevice.createShaderModule({
			code: `
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            @vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
           
var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),  
    vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0) 
);

var texCoord = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 0.0), vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), 
    vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0), vec2<f32>(0.0, 1.0)  
);
                var output: VertexOutput;
                output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                output.texCoord = texCoord[vertexIndex];
                return output;
            }

            @group(0) @binding(0) var equirectangularTexture: texture_2d<f32>;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

            @fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
                let ndc = vec2<f32>(
								    input.texCoord.x * 2.0 - 1.0,
								    (1.0 - input.texCoord.y) * 2.0 - 1.0  
								);

                var localDirection = vec3<f32>(ndc.x, ndc.y, 1.0);
                let worldDirection = normalize((faceMatrix * vec4<f32>(localDirection, 0.0)).xyz);
                
                let theta = atan2(worldDirection.z, worldDirection.x);
                let phi = acos(clamp(worldDirection.y, -1.0, 1.0));
                
                var u = (theta + 3.14159265359) / (2.0 * 3.14159265359);
								var v = phi / 3.14159265359;
								
								u = fract(u + 1.0);  
								v = clamp(v, 0.0001, 0.9999);  

                let color = textureSample(equirectangularTexture, textureSampler, vec2<f32>(u, v));
                return color;
            }
        `
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
			primitive: {
				topology: 'triangle-list'
			}
		});

		const sampler = gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		});

		const faceMatrices = this.#getCubeMapFaceMatrices();

		for (let face = 0; face < 6; face++) {
			await this.#renderCubeMapFace(renderPipeline, sampler, face, faceMatrices[face]);
		}

		if (this.#useMipmap) {
			console.log('큐브맵 밉맵 생성 중...');
			mipmapGenerator.generateMipmap(this.#gpuCubeTexture, cubeMapDescriptor);
			console.log('큐브맵 밉맵 생성 완료');
		}
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

	async #renderCubeMapFace(renderPipeline: GPURenderPipeline, sampler: GPUSampler, face: number, faceMatrix: Float32Array) {
		const {gpuDevice} = this.redGPUContext;
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix);
		const bindGroup = gpuDevice.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: this.#gpuTexture.createView()},
				{binding: 1, resource: sampler},
				{binding: 2, resource: {buffer: uniformBuffer}}
			]
		});
		const commandEncoder = gpuDevice.createCommandEncoder();
		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: this.#gpuCubeTexture.createView({
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

	// 🎯 수정된 HDR 로딩 메서드
	async #loadHDRTexture(src: string) {
		try {
			console.log('HDR 텍스처 로딩 시작:', src, this.#hdrLoadOptions);

			// 🎯 HDRLoader에서 전처리된 데이터 받기
			const hdrData = await this.#hdrLoader.loadHDRFile(src, this.#hdrLoadOptions);

			// 처리된 데이터 저장
			this.#hdrData = hdrData;
			this.#originalHdrData = {
				data: new Float32Array(hdrData.data),
				width: hdrData.width,
				height: hdrData.height
			};

			// 노출 및 분석 결과 저장
			this.#exposure = hdrData.recommendedExposure || 1.0;

			// 🆕 휘도 분석 결과 사용
			if (hdrData.luminanceStats) {
				this.#luminanceAnalysis = {
					averageLuminance: hdrData.luminanceStats.average,
					maxLuminance: hdrData.luminanceStats.max,
					minLuminance: hdrData.luminanceStats.min,
					medianLuminance: hdrData.luminanceStats.median,
					percentile95: hdrData.luminanceStats.max * 0.95, // 근사
					percentile99: hdrData.luminanceStats.max * 0.99, // 근사
					recommendedExposure: this.#exposure
				};

				console.log('휘도 분석 완료:', this.#luminanceAnalysis);
			}

			console.log(`HDR 데이터 로드 완료: ${hdrData.width}x${hdrData.height}, 노출: ${this.#exposure.toFixed(3)}`);

			await this.#createGPUTexture();
			this.#onLoad?.(this);
		} catch (error) {
			console.error('HDR loading error:', error);
			this.#onError?.(error);
		}
	}
}

Object.freeze(HDRTexture)
export default HDRTexture
