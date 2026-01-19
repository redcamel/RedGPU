import View3D from "../display/view/View3D";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import { ASinglePassPostEffectResult } from "../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] 톤 매핑, 노출, 대비, 밝기를 통합 관리하는 클래스입니다.
 * [EN] Class that integrates and manages tone mapping, exposure, contrast, and brightness.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // View3D를 통해 접근합니다. (Access through View3D)
 * const toneMappingManager = view.toneMappingManager;
 * toneMappingManager.mode = RedGPU.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
 * toneMappingManager.exposure = 1.2;
 * ```
 * @category ToneMapping
 */
declare class ToneMappingManager {
    #private;
    /**
     * [KO] ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneMappingManager instance. (Internal system only)
     * @param view - [KO] View3D 인스턴스 [EN] View3D instance
     */
    constructor(view: View3D);
    /** [KO] 현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다. [EN] Returns the currently active tone mapping effect instance. */
    get toneMapping(): AToneMappingEffect | undefined;
    /** [KO] 현재 적용된 톤 매핑 모드를 반환합니다. [EN] Returns the currently applied tone mapping mode. */
    get mode(): TONE_MAPPING_MODE;
    /** [KO] 톤 매핑 모드를 설정합니다. [EN] Sets the tone mapping mode. */
    set mode(value: TONE_MAPPING_MODE);
    /** [KO] 노출값(Exposure)을 반환합니다. [EN] Returns the exposure value. */
    get exposure(): number;
    /** [KO] 노출값(Exposure)을 설정합니다. (기본값: 1.0) [EN] Sets the exposure value. (Default: 1.0) */
    set exposure(value: number);
    /** [KO] 명암 대비(Contrast)를 반환합니다. [EN] Returns the contrast. */
    get contrast(): number;
    /** [KO] 명암 대비(Contrast)를 설정합니다. (0.0 ~ 2.0, 기본값: 1.0) [EN] Sets the contrast. (0.0 to 2.0, Default: 1.0) */
    set contrast(value: number);
    /** [KO] 밝기(Brightness)를 반환합니다. [EN] Returns the brightness. */
    get brightness(): number;
    /** [KO] 밝기(Brightness)를 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0) [EN] Sets the brightness. (-1.0 to 1.0, Default: 0.0) */
    set brightness(value: number);
    /**
     * [KO] 톤 매핑을 렌더링합니다.
     * [EN] Renders tone mapping.
     * @param width - [KO] 너비 [EN] Width
     * @param height - [KO] 높이 [EN] Height
     * @param currentTextureView - [KO] 현재 텍스처 뷰 정보 [EN] Current texture view information
     * @returns [KO] 렌더링 결과 [EN] Rendering result
     */
    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default ToneMappingManager;
