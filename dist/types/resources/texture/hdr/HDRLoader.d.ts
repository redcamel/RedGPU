export interface HDRData {
    data: Float32Array;
    width: number;
    height: number;
}
export interface FileValidation {
    isValid: boolean;
    format: string;
    error?: string;
}
declare class HDRLoader {
    #private;
    constructor(enableDebugLogs?: boolean);
    get enableDebugLogs(): boolean;
    set enableDebugLogs(value: boolean);
    /**
     * HDR 파일 로드 (원본 데이터 보존, 분석만 수행)
     */
    loadHDRFile(src: string): Promise<HDRData>;
}
export default HDRLoader;
