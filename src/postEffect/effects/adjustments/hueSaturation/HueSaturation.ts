import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * 색상(Hue)과 채도(Saturation)를 조절할 수 있습니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상 회전
 * effect.saturation = 50;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/hueSaturation/"></iframe>
 */
class HueSaturation extends ASinglePassPostEffect {
	/** 색상(Hue). 기본값 0, 범위 -180~180 */
	#hue: number = 0
	/** 채도(Saturation). 기본값 0, 범위 -100~100 */
	#saturation: number = 0

	/**
	 * HueSaturation 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_HUE_SATURATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	/** 색상 반환 */
	get hue(): number {
		return this.#hue;
	}

	/**
	 * 색상 설정
	 * 범위 -180~180
	 */
	set hue(value: number) {
		validateNumberRange(value, -180, 180)
		this.#hue = value;
		this.updateUniform('hue', value)
	}

	/** 채도 반환 */
	get saturation(): number {
		return this.#saturation;
	}

	/**
	 * 채도 설정
	 * 범위 -100~100
	 */
	set saturation(value: number) {
		validateNumberRange(value, -100, 100)
		this.#saturation = value;
		this.updateUniform('saturation', value)
	}
}

Object.freeze(HueSaturation)
export default HueSaturation
