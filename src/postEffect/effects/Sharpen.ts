import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AMultiPassPostEffect from "../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../core/types";
import Convolution from "./convolution/Convolution";

/**
 * [KO] 컨볼루션 커널을 사용하여 인접 픽셀 간 대비를 높이고 경계를 선명하게 강조하는 샤픈(Sharpen) 후처리 이펙트입니다.
 * [EN] Sharpen post-processing effect that enhances edges and details by increasing contrast between adjacent pixels using a convolution kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/sharpen/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sharpen example](/RedGPU/examples/postEffect/sharpen/)
 * @category PostEffect
 */
class Sharpen extends AMultiPassPostEffect {
    #effect_convolution: Convolution;

    /**
     * [KO] Sharpen 인스턴스를 생성합니다.
     * [EN] Creates a Sharpen instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new Convolution(redGPUContext),
            ],
            true
        );
        this.#effect_convolution = this.passList[0] as Convolution;
        this.#effect_convolution.kernel = Convolution.SHARPEN;
    }

    /**
     * [KO] 샤픈 후처리 효과를 렌더링합니다.
     * [EN] Renders the sharpen post-processing effect.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 샤픈 처리된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Sharpened output texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult) {
        return this.#effect_convolution.render(
            view, width, height, sourceTextureInfo
        );
    }
}

Object.freeze(Sharpen)
export default Sharpen
