import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] TAA 전용 샤프닝 후처리 이펙트입니다.
 * [EN] TAA-specific sharpening post-processing effect.
 *
 * [KO] TAA로 인해 발생하는 블러 현상을 복구합니다.
 * [EN] Restores blur caused by TAA.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 TAA 설정 시 자동으로 적용됩니다.
 * // Automatically applied when TAA is configured via AntialiasingManager.
 * redGPUContext.antialiasingManager.useTAA = true;
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
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 샤프닝 강도를 반환합니다.
     * [EN] Returns the sharpening strength.
     *
     * @returns
     * [KO] 샤프닝 강도
     * [EN] Sharpening strength
     */
    get sharpness(): number;
    /**
     * [KO] 샤프닝 강도를 설정합니다.
     * [EN] Sets the sharpening strength.
     *
     * @param value -
     * [KO] 샤프닝 강도 (0 ~ 1)
     * [EN] Sharpening strength (0 ~ 1)
     */
    set sharpness(value: number);
}
export default TAASharpen;
