import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * [EN] Lens Distortion post-processing effect.
 *
 * [KO] 배럴/핀쿠션 왜곡, 중심 위치를 조절할 수 있습니다.
 * [EN] Can adjust Barrel/Pincushion distortion and center position.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.barrelStrength = 0.2;      // 배럴 왜곡 강도
 * effect.pincushionStrength = 0.1;  // 핀쿠션 왜곡 강도
 * effect.centerX = 0.5;             // 왜곡 중심 X
 * effect.centerY = 0.5;             // 왜곡 중심 Y
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/lensDistortion/"></iframe>
 * @category Lens
 */
declare class LensDistortion extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] LensDistortion 인스턴스를 생성합니다.
     * [EN] Creates a LensDistortion instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 배럴 왜곡 강도를 반환합니다.
     * [EN] Returns the barrel distortion strength.
     */
    get barrelStrength(): number;
    /**
     * [KO] 배럴 왜곡 강도를 설정합니다. (최소 0)
     * [EN] Sets the barrel distortion strength. (Minimum 0)
     */
    set barrelStrength(value: number);
    /**
     * [KO] 핀쿠션 왜곡 강도를 반환합니다.
     * [EN] Returns the pincushion distortion strength.
     */
    get pincushionStrength(): number;
    /**
     * [KO] 핀쿠션 왜곡 강도를 설정합니다. (최소 0)
     * [EN] Sets the pincushion distortion strength. (Minimum 0)
     */
    set pincushionStrength(value: number);
    /**
     * [KO] 왜곡 중심 X 좌표를 반환합니다.
     * [EN] Returns the distortion center X coordinate.
     */
    get centerX(): number;
    /**
     * [KO] 왜곡 중심 X 좌표를 설정합니다.
     * [EN] Sets the distortion center X coordinate.
     */
    set centerX(value: number);
    /**
     * [KO] 왜곡 중심 Y 좌표를 반환합니다.
     * [EN] Returns the distortion center Y coordinate.
     */
    get centerY(): number;
    /**
     * [KO] 왜곡 중심 Y 좌표를 설정합니다.
     * [EN] Sets the distortion center Y coordinate.
     */
    set centerY(value: number);
}
export default LensDistortion;
