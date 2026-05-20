import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineUniformProperty} from "../../../../defineProperty";

interface ChromaticAberration {
    strength: number
    centerX: number
    centerY: number
    falloff: number
}

/**
 * [KO] 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 0.5;
 * effect.centerY = 0.5;
 * effect.falloff = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/chromaticAberration/"></iframe>
 * @category Lens
 */
class ChromaticAberration extends ASinglePassPostEffect {

    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_CHROMATIC_ABERRATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

}

DefineUniformProperty.defineNumber(ChromaticAberration, [
    {key: 'strength', value: 0.015, min: 0},
    {key: 'centerX', value: 0.5, min: 0, max: 1},
    {key: 'centerY', value: 0.5, min: 0, max: 1},
    {key: 'falloff', value: 0.5, min: 0, max: 5},
])

Object.freeze(ChromaticAberration)
export default ChromaticAberration
