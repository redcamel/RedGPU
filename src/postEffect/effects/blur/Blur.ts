import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import Convolution from "../convolution/Convolution";

/**
 * [KO] 2D 블러(Blur) 후처리 효과를 제공하는 클래스입니다.
 * [EN] Class that provides 2D Blur post-processing effect.
 *
 * [KO] Convolution 기반의 블러 커널을 사용하여 단일 패스 블러를 구현합니다.
 * [EN] Implements single-pass blur using a Convolution-based blur kernel.
 * * ### Example
 * ```typescript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
 * view.postEffectManager.addEffect(new RedGPU.PostEffect.Blur(redGPUContext));
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blur/"></iframe>
 * @category Blur
 */
class Blur extends AMultiPassPostEffect {
    /**
     * [KO] 내부적으로 사용하는 Convolution 인스턴스입니다.
     * [EN] Convolution instance used internally.
     * @private
     */
    #effect_convolution: Convolution;

    /**
     * [KO] Blur 인스턴스를 생성합니다.
     * [EN] Creates a Blur instance.
     *
     * [KO] 기본적으로 `Convolution.BLUR` 커널을 할당하여 표준 블러 효과로 초기화합니다.
     * [EN] Initializes with a standard blur effect by assigning the `Convolution.BLUR` kernel by default.
     *
     * @param redGPUContext
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
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
     * [KO] Blur 효과를 렌더링하여 블러 처리된 텍스처 정보를 반환합니다.
     * [EN] Renders the Blur effect and returns the blurred texture information.
     *
     * [KO] 내부적으로 Convolution 패스의 `render`를 호출합니다.
     * [EN] Internally calls `render` of the Convolution pass.
     *
     * @param view
     * [KO] 렌더링 대상 View3D 객체
     * [EN] Render target View3D object
     * @param width
     * [KO] 렌더링 너비(픽셀)
     * [EN] Rendering width (pixels)
     * @param height
     * [KO] 렌더링 높이(픽셀)
     * [EN] Rendering height (pixels)
     * @param sourceTextureInfo
     * [KO] 입력 텍스처 정보 (이전 패스의 결과 또는 렌더 타겟)
     * [EN] Input texture information (result of previous pass or render target)
     * @returns
     * [KO] 블러 처리된 텍스처 결과
     * [EN] Blurred texture result
     */
    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: ASinglePassPostEffectResult
    ): ASinglePassPostEffectResult {
        return this.#effect_convolution.render(
            view, width, height, sourceTextureInfo
        );
    }
}

Object.freeze(Blur);
export default Blur;
