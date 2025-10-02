import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 방사형 블러(Radial Blur) 후처리 이펙트입니다.
 * 중심점, 강도, 샘플 수를 조절해 원형으로 퍼지는 블러 효과를 만듭니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * effect.sampleCount = 32; // 샘플 수
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/radialBlur/"></iframe>
 */
declare class RadialBlur extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 중심 X 반환 */
    get centerX(): number;
    /** 중심 X 설정 */
    set centerX(value: number);
    /** 중심 Y 반환 */
    get centerY(): number;
    /** 중심 Y 설정 */
    set centerY(value: number);
    /** 블러 강도 반환 */
    get amount(): number;
    /** 블러 강도 설정. 최소 0 */
    set amount(value: number);
    /** 샘플 수 반환 */
    get sampleCount(): number;
    /** 샘플 수 설정. 최소 4 */
    set sampleCount(value: number);
}
export default RadialBlur;
