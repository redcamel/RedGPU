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

	// Uniform vec4 Blocks
	sunData: Float32Array;          // [dir.x, dir.y, dir.z, size]
	atmosphereParams: Float32Array; // [height, exposure, intensity, camHeight]
	earthParams: Float32Array;      // [radius, 0, 0, 0]
}

class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	// 기존 인터페이스 호환용 Getter/Setter
	get sunDirection(): Float32Array { return this.sunData.subarray(0, 3); }
	set sunDirection(v: Float32Array | number[]) {
		this.sunData[0] = v[0]; this.sunData[1] = v[1]; this.sunData[2] = v[2];
		this.sunData = this.sunData; // 업데이트 트리거
	}
	get sunSize(): number { return this.sunData[3]; }
	set sunSize(v: number) { 
		this.sunData[3] = v; 
		this.sunData = this.sunData; // 업데이트 트리거
	}

	get atmosphereHeight(): number { return this.atmosphereParams[0]; }
	set atmosphereHeight(v: number) { 
		this.atmosphereParams[0] = v; 
		this.atmosphereParams = this.atmosphereParams; 
	}
	get exposure(): number { return this.atmosphereParams[1]; }
	set exposure(v: number) { 
		this.atmosphereParams[1] = v; 
		this.atmosphereParams = this.atmosphereParams;
	}
	get sunIntensity(): number { return this.atmosphereParams[2]; }
	set sunIntensity(v: number) { 
		this.atmosphereParams[2] = v; 
		this.atmosphereParams = this.atmosphereParams;
	}
	get cameraHeight(): number { return this.atmosphereParams[3]; }
	set cameraHeight(v: number) { 
		this.atmosphereParams[3] = v; 
		this.atmosphereParams = this.atmosphereParams;
	}

	get earthRadiusVal(): number { return this.earthParams[0]; }
	set earthRadiusVal(v: number) { 
		this.earthParams[0] = v; 
		this.earthParams = this.earthParams;
	}

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, 'SKY_ATMOSPHERE_MATERIAL', SHADER_INFO, 2);
		this.initGPURenderInfos();

		// 초기화 (UE 표준값 기반)
		this.sunData = new Float32Array([0, 1, 0, 0.5]);
		this.atmosphereParams = new Float32Array([60.0, 1.0, 22.0, 0.2]);
		this.earthParams = new Float32Array([6360.0, 0, 0, 0]);

		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
	}
}

// 16바이트 정렬 정의
DefineForFragment.defineVec4(SkyAtmosphereMaterial, [
	'sunData',
	'atmosphereParams',
	'earthParams'
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
