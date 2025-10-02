import RedGPUContext from "../context/RedGPUContext";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
declare class FXAA extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get subpix(): number;
    set subpix(value: number);
    get edgeThreshold(): number;
    set edgeThreshold(value: number);
    get edgeThresholdMin(): number;
    set edgeThresholdMin(value: number);
}
export default FXAA;
