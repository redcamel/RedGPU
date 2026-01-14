import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
declare class AToneMappingEffect extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get exposure(): number;
    set exposure(value: number);
    get contrast(): number;
    set contrast(value: number);
    get brightness(): number;
    set brightness(value: number);
    /**
     * 내부 유니폼 일괄 갱신
     * @private
     */
    updateUniforms(): void;
}
export default AToneMappingEffect;
