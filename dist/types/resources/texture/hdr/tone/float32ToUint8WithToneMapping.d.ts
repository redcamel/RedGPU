import RedGPUContext from "../../../../context/RedGPUContext";
export interface ToneMappingOptions {
    exposure: number;
    width: number;
    height: number;
    workgroupSize?: [number, number];
}
export interface ToneMappingResult {
    data: Uint8Array;
    processedPixels: number;
    executionTime: number;
}
/**
 * 🎬 GPU 기반 HDR 톤매핑 유틸리티
 * ACES 톤매핑과 감마 보정을 통해 Float32 → Uint8 변환
 */
export declare function float32ToUint8WithToneMapping(redGPUContext: RedGPUContext, float32Data: Float32Array, options: ToneMappingOptions): Promise<ToneMappingResult>;
