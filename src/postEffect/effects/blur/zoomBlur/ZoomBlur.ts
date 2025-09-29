import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * 중심점에서 방사형으로 퍼지는 블러 효과를 만듭니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/zoomBlur/"></iframe>
 */
class ZoomBlur extends ASinglePassPostEffect {
	/** 블러 강도. 기본값 64, 최소 0 */
	#amount: number = 64
	/** 중심 X. 기본값 0 */
	#centerX: number = 0
	/** 중심 Y. 기본값 0 */
	#centerY: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_ZOOM_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
	}
	/** 중심 X 반환 */
	get centerX(): number {
		return this.#centerX;
	}
	/** 중심 X 설정 */
	set centerX(value: number) {
		validateNumber(value)
		this.#centerX = value;
		this.updateUniform('centerX', value)
	}
	/** 중심 Y 반환 */
	get centerY(): number {
		return this.#centerY;
	}
	/** 중심 Y 설정 */
	set centerY(value: number) {
		validateNumber(value)
		this.#centerY = value;
		this.updateUniform('centerY', value)
	}
	/** 블러 강도 반환 */
	get amount(): number {
		return this.#amount;
	}
	/** 블러 강도 설정. 최소 0 */
	set amount(value: number) {
		validateNumberRange(value, 0)
		this.#amount = value;
		this.updateUniform('amount', value)
	}
}

Object.freeze(ZoomBlur)
export default ZoomBlur
