import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import ManagedResourceBase from "../ManagedResourceBase";
import basicRegisterResource from "../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../resourceManager/core/basicUnregisterResource";
import ResourceStateHDRTexture from "../resourceManager/resourceState/ResourceStateHDRTexture";
import CubeTexture from "./CubeTexture";

const MANAGED_STATE_KEY = 'managedHDRTextureState'

interface HDRData {
	data: Float32Array;
	width: number;
	height: number;
}

interface IBLTextures {
	environmentMap: CubeTexture;
	irradianceMap: CubeTexture;
	prefilterMap: GPUTexture;
	brdfLUT: GPUTexture;
}

class HDRTexture extends ManagedResourceBase {
	#gpuTexture: GPUTexture
	#cubeMapTexture: GPUTexture
	#iblTextures: IBLTextures
	#src: string
	#cacheKey: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#videoMemorySize: number = 0
	#cubeMapSize: number = 1024
	#generateCubeMap: boolean = true
	readonly #format: GPUTextureFormat
	readonly #onLoad: (textureInstance: HDRTexture) => void;
	readonly #onError: (error: Error) => void;

	constructor(
		redGPUContext: RedGPUContext,
		src?: any,
		useMipMap: boolean = true,
		onLoad?: (textureInstance?: HDRTexture) => void,
		onError?: (error: Error) => void,
		format?: GPUTextureFormat,
		generateCubeMap: boolean = true,
		cubeMapSize: number = 1024
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#useMipmap = useMipMap
		this.#format = format || 'rgba8unorm' // HDR용 기본 포맷
		this.#generateCubeMap = generateCubeMap
		this.#cubeMapSize = cubeMapSize


		// this.#hdrData = this.#createTestHDRData();
		// this.#createGPUTexture();

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
	#createTestHDRData(): HDRData {
		const width = 4;
		const height = 4;
		const data = new Float32Array(width * height * 4);

		/* 그라데이션 패턴 생성 */
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = (y * width + x) * 4;
				data[index] = x / (width - 1);     /* Red 그라데이션 */
				data[index + 1] = y / (height - 1); /* Green 그라데이션 */
				data[index + 2] = 0.5;             /* Blue 고정 */
				data[index + 3] = 1.0;             /* Alpha */
			}
		}

		console.log('테스트 HDR 데이터 생성됨');
		return { data, width, height };
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

	get cubeMapTexture(): GPUTexture {
		return this.#cubeMapTexture;
	}

	get iblTextures(): IBLTextures {
		return this.#iblTextures;
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
		if (this.#cubeMapTexture) this.#cubeMapTexture.destroy()
		if (this.#iblTextures) {
			this.#iblTextures.environmentMap?.destroy()
			this.#iblTextures.irradianceMap?.destroy()
			this.#iblTextures.prefilterMap?.destroy()
			this.#iblTextures.brdfLUT?.destroy()
		}
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

		// 큐브맵 생성
		if (this.#generateCubeMap) {
			await this.#generateCubeMapFromEquirectangular()
			await this.#generateIBLTextures()
		}
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

			case 'rgba16float':
				bytesPerPixel = 8; // 16bit × 4 = 64bit = 8bytes
				uploadData = this.#float32ToFloat16(hdrData.data).buffer as ArrayBuffer;
				break;

			case 'rgba32float':
				bytesPerPixel = 16; // 32bit × 4 = 128bit = 16bytes
				uploadData = hdrData.data.buffer as ArrayBuffer; // Float32Array 그대로
				break;

			default:
				throw new Error(`지원되지 않는 텍스처 포맷: ${this.#format}`);
		}

		console.log(`텍스처 포맷: ${this.#format}`);
		console.log(`바이트/픽셀: ${bytesPerPixel}`);
		console.log(`업로드 데이터 크기: ${uploadData.byteLength} bytes`);
		console.log(`예상 크기: ${hdrData.width * hdrData.height * bytesPerPixel} bytes`);

		device.queue.writeTexture(
			{ texture },
			uploadData,
			{
				bytesPerRow: hdrData.width * bytesPerPixel,
				rowsPerImage: hdrData.height
			},
			{ width: hdrData.width, height: hdrData.height }
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
		const { gpuDevice, resourceManager } = this.redGPUContext;
		const { mipmapGenerator } = resourceManager;


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

		this.#cubeMapTexture = gpuDevice.createTexture(cubeMapDescriptor);

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
				targets: [{ format: this.#format }]
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
			mipmapGenerator.generateMipmap(this.#cubeMapTexture, cubeMapDescriptor);
			console.log('큐브맵 밉맵 생성 완료');
		}

	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		// 큐브맵 6면에 대한 뷰 매트릭스 정의
		return [
			// +X (Right)
			new Float32Array([0,0,-1,0, 0,-1,0,0, -1,0,0,0, 0,0,0,1]),
			// -X (Left)
			new Float32Array([0,0,1,0, 0,-1,0,0, 1,0,0,0, 0,0,0,1]),
			// +Y (Top)
			new Float32Array([1,0,0,0, 0,0,-1,0, 0,1,0,0, 0,0,0,1]),
			// -Y (Bottom)
			new Float32Array([1,0,0,0, 0,0,1,0, 0,-1,0,0, 0,0,0,1]),
			// +Z (Front)
			new Float32Array([1,0,0,0, 0,-1,0,0, 0,0,-1,0, 0,0,0,1]),
			// -Z (Back)
			new Float32Array([-1,0,0,0, 0,-1,0,0, 0,0,1,0, 0,0,0,1])
		];
	}

	async #renderCubeMapFace(renderPipeline: GPURenderPipeline, sampler: GPUSampler, face: number, faceMatrix: Float32Array) {
		const { gpuDevice } = this.redGPUContext;

		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix);

		const bindGroup = gpuDevice.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#gpuTexture.createView() },
				{ binding: 1, resource: sampler },
				{ binding: 2, resource: { buffer: uniformBuffer } }
			]
		});

		const commandEncoder = gpuDevice.createCommandEncoder();
		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: this.#cubeMapTexture.createView({
					dimension: '2d',
					baseMipLevel: 0,
					mipLevelCount: 1,
					baseArrayLayer: face,
					arrayLayerCount: 1
				}),
				clearValue: { r: 0, g: 0, b: 0, a: 0 },
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
		if (!this.#cubeMapTexture) return;

		const { gpuDevice } = this.redGPUContext;

		console.log('IBL 생성 시작 - 복사 없이 원본 사용');

		// ✅ 복사 없이 원본을 입력으로 사용
		const irradianceMap = await this.#generateIrradianceMap(this.#cubeMapTexture);
		const prefilterMap = await this.#generatePrefilterMap(this.#cubeMapTexture);
		const brdfLUT = await this.#generateBRDFLUT();

		// ✅ 독립적인 CubeTexture 래퍼 생성
		const env = new CubeTexture(this.redGPUContext, [], false, undefined, undefined, this.#format);
		const irradiance = new CubeTexture(this.redGPUContext, [], false, undefined, undefined, this.#format);

		// ✅ 완전히 다른 GPUTexture 객체들
		env.setGPUTextureDirectly(
			this.#cubeMapTexture,     // ← 원본 큐브맵 (1024x1024)
			`${this.#src}_environmentMap_exported_cubemap`,
			this.#useMipmap
		);

		irradiance.setGPUTextureDirectly(
			irradianceMap,            // ← 새로 생성된 Irradiance 맵 (32x32)
			`${this.#src}_irradianceMap_exported_cubemap`,
			false
		);

		console.log('텍스처 독립성 확인:');
		console.log('Environment:', this.#cubeMapTexture.width, 'x', this.#cubeMapTexture.height);
		console.log('Irradiance:', irradianceMap.width, 'x', irradianceMap.height);
		console.log('같은 객체?', this.#cubeMapTexture === irradianceMap); // false여야 함

		this.#iblTextures = {
			environmentMap: env,
			irradianceMap: irradiance,
			prefilterMap,
			brdfLUT
		};

		console.log('IBL 생성 완료');
	}


	async #generateIrradianceMap(environmentMap: GPUTexture): Promise<GPUTexture> {
		const { gpuDevice } = this.redGPUContext;
		const irradianceSize = 32; // 작은 크기로 충분
		const irradianceMipLevels = this.#useMipmap ? getMipLevelCount(irradianceSize, irradianceSize) : 1;


		const irradianceTexture = gpuDevice.createTexture({
			size: [irradianceSize, irradianceSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: irradianceMipLevels,
			label: `${this.#src}_irradiance`
		});

		// ✅ Irradiance 계산용 셰이더 (구면 컨볼루션)
		const irradianceShader = gpuDevice.createShaderModule({
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
                    vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0),
                    vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), vec2<f32>(1.0, 0.0)
                );

                var output: VertexOutput;
                output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                output.texCoord = texCoord[vertexIndex];
                return output;
            }

            @group(0) @binding(0) var environmentTexture: texture_cube<f32>;
            @group(0) @binding(1) var environmentSampler: sampler;
            @group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

            const PI = 3.14159265359;

            @fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
               
                let ndc = vec2<f32>(
                    input.texCoord.x * 2.0 - 1.0,
                    1.0 - input.texCoord.y * 2.0
                );

              
                var localDirection = vec3<f32>(ndc.x, ndc.y, 1.0);
                
              
                let worldDirection = normalize((faceMatrix * vec4<f32>(localDirection, 0.0)).xyz);
                let normal = worldDirection;

                
                var irradiance = vec3<f32>(0.0);
                var sampleCount = 0u;
                
             
                var up = vec3<f32>(0.0, 1.0, 0.0);
                if (abs(normal.y) > 0.999) {
                    up = vec3<f32>(0.0, 0.0, 1.0);
                }
                let tangent = normalize(cross(up, normal));
                let bitangent = cross(normal, tangent);
                
               
                let sampleDelta = 0.025; 
                
                for (var phi = 0.0; phi < 2.0 * PI; phi += sampleDelta) {
                    for (var theta = 0.0; theta < 0.5 * PI; theta += sampleDelta) {
                    
                        let sampleVec = vec3<f32>(
                            sin(theta) * cos(phi),
                            sin(theta) * sin(phi),
                            cos(theta)
                        );
                        
                      
                        let worldSample = sampleVec.x * tangent + 
                                        sampleVec.y * bitangent + 
                                        sampleVec.z * normal;
                        
                       
                        let sampleColor = textureSample(environmentTexture, environmentSampler, worldSample);
                        
                    
                        let cosTheta = cos(theta);
                        let sinTheta = sin(theta);
                        
                        irradiance += sampleColor.rgb * cosTheta * sinTheta;
                        sampleCount++;
                    }
                }
                
                irradiance = PI * irradiance / f32(sampleCount);
                
                return vec4<f32>(irradiance, 1.0);
            }
        `
		});

		// 렌더 파이프라인 생성
		const irradiancePipeline = gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: irradianceShader,
				entryPoint: 'vs_main'
			},
			fragment: {
				module: irradianceShader,
				entryPoint: 'fs_main',
				targets: [{ format: this.#format }]
			},
			primitive: {
				topology: 'triangle-list'
			}
		});

		// 샘플러 생성 (선형 필터링)
		const sampler = gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		});

		const faceMatrices = this.#getCubeMapFaceMatrices();

		// ✅ 단일 버퍼를 재사용
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		const commandEncoder = gpuDevice.createCommandEncoder();

		for (let face = 0; face < 6; face++) {
			// ✅ 버퍼 내용만 업데이트 (재사용)
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrices[face]);

			const bindGroup = gpuDevice.createBindGroup({
				layout: irradiancePipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: environmentMap.createView({ dimension: 'cube' }) },
					{ binding: 1, resource: sampler },
					{ binding: 2, resource: { buffer: uniformBuffer } }
				]
			});

			const renderPass = commandEncoder.beginRenderPass({
				colorAttachments: [{
					view: irradianceTexture.createView({
						dimension: '2d',
						baseMipLevel: 0,
						mipLevelCount: 1,
						baseArrayLayer: face,
						arrayLayerCount: 1
					}),
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'clear',
					storeOp: 'store'
				}]
			});

			renderPass.setPipeline(irradiancePipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
		}

		// ✅ 모든 작업 후 submit
		gpuDevice.queue.submit([commandEncoder.finish()]);

		// ✅ 단일 버퍼만 정리
		uniformBuffer.destroy();

		console.log(`Irradiance Map 생성 완료: ${irradianceSize}x${irradianceSize}`);
		return irradianceTexture;

	}

	async #generatePrefilterMap(environmentMap: GPUTexture): Promise<GPUTexture> {
		const { gpuDevice } = this.redGPUContext;
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
		const { gpuDevice } = this.redGPUContext;
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

	// HDR 파일 유효성 검사
	#validateHDRFile(data: Uint8Array): { isValid: boolean, format: string, error?: string } {
		if (data.length < 50) {
			return { isValid: false, format: 'unknown', error: '파일이 너무 작습니다' };
		}

		// 처음 몇 바이트로 HDR 형식 확인
		const header = new TextDecoder('ascii', { fatal: false }).decode(data.slice(0, 50));

		if (header.startsWith('#?RADIANCE') || header.startsWith('#?RGBE')) {
			return { isValid: true, format: 'RGBE/Radiance' };
		}

		if (header.includes('RADIANCE') || header.includes('RGBE')) {
			return { isValid: true, format: 'RGBE/Radiance (variant)' };
		}

		// EXR 형식 확인
		if (data[0] === 0x76 && data[1] === 0x2f && data[2] === 0x31 && data[3] === 0x01) {
			return { isValid: false, format: 'OpenEXR', error: 'EXR 형식은 아직 지원되지 않습니다' };
		}

		return { isValid: false, format: 'unknown', error: '알 수 없는 HDR 형식입니다' };
	}

	// RGBE 포맷 HDR 파일 파싱 - 개선된 버전
	#parseRGBE(data: Uint8Array): HDRData {
		let pos = 0;
		let width = 0, height = 0;
		let isRLE = false;

		console.log('HDR 헤더 파싱 시작...');

		// 전체 헤더를 먼저 문자열로 변환해서 확인
		const headerEnd = this.#findHeaderEnd(data);
		const headerStr = new TextDecoder('ascii', { fatal: false }).decode(data.slice(0, headerEnd));

		console.log('전체 헤더:');
		console.log('---');
		console.log(headerStr);
		console.log('---');

		// 헤더를 줄별로 분석
		const lines = headerStr.split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			console.log(`라인 ${i}: "${line}"`);

			// 빈 줄이면 다음 줄이 크기 정보일 가능성
			if (line === '') {
				console.log('빈 줄 발견, 다음 줄 확인...');
				continue;
			}

			// 매직 넘버 확인
			if (line.startsWith('#?RADIANCE') || line.startsWith('#?RGBE')) {
				console.log('HDR 매직 넘버 확인됨');
				continue;
			}

			// 포맷 확인
			if (line.includes('32-bit_rle_rgbe') || line.includes('FORMAT=32-bit_rle_rgbe')) {
				isRLE = true;
				console.log('RLE 포맷 확인됨');
				continue;
			}

			// 다양한 크기 정보 패턴 확인
			const sizePatterns = [
				/-Y\s+(\d+)\s+\+X\s+(\d+)/,           // 표준: -Y 512 +X 1024
				/\+X\s+(\d+)\s+-Y\s+(\d+)/,           // 순서 바뀐 경우
				/-Y\s*(\d+)\s*\+X\s*(\d+)/,           // 공백 없는 경우
				/(\d+)\s+(\d+)/,                       // 단순히 숫자 두 개
				/WIDTH=(\d+)\s+HEIGHT=(\d+)/i,         // WIDTH=1024 HEIGHT=512
				/RESOLUTION=(\d+)x(\d+)/i              // RESOLUTION=1024x512
			];

			for (const pattern of sizePatterns) {
				const match = line.match(pattern);
				if (match) {
					if (pattern === sizePatterns[0] || pattern === sizePatterns[2]) {
						// -Y height +X width 패턴
						height = parseInt(match[1]);
						width = parseInt(match[2]);
					} else if (pattern === sizePatterns[1]) {
						// +X width -Y height 패턴
						width = parseInt(match[1]);
						height = parseInt(match[2]);
					} else {
						// 기타 패턴들
						width = parseInt(match[1]);
						height = parseInt(match[2]);
					}

					console.log(`크기 정보 발견: ${width}x${height} (패턴: ${pattern})`);
					break;
				}
			}

			// 크기를 찾았으면 중단
			if (width > 0 && height > 0) {
				pos = headerEnd;
				break;
			}
		}

		// 크기를 못 찾았으면 바이트 단위로 다시 시도
		if (width === 0 || height === 0) {
			console.log('라인 기반 파싱 실패, 바이트 기반 파싱 시도...');
			const result = this.#parseHeaderByBytes(data);
			width = result.width;
			height = result.height;
			pos = result.dataStart;
			isRLE = result.isRLE;
		}

		if (width === 0 || height === 0) {
			// 최종적으로 실패하면 헤더 정보를 더 자세히 출력
			console.error('HDR 헤더 파싱 실패!');
			console.error('첫 500바이트의 16진수 덤프:');
			this.#hexDump(data.slice(0, 500));

			throw new Error(`HDR 파일에서 유효한 크기를 찾을 수 없습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.`);
		}

		console.log(`최종 파싱 결과: ${width}x${height}, RLE: ${isRLE}, 데이터 시작: ${pos}`);

		// 나머지 파싱 로직...
		let rgbeData: Uint8Array;

		if (isRLE && width >= 8 && width <= 0x7fff) {
			rgbeData = this.#decodeRLERGBE(data.slice(pos), width, height);
		} else {
			rgbeData = data.slice(pos, pos + width * height * 4);
		}

		return this.#rgbeToFloat32(rgbeData, width, height);
	}

	// 헤더 끝 위치 찾기
	#findHeaderEnd(data: Uint8Array): number {
		// 연속된 두 개의 줄바꿈을 찾거나, 첫 번째 이진 데이터 시작점을 찾음
		for (let i = 0; i < Math.min(data.length, 2048); i++) {
			// \n\n 또는 \r\n\r\n 패턴
			if ((data[i] === 10 && data[i + 1] === 10) ||
				(data[i] === 13 && data[i + 1] === 10 && data[i + 2] === 13 && data[i + 3] === 10)) {
				return i + 2;
			}

			// 크기 정보 라인 다음에 바로 이진 데이터가 올 수도 있음
			if (data[i] === 10) {
				const nextLineStart = i + 1;
				// 다음 라인이 크기 정보인지 확인
				const line = this.#readLineAt(data, nextLineStart);
				if (line.match(/-Y\s+\d+\s+\+X\s+\d+/)) {
					// 크기 정보 라인 다음이 헤더 끝
					return nextLineStart + line.length + 1;
				}
			}
		}
		return 1024; // 기본값
	}

	// 바이트 단위로 헤더 파싱 (대안 방법)
	#parseHeaderByBytes(data: Uint8Array): { width: number, height: number, dataStart: number, isRLE: boolean } {
		let pos = 0;
		let width = 0, height = 0;
		let isRLE = false;

		console.log('바이트 단위 헤더 파싱...');

		while (pos < Math.min(data.length, 2048)) {
			const line = this.#readLineAt(data, pos);
			pos += line.length + 1;

			console.log(`바이트 파싱 라인: "${line}"`);

			if (line.includes('32-bit_rle_rgbe')) {
				isRLE = true;
			}

			// 더 관대한 크기 패턴 매칭
			const patterns = [
				/-Y\s*(\d+)\s*\+X\s*(\d+)/,
				/\+X\s*(\d+)\s*-Y\s*(\d+)/,
				/^(\d+)\s+(\d+)$/,
				/WIDTH.*?(\d+).*?HEIGHT.*?(\d+)/i,
				/(\d+)x(\d+)/
			];

			for (const pattern of patterns) {
				const match = line.match(pattern);
				if (match) {
					if (pattern === patterns[0]) {
						height = parseInt(match[1]);
						width = parseInt(match[2]);
					} else if (pattern === patterns[1]) {
						width = parseInt(match[1]);
						height = parseInt(match[2]);
					} else {
						width = parseInt(match[1]);
						height = parseInt(match[2]);
					}

					if (width > 0 && height > 0) {
						console.log(`바이트 파싱 성공: ${width}x${height}`);
						return { width, height, dataStart: pos, isRLE };
					}
				}
			}

			// 라인이 비어있거나 너무 짧으면 다음 줄로
			if (line.length === 0) continue;

			// 이진 데이터 시작으로 보이면 중단
			if (line.length > 50 || /[\x00-\x08\x0E-\x1F\x7F-\xFF]/.test(line)) {
				break;
			}
		}

		return { width: 0, height: 0, dataStart: pos, isRLE };
	}

	// 특정 위치에서 라인 읽기
	#readLineAt(data: Uint8Array, start: number): string {
		let end = start;
		while (end < data.length && data[end] !== 10 && data[end] !== 13) {
			end++;
		}
		return new TextDecoder('ascii', { fatal: false }).decode(data.slice(start, end));
	}

	// 16진수 덤프 (디버깅용)
	#hexDump(data: Uint8Array): void {
		const lines: string[] = [];
		for (let i = 0; i < data.length; i += 16) {
			const chunk = data.slice(i, i + 16);
			const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ');
			const ascii = Array.from(chunk).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
			lines.push(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(47)} |${ascii}|`);
		}
		console.log(lines.join('\n'));
	}

	// RLE 압축 해제
	#decodeRLERGBE(data: Uint8Array, width: number, height: number): Uint8Array {
		const result = new Uint8Array(width * height * 4);
		let dataPos = 0;
		let resultPos = 0;

		for (let y = 0; y < height; y++) {
			// 스캔라인 헤더 확인
			if (dataPos + 4 > data.length) break;

			const r = data[dataPos];
			const g = data[dataPos + 1];
			const b = data[dataPos + 2];
			const e = data[dataPos + 3];

			// 새로운 RLE 포맷 확인 (Magic number: 0x02, 0x02)
			if (r === 0x02 && g === 0x02 && ((b << 8) | e) === width) {
				dataPos += 4;

				// 각 컴포넌트별로 RLE 디코딩
				for (let component = 0; component < 4; component++) {
					let x = 0;
					while (x < width && dataPos < data.length) {
						const code = data[dataPos++];

						if (code > 128) {
							// Run: 같은 값 반복
							const count = code - 128;
							if (dataPos >= data.length) break;
							const value = data[dataPos++];

							for (let i = 0; i < count && x < width; i++, x++) {
								result[resultPos + x * 4 + component] = value;
							}
						} else {
							// Copy: 연속된 다른 값들
							const count = code;
							for (let i = 0; i < count && x < width && dataPos < data.length; i++, x++) {
								result[resultPos + x * 4 + component] = data[dataPos++];
							}
						}
					}
				}
				resultPos += width * 4;
			} else {
				// 구형 포맷 또는 압축되지 않은 스캔라인
				for (let x = 0; x < width && dataPos + 4 <= data.length; x++) {
					result[resultPos++] = data[dataPos++]; // R
					result[resultPos++] = data[dataPos++]; // G
					result[resultPos++] = data[dataPos++]; // B
					result[resultPos++] = data[dataPos++]; // E
				}
			}
		}

		return result;
	}

	// RGBE를 Float32로 변환
	// RGBE에서 Float32로 변환 - 수정된 버전
	#rgbeToFloat32(rgbeData: Uint8Array, width: number, height: number): HDRData {
		const floatData = new Float32Array(width * height * 4);

		console.log(`RGBE 디코딩: ${width}x${height}, 입력 데이터 크기: ${rgbeData.length}`);

		// 첫 몇 픽셀의 원본 RGBE 값 확인
		console.log('첫 10개 RGBE 픽셀:');
		for (let i = 0; i < Math.min(10, rgbeData.length / 4); i++) {
			const r = rgbeData[i * 4];
			const g = rgbeData[i * 4 + 1];
			const b = rgbeData[i * 4 + 2];
			const e = rgbeData[i * 4 + 3];
			console.log(`픽셀 ${i}: R=${r}, G=${g}, B=${b}, E=${e}`);
		}

		for (let i = 0; i < width * height; i++) {
			const rgbeIndex = i * 4;
			const floatIndex = i * 4;

			if (rgbeIndex + 3 >= rgbeData.length) break;

			const r = rgbeData[rgbeIndex];
			const g = rgbeData[rgbeIndex + 1];
			const b = rgbeData[rgbeIndex + 2];
			const e = rgbeData[rgbeIndex + 3];

			if (e === 0) {
				/* 지수가 0이면 모든 값이 0 */
				floatData[floatIndex] = 0.0;
				floatData[floatIndex + 1] = 0.0;
				floatData[floatIndex + 2] = 0.0;
				floatData[floatIndex + 3] = 1.0;
			} else {
				/* 표준 RGBE 디코딩 공식 */
				const factor = Math.pow(2, e - 128 - 8);

				floatData[floatIndex] = (r + 0.5) * factor;     /* Red */
				floatData[floatIndex + 1] = (g + 0.5) * factor; /* Green */
				floatData[floatIndex + 2] = (b + 0.5) * factor; /* Blue */
				floatData[floatIndex + 3] = 1.0;                 /* Alpha */
			}
		}

		// 변환된 첫 몇 픽셀 확인
		console.log('변환된 첫 10개 Float 픽셀:');
		for (let i = 0; i < Math.min(10, width * height); i++) {
			const r = floatData[i * 4];
			const g = floatData[i * 4 + 1];
			const b = floatData[i * 4 + 2];
			console.log(`픽셀 ${i}: R=${r.toFixed(6)}, G=${g.toFixed(6)}, B=${b.toFixed(6)}`);
		}

		return {
			data: floatData,
			width,
			height
		};
	}

	// 디버깅용 메서드들
	debugHDRInfo(): void {
		console.log('=== HDR 디버깅 정보 ===');
		if (this.#hdrData) {
			const { data, width, height } = this.#hdrData;

			// 통계 계산
			let nonZeroPixels = 0;
			let totalLuminance = 0;
			let maxLuminance = 0;

			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				if (r > 0 || g > 0 || b > 0) {
					nonZeroPixels++;
					// Rec.709 luminance
					const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
					totalLuminance += luminance;
					maxLuminance = Math.max(maxLuminance, luminance);
				}
			}

			console.log(`크기: ${width}x${height}`);
			console.log(`비어있지 않은 픽셀: ${nonZeroPixels} / ${width * height}`);
			console.log(`평균 휘도: ${(totalLuminance / nonZeroPixels).toFixed(6)}`);
			console.log(`최대 휘도: ${maxLuminance.toFixed(6)}`);

			// 코너 픽셀들 확인
			this.#checkCornerPixels(data, width, height);
		}

		if (this.#gpuTexture) {
			console.log(`GPU 텍스처: ${this.#gpuTexture.width}x${this.#gpuTexture.height}`);
			console.log(`포맷: ${this.#gpuTexture.format}`);
		}

		if (this.#cubeMapTexture) {
			console.log(`큐브맵: ${this.#cubeMapTexture.width}x${this.#cubeMapTexture.height}`);
			console.log(`큐브맵 mip levels: ${this.#cubeMapTexture.mipLevelCount}`);
		}
	}

	#checkCornerPixels(data: Float32Array, width: number, height: number): void {
		const corners = [
			{ name: '좌상단', x: 0, y: 0 },
			{ name: '우상단', x: width - 1, y: 0 },
			{ name: '좌하단', x: 0, y: height - 1 },
			{ name: '우하단', x: width - 1, y: height - 1 },
			{ name: '중앙', x: Math.floor(width / 2), y: Math.floor(height / 2) }
		];

		console.log('코너 픽셀 값:');
		corners.forEach(corner => {
			const index = (corner.y * width + corner.x) * 4;
			const r = data[index];
			const g = data[index + 1];
			const b = data[index + 2];
			console.log(`${corner.name}: R=${r.toFixed(3)}, G=${g.toFixed(3)}, B=${b.toFixed(3)}`);
		});
	}

	async #loadHDRTexture(src: string) {
		try {
			console.log(`HDR 파일 로딩 시작: ${src}`);

			const response = await fetch(src);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const buffer = await response.arrayBuffer();
			const uint8Array = new Uint8Array(buffer);

			console.log(`파일 크기: ${uint8Array.length} bytes`);

			// 파일 형식 검증
			const validation = this.#validateHDRFile(uint8Array);
			console.log(`파일 형식: ${validation.format}`);

			if (!validation.isValid) {
				throw new Error(validation.error || '지원되지 않는 파일 형식입니다');
			}

			if (src.toLowerCase().endsWith('.hdr')) {
				// 파일 헤더 디버깅
				console.log('파일 첫 200바이트:');
				this.#hexDump(uint8Array.slice(0, 200));

				// RGBE HDR 포맷
				this.#hdrData = this.#parseRGBE(uint8Array);

				// HDR 데이터 디버깅
				this.debugHDRInfo();

			} else if (src.toLowerCase().endsWith('.exr')) {
				throw new Error('EXR format not supported yet');
			} else {
				throw new Error(`Unsupported HDR format: ${src}`);
			}

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
