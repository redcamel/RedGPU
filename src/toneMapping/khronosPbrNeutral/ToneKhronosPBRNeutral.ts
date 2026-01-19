import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] Khronos PBR Neutral 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs Khronos PBR Neutral tone mapping.
 * @category ToneMapping
 */
class ToneKhronosPBRNeutral extends AToneMappingEffect {
    /**
     * [KO] ToneKhronosPBRNeutral 인스턴스를 생성합니다.
     * [EN] Creates a ToneKhronosPBRNeutral instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_KHRONOS_PBR_NEUTRAL',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.updateUniforms();
    }
}

Object.freeze(ToneKhronosPBRNeutral);
export default ToneKhronosPBRNeutral;
