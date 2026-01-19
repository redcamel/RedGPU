import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
/**
 * [KO] 가우시안 블러(Gaussian Blur) 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect.
 *
 * [KO] X, Y 방향 블러를 적용해 부드러운 블러 효과를 만듭니다.
 * [EN] Creates a smooth blur effect by applying blur in X and Y directions.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/"></iframe>
 * @category Blur
 */
declare class GaussianBlur extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] GaussianBlur 인스턴스를 생성합니다.
     * [EN] Creates a GaussianBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get size(): number;
    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     */
    set size(value: number);
}
export default GaussianBlur;
