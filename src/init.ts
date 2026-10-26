import RedGPUContext from "./context/RedGPUContext";
import keepLog from "./utils/keepLog";

const DEFAULT_REQUEST_ADAPTER_OPTIONS: GPURequestAdapterOptions = {
    powerPreference: "high-performance",
    forceFallbackAdapter: false,
};

const BOT_PATTERN = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|developers\.google.com\/\+\/web\/snippet|www\.google\.com\/webmasters\/tools\/richsnippets|slackbot|vkshare|w3c_validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|line|discordbot|telegrambot|crawler|spider|bot/;


/**
 * [KO] WebGPU 어댑터와 디바이스를 비동기로 초기화하고 `RedGPUContext` 인스턴스를 생성합니다.
 * [EN] Asynchronously initializes the WebGPU adapter and device, and creates a `RedGPUContext` instance.
 *
 * ### Example
 * ```typescript
 * await RedGPU.init(
 *   canvas,
 *   (redGPUContext) => {
 *     // [KO] 초기화 성공 후 렌더링 시작
 *     // [EN] Start rendering after successful initialization
 *     console.log(redGPUContext);
 *   },
 *   (errorMessage) => {
 *     // [KO] 초기화 실패 처리
 *     // [EN] Handle initialization failure
 *     console.error(errorMessage);
 *   }
 * );
 * ```
 *
 * @param canvas -
 * [KO] WebGPU 컨텍스트를 바인딩할 `HTMLCanvasElement`
 * [EN] `HTMLCanvasElement` to bind the WebGPU context
 * @param onWebGPUInitialized -
 * [KO] 초기화 성공 시 생성된 `RedGPUContext`를 전달받는 콜백 함수
 * [EN] Callback function receiving the created `RedGPUContext` upon successful initialization
 * @param onFailInitialized -
 * [KO] 초기화 실패 시 에러 메시지를 전달받는 선택적 콜백 함수
 * [EN] Optional callback function receiving an error message upon initialization failure
 * @param onDestroy -
 * [KO] GPU 디바이스 손실(`GPUDeviceLostInfo`) 발생 시 호출되는 선택적 콜백 함수
 * [EN] Optional callback function invoked when the GPU device is lost (`GPUDeviceLostInfo`)
 * @param alphaMode -
 * [KO] 캔버스 알파 합성 모드 (기본값: `'premultiplied'`)
 * [EN] Canvas alpha compositing mode (default: `'premultiplied'`)
 * @param requestAdapterOptions -
 * [KO] WebGPU 어댑터 요청 옵션 (기본값: `DEFAULT_REQUEST_ADAPTER_OPTIONS`)
 * [EN] WebGPU adapter request options (default: `DEFAULT_REQUEST_ADAPTER_OPTIONS`)
 * @returns
 * [KO] 초기화 완료를 나타내는 `Promise<void>`
 * [EN] `Promise<void>` representing the completion of initialization
 * @category Core
 */
