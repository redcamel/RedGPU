import RedGPUContext from "../../../../context/RedGPUContext";
export interface Float16ConversionOptions {
    width: number;
    height: number;
    workgroupSize?: [number, number];
}
export interface Float16ConversionResult {
    data: Uint16Array;
    processedPixels: number;
    executionTime: number;
}
/**
 * 🎬 GPU 기반 Float32 → Float16 변환 유틸리티
 * 톤매핑 없이 단순 포맷 변환만 수행
 */
export declare function float32ToFloat16WithToneMapping(redGPUContext: RedGPUContext, float32Data: Float32Array, options: Float16ConversionOptions): Promise<Float16ConversionResult>;
