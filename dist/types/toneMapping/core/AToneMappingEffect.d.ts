import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] 모든 톤 매핑 이펙트의 기본 추상 클래스입니다.
 * [EN] Base abstract class for all tone mapping effects.
 * @category ToneMapping
 */
declare class AToneMappingEffect extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다.
     * [EN] Creates an AToneMappingEffect instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext);
    /** [KO] 노출값을 반환합니다. [EN] Returns the exposure value. */
    get exposure(): number;
    /** [KO] 노출값을 설정합니다. [EN] Sets the exposure value. */
    set exposure(value: number);
    /** [KO] 명암 강도를 반환합니다. [EN] Returns the contrast strength. */
    get contrast(): number;
    /** [KO] 명암 강도를 설정합니다. [EN] Sets the contrast strength. */
    set contrast(value: number);
    /** [KO] 밝기 조절 값을 반환합니다. [EN] Returns the brightness adjustment value. */
    get brightness(): number;
    /** [KO] 밝기 조절 값을 설정합니다. [EN] Sets the brightness adjustment value. */
    set brightness(value: number);
    /**
     * [KO] 내부 유니폼을 일괄 갱신합니다.
     * [EN] Updates all internal uniforms at once.
     */
    updateUniforms(): void;
}
export default AToneMappingEffect;
