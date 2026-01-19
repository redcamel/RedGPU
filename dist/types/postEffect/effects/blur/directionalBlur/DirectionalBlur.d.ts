import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 방향성 블러(Directional Blur) 후처리 이펙트입니다.
 * [EN] Directional Blur post-processing effect.
 *
 * [KO] 각도와 강도를 지정해 원하는 방향으로 블러를 적용할 수 있습니다.
 * [EN] Can apply blur in a desired direction by specifying angle and strength.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
 * effect.angle = 45;   // 45도 방향 블러
 * effect.amount = 30;  // 블러 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/directionalBlur/"></iframe>
 * @category Blur
 */
declare class DirectionalBlur extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] DirectionalBlur 인스턴스를 생성합니다.
     * [EN] Creates a DirectionalBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 각도를 반환합니다.
     * [EN] Returns the blur angle.
     */
    get angle(): number;
    /**
     * [KO] 블러 각도를 설정합니다. (0 = 오른쪽, 360도로 정규화됨)
     * [EN] Sets the blur angle. (0 = Right, Normalized to 360 degrees)
     *
     * @param value
     * [KO] 각도
     * [EN] Angle
     */
    set angle(value: number);
    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get amount(): number;
    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     *
     * @param value
     * [KO] 강도
     * [EN] Strength
     */
    set amount(value: number);
}
export default DirectionalBlur;
