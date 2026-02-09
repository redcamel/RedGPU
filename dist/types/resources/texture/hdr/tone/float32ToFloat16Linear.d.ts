import RedGPUContext from "../../../../context/RedGPUContext";
/**
 * [KO] Float16 변환 옵션 인터페이스입니다.
 * [EN] Interface for Float16 conversion options.
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
     * [KO] 컴퓨트 워크그룹 크기 (기본값: [8, 8])
     * [EN] Compute workgroup size (default: [8, 8])
     */
    workgroupSize?: [number, number];
    /**
     * [KO] 최대 밝기 제한값 (기본값: 1000.0)
     * [EN] Maximum brightness limit value (default: 1000.0)
     */
    maxValue?: number;
}
/**
 * [KO] Float16 변환 결과 인터페이스입니다.
 * [EN] Interface for Float16 conversion results.
 */
export interface Float16ConversionResult {
    /**
     * [KO] 변환된 `Uint16Array` 데이터
     * [EN] Converted `Uint16Array` data
     */
    data: Uint16Array;
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
 * [KO] Float32 데이터를 Float16(Half-float)으로 변환합니다.
 * [EN] Converts Float32 data to Float16 (Half-float).
 *
 * [KO] GPU 컴퓨트 셰이더를 사용하여 선형 색공간을 유지하며 고속으로 변환을 수행합니다.
 * [EN] Performs high-speed conversion using GPU compute shaders while maintaining linear color space.
 *
 * ### Example
 * ```typescript
 * const result = await float32ToFloat16Linear(redGPUContext, rawFloat32Data, {
 *     width: 1024,
 *     height: 1024
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
 * [KO] 변환 결과 (Uint16Array 데이터 및 실행 정보 포함)
 * [EN] Conversion result (including Uint16Array data and execution info)
 * @category IBL
 */
export declare function float32ToFloat16Linear(redGPUContext: RedGPUContext, float32Data: Float32Array, options: Float16ConversionOptions): Promise<Float16ConversionResult>;
