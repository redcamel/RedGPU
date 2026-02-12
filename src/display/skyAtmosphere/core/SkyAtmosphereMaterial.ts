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

	// [수정] 데이터 정렬 밀림 방지를 위해 vec4 단위로 관리
	// xyz: sunDirection, w: sunSize
	sunData: Float32Array;
	// x: atmHeight, y: exposure, z: sunIntensity, w: cameraHeight
	atmosphereParams: Float32Array;
	// x: earthRadius, yzw: padding
	earthRadius: Float32Array;
}

class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	dirtyPipeline: boolean = false

	// 사용 편의를 위한 Getter/Setter (기존 코드 호환성 유지)
	get sunDirection(): Float32Array { return this.sunData.subarray(0, 3); }
	set sunDirection(v: Float32Array | number[]) {
		this.sunData[0] = v[0]; this.sunData[1] = v[1]; this.sunData[2] = v[2];
	}

	get sunSize(): number { return this.sunData[3]; }
	set sunSize(v: number) { this.sunData[3] = v; }

	get atmosphereHeight(): number { return this.atmosphereParams[0]; }
	set atmosphereHeight(v: number) { this.atmosphereParams[0] = v; }

	get exposure(): number { return this.atmosphereParams[1]; }
	set exposure(v: number) { this.atmosphereParams[1] = v; }

	get sunIntensity(): number { return this.atmosphereParams[2]; }
	set sunIntensity(v: number) { this.atmosphereParams[2] = v; }

	get cameraHeight(): number { return this.atmosphereParams[3]; }
	set cameraHeight(v: number) { this.atmosphereParams[3] = v; }

	get earthRadiusVal(): number { return this.earthRadius[0]; }
	set earthRadiusVal(v: number) { this.earthRadius[0] = v; }

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			'SKY_ATMOSPHERE_MATERIAL',
			SHADER_INFO,
			2
		)
		this.initGPURenderInfos()

		// [초기화] vec4 패킹에 맞춰 기본값 설정
		this.sunData = new Float32Array([0, 1, 0, 0.5])
		this.atmosphereParams = new Float32Array([60.0, 20.0, 22.0, 0.2])
		this.earthRadius = new Float32Array([6360.0, 0, 0, 0])

		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		})
	}
}

// [중요] defineVec4를 사용하여 16바이트 정렬을 강제합니다.
DefineForFragment.defineVec4(SkyAtmosphereMaterial, [
	'sunData',
	'atmosphereParams',
	'earthRadius'
])

DefineForFragment.defineTexture(SkyAtmosphereMaterial, [
	'transmittanceTexture',
	'multiScatteringTexture',
	'skyViewTexture',
])
DefineForFragment.defineSampler(SkyAtmosphereMaterial, [
	'transmittanceTextureSampler',
])

Object.freeze(SkyAtmosphereMaterial)
export default SkyAtmosphereMaterial