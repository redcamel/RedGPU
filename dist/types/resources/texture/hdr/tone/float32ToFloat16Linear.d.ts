import RedGPUContext from "../../../../context/RedGPUContext";
export interface Float16ConversionOptions {
    width: number;
    height: number;
    workgroupSize?: [number, number];
    maxValue?: number;
}
export interface Float16ConversionResult {
    data: Uint16Array;
    processedPixels: number;
    executionTime: number;
}
export declare function float32ToFloat16Linear(redGPUContext: RedGPUContext, float32Data: Float32Array, options: Float16ConversionOptions): Promise<Float16ConversionResult>;
