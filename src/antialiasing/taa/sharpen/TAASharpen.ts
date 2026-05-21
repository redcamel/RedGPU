import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../defineProperty/DefineUniformProperty";

interface TAASharpen {
    sharpness: number
}

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
class TAASharpen extends ASinglePassPostEffect {

    /**
     * [KO] TAASharpen 인스턴스를 생성합니다.
     * [EN] Creates a TAASharpen instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TAA_SHARPEN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }


}

DefineUniformProperty.definePositiveNumber(TAASharpen, [
    {key: 'sharpness', value: 0.5, min: 0, max: 1},
])
Object.freeze(TAASharpen)
export default TAASharpen