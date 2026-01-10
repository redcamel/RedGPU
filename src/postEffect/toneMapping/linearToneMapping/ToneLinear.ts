import RedGPUContext from "../../../context/RedGPUContext";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../uniformStructCode.wgsl"
import AToneMappingEffect from "../AToneMappingEffect";

class ToneLinear extends AToneMappingEffect {

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