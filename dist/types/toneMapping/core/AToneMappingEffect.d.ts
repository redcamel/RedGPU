import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
interface AToneMappingEffect {
    contrast: number;
    brightness: number;
}
/**
 * [KO] 모든 톤 매핑 이펙트의 기본 추상 클래스입니다.
 * [EN] Base abstract class for all tone mapping effects.
 * @category ToneMapping
 */
declare class AToneMappingEffect extends ASinglePassPostEffect {
    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다.
     * [EN] Creates an AToneMappingEffect instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext);
}
export default AToneMappingEffect;
