import RedGPUContext from "../../context/RedGPUContext";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import createUUID from "../../utils/createUUID";
import UniformBuffer from "../buffer/uniformBuffer/UniformBuffer";
import ManagedResourceBase from "../ManagedResourceBase";
import basicRegisterResource from "../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../resourceManager/core/basicUnregisterResource";
import ResourceStateBitmapTexture from "../resourceManager/resourceState/ResourceStateBitmapTexture";
import parseWGSL from "../wgslParser/parseWGSL";

const MANAGED_STATE_KEY = 'managedBitmapTextureState';

/* 노이즈 효과 타입 정의 */
export interface NoiseEffect {
	uniformStruct?: string;
	mainLogic: string;
	helperFunctions?: string;
	uniformDefaults?: Record<string, any>;
}

class NoiseTexture extends ManagedResourceBase {
	#gpuTexture: GPUTexture;
	#COMPUTE_WORKGROUP_SIZE_X = 16;
	#COMPUTE_WORKGROUP_SIZE_Y = 4;
	#COMPUTE_WORKGROUP_SIZE_Z = 1;
	#textureComputeShaderModule: GPUShaderModule;
	#textureComputeBindGroup: GPUBindGroup;
	#textureComputeBindGroupLayout: GPUBindGroupLayout;
	#textureComputePipeline: GPUComputePipeline;
	#uniformBuffer: UniformBuffer;
	#uniformInfo: any;
	#width: number;
	#height: number;
	#currentEffect: NoiseEffect;
	cacheKey
	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 512,
		height: number = 512,
		effect?: NoiseEffect
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		validateUintRange(width, 2, 2048);
		validateUintRange(height, 2, 2048);

		this.#width = width;
		this.#height = height;
		this.#currentEffect = effect || this.#getDefaultEffect();

