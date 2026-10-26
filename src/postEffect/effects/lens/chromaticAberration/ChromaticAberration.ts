import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface ChromaticAberration {
    /**
     * [KO] 색수차 강도 (0 이상)
     * [EN] Chromatic aberration strength (0 or greater)
     * @defaultValue 0.015
     */
    strength: number
    /**
     * [KO] 효과 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Effect center X offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerX: number
    /**
     * [KO] 효과 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Effect center Y offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerY: number
    /**
     * [KO] 중심으로부터의 효과 감쇠율 (0 ~ 5)
     * [EN] Effect falloff from center (0 ~ 5)
     * @defaultValue 1.0
     */
    falloff: number
}

/**
 * [KO] 렌즈의 파장별 굴절률 차이로 인해 RGB 채널이 분리되는 색수차 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect that separates RGB channels due to wavelength-dependent lens refraction.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 100;
 * effect.falloff = 1.5;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/chromaticAberration/" style="width:100%; height:500px;"></iframe>
 *
 * @see [ChromaticAberration example](/RedGPU/examples/postEffect/lens/chromaticAberration/)
 * @category Lens
 */
class ChromaticAberration extends ASinglePassPostEffect {

    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
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
            'POST_EFFECT_CHROMATIC_ABERRATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

}

defineNumber(ChromaticAberration, [
    {key: 'strength', value: 0.015, min: 0},
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
    {key: 'falloff', value: 1.0, min: 0, max: 5},
])

Object.freeze(ChromaticAberration)
export default ChromaticAberration
