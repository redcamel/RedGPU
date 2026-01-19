import RedGPUContext from "../context/RedGPUContext";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.FXAA(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @category PostEffect
 */
declare class FXAA extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] FXAA 인스턴스를 생성합니다.
     * [EN] Creates an FXAA instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 서브픽셀 품질 값을 반환합니다.
     * [EN] Returns the subpixel quality value.
     */
    get subpix(): number;
    /**
     * [KO] 서브픽셀 품질 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the subpixel quality value. (0.0 ~ 1.0)
     */
    set subpix(value: number);
    /**
     * [KO] 엣지 임계값을 반환합니다.
     * [EN] Returns the edge threshold.
     */
    get edgeThreshold(): number;
    /**
     * [KO] 엣지 임계값을 설정합니다. (0.0001 ~ 0.25)
     * [EN] Sets the edge threshold. (0.0001 ~ 0.25)
     */
    set edgeThreshold(value: number);
    /**
     * [KO] 최소 엣지 임계값을 반환합니다.
     * [EN] Returns the minimum edge threshold.
     */
    get edgeThresholdMin(): number;
    /**
     * [KO] 최소 엣지 임계값을 설정합니다. (0.00001 ~ 0.1)
     * [EN] Sets the minimum edge threshold. (0.00001 ~ 0.1)
     */
    set edgeThresholdMin(value: number);
}
export default FXAA;
