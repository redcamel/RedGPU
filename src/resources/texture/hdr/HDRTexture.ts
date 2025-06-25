import RedGPUContext from "../../../context/RedGPUContext";
import calculateTextureByteSize from "../../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/math/getMipLevelCount";
import ManagedResourceBase from "../../ManagedResourceBase";
import basicRegisterResource from "../../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../../resourceManager/core/basicUnregisterResource";
import ResourceStateHDRTexture from "../../resourceManager/resourceState/ResourceStateHDRTexture";
import HDRLoader from "./HDRLoader";

const MANAGED_STATE_KEY = 'managedHDRTextureState'

interface HDRData {
	data: Float32Array;
	width: number;
	height: number;
}


class HDRTexture extends ManagedResourceBase {
	#gpuTexture: GPUTexture
	#gpuCubeTexture: GPUTexture
	#src: string
	#cacheKey: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#videoMemorySize: number = 0
	#cubeMapSize: number = 1024
	#hdrLoader: HDRLoader = new HDRLoader()
	#format: GPUTextureFormat
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
				this.#onLoad?.(this)
				return table[target.uuid].texture
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

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#src = null
		this.#cacheKey = null
		this.#unregisterResource()
		if (temp) temp.destroy()
		if (this.#gpuCubeTexture) this.#gpuCubeTexture.destroy()

	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#hdrData = null
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
			await this.#generateIBLTextures()

	}

	#hdrDataToGPUTexture(device: GPUDevice, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): GPUTexture {
		const texture = device.createTexture(textureDescriptor);
		// ✅ 포맷별 올바른 바이트 계산
		let bytesPerPixel: number;
		let uploadData: ArrayBuffer;
		switch (this.#format) {
			case 'rgba8unorm':
				bytesPerPixel = 4; // 8bit × 4 = 32bit = 4bytes
				uploadData = this.#float32ToUint8(hdrData.data).buffer as ArrayBuffer;
				break;
				// TODO - 일단 rgba8unorm 만 지원
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

// Float32 → Float16 변환 함수들 추가
	#float32ToFloat16(float32Data: Float32Array): Uint16Array {
		const float16Data = new Uint16Array(float32Data.length);
		for (let i = 0; i < float32Data.length; i++) {
			float16Data[i] = this.#floatToHalf(float32Data[i]);
		}
		return float16Data;
	}

// Float32 → Half Float (16bit) 변환
	#floatToHalf(val: number): number {
		const buffer = new ArrayBuffer(4);
		const floatView = new Float32Array(buffer);
		const intView = new Uint32Array(buffer);
		floatView[0] = val;
		const x = intView[0];
		let bits = (x >> 16) & 0x8000; // sign bit
		let m = (x >> 12) & 0x07ff;    // mantissa bits
		const e = (x >> 23) & 0xff;    // exponent bits
		if (e < 103) return bits;
		if (e > 142) {
			bits |= 0x7c00;
			bits |= ((x & 0x007fffff) !== 0) ? 1 : 0;
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

// Float32 → Uint8 변환 (0.0~1.0 → 0~255)
	#float32ToUint8(float32Data: Float32Array): Uint8Array {
		const uint8Data = new Uint8Array(float32Data.length);
		console.log('Float32 → Uint8 변환:');
		for (let i = 0; i < float32Data.length; i++) {
			const floatVal = float32Data[i];
			const uint8Val = Math.round(Math.min(1.0, Math.max(0.0, floatVal)) * 255);
			uint8Data[i] = uint8Val;
			if (i < 16) { // 첫 4픽셀만 로그
				console.log(`  [${i}] ${floatVal.toFixed(3)} → ${uint8Val}`);
			}
		}
		return uint8Data;
	}

	// Equirectangular을 CubeMap으로 변환
	async #generateCubeMapFromEquirectangular() {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const {mipmapGenerator} = resourceManager;
		// 큐브맵 텍스처 생성
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
		// ✅ 개선된 변환용 셰이더
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
		// 렌더 파이프라인 생성
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
		// 샘플러 생성
		const sampler = gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		});
		// 각 큐브맵 면에 대한 변환 매트릭스
		const faceMatrices = this.#getCubeMapFaceMatrices();
		// 각 면에 대해 렌더링
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
		// 큐브맵 6면에 대한 뷰 매트릭스 정의
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
		// ✅ submit 먼저
		gpuDevice.queue.submit([commandEncoder.finish()]);
		// ✅ 그 다음 버퍼 파괴
		uniformBuffer.destroy();
	}

	// IBL용 텍스처들 생성
	async #generateIBLTextures() {
		// if (!this.#gpuCubeTexture) return;
		// const {gpuDevice} = this.redGPUContext;
		// console.log('IBL 생성 시작 - 복사 없이 원본 사용');
		// // ✅ 복사 없이 원본을 입력으로 사용
		// const irradianceMap = await this.#generateIrradianceMap(this.#gpuCubeTexture);
		// const prefilterMap = await this.#generatePrefilterMap(this.#gpuCubeTexture);
		// const brdfLUT = await this.#generateBRDFLUT();
		// // ✅ 독립적인 CubeTexture 래퍼 생성
		// const irradiance = new CubeTexture(this.redGPUContext, [], false, undefined, undefined, this.#format);
		// // ✅ 완전히 다른 GPUTexture 객체들
		// this.#iblTextures.environmentMap.setGPUTextureDirectly(
		// 	this.#gpuCubeTexture,     // ← 원본 큐브맵 (1024x1024)
		// 	`${this.#src}_environmentMap_exported_cubemap`,
		// 	this.#useMipmap
		// );
		// this.#iblTextures.iblIrradianceTexture.setGPUTextureDirectly(
		// 	irradianceMap,            // ← 새로 생성된 Irradiance 맵 (32x32)
		// 	`${this.#src}_irradianceMap_exported_cubemap`,
		// 	false
		// );
		// console.log('텍스처 독립성 확인:');
		// console.log('Environment:', this.#gpuCubeTexture.width, 'x', this.#gpuCubeTexture.height);
		// console.log('Irradiance:', irradianceMap.width, 'x', irradianceMap.height);
		// console.log('같은 객체?', this.#gpuCubeTexture === irradianceMap); // false여야 함
		//
		// console.log('IBL 생성 완료');
	}



	async #generatePrefilterMap(environmentMap: GPUTexture): Promise<GPUTexture> {
		const {gpuDevice} = this.redGPUContext;
		const prefilterSize = 128;
		const maxMipLevels = 5;
		const prefilterTexture = gpuDevice.createTexture({
			size: [prefilterSize, prefilterSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: maxMipLevels,
			label: `${this.#src}_prefilter`
		});
		// 각 roughness 레벨에 대한 prefilter 계산
		// 구현 필요...
		return prefilterTexture;
	}

	async #generateBRDFLUT(): Promise<GPUTexture> {
		const {gpuDevice} = this.redGPUContext;
		const lutSize = 512;
		const brdfTexture = gpuDevice.createTexture({
			size: [lutSize, lutSize],
			format: 'rg16float',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			label: `${this.#src}_brdf_lut`
		});
		// BRDF LUT 계산용 셰이더
		// 구현 필요...
		return brdfTexture;
	}

	async #loadHDRTexture(src: string) {
		try {
			this.#hdrData = await this.#hdrLoader.loadHDRFile(src)
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
