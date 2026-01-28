import RedGPUContext from "../RedGPUContext";
/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
 *
 * [KO] Adapter 정보, 제한값(Limits), Fallback 여부, 모바일 환경 여부 등을 제공합니다.
 * [EN] Provides adapter information, limits, fallback status, mobile environment status, etc.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * const detector = redGPUContext.detector;
 * console.log('Is mobile:', detector.isMobile);
 * console.log('GPU Limits:', detector.limits);
 * ```
 *
 * @category Context
 */
declare class RedGPUContextDetector {
    #private;
    /**
     * [KO] RedGPUContextDetector 생성자
     * [EN] RedGPUContextDetector constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 현재 사용중인 GPUAdapter의 정보를 반환합니다.
     * [EN] Returns information about the currently used GPUAdapter.
     */
    get adapterInfo(): GPUAdapterInfo;
    /**
     * [KO] 현재 사용 중인 GPU의 한계값을 반환합니다.
     * [EN] Returns the supported limits of the currently used GPU.
     */
    get limits(): GPUSupportedLimits;
    /**
     * [KO] 현재 어댑터가 Fallback 어댑터인지 여부를 반환합니다.
     * [EN] Returns whether the current adapter is a fallback adapter.
     */
    get isFallbackAdapter(): boolean;
    /**
     * [KO] 그룹화된 한계값 정보를 반환합니다.
     * [EN] Returns grouped limit information.
     */
    get groupedLimits(): any;
    /**
     * [KO] 브라우저의 User-Agent 문자열을 반환합니다.
     * [EN] Returns the browser's User-Agent string.
     */
    get userAgent(): string;
    /**
     * [KO] 모바일 디바이스인지 여부를 반환합니다.
     * [EN] Returns whether it is a mobile device.
     */
    get isMobile(): boolean;
}
export default RedGPUContextDetector;
