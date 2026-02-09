import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing effect.
 *
 * [KO] 화면의 픽셀 정보를 분석하여 엣지 부분을 부드럽게 처리하는 저비용 안티앨리어싱 기법입니다.
 * [EN] A low-cost anti-aliasing technique that smoothens edges by analyzing screen pixel information.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 FXAA 설정 (Configure FXAA via AntialiasingManager)
 * redGPUContext.antialiasingManager.useFXAA = true;
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
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 서브픽셀 품질 값을 반환합니다.
     * [EN] Returns the subpixel quality value.
     *
     * @returns
     * [KO] 서브픽셀 품질
     * [EN] Subpixel quality
     */
    get subpix(): number;
    /**
     * [KO] 서브픽셀 품질 값을 설정합니다.
     * [EN] Sets the subpixel quality value.
     *
     * @param value -
     * [KO] 서브픽셀 품질 (0.0 ~ 1.0)
     * [EN] Subpixel quality (0.0 ~ 1.0)
     */
    set subpix(value: number);
    /**
     * [KO] 엣지 임계값을 반환합니다.
     * [EN] Returns the edge threshold.
     *
     * @returns
     * [KO] 엣지 임계값
     * [EN] Edge threshold
     */
    get edgeThreshold(): number;
    /**
     * [KO] 엣지 임계값을 설정합니다.
     * [EN] Sets the edge threshold.
     *
     * @param value -
     * [KO] 엣지 임계값 (0.0001 ~ 0.25)
     * [EN] Edge threshold (0.0001 ~ 0.25)
     */
    set edgeThreshold(value: number);
    /**
     * [KO] 최소 엣지 임계값을 반환합니다.
     * [EN] Returns the minimum edge threshold.
     *
     * @returns
     * [KO] 최소 엣지 임계값
     * [EN] Minimum edge threshold
     */
    get edgeThresholdMin(): number;
    /**
     * [KO] 최소 엣지 임계값을 설정합니다.
     * [EN] Sets the minimum edge threshold.
     *
     * @param value -
     * [KO] 최소 엣지 임계값 (0.00001 ~ 0.1)
     * [EN] Minimum edge threshold (0.00001 ~ 0.1)
     */
    set edgeThresholdMin(value: number);
}
export default FXAA;
