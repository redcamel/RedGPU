import RedGPUContext from "../../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
interface DOFUnified {
    nearBlurSize: number;
    farBlurSize: number;
    nearStrength: number;
    farStrength: number;
}
/**
 * [KO] DOF 통합 블러 및 합성 이펙트입니다.
 * [EN] DOF unified blur and compositing effect.
 * @category Lens
 */
declare class DOFUnified extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
}
export default DOFUnified;
