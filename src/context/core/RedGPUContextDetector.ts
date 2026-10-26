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
class RedGPUContextDetector extends RedGPUObject {
    #gpuAdapter: GPUAdapter;
    #adapterInfo: GPUAdapterInfo;
    #supportedLimits: GPUSupportedLimits;
    #activeLimits: GPUSupportedLimits;
    #supportedFeatures: Record<string, boolean> = {};
    #activeFeatures: Record<string, boolean> = {};
    #isFallbackAdapter: boolean;
    #userAgent: string;

    #isMobile: boolean;
    #isIOS: boolean;
    #isAndroid: boolean;
    #isChromium: boolean;
    #isSafari: boolean;
    #isFirefox: boolean;

    #hardwareConcurrency: number;
    #deviceMemory: number;

    /**
     * [KO] RedGPUContextDetector 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextDetector instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const ua = navigator.userAgent;
        this.#userAgent = ua;

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

        if (gpuDevice) {
            this.#activeLimits = gpuDevice.limits;
            this.#activeFeatures = {};
            for (const k in this.#supportedFeatures) {
                this.#activeFeatures[k] = gpuDevice.features.has(k);
            }
        }
    }

    /**
     * [KO] GPU 어댑터가 지원하는 전체 기능의 지원 여부 맵(`Record<string, boolean>`)을 반환합니다.
     * [EN] Returns a map (`Record<string, boolean>`) of all known features and whether they are supported by the GPU adapter.
     *
     * @returns
     * [KO] 기능별 어댑터 지원 여부 맵
     * [EN] Feature support map of the GPU adapter
     */
    get supportedFeatures(): Record<string, boolean> {
        return this.#supportedFeatures;
    }

    /**
     * [KO] GPU 디바이스에 실제 활성화된 기능 여부 맵(`Record<string, boolean>`)을 반환합니다.
     * [EN] Returns a map (`Record<string, boolean>`) of all known features and whether they are active on the GPU device.
     *
     * @returns
     * [KO] 기능별 디바이스 활성화 여부 맵
     * [EN] Feature activation map of the GPU device
     */
    get activeFeatures(): Record<string, boolean> {
        return this.#activeFeatures;
    }

    /**
     * [KO] GPU 어댑터가 지원하는 한계 제한치(`GPUSupportedLimits`)를 반환합니다.
     * [EN] Returns the limits (`GPUSupportedLimits`) supported by the GPU adapter.
     *
     * @returns
     * [KO] GPU 어댑터 지원 한계치
     * [EN] Supported limits of the GPU adapter
     */
    get supportedLimits(): GPUSupportedLimits {
        return this.#supportedLimits;
    }

    /**
     * [KO] GPU 디바이스에 적용된 한계 제한치(`GPUSupportedLimits`)를 반환합니다.
     * [EN] Returns the limits (`GPUSupportedLimits`) active on the GPU device.
     *
     * @returns
     * [KO] GPU 디바이스 활성 한계치
     * [EN] Active limits of the GPU device
     */
    get activeLimits(): GPUSupportedLimits {
        return this.#activeLimits;
    }

    /**
     * [KO] GPU 어댑터 객체를 반환합니다.
     * [EN] Returns the GPU adapter object.
     *
     * @returns
     * [KO] `GPUAdapter` 인스턴스
     * [EN] `GPUAdapter` instance
     */
    get gpuAdapter(): GPUAdapter {
        return this.#gpuAdapter;
    }

    /**
     * [KO] GPU 어댑터 정보를 반환합니다.
     * [EN] Returns the GPU adapter information.
     *
     * @returns
     * [KO] `GPUAdapterInfo` 인스턴스
     * [EN] `GPUAdapterInfo` instance
     */
    get adapterInfo(): GPUAdapterInfo {
        return this.#adapterInfo;
    }

