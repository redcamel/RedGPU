import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * 배럴/핀쿠션 왜곡, 중심 위치를 조절할 수 있습니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.barrelStrength = 0.2;      // 배럴 왜곡 강도
 * effect.pincushionStrength = 0.1;  // 핀쿠션 왜곡 강도
 * effect.centerX = 0.5;             // 왜곡 중심 X
 * effect.centerY = 0.5;             // 왜곡 중심 Y
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/lensDistortion/"></iframe>
 */
declare class LensDistortion extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 배럴 왜곡 강도 반환 */
    get barrelStrength(): number;
    /** 배럴 왜곡 강도 설정. 최소 0 */
    set barrelStrength(value: number);
    /** 핀쿠션 왜곡 강도 반환 */
    get pincushionStrength(): number;
    /** 핀쿠션 왜곡 강도 설정. 최소 0 */
    set pincushionStrength(value: number);
    /** 왜곡 중심 X 반환 */
    get centerX(): number;
    /** 왜곡 중심 X 설정 */
    set centerX(value: number);
    /** 왜곡 중심 Y 반환 */
    get centerY(): number;
    /** 왜곡 중심 Y 설정 */
    set centerY(value: number);
}
export default LensDistortion;
