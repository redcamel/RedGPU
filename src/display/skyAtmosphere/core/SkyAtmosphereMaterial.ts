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
	/** [KO] 투과율 LUT 텍스처 [EN] Transmittance LUT texture */
	transmittanceTexture: TransmittanceLUTTexture;
	/** [KO] 다중 산란 LUT 텍스처 [EN] Multi-scattering LUT texture */
	multiScatteringTexture: MultiScatteringLUTTexture;
	/** [KO] 스카이 뷰 LUT 텍스처 [EN] Sky-View LUT texture */
	skyViewTexture: SkyViewLUTTexture;
	/** [KO] LUT 텍스처 샘플러 [EN] LUT texture sampler */
	transmittanceTextureSampler: Sampler;
	/** [KO] 태양 방향 [EN] Sun direction */
	sunDirection: Float32Array;
	/** [KO] 태양 크기 [EN] Sun size */
	sunSize: number;
}

/**
 * [KO] SkyAtmosphere 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyAtmosphere rendering.
 */
class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	/**
	 * [KO] 파이프라인 dirty 상태 플래그
	 * [EN] Pipeline dirty status flag
	 */
	dirtyPipeline: boolean = false

	/**
	 * [KO] SkyAtmosphereMaterial 인스턴스를 생성합니다. (내부 시스템 전용)
	 *
	 * @param redGPUContext - RedGPUContext 인스턴스
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			'SKY_ATMOSPHERE_MATERIAL',
			SHADER_INFO,
			2
		)
		this.initGPURenderInfos()
		this.sunDirection = new Float32Array([0, 1, 0])
		this.sunSize = 0.5;
		this.transmittanceTextureSampler = new Sampler(this.redGPUContext, {
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		})
	}
}

DefineForFragment.defineVec3(SkyAtmosphereMaterial, [
	['sunDirection', [0, 1, 0]],
])
DefineForFragment.definePositiveNumber(SkyAtmosphereMaterial, [
	['sunSize', 0.5],
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
