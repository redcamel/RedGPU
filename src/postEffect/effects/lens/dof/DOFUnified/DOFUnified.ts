import RedGPUContext from "../../../../../context/RedGPUContext";
import View3D from "../../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import {DefineUniformProperty} from "../../../../../defineProperty";

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
class DOFUnified extends ASinglePassPostEffect {


    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_UNIFIED',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture'},
                    {name: 'cocTexture'}
                ]
            )
        );
    }


}

DefineUniformProperty.definePositiveNumber(DOFUnified, [
    {key: 'nearBlurSize', value: 16},
    {key: 'farBlurSize', value: 24},
    {key: 'nearStrength', value: 1.0},
    {key: 'farStrength', value: 1.0}
])
Object.freeze(DOFUnified);
export default DOFUnified;
