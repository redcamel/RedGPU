import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * [KO] 3x3 컨볼루션 커널을 사용하여 픽셀을 주변 픽셀과 합성하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that combines pixels with surrounding pixels using a 3x3 convolution kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
 * effect.kernel = RedGPU.PostEffect.Convolution.SHARPEN;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/convolution/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Convolution example](/RedGPU/examples/postEffect/convolution/)
 * @category PostEffect
 */
declare class Convolution extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] 원본 유지 기본 커널
     * [EN] Default identity kernel
     */
    static NORMAL: number[];
    /**
     * [KO] 경계 강조 샤픈 커널
     * [EN] Edge-enhancing sharpen kernel
     */
    static SHARPEN: number[];
    /**
     * [KO] 균일 블러 커널
     * [EN] Uniform blur kernel
     */
    static BLUR: number[];
    /**
     * [KO] 외곽선 추출 커널
     * [EN] Edge detection kernel
     */
    static EDGE: number[];
    /**
     * [KO] 입체 질감 엠보싱 커널
     * [EN] Embossing kernel
     */
    static EMBOSS: number[];
    /**
     * [KO] Convolution 인스턴스를 생성합니다.
     * [EN] Creates a Convolution instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 3x3 커널 데이터(12개 요소의 `mat3x3` 정렬 숫자 배열)를 반환하거나 설정합니다.
     * [EN] Returns or sets the 3x3 kernel data (12-element `mat3x3` aligned number array).
     *
     * @defaultValue Convolution.EDGE
     * @returns
     * [KO] 커널 데이터 배열 (`number[]`)
     * [EN] Kernel data array (`number[]`)
     */
    get kernel(): number[];
    set kernel(value: number[]);
}
export default Convolution;
