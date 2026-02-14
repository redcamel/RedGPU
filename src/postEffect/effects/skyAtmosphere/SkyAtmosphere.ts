import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import CameraVolumeGenerator from "./core/generator/cameraVolume/CameraVolumeGenerator";
import skyAtmosphereFn from "./core/skyAtmosphereFn.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../resources/sampler/Sampler";
import POST_EFFECT_SYSTEM_UNIFORM from '../../core/postEffectSystemUniform.wgsl';

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 포스트 이펙트 클래스입니다.
 * [EN] Physics-based Atmospheric Scattering post-effect class.
 */
class SkyAtmosphere extends ASinglePassPostEffect {
	#transmittanceGenerator: TransmittanceGenerator;
	#multiScatteringGenerator: MultiScatteringGenerator;
	#skyViewGenerator: SkyViewGenerator;
	#cameraVolumeGenerator: CameraVolumeGenerator;
	#sampler: Sampler;

	#params = {
		earthRadius: 6360.0,
		atmosphereHeight: 60.0,
		mieScattering: 0.00399,
		mieExtinction: 0.00444,
		rayleighScattering: [0.0058, 0.0135, 0.0331],
		rayleighScaleHeight: 8.0,
		mieScaleHeight: 1.2,
		mieAnisotropy: 0.8,
		ozoneAbsorption: [0.00065, 0.00188, 0.00008],
		ozoneLayerCenter: 25.0,
		ozoneLayerWidth: 15.0,
		multiScatteringAmbient: 0.0,
		sunSize: 0.5,
		sunIntensity: 22.0,
		exposure: 1.0,
		heightFogDensity: 0.0,
		heightFogFalloff: 0.1,
		horizonHaze: 0.3,
		groundAmbient: 0.4,
		groundAlbedo: [0.1, 0.1, 0.1],
		mieGlow: 0.75,
		mieHalo: 0.99,
		groundShininess: 512.0,
		groundSpecular: 4.0,
		sunDirection: new Float32Array([0, 1, 0]),
		cameraHeight: 0.001,
		padding0: 0,
		padding1: 0
	};

	#sunElevation: number = 45;
	#sunAzimuth: number = 0;
	#dirtyLUT: boolean = true;
	#dirtySkyView: boolean = true;

	#uniformBuffer: UniformBuffer;
	#pipeline: GPUComputePipeline;
	#bindGroupLayout0: GPUBindGroupLayout;
	#bindGroupLayout1: GPUBindGroupLayout;
	#outputTexture: GPUTexture;
	#outputTextureView: GPUTextureView;
	#prevDimensions: { width: number, height: number };

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {gpuDevice, resourceManager} = redGPUContext;

		this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext);
		this.#multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext);
		this.#skyViewGenerator = new SkyViewGenerator(redGPUContext);
		this.#cameraVolumeGenerator = new CameraVolumeGenerator(redGPUContext);
		// 샘플러 설정 명시 (원본과 동일하게 clamp-to-edge 적용)
		this.#sampler = new Sampler(redGPUContext, { 
			magFilter: 'linear', 
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});

		const uniformData = new ArrayBuffer(160);
		this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, 'SKY_ATMOSPHERE_PE_UNIFORM_BUFFER');

		this.#bindGroupLayout0 = gpuDevice.createBindGroupLayout({
			label: 'SKY_ATMOSPHERE_PE_BGL_0',
			entries: [
				{ binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {} },
				{ binding: 1, visibility: GPUShaderStage.COMPUTE, texture: { sampleType: 'depth' } },
				{ binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {} },
				{ binding: 3, visibility: GPUShaderStage.COMPUTE, texture: {} },
				{ binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {} },
				{ binding: 5, visibility: GPUShaderStage.COMPUTE, texture: { viewDimension: '3d' } },
				{ binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {} }
			]
		});

		this.#bindGroupLayout1 = gpuDevice.createBindGroupLayout({
			label: 'SKY_ATMOSPHERE_PE_BGL_1',
			entries: [
				{ binding: 0, visibility: GPUShaderStage.COMPUTE, storageTexture: { format: 'rgba16float', access: 'write-only' } },
				{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
				{ binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }
			]
		});

		const shaderCode = [
			skyAtmosphereFn,
			'@group(0) @binding(0) var sourceTexture : texture_2d<f32>;',
			'@group(0) @binding(1) var depthTexture : texture_depth_2d;',
			'@group(0) @binding(2) var transmittanceTexture : texture_2d<f32>;',
			'@group(0) @binding(3) var multiScatteringTexture : texture_2d<f32>;',
			'@group(0) @binding(4) var skyViewTexture : texture_2d<f32>;',
			'@group(0) @binding(5) var cameraVolumeTexture : texture_3d<f32>;',
			'@group(0) @binding(6) var tSampler : sampler;',
			'',
			'@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
			POST_EFFECT_SYSTEM_UNIFORM,
			'@group(1) @binding(2) var<uniform> uniforms: Uniforms;',
			'',
			uniformStructCode,
			'',
			'fn linearDepth(depthSample : f32) -> f32 {',
			'    return systemUniforms.camera.farClipping * systemUniforms.camera.nearClipping / fma(depthSample, systemUniforms.camera.nearClipping - systemUniforms.camera.farClipping, systemUniforms.camera.farClipping);',
			'}',
			'fn fetchDepth(pos: vec2<u32>) -> f32 { return textureLoad(depthTexture, pos, 0); }',
			'',
			'fn hash33_pe(p: vec3<f32>) -> vec3<f32> {',
			'    var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));',
			'    p3 += dot(p3, p3.yxz + 33.33);',
			'    return fract((p3.xxy + p3.yzz) * p3.zyx);',
			'}',
			'fn get_ground_noise_pe(p: vec3<f32>) -> f32 {',
			'    let i = floor(p);',
			'    let f = fract(p);',
			'    let u = f * f * (3.0 - 2.0 * f);',
			'    return mix(mix(mix(dot(hash33_pe(i + vec3<f32>(0.0, 0.0, 0.0)), f - vec3<f32>(0.0, 0.0, 0.0)),',
			'                       dot(hash33_pe(i + vec3<f32>(1.0, 0.0, 0.0)), f - vec3<f32>(1.0, 0.0, 0.0)), u.x),',
			'                   mix(dot(hash33_pe(i + vec3<f32>(0.0, 1.0, 0.0)), f - vec3<f32>(0.0, 1.0, 0.0)),',
			'                       dot(hash33_pe(i + vec3<f32>(1.0, 1.0, 0.0)), f - vec3<f32>(1.0, 1.0, 0.0)), u.x), u.y),',
			'               mix(mix(dot(hash33_pe(i + vec3<f32>(0.0, 0.0, 1.0)), f - vec3<f32>(0.0, 0.0, 1.0)),',
			'                       dot(hash33_pe(i + vec3<f32>(1.0, 0.0, 1.0)), f - vec3<f32>(1.0, 0.0, 1.0)), u.x),',
			'                   mix(dot(hash33_pe(i + vec3<f32>(0.0, 1.0, 1.0)), f - vec3<f32>(0.0, 1.0, 1.0)),',
			'                       dot(hash33_pe(i + vec3<f32>(1.0, 1.0, 1.0)), f - vec3<f32>(1.0, 1.0, 1.0)), u.x), u.y), u.z);',
			'}',
			'',
			'@compute @workgroup_size(16, 16)',
			'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
			computeCode,
			'}'
		].join('\n');

		const shaderModule = resourceManager.createGPUShaderModule('SKY_ATMOSPHERE_PE_SHADER', { code: shaderCode });
		this.#pipeline = gpuDevice.createComputePipeline({
			label: 'SKY_ATMOSPHERE_PE_PIPELINE',
			layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#bindGroupLayout0, this.#bindGroupLayout1] }),
			compute: { module: shaderModule, entryPoint: 'main' }
		});

		this.#updateSunDirection();
		this.#syncAllUniforms();
	}

	#updateSunDirection(): void {
		const phi = (90 - this.#sunElevation) * (Math.PI / 180);
		const theta = (this.#sunAzimuth) * (Math.PI / 180);
		this.#params.sunDirection[0] = Math.sin(phi) * Math.cos(theta);
		this.#params.sunDirection[1] = Math.cos(phi);
		this.#params.sunDirection[2] = Math.sin(phi) * Math.sin(theta);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 48, View: Float32Array }, Array.from(this.#params.sunDirection));
		this.#dirtySkyView = true;
	}

	#syncAllUniforms(): void {
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 0, View: Float32Array }, this.#params.rayleighScattering);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 12, View: Float32Array }, [this.#params.mieAnisotropy]);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 16, View: Float32Array }, this.#params.ozoneAbsorption);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 28, View: Float32Array }, [this.#params.ozoneLayerCenter]);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 32, View: Float32Array }, this.#params.groundAlbedo);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 44, View: Float32Array }, [this.#params.groundAmbient]);
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 48, View: Float32Array }, Array.from(this.#params.sunDirection));
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 60, View: Float32Array }, [this.#params.sunSize]);
		
		this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 64, View: Float32Array }, [
			this.#params.earthRadius, this.#params.atmosphereHeight, this.#params.mieScattering, this.#params.mieExtinction,
			this.#params.rayleighScaleHeight, this.#params.mieScaleHeight, this.#params.cameraHeight, this.#params.multiScatteringAmbient,
			this.#params.exposure, this.#params.sunIntensity, this.#params.heightFogDensity, this.#params.heightFogFalloff,
			this.#params.horizonHaze, this.#params.mieGlow, this.#params.mieHalo, this.#params.groundShininess,
			this.#params.groundSpecular, this.#params.ozoneLayerWidth
		]);
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
		const {gpuDevice, resourceManager} = this.redGPUContext;
		const {rawCamera} = view;
		const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
		const currentHeightKm = Math.max(0.001, cameraPos[1] / 1000.0);

		if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.01) {
			this.#params.cameraHeight = currentHeightKm;
			this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 88, View: Float32Array }, [currentHeightKm]);
			this.#dirtySkyView = true;
		}

		if (this.#dirtyLUT) {
			this.#transmittanceGenerator.render(this.#params);
			this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture, this.#params);
			this.#dirtyLUT = false;
			this.#dirtySkyView = true;
		}

		if (this.#dirtySkyView) {
			this.#skyViewGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#params);
			this.#cameraVolumeGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#params);
			this.#dirtySkyView = false;
		}

		if (!this.#outputTexture || this.#prevDimensions?.width !== width || this.#prevDimensions?.height !== height) {
			if (this.#outputTexture) this.#outputTexture.destroy();
			this.#outputTexture = resourceManager.createManagedTexture({
				size: { width, height },
				format: 'rgba16float',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
				label: 'SkyAtmosphere_PE_Output'
			});
			this.#outputTextureView = this.#outputTexture.createView();
			this.#prevDimensions = { width, height };
		}

		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'SkyAtmosphere_PE_Pass' });
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);

		const bindGroup0 = gpuDevice.createBindGroup({
			layout: this.#bindGroupLayout0,
			entries: [
				{ binding: 0, resource: sourceTextureInfo.textureView },
				{ binding: 1, resource: view.viewRenderTextureManager.depthTextureView },
				{ binding: 2, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView },
				{ binding: 3, resource: this.#multiScatteringGenerator.lutTexture.gpuTextureView },
				{ binding: 4, resource: this.#skyViewGenerator.lutTexture.gpuTextureView },
				{ binding: 5, resource: this.#cameraVolumeGenerator.lutTexture.gpuTextureView },
				{ binding: 6, resource: this.#sampler.gpuSampler }
			]
		});

		const bindGroup1 = gpuDevice.createBindGroup({
			layout: this.#bindGroupLayout1,
			entries: [
				{ binding: 0, resource: this.#outputTextureView },
				{ binding: 1, resource: { buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer } },
				{ binding: 2, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
			]
		});

		passEncoder.setBindGroup(0, bindGroup0);
		passEncoder.setBindGroup(1, bindGroup1);
		passEncoder.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);

		return { texture: this.#outputTexture, textureView: this.#outputTextureView };
	}

	/** [KO] 태양 고도 [EN] Sun elevation */
	get sunElevation(): number { return this.#sunElevation; }
	set sunElevation(v: number) { validateNumberRange(v, -90, 90); this.#sunElevation = v; this.#updateSunDirection(); }

	/** [KO] 태양 방위각 [EN] Sun azimuth */
	get sunAzimuth(): number { return this.#sunAzimuth; }
	set sunAzimuth(v: number) { validateNumberRange(v, -360, 360); this.#sunAzimuth = v; this.#updateSunDirection(); }

	/** [KO] 노출 [EN] Exposure */
	get exposure(): number { return this.#params.exposure; }
	set exposure(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.exposure = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 96, View: Float32Array }, [v]); }

	/** [KO] 태양 강도 [EN] Sun intensity */
	get sunIntensity(): number { return this.#params.sunIntensity; }
	set sunIntensity(v: number) { validatePositiveNumberRange(v, 0, 10000); this.#params.sunIntensity = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 100, View: Float32Array }, [v]); }

	/** [KO] 지구 반지름 [EN] Earth radius */
	get earthRadius(): number { return this.#params.earthRadius; }
	set earthRadius(v: number) { validatePositiveNumberRange(v, 1); this.#params.earthRadius = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 64, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 대기 높이 [EN] Atmosphere height */
	get atmosphereHeight(): number { return this.#params.atmosphereHeight; }
	set atmosphereHeight(v: number) { validatePositiveNumberRange(v, 1); this.#params.atmosphereHeight = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 68, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 미 산란 계수 [EN] Mie scattering coefficient */
	get mieScattering(): number { return this.#params.mieScattering; }
	set mieScattering(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.mieScattering = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 72, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 미 소멸 계수 [EN] Mie extinction coefficient */
	get mieExtinction(): number { return this.#params.mieExtinction; }
	set mieExtinction(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.mieExtinction = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 76, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 레일리 산란 계수 [EN] Rayleigh scattering coefficient */
	get rayleighScattering(): [number, number, number] { return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]]; }
	set rayleighScattering(v: [number, number, number]) { this.#params.rayleighScattering = [...v]; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 0, View: Float32Array }, this.#params.rayleighScattering); this.#dirtyLUT = true; }

	/** [KO] 레일리 스케일 높이 [EN] Rayleigh scale height */
	get rayleighScaleHeight(): number { return this.#params.rayleighScaleHeight; }
	set rayleighScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#params.rayleighScaleHeight = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 80, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 미 스케일 높이 [EN] Mie scale height */
	get mieScaleHeight(): number { return this.#params.mieScaleHeight; }
	set mieScaleHeight(v: number) { validatePositiveNumberRange(v, 0.1, 100); this.#params.mieScaleHeight = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 84, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 미 비등방성 [EN] Mie anisotropy */
	get mieAnisotropy(): number { return this.#params.mieAnisotropy; }
	set mieAnisotropy(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieAnisotropy = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 12, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 지평선 연무 [EN] Horizon haze */
	get horizonHaze(): number { return this.#params.horizonHaze; }
	set horizonHaze(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.horizonHaze = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 112, View: Float32Array }, [v]); }

	/** [KO] 지면 알베도 [EN] Ground albedo */
	get groundAlbedo(): [number, number, number] { return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]]; }
	set groundAlbedo(v: [number, number, number]) { this.#params.groundAlbedo = [...v]; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 32, View: Float32Array }, this.#params.groundAlbedo); this.#dirtyLUT = true; }

	/** [KO] 지면 환경광 [EN] Ground ambient */
	get groundAmbient(): number { return this.#params.groundAmbient; }
	set groundAmbient(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.groundAmbient = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 44, View: Float32Array }, [v]); }

	/** [KO] 오존 흡수 계수 [EN] Ozone absorption coefficient */
	get ozoneAbsorption(): [number, number, number] { return [this.#params.ozoneAbsorption[0], this.#params.ozoneAbsorption[1], this.#params.ozoneAbsorption[2]]; }
	set ozoneAbsorption(v: [number, number, number]) { this.#params.ozoneAbsorption = [...v]; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 16, View: Float32Array }, this.#params.ozoneAbsorption); this.#dirtyLUT = true; }

	/** [KO] 오존층 중심 [EN] Ozone layer center */
	get ozoneLayerCenter(): number { return this.#params.ozoneLayerCenter; }
	set ozoneLayerCenter(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.ozoneLayerCenter = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 28, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 오존층 두께 [EN] Ozone layer width */
	get ozoneLayerWidth(): number { return this.#params.ozoneLayerWidth; }
	set ozoneLayerWidth(v: number) { validatePositiveNumberRange(v, 1, 50); this.#params.ozoneLayerWidth = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 132, View: Float32Array }, [v]); this.#dirtyLUT = true; }

	/** [KO] 다중 산란 환경광 [EN] Multi-scattering ambient */
	get multiScatteringAmbient(): number { return this.#params.multiScatteringAmbient; }
	set multiScatteringAmbient(v: number) { validatePositiveNumberRange(v, 0, 1.0); this.#params.multiScatteringAmbient = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 92, View: Float32Array }, [v]); this.#dirtySkyView = true; }

	/** [KO] 높이 안개 밀도 [EN] Height fog density */
	get heightFogDensity(): number { return this.#params.heightFogDensity; }
	set heightFogDensity(v: number) { validatePositiveNumberRange(v, 0, 10); this.#params.heightFogDensity = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 104, View: Float32Array }, [v]); }

	/** [KO] 높이 안개 감쇄 [EN] Height fog falloff */
	get heightFogFalloff(): number { return this.#params.heightFogFalloff; }
	set heightFogFalloff(v: number) { validatePositiveNumberRange(v, 0.001, 10); this.#params.heightFogFalloff = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 108, View: Float32Array }, [v]); }

	/** [KO] 태양 시직경 [EN] Sun size */
	get sunSize(): number { return this.#params.sunSize; }
	set sunSize(v: number) { validatePositiveNumberRange(v, 0.01, 10.0); this.#params.sunSize = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 60, View: Float32Array }, [v]); }

	/** [KO] 미 글로우 [EN] Mie glow */
	get mieGlow(): number { return this.#params.mieGlow; }
	set mieGlow(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieGlow = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 116, View: Float32Array }, [v]); }

	/** [KO] 미 헤일로 [EN] Mie halo */
	get mieHalo(): number { return this.#params.mieHalo; }
	set mieHalo(v: number) { validateNumberRange(v, 0, 0.999); this.#params.mieHalo = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 120, View: Float32Array }, [v]); }

	/** [KO] 지면 광택도 [EN] Ground shininess */
	get groundShininess(): number { return this.#params.groundShininess; }
	set groundShininess(v: number) { validatePositiveNumberRange(v, 1, 2048); this.#params.groundShininess = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 124, View: Float32Array }, [v]); }

	/** [KO] 지면 스펙큘러 [EN] Ground specular */
	get groundSpecular(): number { return this.#params.groundSpecular; }
	set groundSpecular(v: number) { validatePositiveNumberRange(v, 0, 100); this.#params.groundSpecular = v; this.#uniformBuffer.writeOnlyBuffer({ uniformOffset: 128, View: Float32Array }, [v]); }

	get transmittanceTexture() { return this.#transmittanceGenerator.lutTexture; }
	get multiScatteringTexture() { return this.#multiScatteringGenerator.lutTexture; }
	get skyViewTexture() { return this.#skyViewGenerator.lutTexture; }
	get cameraVolumeTexture() { return this.#cameraVolumeGenerator.lutTexture; }
	get skyAtmosphereSampler() { return this.#sampler; }
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;
