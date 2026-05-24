import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineGPUProperty} from "../../../../defineProperty";

interface Vignetting {
    size: number;
    smoothness: number;
}

/**
 * [KO] 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect.
 *
 * [KO] 화면 가장자리를 어둡게 하여 집중도를 높이는 효과를 만듭니다.
 * [EN] Creates an effect that darkens the edges of the screen to increase focus.
 *
 * [KO] size(범위), smoothness(부드러움)를 조절할 수 있습니다.
 * [EN] Can adjust size (range) and smoothness.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.6;        // 비네팅 범위
 * effect.smoothness = 0.3;  // 경계 부드러움
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/vignetting/"></iframe>
 * @category Lens
 */
class Vignetting extends ASinglePassPostEffect {


    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }


}

DefineGPUProperty.definePositiveNumber(Vignetting, [
    {key: 'size', value: 0.5, max: 1},
    {key: 'smoothness', value: 0.2, max: 1},
])
Object.freeze(Vignetting)
export default Vignetting
