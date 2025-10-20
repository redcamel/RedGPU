import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";
declare class ShadowManager {
    #private;
    constructor();
    get directionalShadowManager(): DirectionalShadowManager;
    updateViewSystemUniforms(redGPUContext: RedGPUContext): void;
}
export default ShadowManager;
