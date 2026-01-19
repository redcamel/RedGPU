import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * [KO] 컨볼루션(Convolution) 커널 기반 후처리 이펙트입니다.
 * [EN] Convolution kernel-based post-processing effect.
 *
 * [KO] 다양한 커널(NORMAL, SHARPEN, BLUR, EDGE, EMBOSE)로 이미지 효과를 줄 수 있습니다.
 * [EN] Various kernels (NORMAL, SHARPEN, BLUR, EDGE, EMBOSE) can be used to apply image effects.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
 * effect.kernel = RedGPU.PostEffect.Convolution.SHARPEN;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/convolution/"></iframe>
 * @category PostEffect
 */
declare class Convolution extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] NORMAL 커널
     * [EN] NORMAL kernel
     */
    static NORMAL: number[];
    /**
     * [KO] SHARPEN 커널
     * [EN] SHARPEN kernel
     */
    static SHARPEN: number[];
    /**
     * [KO] BLUR 커널
     * [EN] BLUR kernel
     */
    static BLUR: number[];
    /**
     * [KO] EDGE 커널
     * [EN] EDGE kernel
     */
    static EDGE: number[];
    /**
     * [KO] EMBOSE 커널
     * [EN] EMBOSE kernel
     */
    static EMBOSE: number[];
    /**
     * [KO] Convolution 인스턴스를 생성합니다.
     * [EN] Creates a Convolution instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 현재 커널을 반환합니다.
     * [EN] Returns the current kernel.
     */
    get kernel(): number[];
    /**
     * [KO] 커널을 설정합니다. (4x4 배열, 길이 16)
     * [EN] Sets the kernel. (4x4 array, length 16)
     */
    set kernel(value: number[]);
}
export default Convolution;