const init = async (
    canvas: HTMLCanvasElement,
    onWebGPUInitialized: (redGPUContext: RedGPUContext) => void,
    onFailInitialized?: (message?: string) => void,
    onDestroy?: (info: GPUDeviceLostInfo) => void,
    alphaMode: GPUCanvasAlphaMode = 'premultiplied',
    requestAdapterOptions: GPURequestAdapterOptions = DEFAULT_REQUEST_ADAPTER_OPTIONS,
) => {
    if (isSearchEngineBot()) {
        keepLog('🤖 Search engine bot detected - skipping WebGPU initialization');
        return;
    }
    const gpu = typeof navigator !== 'undefined' ? navigator.gpu : undefined;
    if (!gpu) {
        const msg = 'WebGPU is not supported in this browser. Please use a modern browser with WebGPU enabled.';
        onFailInitialized?.(msg);
        return;
    }

    const errorHandler = (e: unknown, defaultMsg: string) => {
        const errorInstance = e instanceof Error ? e : new Error(defaultMsg);
        const msg = generateErrorMessage(errorInstance, defaultMsg);
        console.error('\n============\n', msg, '\n============\n');
        onFailInitialized?.(msg);
    };

    if (!(onWebGPUInitialized instanceof Function)) {
        errorHandler(null, `Expected onWebGPUInitialized to be a function, but received: ${onWebGPUInitialized}`);
        return;
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
        errorHandler(null, `Expected canvas to be an HTMLCanvasElement, but received: ${canvas}`);
        return;
    }

    try {
        const adapter = await gpu.requestAdapter(requestAdapterOptions);
        if (!adapter) {
            throw new Error("Failed to request WebGPU adapter. Check options or browser support.");
        }
        keepLog('PASS adapter', adapter);

        const gpuDeviceDescriptor: GPUDeviceDescriptor = {
            requiredFeatures: getRequiredFeature(adapter),
            requiredLimits: getRequiredLimits(adapter)
        };
        const device = await adapter.requestDevice(gpuDeviceDescriptor);
        if (!device) {
            throw new Error("Failed to request WebGPU device.");
        }
        keepLog('PASS device', device);

        const context = canvas.getContext('webgpu');
        if (!context) {
            throw new Error(`Failed to get WebGPU context from canvas: ${canvas.id || 'anonymous canvas'}`);
        }

        const redGPUContext: RedGPUContext = new RedGPUContext(canvas, adapter, device, context, alphaMode, onDestroy);
        onWebGPUInitialized(redGPUContext);

    } catch (e) {
        errorHandler(e, `Unexpected error occurred during WebGPU initialization: ${e instanceof Error ? e.message : String(e)}`);
    }
};
export default init
const getRequiredFeature = (adapter: GPUAdapter): GPUFeatureName[] => {
    const requiredFeatures: GPUFeatureName[] = [];
    const featuresToRequest: GPUFeatureName[] = [
        "texture-compression-astc",
        "texture-compression-bc",
        "texture-compression-etc2",
        "texture-formats-tier1",
        "indirect-first-instance",
        "float32-filterable"
    ];

    featuresToRequest.forEach(feature => {
        if (adapter?.features.has(feature)) {
            requiredFeatures.push(feature);
        }
    });
    return requiredFeatures
}
const getRequiredLimits = (adapter: GPUAdapter): Record<string, number> => {
    const requiredLimits: Record<string, number> = {};
    const limitKeys: (keyof GPUSupportedLimits)[] = [
        'maxBufferSize',
        'maxStorageBufferBindingSize',
        'maxSampledTexturesPerShaderStage',
        'maxSamplersPerShaderStage',
        'maxStorageBuffersPerShaderStage',
        'maxStorageTexturesPerShaderStage',
        'maxUniformBuffersPerShaderStage',
        'maxUniformBufferBindingSize',
        'maxBindGroups',
        'maxVertexAttributes',
        'maxVertexBuffers',
        'maxInterStageShaderVariables',
        'maxComputeWorkgroupStorageSize',
        'maxComputeInvocationsPerWorkgroup',
        'maxComputeWorkgroupSizeX',
        'maxComputeWorkgroupSizeY',
        'maxComputeWorkgroupSizeZ',
        'maxComputeWorkgroupsPerDimension',
        'maxTextureArrayLayers'
    ];
    limitKeys.forEach(key => {
        if (key !== '__brand') {
            if (adapter.limits[key]) requiredLimits[key] = adapter.limits[key];
        }
    });
    return requiredLimits;
}

const generateErrorMessage = (e: any, defaultMsg: string): string => {
    let msg = defaultMsg;
    if (e instanceof Error) {
        msg = e.message ?? defaultMsg;
        if (typeof e.stack === 'string') {
            msg += `\n\nStack Trace: ${e.stack}`;
        }
    } else {
        console.warn('generateErrorMessage function expected an Error instance, but got: ', e);
    }
    return msg;
}
const isSearchEngineBot = (): boolean => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
        return true;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return BOT_PATTERN.test(userAgent);
};
