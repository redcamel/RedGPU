import RedGPUContext from "../../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
declare class DOFCoC extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get focusDistance(): number;
    set focusDistance(value: number);
    get aperture(): number;
    set aperture(value: number);
    get maxCoC(): number;
    set maxCoC(value: number);
    get nearPlane(): number;
    set nearPlane(value: number);
    get farPlane(): number;
    set farPlane(value: number);
}
export default DOFCoC;