		this.#init(redGPUContext);
		this.#gpuTexture = this.#createStorageTexture(redGPUContext, width, height);
		this.#executeComputePass();
		this.#registerResource();
	}

	/* 효과 변경 메서드 */
	setEffect(effect: NoiseEffect) {
		this.#currentEffect = effect;
		this.#reinitialize();
	}

	/* 개별 파라미터 업데이트 */
	updateUniform(name: string, value: any) {
		if (this.#uniformInfo.members[name]) {
			this.#uniformBuffer.writeBuffer(this.#uniformInfo.members[name], value);
		}
	}

	/* 여러 파라미터 일괄 업데이트 */
	updateUniforms(uniforms: Record<string, any>) {
		Object.entries(uniforms).forEach(([name, value]) => {
			this.updateUniform(name, value);
		});
	}

	/* 렌더링 */
	render(time: number, additionalUniforms?: Record<string, any>) {
		this.updateUniform('time', time);
		if (additionalUniforms) {
			this.updateUniforms(additionalUniforms);
		}
		this.#executeComputePass();
	}

	#init(redGPUContext: RedGPUContext) {
		const { gpuDevice } = redGPUContext;
		const textureComputeShader = this.#generateShader();
		this.cacheKey = createUUID()
		this.#textureComputeShaderModule = gpuDevice.createShaderModule({
			code: textureComputeShader,
		});

		this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
		this.#textureComputePipeline = this.#createTextureComputePipeline(
			gpuDevice,
			this.#textureComputeShaderModule,
			this.#textureComputeBindGroupLayout
		);

		const SHADER_INFO = parseWGSL(textureComputeShader);
		this.#uniformInfo = SHADER_INFO.uniforms.uniforms;

		const uniformData = new ArrayBuffer(this.#uniformInfo.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(
			redGPUContext,
			uniformData,
			`${this.constructor.name}_UniformBuffer`,
		);

		/* 기본값 설정 */
		if (this.#currentEffect.uniformDefaults) {
			this.updateUniforms(this.#currentEffect.uniformDefaults);
		}
	}

	#reinitialize() {
		/* 기존 리소스 정리 후 재초기화 */
		this.#init(this.redGPUContext);
		this.#textureComputeBindGroup = this.#createTextureBindGroup(
			this.redGPUContext,
			this.#textureComputeBindGroupLayout,
			this.#gpuTexture.createView()
		);
	}

	#generateShader(): string {
		const baseUniforms = `
            struct Uniforms {
                time: f32,
                ${this.#currentEffect.uniformStruct || ''}
            };
        `;

		const noiseBaseFunctions = this.#getNoiseBaseFunctions();
		const helperFunctions = this.#currentEffect.helperFunctions || '';

		return `
            ${baseUniforms}
            @group(0) @binding(0) var<uniform> uniforms : Uniforms;
            @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba8unorm, write>;
            
            ${noiseBaseFunctions}
            ${helperFunctions}

            @compute @workgroup_size(${this.#COMPUTE_WORKGROUP_SIZE_X},${this.#COMPUTE_WORKGROUP_SIZE_Y},${this.#COMPUTE_WORKGROUP_SIZE_Z})
            fn main (
              @builtin(global_invocation_id) global_id : vec3<u32>,
            ){
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(outputTexture);
                
                /* 경계 체크 */
                if (index.x >= dimensions.x || index.y >= dimensions.y) {
                    return;
                }
                
                let dimW = f32(dimensions.x);
                let dimH = f32(dimensions.y);
                let uv = vec2<f32>((f32(index.x) + 0.5) / dimW, (f32(index.y) + 0.5) / dimH);
                
                ${this.#currentEffect.mainLogic}
                
                textureStore(outputTexture, index, color);
            }
        `;
	}

	#getNoiseBaseFunctions(): string {
		return `
            /* Simplex Noise 2D 기본 함수들 */
            fn mod289_vec3(x: vec3<f32>) -> vec3<f32> {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            
            fn mod289_vec2(x: vec2<f32>) -> vec2<f32> {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            
            fn permute(x: vec3<f32>) -> vec3<f32> {
                return mod289_vec3(((x * 34.0) + 1.0) * x);
            }
            
            fn simplex2D(v: vec2<f32>) -> f32 {
                let C = vec4<f32>(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                var i = floor(v + dot(v, C.yy));
                let x0 = v - i + dot(i, C.xx);
                let i1 = select(vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 0.0), x0.x > x0.y);
                var x12 = x0.xyxy + C.xxzz;
                x12.x = x12.x - i1.x;
                x12.y = x12.y - i1.y;
                i = mod289_vec2(i);
                let p = permute(permute(i.y + vec3<f32>(0.0, i1.y, 1.0)) + i.x + vec3<f32>(0.0, i1.x, 1.0));
                var m = max(0.5 - vec3<f32>(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3<f32>(0.0));
                m = m * m;
                m = m * m;
                let x = 2.0 * fract(p * C.www) - 1.0;
                let h = abs(x) - 0.5;
                let ox = floor(x + 0.5);
                let a0 = x - ox;
                m = m * (1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h));
                let g = vec3<f32>(a0.x * x0.x + h.x * x0.y, a0.y * x12.x + h.y * x12.y, a0.z * x12.z + h.z * x12.w);
                return 130.0 * dot(m, g);
            }

            fn fbm(pos: vec2<f32>, octaves: i32) -> f32 {
                var value = 0.0;
                var amplitude = 0.5;
                var frequency = 1.0;
                var max_value = 0.0;
                
                for (var i = 0; i < octaves; i++) {
                    if (i >= octaves) { break; }
                    value += simplex2D(pos * frequency) * amplitude;
                    max_value += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2.0;
                }
                
                return value / max_value;
            }
        `;
	}

	#getDefaultEffect(): NoiseEffect {
		return {
			uniformStruct: `
                scale: f32,
                speed: f32,
            `,
			mainLogic: `
                let noise_pos = uv * uniforms.scale;
                let time_offset = vec2<f32>(uniforms.time * uniforms.speed * 0.1, uniforms.time * uniforms.speed * 0.05);
                let animated_pos = noise_pos + time_offset;
                let noise_value = simplex2D(animated_pos);
                let normalized_noise = (noise_value + 1.0) * 0.5;
                let color = vec4<f32>(normalized_noise, normalized_noise, normalized_noise, 1.0);
            `,
			uniformDefaults: {
				scale: 8.0,
				speed: 1.0
			}
		};
	}

	#executeComputePass() {
		const commandEncoder = this.redGPUContext.gpuDevice.createCommandEncoder();
		const computePassEncoder = commandEncoder.beginComputePass();
		computePassEncoder.setPipeline(this.#textureComputePipeline);
		computePassEncoder.setBindGroup(0, this.#textureComputeBindGroup);
		computePassEncoder.dispatchWorkgroups(
			Math.ceil(this.#width / this.#COMPUTE_WORKGROUP_SIZE_X),
			Math.ceil(this.#height / this.#COMPUTE_WORKGROUP_SIZE_Y)
		);
		computePassEncoder.end();
		this.redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	#createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
		return redGPUContext.resourceManager.createBindGroupLayout('NoiseTextureBindGroupLayout', {
			entries: [
				{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
				{ binding: 1, visibility: GPUShaderStage.COMPUTE, storageTexture: { format: 'rgba8unorm' } },
			]
		});
	}

	#createStorageTexture(redGPUContext: RedGPUContext, width: number, height: number) {
		const storageTexture = redGPUContext.gpuDevice.createTexture({
			size: { width: width, height: height },
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
			label: `NoiseTexture_${width}x${height}_${Date.now()}`,
		});

		const storageTextureView = storageTexture.createView();
		this.#textureComputeBindGroup = this.#createTextureBindGroup(
			redGPUContext,
			this.#textureComputeBindGroupLayout,
			storageTextureView,
		);

		return storageTexture;
	}

	#createTextureBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, storageTextureView: GPUTextureView) {
		return redGPUContext.gpuDevice.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#uniformBuffer.gpuBuffer,
						offset: 0,
						size: this.#uniformBuffer.gpuBuffer.size
					}
				},
				{ binding: 1, resource: storageTextureView },
			]
		});
	}

	#createTextureComputePipeline(gpuDevice: GPUDevice, shaderModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
		return gpuDevice.createComputePipeline({
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [bindGroupLayout]
			}),
			compute: {
				module: shaderModule,
				entryPoint: 'main',
			}
		});
	}

	#registerResource() {
		basicRegisterResource(this, new ResourceStateBitmapTexture(this));
	}

	#unregisterResource() {
		basicUnregisterResource(this);
	}
}