    /**
     * [KO] 폴백 어댑터(소프트웨어 렌더러 등) 여부를 반환합니다.
     * [EN] Returns whether the adapter is a fallback adapter (e.g., software renderer).
     *
     * @returns
     * [KO] 폴백 어댑터 여부
     * [EN] Whether it is a fallback adapter
     */
    get isFallbackAdapter(): boolean {
        return this.#isFallbackAdapter;
    }

    /**
     * [KO] 브라우저의 UserAgent 문자열을 반환합니다.
     * [EN] Returns the browser's UserAgent string.
     *
     * @returns
     * [KO] UserAgent 문자열
     * [EN] UserAgent string
     */
    get userAgent(): string {
        return this.#userAgent;
    }

    /**
     * [KO] 모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.
     * [EN] Returns whether the current environment is mobile (smartphones, tablets, etc.).
     *
     * @returns
     * [KO] 모바일 환경 여부
     * [EN] Whether it is a mobile environment
     */
    get isMobile(): boolean {
        return this.#isMobile;
    }

    /**
     * [KO] iOS 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is iOS.
     *
     * @returns
     * [KO] iOS 여부
     * [EN] Whether it is iOS
     */
    get isIOS(): boolean {
        return this.#isIOS;
    }

    /**
     * [KO] Android 운영체제 여부를 반환합니다.
     * [EN] Returns whether the operating system is Android.
     *
     * @returns
     * [KO] Android 여부
     * [EN] Whether it is Android
     */
    get isAndroid(): boolean {
        return this.#isAndroid;
    }

    /**
     * [KO] Chromium 기반 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Chromium-based.
     *
     * @returns
     * [KO] Chromium 기반 브라우저 여부
     * [EN] Whether it is a Chromium-based browser
     */
    get isChromium(): boolean {
        return this.#isChromium;
    }

    /**
     * [KO] Safari 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Safari.
     *
     * @returns
     * [KO] Safari 브라우저 여부
     * [EN] Whether it is Safari
     */
    get isSafari(): boolean {
        return this.#isSafari;
    }

    /**
     * [KO] Firefox 브라우저 여부를 반환합니다.
     * [EN] Returns whether the browser is Firefox.
     *
     * @returns
     * [KO] Firefox 브라우저 여부
     * [EN] Whether it is Firefox
     */
    get isFirefox(): boolean {
        return this.#isFirefox;
    }

    /**
     * [KO] 논리 프로세서 코어 개수를 반환합니다. (기본값: 4)
     * [EN] Returns the number of logical processor cores (default: 4).
     *
     * @returns
     * [KO] 논리 프로세서 코어 수
     * [EN] Number of logical processor cores
     */
    get hardwareConcurrency(): number {
        return this.#hardwareConcurrency;
    }

    /**
     * [KO] 대략적인 장치 메모리 용량(GB 단위)을 반환합니다. (기본값: 4)
     * [EN] Returns the approximate device memory capacity in GB (default: 4).
     *
     * @returns
     * [KO] 장치 메모리 용량 (GB)
     * [EN] Device memory capacity (GB)
     */
    get deviceMemory(): number {
        return this.#deviceMemory;
    }

    /**
     * [KO] RedGPUContextDetector 인스턴스를 파기하고 내부 GPU 및 환경 참조를 해제합니다.
     * [EN] Destroys the RedGPUContextDetector instance and releases internal GPU and environment references.
     */
    destroy(): void {
        this.#gpuAdapter = null as any;
        this.#adapterInfo = null as any;
        this.#supportedLimits = null as any;
        this.#activeLimits = null as any;

        this.#supportedFeatures = {};
        this.#activeFeatures = {};

        this.#userAgent = '';
    }

    /**
     * [KO] 감지된 플랫폼, 브라우저, 하드웨어 및 GPU 정보를 종합한 리포트 객체를 반환합니다.
     * [EN] Returns a comprehensive report object containing detected platform, browser, hardware, and GPU information.
     *
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

Object.freeze(RedGPUContextDetector);
export default RedGPUContextDetector;
