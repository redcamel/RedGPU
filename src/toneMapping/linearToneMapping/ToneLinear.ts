import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] 선형(Linear) 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs linear tone mapping.
 * @category ToneMapping
 */
class ToneLinear extends AToneMappingEffect {
    /**
     * [KO] ToneLinear 인스턴스를 생성합니다.
     * [EN] Creates a ToneLinear instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_LINEAR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.updateUniforms();
    }
}

Object.freeze(ToneLinear);
export default ToneLinear;
