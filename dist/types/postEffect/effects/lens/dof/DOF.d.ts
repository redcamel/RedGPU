import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 피사계 심도(DOF, Depth of Field) 후처리 이펙트입니다.
 * [EN] Depth of Field (DOF) post-processing effect.
 *
 * [KO] CoC(혼란 원) 계산과 블러를 결합해 사실적인 심도 효과를 제공합니다.
 * [EN] Provides realistic depth effects by combining CoC (Circle of Confusion) calculation and blur.
 *
 * [KO] 다양한 사진/영상 스타일 프리셋 메서드를 지원합니다.
 * [EN] Supports various photo/video style preset methods.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.DOF(redGPUContext);
 * effect.focusDistance = 10;
 * effect.aperture = 2.0;
 * effect.maxCoC = 30;
 * effect.setCinematic(); // 시네마틱 프리셋 적용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/dof/"></iframe>
 * @category Lens
 */
declare class DOF extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] DOF 인스턴스를 생성합니다.
     * [EN] Creates a DOF instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 초점 거리를 반환합니다.
     * [EN] Returns the focus distance.
     */
    get focusDistance(): number;
    /**
     * [KO] 초점 거리를 설정합니다.
     * [EN] Sets the focus distance.
     */
    set focusDistance(value: number);
    /**
     * [KO] 조리개 값을 반환합니다.
     * [EN] Returns the aperture value.
     */
    get aperture(): number;
    /**
     * [KO] 조리개 값을 설정합니다.
     * [EN] Sets the aperture value.
     */
    set aperture(value: number);
    /**
     * [KO] 최대 CoC 값을 반환합니다.
     * [EN] Returns the max CoC value.
     */
    get maxCoC(): number;
    /**
     * [KO] 최대 CoC 값을 설정합니다.
     * [EN] Sets the max CoC value.
     */
    set maxCoC(value: number);
    /**
     * [KO] 근평면 값을 반환합니다.
     * [EN] Returns the near plane value.
     */
    get nearPlane(): number;
    /**
     * [KO] 근평면 값을 설정합니다.
     * [EN] Sets the near plane value.
     */
    set nearPlane(value: number);
    /**
     * [KO] 원평면 값을 반환합니다.
     * [EN] Returns the far plane value.
     */
    get farPlane(): number;
    /**
     * [KO] 원평면 값을 설정합니다.
     * [EN] Sets the far plane value.
     */
    set farPlane(value: number);
    /**
     * [KO] 근거리 블러 크기를 반환합니다.
     * [EN] Returns the near blur size.
     */
    get nearBlurSize(): number;
    /**
     * [KO] 근거리 블러 크기를 설정합니다.
     * [EN] Sets the near blur size.
     */
    set nearBlurSize(value: number);
    /**
     * [KO] 원거리 블러 크기를 반환합니다.
     * [EN] Returns the far blur size.
     */
    get farBlurSize(): number;
    /**
     * [KO] 원거리 블러 크기를 설정합니다.
     * [EN] Sets the far blur size.
     */
    set farBlurSize(value: number);
    /**
     * [KO] 근거리 블러 강도를 반환합니다.
     * [EN] Returns the near blur strength.
     */
    get nearStrength(): number;
    /**
     * [KO] 근거리 블러 강도를 설정합니다.
     * [EN] Sets the near blur strength.
     */
    set nearStrength(value: number);
    /**
     * [KO] 원거리 블러 강도를 반환합니다.
     * [EN] Returns the far blur strength.
     */
    get farStrength(): number;
    /**
     * [KO] 원거리 블러 강도를 설정합니다.
     * [EN] Sets the far blur strength.
     */
    set farStrength(value: number);
    /**
     * [KO] 게임 기본 프리셋을 적용합니다. (균형잡힌 품질/성능)
     * [EN] Applies the Game Default preset. (Balanced quality/performance)
     */
    setGameDefault(): void;
    /**
     * [KO] 시네마틱 프리셋을 적용합니다. (강한 DOF, 영화같은 느낌)
     * [EN] Applies the Cinematic preset. (Strong DOF, cinematic feel)
     */
    setCinematic(): void;
    /**
     * [KO] 인물 사진 프리셋을 적용합니다. (배경 흐림, 인물 포커스)
     * [EN] Applies the Portrait preset. (Blurred background, focused subject)
     */
    setPortrait(): void;
    /**
     * [KO] 풍경 사진 프리셋을 적용합니다. (전체적으로 선명, 약간의 원거리 흐림)
     * [EN] Applies the Landscape preset. (Generally sharp, slight far blur)
     */
    setLandscape(): void;
    /**
     * [KO] 매크로 촬영 프리셋을 적용합니다. (극도로 얕은 심도)
     * [EN] Applies the Macro preset. (Extremely shallow depth of field)
     */
    setMacro(): void;
    /**
     * [KO] 액션/스포츠 프리셋을 적용합니다. (빠른 움직임에 적합)
     * [EN] Applies the Action/Sports preset. (Suitable for fast motion)
     */
    setSports(): void;
    /**
     * [KO] 야간 촬영 프리셋을 적용합니다. (저조도 환경)
     * [EN] Applies the Night Mode preset. (Low light environment)
     */
    setNightMode(): void;
    /**
     * [KO] DOF 효과를 렌더링합니다.
     * [EN] Renders the DOF effect.
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
     * [KO] 최종 DOF 처리 결과
     * [EN] Final DOF result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default DOF;