export default NoiseTexture;

export class NoiseEffects {
	/* 🌊 물결 효과 */
	static water(): NoiseEffect {
		return {
			uniformStruct: `
                wave_speed: f32,
                wave_scale: f32,
                wave_strength: f32,
            `,
			helperFunctions: `
                fn waterAnimation(pos: vec2<f32>, time: f32) -> f32 {
                    let wave1 = simplex2D(pos * 3.0 + vec2<f32>(time * uniforms.wave_speed, 0.0));
                    let wave2 = simplex2D(pos * 2.0 + vec2<f32>(0.0, time * uniforms.wave_speed * 0.7));
                    let wave3 = simplex2D(pos * 4.0 + vec2<f32>(time * uniforms.wave_speed * 0.5, time * uniforms.wave_speed * 0.3));
                    return (wave1 + wave2 * 0.7 + wave3 * 0.5) / 2.2 * uniforms.wave_strength;
                }
            `,
			mainLogic: `
                let noise_value = waterAnimation(uv * uniforms.wave_scale, uniforms.time);
                let normalized_noise = (noise_value + 1.0) * 0.5;
                let blue_tint = vec3<f32>(0.2, 0.6, 1.0);
                let color = vec4<f32>(blue_tint * normalized_noise + vec3<f32>(0.1, 0.2, 0.3), 1.0);
            `,
			uniformDefaults: {
				wave_speed: 0.3,
				wave_scale: 8.0,
				wave_strength: 1.0
			}
		};
	}

