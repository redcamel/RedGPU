import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * 2D 블러(Blur) 후처리 효과를 제공하는 클래스입니다.
 *
 * Convolution 기반의 블러 커널을 사용하여 단일 패스 블러를 구현합니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
 * view.postEffectManager.addEffect(new RedGPU.PostEffect.Blur(redGPUContext));
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/blur/"></iframe>
 */
declare class Blur extends AMultiPassPostEffect {
    #private;
    /**
     * Blur 인스턴스를 생성합니다.
     *
     * 기본적으로 `Convolution.BLUR` 커널을 할당하여 표준 블러 효과로 초기화합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * Blur 효과를 렌더링하여 블러 처리된 텍스처 정보를 반환합니다.
     *
     * 내부적으로 Convolution 패스의 `render`를 호출합니다.
     *
     * @param view - 렌더링 대상 View3D 객체
     * @param width - 렌더링 너비(픽셀)
     * @param height - 렌더링 높이(픽셀)
     * @param sourceTextureInfo - 입력 텍스처 정보 (이전 패스의 결과 또는 렌더 타겟)
     * @returns 블러 처리된 텍스처 결과
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default Blur;
