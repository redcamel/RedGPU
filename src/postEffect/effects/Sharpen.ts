import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AMultiPassPostEffect from "../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../core/ASinglePassPostEffect";
import Convolution from "./convolution/Convolution";

/**
 * 샤픈(Sharpen) 후처리 이펙트입니다.
 * 컨볼루션 커널을 이용해 이미지의 경계와 디테일을 강조합니다.
 *
 * @category PostEffect
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/sharpen/"></iframe>
 */
class Sharpen extends AMultiPassPostEffect {
	#effect_convolution: Convolution

	/**
	 * Sharpen 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new Convolution(redGPUContext),
			],
		);
		this.#effect_convolution = this.passList[0] as Convolution
		this.#effect_convolution.kernel = Convolution.SHARPEN
	}

	/**
	 * 샤픈 효과를 렌더링합니다.
	 * @returns 샤픈 처리된 텍스처 결과
	 */
	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
		return this.#effect_convolution.render(
			view, width, height, sourceTextureInfo
		)
	}
}

Object.freeze(Sharpen)
export default Sharpen
