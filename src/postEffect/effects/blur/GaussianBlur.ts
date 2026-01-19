import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import BlurX from "./blurX/BlurX";
import BlurY from "./blurY/BlurY";

/**
 * [KO] 가우시안 블러(Gaussian Blur) 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect.
 *
 * [KO] X, Y 방향 블러를 적용해 부드러운 블러 효과를 만듭니다.
 * [EN] Creates a smooth blur effect by applying blur in X and Y directions.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class GaussianBlur extends AMultiPassPostEffect {
    /** 
     * [KO] 블러 강도(커널 크기). 기본값 32
     * [EN] Blur strength (kernel size). Default 32
     */
    #size: number = 32

    /**
     * [KO] GaussianBlur 인스턴스를 생성합니다.
     * [EN] Creates a GaussianBlur instance.
     * 
     * @param redGPUContext 
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
    }

    /** 
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 블러 강도를 설정합니다.
     * [EN] Sets the blur strength.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set size(value: number) {
        this.#size = value;
        this.passList.forEach((v: BlurX | BlurY) => v.size = value)
    }
}

Object.freeze(GaussianBlur)
export default GaussianBlur