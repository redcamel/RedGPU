import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
/**
 * [KO] X축과 Y축 방향을 두 번의 패스로 나누어 처리(Separable Blur)하는 가우시안 블러 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect that processes X and Y axis blurs in two separate passes (Separable Blur).
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
 * effect.size = 64;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/" style="width:100%; height:500px;"></iframe>
 *
 * @see [GaussianBlur example](/RedGPU/examples/postEffect/blur/gaussianBlur/)
 * @category Blur
 */
declare class GaussianBlur extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] GaussianBlur 인스턴스를 생성합니다.
     * [EN] Creates a GaussianBlur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 강도(단위: 픽셀, 0 ~ 512)를 반환하거나 설정합니다.
     * [EN] Returns or sets the blur strength (unit: pixels, 0 ~ 512).
     *
     * @defaultValue 32
     * @returns
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    get size(): number;
    set size(value: number);
}
export default GaussianBlur;
