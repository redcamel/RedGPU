import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
interface AToneMappingEffect {
    /**
     * [KO] 대비(Contrast) 값입니다. (기본값: 5.0, 범위: 0.5 ~ 20.0)
     * [EN] Contrast value. (Default: 5.0, Range: 0.5 ~ 20.0)
     */
    contrast: number;
    /**
     * [KO] 밝기(Brightness) 오프셋 값입니다. (기본값: 0.0, 범위: -1.0 ~ 1.0)
     * [EN] Brightness offset value. (Default: 0.0, Range: -1.0 ~ 1.0)
     */
    brightness: number;
}
/**
 * [KO] 모든 톤 매핑 이펙트의 기반이 되며 공통 `contrast`, `brightness` 속성을 제공하는 추상 클래스입니다.
 * [EN] Abstract base class for all tone mapping effects, providing common `contrast` and `brightness` properties.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category ToneMapping
 */
declare class AToneMappingEffect extends ASinglePassPostEffect {
    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다. (하위 클래스 전용)
     * [EN] Creates an AToneMappingEffect instance. (Subclasses only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext);
}
export default AToneMappingEffect;
