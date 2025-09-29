import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"

/**
 * 그레이스케일(Grayscale) 후처리 이펙트입니다.
 * 화면을 흑백으로 변환합니다.
 *
 * @category PostEffect
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/grayscale/"></iframe>
 */
class Grayscale extends ASinglePassPostEffect {
	/**
	 * Grayscale 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_GRAYSCALE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Grayscale)
export default Grayscale
