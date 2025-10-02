import RedGPUContext from "../RedGPUContext";
/**
 * RedGPUContext Instance GPUContext 정보를 정리..
 */
declare class RedGPUContextDetector {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get adapterInfo(): GPUAdapterInfo;
    get limits(): GPUSupportedLimits;
    get isFallbackAdapter(): boolean;
    get groupedLimits(): any;
    get userAgent(): string;
    get isMobile(): boolean;
}
export default RedGPUContextDetector;
