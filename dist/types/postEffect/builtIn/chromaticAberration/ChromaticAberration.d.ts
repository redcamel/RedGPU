import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../core/ASingleComputePassPostEffect";
import { IPostEffectResult } from "../../core/types";
interface ChromaticAberration {
    /**
     * [KO] 색수차 분리 강도 (0 이상, 기본값 0.3)
     * [EN] Chromatic aberration separation intensity (0 or greater, default 0.3)
     * @defaultValue 0.3
     */
    intensity: number;
    /**
     * [KO] 화면 중심으로부터 색수차가 시작되는 정원형 보호 반경 (0.0 ~ 1.0, 기본값 0.0)
     * [EN] Circular protection radius from screen center where chromatic aberration begins (0.0 ~ 1.0, default 0.0)
     * @defaultValue 0.0
     */
    startOffset: number;
}
/**
 * [KO] 실제 카메라 구면 렌즈 가장자리의 파장별 굴절률 차이로 인해 RGB 채널이 정원형 방사 방향으로 분리되는 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect that radially separates RGB channels in a circular pattern due to wavelength-dependent refraction at camera lens edges.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 ChromaticAberration 활성화 및 설정
 * // [EN] Enable and configure ChromaticAberration through View3D's builtInEffectManager
 * view.builtInEffectManager.useChromaticAberration = true;
 * const chromaticAberration = view.builtInEffectManager.chromaticAberration;
 * chromaticAberration.intensity = 0.3;
 * chromaticAberration.startOffset = 0.2;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/chromaticAberration/"></iframe>
 *
 * @see [ChromaticAberration example](/RedGPU/examples/postEffect/builtIn/lens/chromaticAberration/)
 * @category PostEffect
 */
declare class ChromaticAberration extends ASingleComputePassPostEffect {
    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 색수차 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the chromatic aberration post-processing effect.
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
     * [KO] 렌더링 결과 (`IPostEffectResult`)
     * [EN] Rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default ChromaticAberration;
