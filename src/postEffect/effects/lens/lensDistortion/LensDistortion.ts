import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineGPUProperty} from "../../../../defineProperty";

interface LensDistortion {
    distortion: number
    centerX: number
    centerY: number
}

/**
 * [KO] 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * [EN] Lens Distortion post-processing effect.
 *
 * [KO] 왜곡 강도와 중심 위치를 조절할 수 있습니다. (양수: 배럴 왜곡, 음수: 핀쿠션 왜곡)
 * [EN] Can adjust distortion strength and center position. (Positive: Barrel, Negative: Pincushion)
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.distortion = 0.2;      // 왜곡 강도 (양수: 배럴, 음수: 핀쿠션)
 * effect.centerX = 0.5;         // 왜곡 중심 X
 * effect.centerY = 0.5;         // 왜곡 중심 Y
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/lensDistortion/"></iframe>
 * @category Lens
 */
class LensDistortion extends ASinglePassPostEffect {
    /**
     * [KO] LensDistortion 인스턴스를 생성합니다.
     * [EN] Creates a LensDistortion instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_DISTORTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }
}

DefineGPUProperty.defineNumber(LensDistortion, [
    {key: 'distortion', value: 0.1,},
    {key: 'centerX', value: 0.5, min: 0, max: 1},
    {key: 'centerY', value: 0.5, min: 0, max: 1},
])
Object.freeze(LensDistortion)
export default LensDistortion
