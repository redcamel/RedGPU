import RedGPUContext from "../RedGPUContext";

/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
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
    get supportedFeatures(): Record<string, boolean> {
        return this.#supportedFeatures;
    }

    get activeFeatures(): Record<string, boolean> {
        return this.#activeFeatures;
    }

    get supportedLimits(): GPUSupportedLimits {
        return this.#supportedLimits;
    }

    get activeLimits(): GPUSupportedLimits {
        return this.#activeLimits;
    }

    get gpuAdapter(): GPUAdapter {
        return this.#gpuAdapter;
    }

    get adapterInfo(): GPUAdapterInfo {
        return this.#adapterInfo;
    }

    get isFallbackAdapter(): boolean {
        return this.#isFallbackAdapter;
    }

    get userAgent(): string {
        return this.#userAgent;
    }

    get isMobile(): boolean {
        return this.#isMobile;
    }

    get isIOS(): boolean {
        return this.#isIOS;
    }

    get isAndroid(): boolean {
        return this.#isAndroid;
    }

    get isChromium(): boolean {
        return this.#isChromium;
    }

    get isSafari(): boolean {
        return this.#isSafari;
    }

    get isFirefox(): boolean {
        return this.#isFirefox;
    }

    get hardwareConcurrency(): number {
        return this.#hardwareConcurrency;
    }

    get deviceMemory(): number {
        return this.#deviceMemory;
    }

    /**
     * [KO] 모든 탐지된 정보를 리포트 객체로 반환합니다.
     * [EN] Returns all detected information as a report object.
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
