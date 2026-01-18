import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * 피사계 심도(DOF, Depth of Field) 후처리 이펙트입니다.
 * CoC(혼란 원) 계산과 블러를 결합해 사실적인 심도 효과를 제공합니다.
 * 다양한 사진/영상 스타일 프리셋 메서드를 지원합니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.DOF(redGPUContext);
 * effect.focusDistance = 10;
 * effect.aperture = 2.0;
 * effect.maxCoC = 30;
 * effect.setCinematic(); // 시네마틱 프리셋 적용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/dof/"></iframe>
 */
declare class DOF extends AMultiPassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 초점 거리 반환 */
    get focusDistance(): number;
    /** 초점 거리 설정 */
    set focusDistance(value: number);
    /** 조리개 반환 */
    get aperture(): number;
    /** 조리개 설정 */
    set aperture(value: number);
    /** 최대 CoC 반환 */
    get maxCoC(): number;
    /** 최대 CoC 설정 */
    set maxCoC(value: number);
    /** 근평면 반환 */
    get nearPlane(): number;
    /** 근평면 설정 */
    set nearPlane(value: number);
    /** 원평면 반환 */
    get farPlane(): number;
    /** 원평면 설정 */
    set farPlane(value: number);
    /** 근거리 블러 크기 반환 */
    get nearBlurSize(): number;
    /** 근거리 블러 크기 설정 */
    set nearBlurSize(value: number);
    /** 원거리 블러 크기 반환 */
    get farBlurSize(): number;
    /** 원거리 블러 크기 설정 */
    set farBlurSize(value: number);
    /** 근거리 블러 강도 반환 */
    get nearStrength(): number;
    /** 근거리 블러 강도 설정 */
    set nearStrength(value: number);
    /** 원거리 블러 강도 반환 */
    get farStrength(): number;
    /** 원거리 블러 강도 설정 */
    set farStrength(value: number);
    /**
     * 🎮 게임 기본 프리셋 (균형잡힌 품질/성능)
     */
    setGameDefault(): void;
    /**
     * 🎬 시네마틱 프리셋 (강한 DOF, 영화같은 느낌)
     */
    setCinematic(): void;
    /**
     * 📷 인물 사진 프리셋 (배경 흐림, 인물 포커스)
     */
    setPortrait(): void;
    /**
     * 🌄 풍경 사진 프리셋 (전체적으로 선명, 약간의 원거리 흐림)
     */
    setLandscape(): void;
    /**
     * 🔍 매크로 촬영 프리셋 (극도로 얕은 심도)
     */
    setMacro(): void;
    /**
     * 🏃 액션/스포츠 프리셋 (빠른 움직임에 적합)
     */
    setSports(): void;
    /**
     * 🌙 야간 촬영 프리셋 (저조도 환경)
     */
    setNightMode(): void;
    /**
     * DOF 효과를 렌더링합니다.
     * @returns 최종 DOF 처리 결과
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default DOF;
