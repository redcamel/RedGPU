import RedGPUContext from "./context/RedGPUContext";
import {keepLog} from "./utils";

const DEFAULT_REQUEST_ADAPTER_OPTIONS: GPURequestAdapterOptions = {
    powerPreference: "high-performance",
    forceFallbackAdapter: false,
};

const BOT_PATTERN = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|developers\.google.com\/\+\/web\/snippet|www\.google\.com\/webmasters\/tools\/richsnippets|slackbot|vkshare|w3c_validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|line|discordbot|telegrambot|crawler|spider|bot/;


/**
 * [KO] WebGPU를 비동기적으로 초기화하고 RedGPUContext를 생성합니다.
 * [EN] Asynchronously initializes WebGPU and creates a RedGPUContext.
 *
 * [KO] 브라우저의 WebGPU 지원 여부를 확인하고, GPU 어댑터와 디바이스를 요청한 후 최종적으로 RedGPUContext 인스턴스를 생성하여 콜백을 통해 전달합니다.
 * [EN] Checks for WebGPU support in the browser, requests a GPU adapter and device, and finally creates a RedGPUContext instance, passing it through a callback.
 *
 * * ### Example
 * ```typescript
 * await RedGPU.init(
 *   canvas,
 *   (redGPUContext) => {
 *     console.log('WebGPU 초기화 성공!', redGPUContext);
 *     // 렌더링 루프 시작 (Start rendering loop)
 *   },
 *   (errorMessage) => {
 *     console.error('초기화 실패:', errorMessage);
 *   }
 * );
 * ```
 *
 * @param canvas -
 * [KO] WebGPU를 초기화할 HTML 캔버스 요소
 * [EN] HTML canvas element to initialize WebGPU
 * @param onWebGPUInitialized -
 * [KO] 성공 시 호출될 콜백 함수 (RedGPUContext 인스턴스가 인자로 전달됨)
 * [EN] Callback function to be called on success (RedGPUContext instance is passed as an argument)
 * @param onFailInitialized -
 * [KO] 실패 시 호출될 선택적 콜백 함수 (에러 메시지가 인자로 전달됨)
 * [EN] Optional callback function to be called on failure (error message is passed as an argument)
 * @param onDestroy -
 * [KO] 디바이스 유실 시 호출될 선택적 콜백 함수
 * [EN] Optional callback function to be called when the device is lost
 * @param alphaMode -
 * [KO] 캔버스 알파 모드 (기본값: 'premultiplied')
 * [EN] Canvas alpha mode (Default: 'premultiplied')
 * @param requestAdapterOptions -
 * [KO] 어댑터 요청 옵션 (기본값: 고성능 설정)
 * [EN] Adapter request options (Default: high-performance setup)
 * @returns
 * [KO] 초기화 프로세스 완료를 나타내는 Promise
 * [EN] Promise representing the completion of the initialization process
 * @category Core
 * */
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
        // 1. Request Adapter
        const adapter = await gpu.requestAdapter(requestAdapterOptions);
        if (!adapter) {
            throw new Error("Failed to request WebGPU adapter. Check options or browser support.");
        }
        keepLog('PASS adapter', adapter);

        // 2. Request Device
        const gpuDeviceDescriptor: GPUDeviceDescriptor = {
            requiredFeatures: getRequiredFeature(adapter),
            requiredLimits: getRequiredLimits(adapter)
        };
        const device = await adapter.requestDevice(gpuDeviceDescriptor);
        if (!device) {
            throw new Error("Failed to request WebGPU device.");
        }
        keepLog('PASS device', device);

        // 3. Initialize Context
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
        // "texture-compression-astc",
        // "texture-compression-bc",
        // "texture-compression-etc2",
        // "shader-f16",
        // "timestamp-query",
        // "depth-clip-control",
        "indirect-first-instance",
        // "rg11b10ufloat-renderable",
        // "bgra8unorm-storage",
        // "float32-filterable"
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
        'maxComputeWorkgroupsPerDimension'
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
    // Check if 'e' is an instance of Error
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
        return true; // SSR 환경에서는 봇으로 간주
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return BOT_PATTERN.test(userAgent);
};
