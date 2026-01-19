import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] ACES Filmic (Narkowicz 근사) 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs ACES Filmic (Narkowicz approximation) tone mapping.
 * @category ToneMapping
 */
class ToneACESFilmicNarkowicz extends AToneMappingEffect {
    /**
     * [KO] ToneACESFilmicNarkowicz 인스턴스를 생성합니다.
     * [EN] Creates a ToneACESFilmicNarkowicz instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_ACES_FILMIC_NARKOWICZ',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.updateUniforms();
    }
}

Object.freeze(ToneACESFilmicNarkowicz);
export default ToneACESFilmicNarkowicz;
