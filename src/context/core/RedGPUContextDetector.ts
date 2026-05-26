import RedGPUContext from "../RedGPUContext";
import {keepLog} from "../../utils";

/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
 */
class RedGPUContextDetector {
    #gpuAdapter: GPUAdapter;
    #adapterInfo: GPUAdapterInfo;
    #supportedLimits: GPUSupportedLimits;
    #activeLimits: GPUSupportedLimits;
    #supportedFeatures: GPUSupportedFeatures;
    #activeFeatures: GPUSupportedFeatures;
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

        // Platform Detection
        this.#isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(ua);
        this.#isIOS = /iPhone|iPad|iPod/i.test(ua);
        this.#isAndroid = /Android/i.test(ua);

        // Browser Engine Detection
        this.#isChromium = /Chrome|Chromium|Edg|Opr/i.test(ua) && !/Edge/i.test(ua);
        this.#isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|Opr/i.test(ua);
        this.#isFirefox = /Firefox/i.test(ua);

        // Hardware Context
        this.#hardwareConcurrency = navigator.hardwareConcurrency || 4;
        this.#deviceMemory = (navigator as any).deviceMemory || 4;

        const {gpuAdapter, gpuDevice} = redGPUContext;
        this.#gpuAdapter = gpuAdapter;

        if (gpuAdapter) {
            const {limits, info, features} = gpuAdapter;
            this.#adapterInfo = info;
            this.#supportedFeatures = features;
            this.#isFallbackAdapter = info.isFallbackAdapter;
            this.#supportedLimits = limits;
        }

        if (gpuDevice) {
            this.#activeFeatures = gpuDevice.features;
            this.#activeLimits = gpuDevice.limits;
        }

        keepLog(this);
    }

    // Getters
    get supportedFeatures(): GPUSupportedFeatures { return this.#supportedFeatures; }
    get activeFeatures(): GPUSupportedFeatures { return this.#activeFeatures; }
    get supportedLimits(): GPUSupportedLimits { return this.#supportedLimits; }
    get activeLimits(): GPUSupportedLimits { return this.#activeLimits; }
    get gpuAdapter(): GPUAdapter { return this.#gpuAdapter; }
    get adapterInfo(): GPUAdapterInfo { return this.#adapterInfo; }
    get isFallbackAdapter(): boolean { return this.#isFallbackAdapter; }
    get userAgent(): string { return this.#userAgent; }

    // Platform Getters
    get isMobile(): boolean { return this.#isMobile; }
    get isIOS(): boolean { return this.#isIOS; }
    get isAndroid(): boolean { return this.#isAndroid; }
    get isChromium(): boolean { return this.#isChromium; }
    get isSafari(): boolean { return this.#isSafari; }
    get isFirefox(): boolean { return this.#isFirefox; }

    // Hardware Getters
    get hardwareConcurrency(): number { return this.#hardwareConcurrency; }
    get deviceMemory(): number { return this.#deviceMemory; }

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
                supportedFeatures: Array.from(this.#supportedFeatures || []),
                activeFeatures: Array.from(this.#activeFeatures || []),
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
