import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface Vignetting {
    /**
     * [KO] 비네팅 크기 (0 ~ 1)
     * [EN] Vignette size (0 ~ 1)
     * @defaultValue 0.55
     */
    size: number;
    /**
     * [KO] 경계면 부드러움 정도 (0 ~ 1)
     * [EN] Edge smoothness (0 ~ 1)
     * @defaultValue 0.35
     */
    smoothness: number;
    /**
     * [KO] 비네팅 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Vignette center X offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerX: number;
    /**
     * [KO] 비네팅 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Vignette center Y offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerY: number;
}

/**
 * [KO] 화면 중심점을 기준으로 가장자리를 어둡게 감쇠시키는 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect that darkens the screen edges relative to a center point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.7;
 * effect.smoothness = 0.3;
 * effect.centerX = 100;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/vignetting/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Vignetting example](/RedGPU/examples/postEffect/lens/vignetting/)
 * @category Lens
 */
class Vignetting extends ASinglePassPostEffect {

    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

}

definePositiveNumber(Vignetting, [
    {key: 'size', value: 0.55, max: 1},
    {key: 'smoothness', value: 0.35, max: 1},
])
defineNumber(Vignetting, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
])
Object.freeze(Vignetting)
export default Vignetting
