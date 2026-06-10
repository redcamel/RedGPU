import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import Convolution from "../convolution/Convolution";


/**
 * [KO] 컨볼루션 기반의 단일 패스 블러(Blur) 후처리 이펙트입니다.
 * [EN] Convolution-based single-pass Blur post-processing effect.
 *
 * [KO] 고정된 3x3 커널을 사용하여 이미지를 부드럽게 뭉개줍니다. 가우시안 블러보다 연산량이 적어 성능이 우수하지만, 블러의 크기(Size)를 조절할 수는 없습니다.
 * [EN] Softens the image using a fixed 3x3 kernel. It offers better performance than Gaussian Blur due to lower computational overhead, but the blur size cannot be adjusted.
 *
 * [KO] 이 효과는 HDR 공간에서 동작하여 밝은 영역의 에너지를 보존하며 자연스러운 번짐을 제공합니다.
 * [EN] This effect operates in HDR space, preserving the energy of bright areas and providing a natural bleeding effect.
 *
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
     * [KO] 내부적으로 사용하는 컨볼루션 이펙트 인스턴스
     * [EN] Internal convolution effect instance
     */
    #effect_convolution: Convolution;

    /**
     * [KO] Blur 인스턴스를 생성합니다.
     * [EN] Creates a Blur instance.
     *
     * @param redGPUContext - [KO] RedGPU 렌더링 컨텍스트 [EN] RedGPU rendering context
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
     * @param view - [KO] 렌더링 대상 View3D 객체 [EN] Render target View3D object
     * @param width - [KO] 렌더링 너비 [EN] Rendering width
     * @param height - [KO] 렌더링 높이 [EN] Rendering height
     * @param sourceTextureInfo - [KO] 입력 텍스처 정보 [EN] Input texture information
     * @returns [KO] 블러 처리된 텍스처 결과 [EN] Blurred texture result
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
