import RedGPUContext from "../../../context/RedGPUContext";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../uniformStructCode.wgsl"
import AToneMappingEffect from "../AToneMappingEffect";

class ToneACESFilmicNarkowicz extends AToneMappingEffect {

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