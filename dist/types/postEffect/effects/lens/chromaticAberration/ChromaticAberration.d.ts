import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
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
declare class ChromaticAberration extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 강도 값을 반환합니다.
     * [EN] Returns the strength value.
     */
    get strength(): number;
    /**
     * [KO] 강도 값을 설정합니다. (최소 0)
     * [EN] Sets the strength value. (Minimum 0)
     */
    set strength(value: number);
    /**
     * [KO] 중심 X 좌표를 반환합니다.
     * [EN] Returns the center X coordinate.
     */
    get centerX(): number;
    /**
     * [KO] 중심 X 좌표를 설정합니다. (0 ~ 1)
     * [EN] Sets the center X coordinate. (0 ~ 1)
     */
    set centerX(value: number);
    /**
     * [KO] 중심 Y 좌표를 반환합니다.
     * [EN] Returns the center Y coordinate.
     */
    get centerY(): number;
    /**
     * [KO] 중심 Y 좌표를 설정합니다. (0 ~ 1)
     * [EN] Sets the center Y coordinate. (0 ~ 1)
     */
    set centerY(value: number);
    /**
     * [KO] 감쇠율을 반환합니다.
     * [EN] Returns the falloff.
     */
    get falloff(): number;
    /**
     * [KO] 감쇠율을 설정합니다. (0 ~ 5)
     * [EN] Sets the falloff. (0 ~ 5)
     */
    set falloff(value: number);
}
export default ChromaticAberration;
