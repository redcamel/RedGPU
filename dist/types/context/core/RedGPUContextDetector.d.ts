import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../RedGPUContext";
/**
 * [KO] GPU 어댑터/디바이스의 기능 및 한계치(Limits)와 브라우저·플랫폼·하드웨어 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes GPU adapter/device features and limits, as well as browser, platform, and hardware environments.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Context
 */
declare class RedGPUContextDetector extends RedGPUObject {
    #private;
    /**
     * [KO] RedGPUContextDetector 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextDetector instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] GPU 어댑터가 지원하는 전체 기능의 지원 여부 맵(`Record<string, boolean>`)을 반환합니다.
     * [EN] Returns a map (`Record<string, boolean>`) of all known features and whether they are supported by the GPU adapter.
     *
     * @returns
     * [KO] 기능별 어댑터 지원 여부 맵
     * [EN] Feature support map of the GPU adapter
     */
    get supportedFeatures(): Record<string, boolean>;
    /**
     * [KO] GPU 디바이스에 실제 활성화된 기능 여부 맵(`Record<string, boolean>`)을 반환합니다.
     * [EN] Returns a map (`Record<string, boolean>`) of all known features and whether they are active on the GPU device.
     *
     * @returns
     * [KO] 기능별 디바이스 활성화 여부 맵
     * [EN] Feature activation map of the GPU device
     */
    get activeFeatures(): Record<string, boolean>;
    /**
     * [KO] GPU 어댑터가 지원하는 한계 제한치(`GPUSupportedLimits`)를 반환합니다.
     * [EN] Returns the limits (`GPUSupportedLimits`) supported by the GPU adapter.
     *
     * @returns
     * [KO] GPU 어댑터 지원 한계치
     * [EN] Supported limits of the GPU adapter
     */
    get supportedLimits(): GPUSupportedLimits;
    /**
     * [KO] GPU 디바이스에 적용된 한계 제한치(`GPUSupportedLimits`)를 반환합니다.
     * [EN] Returns the limits (`GPUSupportedLimits`) active on the GPU device.
     *
     * @returns
     * [KO] GPU 디바이스 활성 한계치
     * [EN] Active limits of the GPU device
     */
    get activeLimits(): GPUSupportedLimits;
    /**
     * [KO] GPU 어댑터 객체를 반환합니다.
     * [EN] Returns the GPU adapter object.
     *
     * @returns
     * [KO] `GPUAdapter` 인스턴스
     * [EN] `GPUAdapter` instance
     */
    get gpuAdapter(): GPUAdapter;
    /**
     * [KO] GPU 어댑터 정보를 반환합니다.
     * [EN] Returns the GPU adapter information.
     *
     * @returns
     * [KO] `GPUAdapterInfo` 인스턴스
     * [EN] `GPUAdapterInfo` instance
     */
    get adapterInfo(): GPUAdapterInfo;
    /**
     * [KO] 폴백 어댑터(소프트웨어 렌더러 등) 여부를 반환합니다.
     * [EN] Returns whether the adapter is a fallback adapter (e.g., software renderer).
     *
     * @returns
     * [KO] 폴백 어댑터 여부
     * [EN] Whether it is a fallback adapter
     */
    get isFallbackAdapter(): boolean;
    /**
     * [KO] 브라우저의 UserAgent 문자열을 반환합니다.
     * [EN] Returns the browser's UserAgent string.
     *
     * @returns
     * [KO] UserAgent 문자열
     * [EN] UserAgent string
     */
    get userAgent(): string;
    /**
     * [KO] 모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.
     * [EN] Returns whether the current environment is mobile (smartphones, tablets, etc.).
     *
     * @returns
     * [KO] 모바일 환경 여부
     * [EN] Whether it is a mobile environment
     */
    get isMobile(): boolean;
    /**
     * [KO] iOS 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is iOS.
     *
     * @returns
     * [KO] iOS 여부
     * [EN] Whether it is iOS
     */
    get isIOS(): boolean;
    /**
     * [KO] Android 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is Android.
     *
     * @returns
     * [KO] Android 여부
     * [EN] Whether it is Android
     */
    get isAndroid(): boolean;
    /**
     * [KO] Chromium 기반 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Chromium-based.
     *
     * @returns
     * [KO] Chromium 기반 브라우저 여부
     * [EN] Whether it is a Chromium-based browser
     */
    get isChromium(): boolean;
    /**
     * [KO] Safari 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Safari.
     *
     * @returns
     * [KO] Safari 브라우저 여부
     * [EN] Whether it is Safari
     */
    get isSafari(): boolean;
    /**
     * [KO] Firefox 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Firefox.
     *
     * @returns
     * [KO] Firefox 브라우저 여부
     * [EN] Whether it is Firefox
     */
    get isFirefox(): boolean;
    /**
     * [KO] 논리 프로세서 코어 개수를 반환합니다. (기본값: 4)
     * [EN] Returns the number of logical processor cores (default: 4).
     *
     * @returns
     * [KO] 논리 프로세서 코어 수
     * [EN] Number of logical processor cores
     */
    get hardwareConcurrency(): number;
    /**
     * [KO] 대략적인 장치 메모리 용량(GB 단위)을 반환합니다. (기본값: 4)
     * [EN] Returns the approximate device memory capacity in GB (default: 4).
     *
     * @returns
     * [KO] 장치 메모리 용량 (GB)
     * [EN] Device memory capacity (GB)
     */
    get deviceMemory(): number;
    /**
     * [KO] RedGPUContextDetector 인스턴스를 파기하고 내부 GPU 및 환경 참조를 해제합니다.
     * [EN] Destroys the RedGPUContextDetector instance and releases internal GPU and environment references.
     */
    destroy(): void;
    /**
     * [KO] 감지된 플랫폼, 브라우저, 하드웨어 및 GPU 정보를 종합한 리포트 객체를 반환합니다.
     * [EN] Returns a comprehensive report object containing detected platform, browser, hardware, and GPU information.
     *
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
