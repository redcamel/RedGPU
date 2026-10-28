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
 * effect.size = 64;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/" style="width:100%; height:500px;"></iframe>
 *
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
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 가우시안 블러 생성 옵션. 기본값은 LDR(`isLdr: true`, `rgba8unorm`)이며, HDR 빌트인 패스(`SSAO` 등) 내부에서 사용될 경우를 대비해 `isLdr: false`(`rgba16float`) 설정을 열어둡니다.
     * [EN] Gaussian blur creation options. Defaults to LDR (`isLdr: true`, `rgba8unorm`), and exposes `isLdr: false` (`rgba16float`) in case it is used inside an HDR built-in pass (e.g., `SSAO`).
     */
    constructor(redGPUContext: RedGPUContext, options?: { isLdr?: boolean }) {
        // [KO] HDR 패스(SSAO 등) 내부에서 재사용될 경우를 대비해 isLdr 옵션을 열어둠 (기본값: true)
        // [EN] Expose isLdr option in case it is reused inside an HDR pass (e.g., SSAO) (default: true)
        const isLdr = options?.isLdr ?? true;
        super(
            redGPUContext,
            [
                new BlurX(redGPUContext, {isLdr}),
                new BlurY(redGPUContext, {isLdr})
            ],
            isLdr
        );
        this.size = this.size
    }

    /**
     * [KO] 블러 강도(단위: 픽셀, 0 ~ 512)를 반환하거나 설정합니다.
     * [EN] Returns or sets the blur strength (unit: pixels, 0 ~ 512).
     *
     * @defaultValue 32
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
