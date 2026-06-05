import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import BlurX from "./blurX/BlurX";
import BlurY from "./blurY/BlurY";

/**
 * [KO] 고품질 가우시안 블러(Gaussian Blur) 후처리 이펙트입니다.
 * [EN] High-quality Gaussian Blur post-processing effect.
 *
 * [KO] X축과 Y축 방향의 블러를 두 번의 패스로 나누어 처리(Separable Blur)함으로써, 연산 효율성을 높이면서도 매우 부드럽고 매끄러운 번짐 효과를 제공합니다.
 * [EN] By processing X and Y axis blurs in two separate passes (Separable Blur), it provides extremely smooth and seamless bleeding effects while maintaining computational efficiency.
 *
 * [KO] 하드웨어 선형 샘플링과 가우시안 가중치를 결합하여 노이즈 없는 시네마틱한 품질을 구현합니다.
 * [EN] Combines hardware linear sampling with Gaussian weights to achieve noise-free cinematic quality.
 *
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
class GaussianBlur extends AMultiPassPostEffect {
    /**
     * [KO] 블러 강도 (픽셀 단위 반경)
     * [EN] Blur strength (Radius in pixels)
     * @defaultValue 32
     */
    #size: number = 32
    #sampleCount: number = 10

    /**
     * [KO] GaussianBlur 인스턴스를 생성합니다.
     * [EN] Creates a GaussianBlur instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
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
        this.sampleCount = this.#sampleCount
    }

    /**
     * [KO] 현재 설정된 블러 강도를 반환합니다.
     * [EN] Returns the currently set blur strength.
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 블러 강도를 설정합니다.
     * [EN] Sets the blur strength.
     */
    set size(value: number) {
        this.#size = value;
        this.passList.forEach((v: BlurX | BlurY) => v.size = value)
    }

    get sampleCount(): number {
        return this.#sampleCount;
    }

    set sampleCount(value: number) {
        this.#sampleCount = value;
        this.passList.forEach((v: BlurX | BlurY) => v.sampleCount = value)
    }
}

Object.freeze(GaussianBlur)
export default GaussianBlur
