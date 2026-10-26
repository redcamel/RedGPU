/**
 * [KO] 가중치가 적용된 소스(Source)와 대상(Destination) 색상/알파 값을 결합하는 블렌딩 산술 연산자 상수입니다.
 * [EN] Blending arithmetic operator constants that combine weighted source and destination color/alpha values.
 *
 * @category Constants
 */
declare const GPU_BLEND_OPERATION: {
    /**
     * [KO] 가중치가 곱해진 소스 값과 대상 값을 더합니다. (`Src * SrcFactor + Dst * DstFactor`)
     * [EN] Adds the weighted source and destination values. (`Src * SrcFactor + Dst * DstFactor`)
     */
    readonly ADD: "add";
    /**
     * [KO] 가중치가 곱해진 소스 값에서 대상 값을 뺍니다. (`Src * SrcFactor - Dst * DstFactor`)
     * [EN] Subtracts the weighted destination value from the weighted source value. (`Src * SrcFactor - Dst * DstFactor`)
     */
    readonly SUBTRACT: "subtract";
    /**
     * [KO] 가중치가 곱해진 대상 값에서 소스 값을 뺍니다. (`Dst * DstFactor - Src * SrcFactor`)
     * [EN] Subtracts the weighted source value from the weighted destination value. (`Dst * DstFactor - Src * SrcFactor`)
     */
    readonly REVERSE_SUBTRACT: "reverse-subtract";
    /**
     * [KO] 소스와 대상의 각 채널 중 더 작은 값을 선택합니다. (`min(Src, Dst)`)
     * [EN] Selects the minimum value per channel between source and destination. (`min(Src, Dst)`)
     */
    readonly MIN: "min";
    /**
     * [KO] 소스와 대상의 각 채널 중 더 큰 값을 선택합니다. (`max(Src, Dst)`)
     * [EN] Selects the maximum value per channel between source and destination. (`max(Src, Dst)`)
     */
    readonly MAX: "max";
};
export default GPU_BLEND_OPERATION;
