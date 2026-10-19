import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import BlurX from "./blurX/BlurX";
import BlurY from "./blurY/BlurY";

/**
 * [KO] X축과 Y축 방향을 두 번의 패스로 나누어 처리(Separable Blur)하는 가우시안 블러 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect that processes X and Y axis blurs in two separate passes (Separable Blur).
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
 * // [KO] 블러 강도 조절
 * // [EN] Adjust blur strength
 * effect.size = 64;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/" style="width:100%; height:500px;"></iframe>
 * @see [GaussianBlur example](/RedGPU/examples/postEffect/blur/gaussianBlur/)
 * @category Blur
 */
class GaussianBlur extends AMultiPassPostEffect {
    #size: number = 32

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
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new BlurX(redGPUContext),
                new BlurY(redGPUContext)
            ],
        );
        this.size = this.size
    }

    /**
     * [KO] 블러 강도(픽셀 단위 반경, 기본값: 32)를 반환하거나 설정합니다.
     * [EN] Returns or sets the blur strength (radius in pixels, default: 32).
     *
     * @returns
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    get size(): number {
        return this.#size;
    }

    set size(value: number) {
        this.#size = value;
        this.passList.forEach((v: BlurX | BlurY) => v.size = value)
    }
}

Object.freeze(GaussianBlur)
export default GaussianBlur
