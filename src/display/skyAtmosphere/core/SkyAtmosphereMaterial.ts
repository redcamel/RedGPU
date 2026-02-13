import RedGPUContext from "../../../context/RedGPUContext";
import DefineForFragment from "../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"
import skyAtmosphereFn from "./skyAtmosphereFn.wgsl"
import TransmittanceLUTTexture from "./generator/transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "./generator/multiScattering/MultiScatteringLUTTexture";
import SkyViewLUTTexture from "./generator/skyView/SkyViewLUTTexture";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + fragmentModuleSource)

interface SkyAtmosphereMaterial {
	transmittanceTexture: TransmittanceLUTTexture;
	multiScatteringTexture: MultiScatteringLUTTexture;
	skyViewTexture: SkyViewLUTTexture;
	transmittanceTextureSampler: Sampler;

	sunDirection: Float32Array;
	sunSize: number;
	rayleighScattering: Float32Array;
	mieAnisotropy: number;
	ozoneAbsorption: Float32Array;
	ozoneLayerCenter: number;
	groundAlbedo: Float32Array;
	groundAmbient: number;

	earthRadius: number;
	atmosphereHeight: number;
	mieScattering: number;
	mieExtinction: number;
	rayleighScaleHeight: number;
	mieScaleHeight: number;
	cameraHeight: number;
	multiScatteringAmbient: number;
	exposure: number;
	sunIntensity: number;
	heightFogDensity: number;
	heightFogFalloff: number;
	horizonHaze: number;
	mieGlow: number;
	mieHalo: number;
	groundShininess: number;
	groundSpecular: number;
	ozoneLayerWidth: number;
}

class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, 'SKY_ATMOSPHERE_MATERIAL', SHADER_INFO, 2);
		this.initGPURenderInfos();

		// 초기화 (UE 표준값 기반)
		this.rayleighScattering = new Float32Array([0.0058, 0.0135, 0.0331]);
		this.mieAnisotropy = 0.9;
		this.ozoneAbsorption = new Float32Array([0.00065, 0.00188, 0.00008]);
		this.ozoneLayerCenter = 25.0;
		this.groundAlbedo = new Float32Array([0.15, 0.15, 0.15]);
		this.groundAmbient = 0.4;
		this.sunDirection = new Float32Array([0, 1, 0]);
		this.sunSize = 0.5;

		this.earthRadius = 6360.0;
		this.atmosphereHeight = 60.0;
		this.mieScattering = 0.021;
		this.mieExtinction = 0.021;
		this.rayleighScaleHeight = 8.0;
		this.mieScaleHeight = 1.2;
		this.cameraHeight = 0.2;
		this.multiScatteringAmbient = 0.05;
		this.exposure = 1.0;
		this.sunIntensity = 22.0;
		this.heightFogDensity = 0.0;
		this.heightFogFalloff = 0.1;
		this.horizonHaze = 0.3;
		this.mieGlow = 0.75;
		this.mieHalo = 0.99;
		this.groundShininess = 512.0;
		this.groundSpecular = 4.0;
		this.ozoneLayerWidth = 15.0;

		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
	}
}

// 개별 속성 정의 (셰이더 구조체 AtmosphereParameters 순서와 정확히 일치해야 함)
DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['rayleighScattering']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['mieAnisotropy']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['ozoneAbsorption']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['ozoneLayerCenter']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['groundAlbedo']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['groundAmbient']);

DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['sunDirection']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, ['sunSize']);

// Scalars
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, [
	'earthRadius',
	'atmosphereHeight',
	'mieScattering',
	'mieExtinction',
	'rayleighScaleHeight',
	'mieScaleHeight',
	'cameraHeight',
	'multiScatteringAmbient',
	'exposure',
	'sunIntensity',
	'heightFogDensity',
	'heightFogFalloff',
	'horizonHaze',
	'mieGlow',
	'mieHalo',
	'groundShininess',
	'groundSpecular',
	'ozoneLayerWidth'
]);

DefineForFragment.defineTexture(SkyAtmosphereMaterial, [
	'transmittanceTexture',
	'multiScatteringTexture',
	'skyViewTexture',
]);

DefineForFragment.defineSampler(SkyAtmosphereMaterial, [
	'transmittanceTextureSampler',
]);

Object.freeze(SkyAtmosphereMaterial);
export default SkyAtmosphereMaterial;
