import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"

/**
 * 색상 반전(Invert) 후처리 이펙트입니다.
 * 화면의 모든 색상을 반전시킵니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/invert/"></iframe>
 */
class Invert extends ASinglePassPostEffect {
	/**
	 * Invert 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_INVERT',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Invert)
export default Invert
