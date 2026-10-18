import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import Convolution from "../convolution/Convolution";


/**
 * [KO] 고정된 3x3 커널을 사용하는 컨볼루션 기반의 단일 패스 블러 후처리 이펙트입니다.
 * [EN] Convolution-based single-pass blur post-processing effect using a fixed 3x3 kernel.
 *
 * ### Example
 * ```typescript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
 * view.postEffectManager.addEffect(new RedGPU.PostEffect.Blur(redGPUContext));
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blur/"></iframe>
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
        this.#effect_convolution = this.passList[0] as Convolution;
        this.#effect_convolution.kernel = Convolution.BLUR;
    }

    /**
     * [KO] 블러 효과를 렌더링합니다.
     * [EN] Renders the blur effect.
     *
     * @param view -
     * [KO] 렌더링 대상 View3D 객체
     * [EN] Render target View3D object
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 입력 텍스처 정보
     * [EN] Input texture information
     * @returns
     * [KO] 블러 처리된 텍스처 결과
     * [EN] Blurred texture result
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
