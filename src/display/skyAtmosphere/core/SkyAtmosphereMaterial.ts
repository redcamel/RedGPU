import RedGPUContext from "../../../context/RedGPUContext";
import DefineForFragment from "../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"
import TransmittanceLUTTexture from "./generator/TransmittanceLUTTexture";

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface SkyAtmosphereMaterial {
	/** [KO] 투과율 LUT 텍스처 [EN] Transmittance LUT texture */
	transmittanceTexture: TransmittanceLUTTexture;
	/** [KO] 투과율 텍스처 샘플러 [EN] Transmittance texture sampler */
	transmittanceTextureSampler: Sampler;
	/** [KO] 태양 방향 [EN] Sun direction */
	sunDirection: Float32Array;
}

/**
 * [KO] SkyAtmosphere 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyAtmosphere rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 머티리얼 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a material class used internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphereMaterial extends ABitmapBaseMaterial {
	/**
	 * [KO] 파이프라인 dirty 상태 플래그
	 * [EN] Pipeline dirty status flag
	 */
	dirtyPipeline: boolean = false

	/**
	 * [KO] SkyAtmosphereMaterial 인스턴스를 생성합니다. (내부 시스템 전용)
	 * [EN] Creates a SkyAtmosphereMaterial instance. (Internal system only)
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
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
DefineForFragment.defineTexture(SkyAtmosphereMaterial, [
	'transmittanceTexture',
])
DefineForFragment.defineSampler(SkyAtmosphereMaterial, [
	'transmittanceTextureSampler',
])

Object.freeze(SkyAtmosphereMaterial)
export default SkyAtmosphereMaterial
