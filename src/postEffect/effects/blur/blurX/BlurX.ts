import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * X축 방향 블러 후처리 효과를 제공하는 클래스입니다.
 *
 * @category PostEffect
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/blurX/"></iframe>
 */
class BlurX extends ASinglePassPostEffect {
	/**
	 * 블러 강도입니다. 기본값은 32입니다.
	 * @private
	 */
	#size: number = 32

	/**
	 * BlurX 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_BLUR_X',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.size = this.#size
	}

	/**
	 * 블러 강도를 반환합니다.
	 */
	get size(): number {
		return this.#size;
	}

	/**
	 * 블러 강도를 설정합니다.
	 * 최소값은 0입니다.
	 * @param value - 블러 강도
	 */
	set size(value: number) {
		validateNumberRange(value, 0)
		this.#size = value;
		this.updateUniform('size', value)
	}
}

Object.freeze(BlurX)
export default BlurX
