import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AMultiPassPostEffect from "../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../core/ASinglePassPostEffect";
import Convolution from "./convolution/Convolution";

/**
 * [KO] 샤픈(Sharpen) 후처리 이펙트입니다.
 * [EN] Sharpen post-processing effect.
 *
 * [KO] 컨볼루션 커널을 이용해 이미지의 경계와 디테일을 강조합니다.
 * [EN] Emphasizes image edges and details using a convolution kernel.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/sharpen/"></iframe>
 * @category PostEffect
 */
class Sharpen extends AMultiPassPostEffect {
    #effect_convolution: Convolution

    /**
     * [KO] Sharpen 인스턴스를 생성합니다.
     * [EN] Creates a Sharpen instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
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
     * [KO] 샤픈 효과를 렌더링합니다.
     * [EN] Renders the sharpen effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 샤픈 처리된 텍스처 결과
     * [EN] Sharpened texture result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
        return this.#effect_convolution.render(
            view, width, height, sourceTextureInfo
        )
    }
}

Object.freeze(Sharpen)
export default Sharpen