	/* ☁️ 구름 효과 */
	static clouds(): NoiseEffect {
		return {
			uniformStruct: `
                cloud_speed: f32,
                cloud_scale: f32,
                cloud_density: f32,
            `,
			helperFunctions: `
                fn cloudAnimation(pos: vec2<f32>, time: f32) -> f32 {
                    let slow_drift = vec2<f32>(time * uniforms.cloud_speed * 0.02, time * uniforms.cloud_speed * 0.01);
                    let large_clouds = fbm(pos * 1.5 + slow_drift, 4) * 0.7;
                    
                    let fast_drift = vec2<f32>(time * uniforms.cloud_speed * 0.08, time * uniforms.cloud_speed * 0.05);
                    let small_details = fbm(pos * 6.0 + fast_drift, 3) * 0.3;
                    
                    return (large_clouds + small_details) * uniforms.cloud_density;
                }
            `,
			mainLogic: `
                let noise_value = cloudAnimation(uv * uniforms.cloud_scale, uniforms.time);
                let cloud_density = smoothstep(0.0, 0.8, (noise_value + 1.0) * 0.5);
                let sky_color = vec3<f32>(0.5, 0.7, 1.0);
                let cloud_color = vec3<f32>(1.0, 1.0, 1.0);
                let color = vec4<f32>(mix(sky_color, cloud_color, cloud_density), 1.0);
            `,
			uniformDefaults: {
				cloud_speed: 1.0,
				cloud_scale: 4.0,
				cloud_density: 1.2
			}
		};
	}

	/* 🔥 불꽃/연기 효과 */
	static fire(): NoiseEffect {
		return {
			uniformStruct: `
                fire_speed: f32,
                fire_scale: f32,
                fire_intensity: f32,
            `,
			helperFunctions: `
                fn fireAnimation(pos: vec2<f32>, time: f32) -> f32 {
                    let rising_motion = vec2<f32>(sin(time * 0.5) * 0.1, -time * uniforms.fire_speed);
                    let turbulence = fbm(pos * uniforms.fire_scale + rising_motion, 5);
                    let intensity = (1.0 - pos.y) * uniforms.fire_intensity;
                    return turbulence * intensity;
                }
            `,
			mainLogic: `
                let noise_value = fireAnimation(uv, uniforms.time);
                let normalized_noise = clamp((noise_value + 1.0) * 0.5, 0.0, 1.0);
                
                let fire_colors = vec3<f32>(1.0, 0.3, 0.0) * normalized_noise * normalized_noise;
                let orange_glow = vec3<f32>(1.0, 0.6, 0.1) * normalized_noise * (1.0 - normalized_noise);
                let final_color = fire_colors + orange_glow;
                
                let color = vec4<f32>(final_color, normalized_noise);
            `,
			uniformDefaults: {
				fire_speed: 0.2,
				fire_scale: 12.0,
				fire_intensity: 2.0
			}
		};
	}

	/* 🌈 레인보우 효과 */
	static rainbow(): NoiseEffect {
		return {
			uniformStruct: `
                rainbow_speed: f32,
                rainbow_scale: f32,
                color_shift: f32,
            `,
			helperFunctions: `
                fn hsv2rgb(c: vec3<f32>) -> vec3<f32> {
                    let K = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    let p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, vec3<f32>(0.0), vec3<f32>(1.0)), c.y);
                }
            `,
			mainLogic: `
                let noise_pos = uv * uniforms.rainbow_scale;
                let time_offset = vec2<f32>(uniforms.time * uniforms.rainbow_speed * 0.1, 0.0);
                let noise_value = simplex2D(noise_pos + time_offset);
                let normalized_noise = (noise_value + 1.0) * 0.5;
                
                let hue = fract(normalized_noise * 2.0 + uniforms.time * uniforms.color_shift);
                let rgb = hsv2rgb(vec3<f32>(hue, 0.8, 1.0));
                let color = vec4<f32>(rgb * normalized_noise, 1.0);
            `,
			uniformDefaults: {
				rainbow_speed: 1.0,
				rainbow_scale: 6.0,
				color_shift: 0.1
			}
		};
	}

