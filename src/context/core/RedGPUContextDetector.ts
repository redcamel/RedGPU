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
class RedGPUContextDetector {
    #gpuAdapter: GPUAdapter;
    #adapterInfo: GPUAdapterInfo;
    #supportedLimits: GPUSupportedLimits;
    #activeLimits: GPUSupportedLimits;
    #supportedFeatures: Record<string, boolean> = {};
    #activeFeatures: Record<string, boolean> = {};
    #isFallbackAdapter: boolean;
    #userAgent: string;

    // Platform & Environment (Cached)
    #isMobile: boolean;
    #isIOS: boolean;
    #isAndroid: boolean;
    #isChromium: boolean;
    #isSafari: boolean;
    #isFirefox: boolean;

    // Hardware Resources
    #hardwareConcurrency: number;
    #deviceMemory: number;

    /**
     * [KO] RedGPUContextDetector 생성자
     * [EN] RedGPUContextDetector constructor
     */
    constructor(redGPUContext: RedGPUContext) {
        const ua = navigator.userAgent;
        this.#userAgent = ua;

        // Platform Detection (Cached)
        this.#isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(ua);
        this.#isIOS = /iPhone|iPad|iPod/i.test(ua);
        this.#isAndroid = /Android/i.test(ua);
        this.#isChromium = /Chrome|Chromium|Edg|Opr/i.test(ua) && !/Edge/i.test(ua);
        this.#isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|Opr/i.test(ua);
        this.#isFirefox = /Firefox/i.test(ua);

        this.#hardwareConcurrency = navigator.hardwareConcurrency || 4;
        this.#deviceMemory = (navigator as any).deviceMemory || 4;

        const {gpuAdapter, gpuDevice} = redGPUContext;
        this.#gpuAdapter = gpuAdapter;

        // [KO] 추적할 주요 기능 목록
        const allKnownFeatures = [
            "core-features-and-limits",
            "depth-clip-control",
            "depth32float-stencil8",
            "texture-compression-bc",
            "texture-compression-bc-sliced-3d",
            "texture-compression-etc2",
            "texture-compression-astc",
            "texture-compression-astc-sliced-3d",
            "timestamp-query",
            "indirect-first-instance",
            "shader-f16",
            "rg11b10ufloat-renderable",
            "bgra8unorm-storage",
            "float32-filterable",
            "float32-blendable",
            "clip-distances",
            "dual-source-blending",
            "subgroups",
            "texture-formats-tier1",
            "texture-formats-tier2",
            "primitive-index",
            "texture-component-swizzle"
        ];

        // [KO] 1. 하드웨어 지원 정보 수집 (Adapter)
        if (gpuAdapter) {
            this.#adapterInfo = gpuAdapter.info;
            this.#isFallbackAdapter = gpuAdapter.info.isFallbackAdapter;
            this.#supportedLimits = gpuAdapter.limits;

            const actualSupported = Array.from(gpuAdapter.features);
            const finalFeatureList = Array.from(new Set([...allKnownFeatures, ...actualSupported])).sort();

            this.#supportedFeatures = {};
            for (const k of finalFeatureList) {
                this.#supportedFeatures[k] = gpuAdapter.features.has(k);
            }
        }

        // [KO] 2. 실제 장치 활성화 정보 수집 (Device)
        if (gpuDevice) {
            this.#activeLimits = gpuDevice.limits;
            this.#activeFeatures = {};
            for (const k in this.#supportedFeatures) {
                this.#activeFeatures[k] = gpuDevice.features.has(k);
            }
        }

        // keepLog(this);
    }

    // Getters
    /**
     * [KO] GPU 어댑터가 지원하는 전체 기능 목록의 키와 지원 여부 맵을 반환합니다.
     * [EN] Returns a map of all known features and whether they are supported by the GPU adapter.
     */
    get supportedFeatures(): Record<string, boolean> {
        return this.#supportedFeatures;
    }

    /**
     * [KO] GPU 디바이스에 실제 활성화된 기능 목록의 키와 활성화 여부 맵을 반환합니다.
     * [EN] Returns a map of all known features and whether they are active on the GPU device.
     */
    get activeFeatures(): Record<string, boolean> {
        return this.#activeFeatures;
    }

    /**
     * [KO] GPU 어댑터의 한계 제한치(Limits)를 반환합니다.
     * [EN] Returns the limits supported by the GPU adapter.
     */
    get supportedLimits(): GPUSupportedLimits {
        return this.#supportedLimits;
    }

    /**
     * [KO] GPU 디바이스의 한계 제한치(Limits)를 반환합니다.
     * [EN] Returns the limits active on the GPU device.
     */
    get activeLimits(): GPUSupportedLimits {
        return this.#activeLimits;
    }

