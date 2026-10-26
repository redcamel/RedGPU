import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] 곡선 압축 없이 선형(Linear) 변환으로 HDR 색상을 출력하는 톤 매핑 이펙트입니다.
 * [EN] Tone mapping effect that outputs HDR color through a linear transform without curve compression.
 *
 * [KO] `ToneMappingManager`의 모드가 `LINEAR`일 때 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when the `ToneMappingManager` mode is `LINEAR`.
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
 * view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;
 * ```
 *
 * @category ToneMapping
 */
class ToneLinear extends AToneMappingEffect {
    /**
     * [KO] ToneLinear 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneLinear instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_LINEAR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

Object.freeze(ToneLinear);
export default ToneLinear;
