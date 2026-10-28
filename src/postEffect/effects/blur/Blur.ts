import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import Convolution from "../convolution/Convolution";


/**
 * [KO] 고정된 3x3 커널을 사용하는 컨볼루션 기반의 블러 후처리 이펙트입니다.
 * [EN] Convolution-based blur post-processing effect using a fixed 3x3 kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Blur(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blur/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Blur example](/RedGPU/examples/postEffect/blur/blur/)
 * @category Blur
 */
class Blur extends AMultiPassPostEffect {
    #effect_convolution: Convolution;

    /**
     * [KO] Blur 인스턴스를 생성합니다.
     * [EN] Creates a Blur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Blur(redGPUContext);
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
        this.#effect_convolution.kernel = Convolution.BLUR;
    }

    /**
     * [KO] 블러 후처리 효과를 렌더링합니다.
     * [EN] Renders the blur post-processing effect.
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
     * [KO] 블러 처리된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Blurred output texture information (`IPostEffectResult`)
     */
    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return this.#effect_convolution.render(
            view, width, height, sourceTextureInfo
        );
    }
}

Object.freeze(Blur);
export default Blur;
