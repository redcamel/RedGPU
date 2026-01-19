import RedGPUContext from "../RedGPUContext";

/**
 * [KO] GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.
 * [EN] Class that detects and analyzes the GPU adapter and browser environment.
 *
 * [KO] Adapter 정보, 제한값(Limits), Fallback 여부, 모바일 환경 여부 등을 제공합니다.
 * [EN] Provides adapter information, limits, fallback status, mobile environment status, etc.
 * @category Context
 */
class RedGPUContextDetector {
    /* [KO] Adapter 관련 정보 (예: 이름, 벤더 등) */
    /* [EN] Adapter information (e.g., name, vendor) */
    #adapterInfo: GPUAdapterInfo;
    /* [KO] GPU가 지원하는 한계값 */
    /* [EN] Limits supported by the GPU */
    #limits: GPUSupportedLimits;
    /* [KO] Fallback Adapter 사용 여부 */
    /* [EN] Whether Fallback Adapter is used */
    #isFallbackAdapter: boolean;
    /* [KO] 그룹화된 제한값 데이터 */
    /* [EN] Grouped limit data */
    #groupedLimits: any;
    /* [KO] 브라우저 User-Agent 문자열 */
    /* [EN] Browser User-Agent string */
    #userAgent: string;

    /**
     * [KO] RedGPUContextDetector 생성자
     * [EN] RedGPUContextDetector constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#init(redGPUContext.gpuAdapter);
        console.log(this); // 디버그용
    }

    /**
     * [KO] 현재 사용중인 GPUAdapter의 정보를 반환합니다.
     * [EN] Returns information about the currently used GPUAdapter.
     */
    get adapterInfo(): GPUAdapterInfo {
        return this.#adapterInfo;
    }

    /**
     * [KO] 현재 사용 중인 GPU의 한계값을 반환합니다.
     * [EN] Returns the supported limits of the currently used GPU.
     */
    get limits(): GPUSupportedLimits {
        return this.#limits;
    }

    /**
     * [KO] 현재 어댑터가 Fallback 어댑터인지 여부를 반환합니다.
     * [EN] Returns whether the current adapter is a fallback adapter.
     */
    get isFallbackAdapter(): boolean {
        return this.#isFallbackAdapter;
    }

    /**
     * [KO] 그룹화된 한계값 정보를 반환합니다.
     * [EN] Returns grouped limit information.
     */
    get groupedLimits(): any {
        return this.#groupedLimits;
    }

    /**
     * [KO] 브라우저의 User-Agent 문자열을 반환합니다.
     * [EN] Returns the browser's User-Agent string.
     */
    get userAgent(): string {
        return this.#userAgent;
    }

    /**
     * [KO] 모바일 디바이스인지 여부를 반환합니다.
     * [EN] Returns whether it is a mobile device.
     */
    get isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(navigator.userAgent);
    }

    /* -------------------------------------------------------------------------- */

    /* 내부 유틸리티 메서드 */
    /**
     * [KO] 초기화 메서드 (내부용)
     * [EN] Initialization method (Internal use)
     */
    #init(gpuAdapter: GPUAdapter) {
        this.#userAgent = navigator.userAgent;
        this.#parseAdapter(gpuAdapter);
        this.#parseLimits();
    }

    /**
     * [KO] 어댑터 정보를 파싱합니다. (내부용)
     * [EN] Parses adapter information. (Internal use)
     */
    #parseAdapter(gpuAdapter: GPUAdapter) {
        if (gpuAdapter) {
            const {limits, info} = gpuAdapter;
            const {isFallbackAdapter} = info;
            this.#adapterInfo = info;
            this.#isFallbackAdapter = isFallbackAdapter;
            this.#limits = limits;
        }
    }

    /**
     * [KO] 제한값 정보를 그룹화하여 파싱합니다. (내부용)
     * [EN] Parses limit information by grouping. (Internal use)
     */
    #parseLimits() {
        const groupSettings = {
            "TextureLimits": [
                'maxTextureDimension1D',
                'maxTextureDimension2D',
                'maxTextureDimension3D',
                'maxTextureArrayLayers',
                'maxSampledTexturesPerShaderStage',
                'maxSamplersPerShaderStage'
            ],
            "BufferLimits": [
                'maxBindGroups',
                'maxBindGroupsPlusVertexBuffers',
                'maxBindingsPerBindGroup',
                'maxDynamicUniformBuffersPerPipelineLayout',
                'maxDynamicStorageBuffersPerPipelineLayout',
                'maxStorageBuffersPerShaderStage',
                'maxStorageTexturesPerShaderStage',
                'maxUniformBuffersPerShaderStage',
                'maxUniformBufferBindingSize',
                'maxStorageBufferBindingSize',
                'minUniformBufferOffsetAlignment',
                'minStorageBufferOffsetAlignment',
                'maxBufferSize'
            ],
            "PipelineAndShaderLimits": [
                'maxVertexBuffers',
                'maxVertexAttributes',
                'maxVertexBufferArrayStride',
                'maxInterStageShaderComponents',
                'maxInterStageShaderVariables'
            ],
            "ComputeLimits": [
                'maxComputeWorkgroupStorageSize',
                'maxComputeInvocationsPerWorkgroup',
                'maxComputeWorkgroupSizeX',
                'maxComputeWorkgroupSizeY',
                'maxComputeWorkgroupSizeZ',
                'maxComputeWorkgroupsPerDimension'
            ],
            "ColorLimits": [
                'maxColorAttachments',
                'maxColorAttachmentBytesPerSample'
            ]
        };
        const groupedLimits = {
            "TextureLimits": {},
            "BufferLimits": {},
            "PipelineAndShaderLimits": {},
            "ComputeLimits": {},
            "ColorLimits": {},
            "EtcLimit": {}
        };
        for (const limit in this.#limits) {
            let found = false;
            for (const group in groupSettings) {
                if (groupSettings[group].includes(limit)) {
                    groupedLimits[group][limit] = this.#limits[limit];
                    found = true;
                    break;
                }
            }
            if (!found) {
                groupedLimits["EtcLimit"][limit] = this.#limits[limit];
            }
        }
        this.#groupedLimits = groupedLimits;
    }
}

export default RedGPUContextDetector;
