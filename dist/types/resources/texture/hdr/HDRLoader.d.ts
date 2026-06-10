/**
 * [KO] HDR 텍스처 데이터를 나타내는 인터페이스입니다.
 * [EN] Interface representing HDR texture data.
 */
export interface HDRData {
    /**
     * [KO] 부동 소수점 픽셀 데이터 (RGBA 순서)
     * [EN] Floating-point pixel data (RGBA order)
     */
    data: Float32Array;
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
}
/**
 * [KO] 파일 유효성 검사 결과를 나타내는 인터페이스입니다.
 * [EN] Interface representing file validation results.
 */
export interface FileValidation {
    /**
     * [KO] 유효 여부
     * [EN] Whether the file is valid
     */
    isValid: boolean;
    /**
     * [KO] 파일 포맷 정보
     * [EN] File format information
     */
    format: string;
    /**
     * [KO] 에러 메시지 (선택적)
     * [EN] Error message (optional)
     */
    error?: string;
}
/**
 * [KO] Radiance HDR(.hdr) 파일을 파싱하고 로드하는 클래스입니다.
 * [EN] Class that parses and loads Radiance HDR (.hdr) files.
 *
 * [KO] RGBE 포맷의 HDR 데이터를 읽어 들여 CPU 메모리에 Float32Array 형태로 변환합니다.
 * [EN] Reads HDR data in RGBE format and converts it into a Float32Array in CPU memory.
 *
 * ### Example
 * ```typescript
 * const loader = new RedGPU.Resource.HDRLoader();
 * const hdrData = await loader.loadHDRFile('path/to/environment.hdr');
 * ```
 * @category IBL
 */
declare class HDRLoader {
    #private;
    /**
     * [KO] HDRLoader 인스턴스를 생성합니다.
     * [EN] Creates an HDRLoader instance.
     * @param enableDebugLogs -
     * [KO] 디버그 로그 활성화 여부 (기본값: true)
     * [EN] Whether to enable debug logs (default: true)
     */
    constructor(enableDebugLogs?: boolean);
    /**
     * [KO] 디버그 로그 활성화 여부를 반환합니다.
     * [EN] Returns whether debug logs are enabled.
     */
    get enableDebugLogs(): boolean;
    /**
     * [KO] 디버그 로그 활성화 여부를 설정합니다.
     * [EN] Sets whether to enable debug logs.
     */
    set enableDebugLogs(value: boolean);
    /**
     * [KO] HDR 파일을 로드하고 데이터를 반환합니다.
     * [EN] Loads an HDR file and returns the data.
     *
     * ### Example
     * ```typescript
     * const hdrData = await loader.loadHDRFile('assets/sky.hdr');
     * ```
     *
     * @param src -
     * [KO] HDR 파일 경로
     * [EN] HDR file path
     * @returns
     * [KO] 파싱된 HDR 데이터 (픽셀, 크기 정보 포함)
     * [EN] Parsed HDR data (including pixel and size information)
     * @throws
     * [KO] HTTP 로드 실패 또는 잘못된 포맷일 경우 Error 발생
     * [EN] Throws Error on HTTP failure or invalid format
     */
    loadHDRFile(src: string): Promise<HDRData>;
}
export default HDRLoader;