	/* ⚡ 일렉트릭 효과 */
	static electric(): NoiseEffect {
		return {
			uniformStruct: `
                electric_speed: f32,
                electric_scale: f32,
                electric_intensity: f32,
            `,
			mainLogic: `
                let noise_pos = uv * uniforms.electric_scale;
                let time_offset = vec2<f32>(uniforms.time * uniforms.electric_speed, 0.0);
                
                let noise1 = simplex2D(noise_pos + time_offset);
                let noise2 = simplex2D(noise_pos * 2.0 - time_offset * 0.7);
                let combined = abs(noise1 * noise2) * uniforms.electric_intensity;
                
                let electric_blue = vec3<f32>(0.2, 0.5, 1.0);
                let white_spark = vec3<f32>(1.0, 1.0, 1.0);
                let intensity = pow(combined, 3.0);
                
                let final_color = mix(electric_blue, white_spark, intensity);
                let color = vec4<f32>(final_color * intensity, 1.0);
            `,
			uniformDefaults: {
				electric_speed: 2.0,
				electric_scale: 15.0,
				electric_intensity: 2.5
			}
		};
	}

	////
	/* 🗺️ 노말맵 효과 */
	static normalMap(): NoiseEffect {
		return {
			uniformStruct: `
                normal_scale: f32,
                normal_strength: f32,
                detail_scale: f32,
                animation_speed: f32,
            `,
			helperFunctions: `
                /* 높이맵에서 노말 벡터 계산 */
                fn calculateNormal(pos: vec2<f32>, heightScale: f32, sampleOffset: f32) -> vec3<f32> {
                    let offset = sampleOffset;
                    
                    /* 주변 4개 포인트의 높이 샘플링 */
                    let heightL = simplex2D(pos + vec2<f32>(-offset, 0.0)) * heightScale;
                    let heightR = simplex2D(pos + vec2<f32>(offset, 0.0)) * heightScale;
                    let heightU = simplex2D(pos + vec2<f32>(0.0, -offset)) * heightScale;
                    let heightD = simplex2D(pos + vec2<f32>(0.0, offset)) * heightScale;
                    
                    /* 그래디언트 계산 */
                    let gradientX = (heightR - heightL) / (2.0 * offset);
                    let gradientY = (heightD - heightU) / (2.0 * offset);
                    
                    /* 노말 벡터 계산 */
                    let normal = normalize(vec3<f32>(-gradientX, -gradientY, 1.0));
                    
                    return normal;
                }
                
                /* 디테일 노말맵 */
                fn detailNormal(pos: vec2<f32>, scale: f32, strength: f32) -> vec3<f32> {
                    let detailPos = pos * scale;
                    return calculateNormal(detailPos, strength, 0.01);
                }
                
                /* 애니메이션 노말맵 */
                fn animatedNormal(pos: vec2<f32>, time: f32) -> vec3<f32> {
                    let timeOffset = vec2<f32>(time * uniforms.animation_speed * 0.1, time * uniforms.animation_speed * 0.05);
                    let animatedPos = pos + timeOffset;
                    
                    /* 기본 노말 */
                    let baseNormal = calculateNormal(animatedPos, uniforms.normal_strength, 0.005);
                    
                    /* 디테일 노말 */
                    let detail = detailNormal(animatedPos, uniforms.detail_scale, uniforms.normal_strength * 0.3);
                    
                    /* 노말 블렌딩 */
                    return normalize(vec3<f32>(
                        baseNormal.x + detail.x,
                        baseNormal.y + detail.y,
                        baseNormal.z * detail.z
                    ));
                }
            `,
			mainLogic: `
                let noise_pos = uv * uniforms.normal_scale;
                let normal = animatedNormal(noise_pos, uniforms.time);
                
                /* 노말을 [0,1] 범위로 변환 (노말맵 형식) */
                let normalMap = (normal + 1.0) * 0.5;
                
                let color = vec4<f32>(normalMap, 1.0);
            `,
			uniformDefaults: {
				normal_scale: 8.0,
				normal_strength: 1.0,
				detail_scale: 32.0,
				animation_speed: 0.5
			}
		};
	}

