import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface LensDistortion {
    /**
     * [KO] 왜곡 강도 (양수: 배럴 왜곡, 음수: 핀쿠션 왜곡)
     * [EN] Distortion strength (Positive: barrel distortion, Negative: pincushion distortion)
     * @defaultValue 0.1
     */
    distortion: number
    /**
     * [KO] 왜곡 중심점 X 오프셋 (픽셀 단위)
     * [EN] Distortion center X offset in pixels
     * @defaultValue 0
     */
    centerX: number
    /**
     * [KO] 왜곡 중심점 Y 오프셋 (픽셀 단위)
     * [EN] Distortion center Y offset in pixels
     * @defaultValue 0
     */
    centerY: number
}

/**
 * [KO] 화면 중심점을 기준으로 배럴(볼록) 또는 핀쿠션(오목) 기하학적 렌즈 왜곡을 시뮬레이션하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that simulates geometric barrel (convex) or pincushion (concave) lens distortion relative to a center point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.distortion = 0.2;
 * effect.centerX = 100;
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
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_DISTORTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }
}

defineNumber(LensDistortion, [
    {key: 'distortion', value: 0.1,},
    {key: 'centerX', value: 0,},
    {key: 'centerY', value: 0,},
])
Object.freeze(LensDistortion)
export default LensDistortion