    /**
     * [KO] GPU 어댑터 객체를 반환합니다.
     * [EN] Returns the GPU adapter object.
     */
    get gpuAdapter(): GPUAdapter {
        return this.#gpuAdapter;
    }

    /**
     * [KO] GPU 어댑터 정보를 반환합니다.
     * [EN] Returns the GPU adapter information.
     */
    get adapterInfo(): GPUAdapterInfo {
        return this.#adapterInfo;
    }

    /**
     * [KO] 폴백 어댑터(Fallback Adapter) 여부를 반환합니다. (예: CPU 소프트웨어 렌더러)
     * [EN] Returns whether it is a fallback adapter (e.g., CPU software renderer).
     */
    get isFallbackAdapter(): boolean {
        return this.#isFallbackAdapter;
    }

    /**
     * [KO] 브라우저의 UserAgent 문자열을 반환합니다.
     * [EN] Returns the UserAgent string of the browser.
     */
    get userAgent(): string {
        return this.#userAgent;
    }

    /**
     * [KO] 모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.
     * [EN] Returns whether it is a mobile environment (smartphones, tablets, etc.).
     */
    get isMobile(): boolean {
        return this.#isMobile;
    }

    /**
     * [KO] iOS 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is iOS.
     */
    get isIOS(): boolean {
        return this.#isIOS;
    }

    /**
     * [KO] Android 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is Android.
     */
    get isAndroid(): boolean {
        return this.#isAndroid;
    }

    /**
     * [KO] Chromium 기반 브라우저 여부를 반환합니다.
     * [EN] Returns whether it is a Chromium-based browser.
     */
    get isChromium(): boolean {
        return this.#isChromium;
    }

    /**
     * [KO] Safari 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Safari.
     */
    get isSafari(): boolean {
        return this.#isSafari;
    }

    /**
     * [KO] Firefox 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Firefox.
     */
    get isFirefox(): boolean {
        return this.#isFirefox;
    }

    /**
     * [KO] 논리 프로세서 코어 개수를 반환합니다. (기본값: 4)
     * [EN] Returns the number of logical processor cores. (default: 4)
     */
    get hardwareConcurrency(): number {
        return this.#hardwareConcurrency;
    }

    /**
     * [KO] 장치 메모리 용량을 대략적인 GB 단위로 반환합니다. (기본값: 4)
     * [EN] Returns the approximate device memory in GB. (default: 4)
     */
    get deviceMemory(): number {
        return this.#deviceMemory;
    }

    destroy(): void {
        // WebGPU 네이티브 객체 참조 끊기 (타입 에러 방지를 위해 as any 사용 또는 null 허용 타입으로 변경)
        this.#gpuAdapter = null as any;
        this.#adapterInfo = null as any;
        this.#supportedLimits = null as any;
        this.#activeLimits = null as any;

        // Record(객체) 참조 끊기
        this.#supportedFeatures = {};
        this.#activeFeatures = {};

        // 문자열 캐시 정리 (선택 사항이나 GC에 도움됨)
        this.#userAgent = '';
    }

    /**
     * [KO] 모든 탐지된 정보를 리포트 객체로 반환합니다.
     * [EN] Returns all detected information as a report object.
     * @returns
     * [KO] 플랫폼, 브라우저, 하드웨어, GPU 정보가 포함된 리포트 객체
     * [EN] Report object containing platform, browser, hardware, and GPU information
     */
    toReport() {
        return {
            platform: {
                isMobile: this.#isMobile,
                isIOS: this.#isIOS,
                isAndroid: this.#isAndroid,
                userAgent: this.#userAgent
            },
            browser: {
                isChromium: this.#isChromium,
                isSafari: this.#isSafari,
                isFirefox: this.#isFirefox
            },
            hardware: {
                hardwareConcurrency: this.#hardwareConcurrency,
                deviceMemory: this.#deviceMemory
            },
            gpu: {
                vendor: this.#adapterInfo?.vendor,
                architecture: this.#adapterInfo?.architecture,
                device: this.#adapterInfo?.device,
                description: this.#adapterInfo?.description,
                isFallback: this.#isFallbackAdapter,
                supportedFeatures: {...this.#supportedFeatures},
                activeFeatures: {...this.#activeFeatures},
                supportedLimits: this.#supportedLimits ? this.#serializeLimits(this.#supportedLimits) : null,
                activeLimits: this.#activeLimits ? this.#serializeLimits(this.#activeLimits) : null
            }
        };
    }

    #serializeLimits(limits: GPUSupportedLimits) {
        const result: Record<string, number> = {};
        const proto = Object.getPrototypeOf(limits);
        Object.getOwnPropertyNames(proto).forEach(key => {
            const value = (limits as any)[key];
            if (typeof value === 'number') result[key] = value;
        });
        return result;
    }
}

export default RedGPUContextDetector;
