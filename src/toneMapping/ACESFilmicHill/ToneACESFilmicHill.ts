import RedGPUContext from "../../context/RedGPUContext";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../core/uniformStructCode.wgsl"
import AToneMappingEffect from "../core/AToneMappingEffect";

/**
 * [KO] ACES Filmic (Hill 근사) 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs ACES Filmic (Hill approximation) tone mapping.
 * @category ToneMapping
 */
class ToneACESFilmicHill extends AToneMappingEffect {
    /**
     * [KO] ToneACESFilmicHill 인스턴스를 생성합니다.
     * [EN] Creates a ToneACESFilmicHill instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING_ACES_FILMIC_HILL',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.updateUniforms();
    }
}

Object.freeze(ToneACESFilmicHill);
export default ToneACESFilmicHill;
