import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] Khronos PBR Neutral 곡선으로 기본 색상(Base Color)의 색조를 최대한 보존하며 HDR 색상을 LDR 범위로 압축하는 톤 매핑 이펙트입니다.
 * [EN] Tone mapping effect that compresses HDR color into LDR range using the Khronos PBR Neutral curve while preserving base color hue.
 *
 * [KO] `ToneMappingManager`의 기본 모드(`KHRONOS_PBR_NEUTRAL`)이며 내부적으로 자동 생성됩니다.
 * [EN] Default mode (`KHRONOS_PBR_NEUTRAL`) of `ToneMappingManager`, automatically created internally.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;
 * ```
 *
 * @category ToneMapping
 */
class ToneKhronosPBRNeutral extends AToneMappingEffect {
    /**
     * [KO] ToneKhronosPBRNeutral 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneKhronosPBRNeutral instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_KHRONOS_PBR_NEUTRAL',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

Object.freeze(ToneKhronosPBRNeutral);
export default ToneKhronosPBRNeutral;