	/* 🌊 물 노말맵 */
	static waterNormal(): NoiseEffect {
		return {
			uniformStruct: `
                wave_scale: f32,
                wave_speed: f32,
                wave_strength: f32,
                foam_threshold: f32,
            `,
			helperFunctions: `
                fn waterHeightMap(pos: vec2<f32>, time: f32) -> f32 {
                    /* 여러 방향의 물결 */
                    let wave1 = simplex2D(pos * 2.0 + vec2<f32>(time * uniforms.wave_speed, 0.0));
                    let wave2 = simplex2D(pos * 1.5 + vec2<f32>(-time * uniforms.wave_speed * 0.7, time * uniforms.wave_speed * 0.3));
                    let wave3 = simplex2D(pos * 3.0 + vec2<f32>(time * uniforms.wave_speed * 0.4, -time * uniforms.wave_speed * 0.6));
                    
                    /* 큰 파도 */
                    let largWaves = (wave1 + wave2 * 0.7) / 1.7;
                    
                    /* 작은 리플 */
                    let ripples = wave3 * 0.3;
                    
                    return (largWaves + ripples) * uniforms.wave_strength;
                }
                
                fn calculateWaterNormal(pos: vec2<f32>, time: f32) -> vec3<f32> {
                    let offset = 0.01;
                    
                    let heightL = waterHeightMap(pos + vec2<f32>(-offset, 0.0), time);
                    let heightR = waterHeightMap(pos + vec2<f32>(offset, 0.0), time);
                    let heightU = waterHeightMap(pos + vec2<f32>(0.0, -offset), time);
                    let heightD = waterHeightMap(pos + vec2<f32>(0.0, offset), time);
                    
                    let gradientX = (heightR - heightL) / (2.0 * offset);
                    let gradientY = (heightD - heightU) / (2.0 * offset);
                    
                    return normalize(vec3<f32>(-gradientX, -gradientY, 1.0));
                }
            `,
			mainLogic: `
                let wave_pos = uv * uniforms.wave_scale;
                let normal = calculateWaterNormal(wave_pos, uniforms.time);
                
                /* 물거품 효과 (높은 기울기 영역) */
                let slope = length(normal.xy);
                let foam = step(uniforms.foam_threshold, slope);
                
                /* 노말맵 + 물거품 */
                let normalMap = (normal + 1.0) * 0.5;
                let finalColor = mix(normalMap, vec3<f32>(1.0, 1.0, 1.0), foam * 0.3);
                
                let color = vec4<f32>(finalColor, 1.0);
            `,
			uniformDefaults: {
				wave_scale: 6.0,
				wave_speed: 0.8,
				wave_strength: 0.5,
				foam_threshold: 0.7
			}
		};
	}

