import RedGPUContext from "../RedGPUContext";
import {keepLog} from "../../utils";

/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
 */
class RedGPUContextDetector {
    #gpuAdapter: GPUAdapter;
    #adapterInfo: GPUAdapterInfo;
    #limits: GPUSupportedLimits;
    #features: GPUSupportedFeatures;
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

    // GPU Feature Helpers
    #hasASTC: boolean = false;
    #hasBC: boolean = false;
    #hasETC2: boolean = false;
    #hasShaderF16: boolean = false;
    #hasTimestampQuery: boolean = false;

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

        const {gpuAdapter} = redGPUContext;
        this.#gpuAdapter = gpuAdapter;

        if (gpuAdapter) {
            const {limits, info, features} = gpuAdapter;
            this.#adapterInfo = info;
            this.#features = features;
            this.#isFallbackAdapter = info.isFallbackAdapter;
            this.#limits = limits;

            // GPU Feature Shortcuts
            this.#hasASTC = features.has('texture-compression-astc');
            this.#hasBC = features.has('texture-compression-bc');
            this.#hasETC2 = features.has('texture-compression-etc2');
            this.#hasShaderF16 = features.has('shader-f16');
            this.#hasTimestampQuery = features.has('timestamp-query');
        }

        keepLog(this);
    }

    // Getters
    get features(): GPUSupportedFeatures { return this.#features; }
    get gpuAdapter(): GPUAdapter { return this.#gpuAdapter; }
    get adapterInfo(): GPUAdapterInfo { return this.#adapterInfo; }
    get limits(): GPUSupportedLimits { return this.#limits; }
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

    // GPU Feature Helpers
    get hasASTC(): boolean { return this.#hasASTC; }
    get hasBC(): boolean { return this.#hasBC; }
    get hasETC2(): boolean { return this.#hasETC2; }
    get hasShaderF16(): boolean { return this.#hasShaderF16; }
    get hasTimestampQuery(): boolean { return this.#hasTimestampQuery; }

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
                features: {
                    hasASTC: this.#hasASTC,
                    hasBC: this.#hasBC,
                    hasETC2: this.#hasETC2,
                    hasShaderF16: this.#hasShaderF16,
                    hasTimestampQuery: this.#hasTimestampQuery
                }
            }
        };
    }
}

export default RedGPUContextDetector;
