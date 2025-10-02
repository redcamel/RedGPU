import RedGPUContext from "../../../../context/RedGPUContext";
export interface ToneMappingOptions {
    exposure: number;
    width: number;
    height: number;
    workgroupSize?: [number, number];
}
export interface ToneMappingResult {
    data: Uint16Array;
    processedPixels: number;
    executionTime: number;
}
/**
 * 🎬 GPU 기반 HDR Float16 톤매핑 유틸리티
 * ACES 톤매핑과 노출 조절을 통해 Float32 → Float16 변환
 */
export declare function float32ToFloat16WithToneMapping(redGPUContext: RedGPUContext, float32Data: Float32Array, options: ToneMappingOptions): Promise<ToneMappingResult>;