	/* 🪨 돌/바위 노말맵 */
	static rockNormal(): NoiseEffect {
		return {
			uniformStruct: `
                rock_scale: f32,
                roughness: f32,
                crack_intensity: f32,
                erosion_factor: f32,
            `,
			helperFunctions: `
                fn rockHeightMap(pos: vec2<f32>) -> f32 {
                    /* 기본 록 텍스처 */
                    let baseRock = fbm(pos * 1.0, 4) * 0.8;
                    
                    /* 거친 표면 */
                    let roughSurface = fbm(pos * 8.0, 3) * uniforms.roughness * 0.2;
                    
                    /* 균열/크랙 */
                    let cracks = abs(simplex2D(pos * 16.0)) * uniforms.crack_intensity * 0.1;
                    
                    /* 침식 효과 */
                    let erosion = simplex2D(pos * 0.5) * uniforms.erosion_factor * 0.3;
                    
                    return baseRock + roughSurface - cracks + erosion;
                }
                
                fn calculateRockNormal(pos: vec2<f32>) -> vec3<f32> {
                    let offset = 0.005;
                    
                    let heightL = rockHeightMap(pos + vec2<f32>(-offset, 0.0));
                    let heightR = rockHeightMap(pos + vec2<f32>(offset, 0.0));
                    let heightU = rockHeightMap(pos + vec2<f32>(0.0, -offset));
                    let heightD = rockHeightMap(pos + vec2<f32>(0.0, offset));
                    
                    let gradientX = (heightR - heightL) / (2.0 * offset);
                    let gradientY = (heightD - heightU) / (2.0 * offset);
                    
                    return normalize(vec3<f32>(-gradientX, -gradientY, 1.0));
                }
            `,
			mainLogic: `
                let rock_pos = uv * uniforms.rock_scale;
                let normal = calculateRockNormal(rock_pos);
                
                /* 노말맵 변환 */
                let normalMap = (normal + 1.0) * 0.5;
                
                let color = vec4<f32>(normalMap, 1.0);
            `,
			uniformDefaults: {
				rock_scale: 4.0,
				roughness: 1.2,
				crack_intensity: 0.8,
				erosion_factor: 0.6
			}
		};
	}

	/* 🌿 나무껍질 노말맵 */
	static barkNormal(): NoiseEffect {
		return {
			uniformStruct: `
                bark_scale: f32,
                ring_frequency: f32,
                vertical_stretch: f32,
                bark_roughness: f32,
            `,
			helperFunctions: `
                fn barkHeightMap(pos: vec2<f32>) -> f32 {
                    /* 세로 방향 스트레치 */
                    let stretchedPos = vec2<f32>(pos.x, pos.y * uniforms.vertical_stretch);
                    
                    /* 나무 고리 패턴 */
                    let rings = sin(pos.x * uniforms.ring_frequency) * 0.3;
                    
                    /* 세로 방향 나무결 */
                    let grain = fbm(stretchedPos * vec2<f32>(8.0, 2.0), 4) * 0.4;
                    
                    /* 거친 껍질 텍스처 */
                    let roughBark = fbm(pos * 12.0, 3) * uniforms.bark_roughness * 0.2;
                    
                    return rings + grain + roughBark;
                }
                
                fn calculateBarkNormal(pos: vec2<f32>) -> vec3<f32> {
                    let offset = 0.008;
                    
                    let heightL = barkHeightMap(pos + vec2<f32>(-offset, 0.0));
                    let heightR = barkHeightMap(pos + vec2<f32>(offset, 0.0));
                    let heightU = barkHeightMap(pos + vec2<f32>(0.0, -offset));
                    let heightD = barkHeightMap(pos + vec2<f32>(0.0, offset));
                    
                    let gradientX = (heightR - heightL) / (2.0 * offset);
                    let gradientY = (heightD - heightU) / (2.0 * offset);
                    
                    return normalize(vec3<f32>(-gradientX, -gradientY, 1.0));
                }
            `,
			mainLogic: `
                let bark_pos = uv * uniforms.bark_scale;
                let normal = calculateBarkNormal(bark_pos);
                
                /* 노말맵 변환 */
                let normalMap = (normal + 1.0) * 0.5;
                
                let color = vec4<f32>(normalMap, 1.0);
            `,
			uniformDefaults: {
				bark_scale: 6.0,
				ring_frequency: 20.0,
				vertical_stretch: 0.3,
				bark_roughness: 1.5
			}
		};
	}


}
