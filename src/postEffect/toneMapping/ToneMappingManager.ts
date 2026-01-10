import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../core/createBasicPostEffectCode";
import computeCode from "./khronosPbrNeutral/computeCode.wgsl"
import uniformStructCode from "./uniformStructCode.wgsl"
import AToneMappingEffect from "./AToneMappingEffect";

class ToneMappingManager {

    #toneMapping:AToneMappingEffect
    constructor(redGPUContext: RedGPUContext) {

    }
    render(){

    }


}

Object.freeze(ToneMappingManager);
export default ToneMappingManager;