import RedGPUContext from "../RedGPUContext";
/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
declare class RedGPUContextDetector {
    #private;
    /**
     * [KO] RedGPUContextDetector 생성자
     * [EN] RedGPUContextDetector constructor
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] GPU 어댑터가 지원하는 전체 기능 목록의 키와 지원 여부 맵을 반환합니다.
     * [EN] Returns a map of all known features and whether they are supported by the GPU adapter.
     */
    get supportedFeatures(): Record<string, boolean>;
    /**
     * [KO] GPU 디바이스에 실제 활성화된 기능 목록의 키와 활성화 여부 맵을 반환합니다.
     * [EN] Returns a map of all known features and whether they are active on the GPU device.
     */
    get activeFeatures(): Record<string, boolean>;
    /**
     * [KO] GPU 어댑터의 한계 제한치(Limits)를 반환합니다.
     * [EN] Returns the limits supported by the GPU adapter.
     */
    get supportedLimits(): GPUSupportedLimits;
    /**
     * [KO] GPU 디바이스의 한계 제한치(Limits)를 반환합니다.
     * [EN] Returns the limits active on the GPU device.
     */
    get activeLimits(): GPUSupportedLimits;
    /**
     * [KO] GPU 어댑터 객체를 반환합니다.
     * [EN] Returns the GPU adapter object.
     */
    get gpuAdapter(): GPUAdapter;
    /**
     * [KO] GPU 어댑터 정보를 반환합니다.
     * [EN] Returns the GPU adapter information.
     */
    get adapterInfo(): GPUAdapterInfo;
    /**
     * [KO] 폴백 어댑터(Fallback Adapter) 여부를 반환합니다. (예: CPU 소프트웨어 렌더러)
     * [EN] Returns whether it is a fallback adapter (e.g., CPU software renderer).
     */
    get isFallbackAdapter(): boolean;
    /**
     * [KO] 브라우저의 UserAgent 문자열을 반환합니다.
     * [EN] Returns the UserAgent string of the browser.
     */
    get userAgent(): string;
    /**
     * [KO] 모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.
     * [EN] Returns whether it is a mobile environment (smartphones, tablets, etc.).
     */
    get isMobile(): boolean;
    /**
     * [KO] iOS 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is iOS.
     */
    get isIOS(): boolean;
    /**
     * [KO] Android 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is Android.
     */
    get isAndroid(): boolean;
    /**
     * [KO] Chromium 기반 브라우저 여부를 반환합니다.
     * [EN] Returns whether it is a Chromium-based browser.
     */
    get isChromium(): boolean;
    /**
     * [KO] Safari 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Safari.
     */
    get isSafari(): boolean;
    /**
     * [KO] Firefox 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Firefox.
     */
    get isFirefox(): boolean;
    /**
     * [KO] 논리 프로세서 코어 개수를 반환합니다. (기본값: 4)
     * [EN] Returns the number of logical processor cores. (default: 4)
     */
    get hardwareConcurrency(): number;
    /**
     * [KO] 장치 메모리 용량을 대략적인 GB 단위로 반환합니다. (기본값: 4)
     * [EN] Returns the approximate device memory in GB. (default: 4)
     */
    get deviceMemory(): number;
    /**
     * [KO] 모든 탐지된 정보를 리포트 객체로 반환합니다.
     * [EN] Returns all detected information as a report object.
     * @returns
     * [KO] 플랫폼, 브라우저, 하드웨어, GPU 정보가 포함된 리포트 객체
     * [EN] Report object containing platform, browser, hardware, and GPU information
     */
    toReport(): {
        platform: {
            isMobile: boolean;
            isIOS: boolean;
            isAndroid: boolean;
            userAgent: string;
        };
        browser: {
            isChromium: boolean;
            isSafari: boolean;
            isFirefox: boolean;
        };
        hardware: {
            hardwareConcurrency: number;
            deviceMemory: number;
        };
        gpu: {
            vendor: string;
            architecture: string;
            device: string;
            description: string;
            isFallback: boolean;
            supportedFeatures: {
                [x: string]: boolean;
            };
            activeFeatures: {
                [x: string]: boolean;
            };
            supportedLimits: Record<string, number>;
            activeLimits: Record<string, number>;
        };
    };
}
export default RedGPUContextDetector;
