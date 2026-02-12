import RedGPUContext from "../../../context/RedGPUContext";
import DefineForFragment from "../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"
import TransmittanceLUTTexture from "./generator/transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "./generator/multiScattering/MultiScatteringLUTTexture";
import SkyViewLUTTexture from "./generator/skyView/SkyViewLUTTexture";

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface SkyAtmosphereMaterial {
	transmittanceTexture: TransmittanceLUTTexture;
	multiScatteringTexture: MultiScatteringLUTTexture;
	skyViewTexture: SkyViewLUTTexture;
	transmittanceTextureSampler: Sampler;

	sunDirection: Float32Array;
	sunSize: number;
	atmosphereHeight: number;
	exposure: number;
	sunIntensity: number;
	earthRadius: number;
	heightFogDensity: number;
	heightFogFalloff: number;
	mieScattering: number;
}

class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, 'SKY_ATMOSPHERE_MATERIAL', SHADER_INFO, 2);
		this.initGPURenderInfos();

		// 초기화 (UE 표준값 기반)
		this.sunDirection = new Float32Array([0, 1, 0]);
		this.sunSize = 0.5;
		this.atmosphereHeight = 60.0;
		this.exposure = 1.0;
		this.sunIntensity = 22.0;
		this.cameraHeight = 0.2;
		this.earthRadius = 6360.0;
		this.heightFogDensity = 0.0;
		this.heightFogFalloff = 0.1;
		this.mieScattering = 0.021;

		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
	}
}

// 개별 속성 정의 (셰이더 구조체 순서와 일치해야 함)
DefineForFragment.defineVec3(SkyAtmosphereMaterial, ['sunDirection']);
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, [
	'sunSize',
	'atmosphereHeight',
	'exposure',
	'sunIntensity',
	'cameraHeight',
	'earthRadius',
	'heightFogDensity',
	'heightFogFalloff',
	'mieScattering'
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
