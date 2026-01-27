import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * [KO] TAA 전용 샤프닝 후처리 이펙트입니다.
 * [EN] TAA-specific sharpening post-processing effect.
 *
 * [KO] TAA로 인해 발생하는 블러 현상을 복구합니다.
 * [EN] Restores blur caused by TAA.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.TAASharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @category PostEffect
 */
declare class TAASharpen extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] TAASharpen 인스턴스를 생성합니다.
     * [EN] Creates a TAASharpen instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 샤프닝 강도를 반환합니다.
     * [EN] Returns the sharpening strength.
     */
    get sharpness(): number;
    /**
     * [KO] 샤프닝 강도를 설정합니다. (0 ~ 1)
     * [EN] Sets the sharpening strength. (0 ~ 1)
     */
    set sharpness(value: number);
}
export default TAASharpen;
