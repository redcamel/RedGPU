import RedGPUContext from "../../../../context/RedGPUContext";
/**
 * [KO] Float16 변환 옵션 인터페이스입니다.
 * [EN] Interface for Float16 conversion options.
 * @category IBL
 */
export interface Float16ConversionOptions {
    /**
     * [KO] 이미지 너비
     * [EN] Image width
     */
    width: number;
    /**
     * [KO] 이미지 높이
     * [EN] Image height
     */
    height: number;
    /**
     * [KO] 결과가 복사될 대상 텍스처
     * [EN] Target texture to copy the result to
     */
    targetTexture: GPUTexture;
}
/**
 * [KO] Float16 변환 결과 인터페이스입니다.
 * [EN] Interface for Float16 conversion results.
 * @category IBL
 */
export interface Float16ConversionResult {
    /**
     * [KO] 처리된 총 픽셀 수
     * [EN] Total number of processed pixels
     */
    processedPixels: number;
    /**
     * [KO] 실행 시간 (ms)
     * [EN] Execution time in milliseconds
     */
    executionTime: number;
}
/**
 * [KO] Float32 데이터를 GPU 컴퓨트 셰이더를 통해 Float16(Half-float)으로 변환하여 대상 텍스처에 업로드합니다.
 * [EN] Converts Float32 data to Float16 (Half-float) via GPU compute shader and uploads it to the target texture.
 *
 * ### Example
 * ```typescript
 * await float32ToFloat16Linear(redGPUContext, rawFloat32Data, {
 *     width: 1024,
 *     height: 1024,
 *     targetTexture: myTexture
 * });
 * ```
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param float32Data -
 * [KO] 변환할 Float32 데이터 배열
 * [EN] Float32 data array to convert
 * @param options -
 * [KO] 변환 옵션
 * [EN] Conversion options
 * @returns
 * [KO] 변환 결과 (실행 정보 포함)
 * [EN] Conversion result (including execution info)
 * @category IBL
 */
export declare function float32ToFloat16Linear(redGPUContext: RedGPUContext, float32Data: Float32Array, options: Float16ConversionOptions): Promise<Float16ConversionResult>;
