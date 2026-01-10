import RedGPUContext from "../../../context/RedGPUContext";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./computeCode.wgsl"
import uniformStructCode from "../uniformStructCode.wgsl"
import AToneMappingEffect from "../AToneMappingEffect";

class ToneKhronosPbrNeutral extends AToneMappingEffect {

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

Object.freeze(ToneKhronosPbrNeutral);
export default ToneKhronosPbrNeutral;