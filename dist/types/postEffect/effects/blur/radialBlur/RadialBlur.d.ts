import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 방사형 블러(Radial Blur) 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect.
 *
 * [KO] 중심점, 강도, 샘플 수를 조절해 원형으로 퍼지는 블러 효과를 만듭니다.
 * [EN] Creates a circular spreading blur effect by adjusting the center point, strength, and sample count.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * effect.sampleCount = 32; // 샘플 수
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/radialBlur/"></iframe>
 * @category Blur
 */
declare class RadialBlur extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] RadialBlur 인스턴스를 생성합니다.
     * [EN] Creates a RadialBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 중심 X 좌표를 반환합니다.
     * [EN] Returns the center X coordinate.
     */
    get centerX(): number;
    /**
     * [KO] 중심 X 좌표를 설정합니다.
     * [EN] Sets the center X coordinate.
     */
    set centerX(value: number);
    /**
     * [KO] 중심 Y 좌표를 반환합니다.
     * [EN] Returns the center Y coordinate.
     */
    get centerY(): number;
    /**
     * [KO] 중심 Y 좌표를 설정합니다.
     * [EN] Sets the center Y coordinate.
     */
    set centerY(value: number);
    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get amount(): number;
    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     */
    set amount(value: number);
    /**
     * [KO] 샘플 수를 반환합니다.
     * [EN] Returns the sample count.
     */
    get sampleCount(): number;
    /**
     * [KO] 샘플 수를 설정합니다. (최소 4)
     * [EN] Sets the sample count. (Minimum 4)
     */
    set sampleCount(value: number);
}
export default RadialBlur;
