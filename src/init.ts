import RedGPUContext from "./context/RedGPUContext";
import ensureVertexIndexBuiltin from "./resources/wgslParser/core/ensureVertexIndexBuiltin";

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
    requestAdapterOptions: GPURequestAdapterOptions = {
        powerPreference: "high-performance",
        forceFallbackAdapter: false,
    },
) => {
    const debugLog = (msg: string) => {
        if (typeof window !== 'undefined') {
            const c = window['console'];
            if (c && typeof c['info'] === 'function') {
                c['info'](msg);
            }
        }
    };

    if (isSearchEngineBot()) {
        debugLog('🤖 Search engine bot detected - skipping WebGPU initialization');
        return;
    }
    const {gpu} = navigator
    if (!gpu) {
        const msg = 'WebGPU is not supported in this browser. Please use a modern browser with WebGPU enabled.';
        onFailInitialized?.(msg);
        return;
    }
    const errorHandler = (e: Error, defaultMsg: string) => {
        const msg = generateErrorMessage(e, defaultMsg);
        console.error('\n============\n', msg, '\n============\n');
        onFailInitialized?.(msg);
    };
    const validateAndRequestAdapter = async (targetGPU: GPU) => {
        if (!targetGPU) errorHandler(null, `Cannot find navigator.gpu`)
        try {
            const adapter: GPUAdapter = await targetGPU.requestAdapter(requestAdapterOptions)
            console.log('PASS adapter', adapter)
            await validateAndRequestDevice(adapter)
        } catch (e) {
            errorHandler(e, `Failed to request adapter or validate device with target GPU: ${targetGPU}, error message is ${e.message}`);
        }
    }
    const validateAndRequestDevice = async (adapter: GPUAdapter) => {
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
        const requiredLimits: Record<string, number> = {};
        const limitKeys = [
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
            'maxInterStageShaderComponents',
            'maxComputeWorkgroupStorageSize',
            'maxComputeInvocationsPerWorkgroup',
            'maxComputeWorkgroupSizeX',
            'maxComputeWorkgroupSizeY',
            'maxComputeWorkgroupSizeZ',
            'maxComputeWorkgroupsPerDimension'
        ];
        limitKeys.forEach(key => {
            if (adapter.limits[key]) requiredLimits[key] = adapter.limits[key];
        });

        const gpuDeviceDescriptor: GPUDeviceDescriptor = {
            requiredFeatures,
            requiredLimits
        };
        try {
            const device: GPUDevice = await adapter.requestDevice(gpuDeviceDescriptor)
            console.log('PASS device', device)
            validateAndInitializeContext(canvas, adapter, device)
        } catch (e) {
            errorHandler(null, `Failed to request device. Adapter was ${adapter}, error message is ${e.message}`)
        }
    }
    const validateAndInitializeContext = (canvas: HTMLCanvasElement, adapter: GPUAdapter, device: GPUDevice) => {
        const context = canvas.getContext('webgpu')
        if (!context) {
            errorHandler(new Error(`Failed to get context from canvas: ${canvas.id || canvas}`), 'Failed to get webgpu initialize from canvas');
            return;
        }
        try {
            {
                const originalCreateShaderModule = device.createShaderModule.bind(device);
                device.createShaderModule = function (descriptor) {
                    descriptor.code = ensureVertexIndexBuiltin(descriptor.code)
                    return originalCreateShaderModule(descriptor)
                };
            }

            const pageShowEventController = new AbortController();
            const pageHideEventController = new AbortController();
            const deviceEventController = new AbortController();

            let redGPUContext: RedGPUContext = new RedGPUContext(canvas, adapter, device, context, alphaMode)

            const uncapturedErrorHandler = (event: GPUUncapturedErrorEvent) => {
                console.warn('TODO A WebGPU error was not captured:', event);
                console.warn(event.error?.message);
                // onFailInitialized?.(errorMsg);
                window.cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
            };
            device.addEventListener('uncapturederror', uncapturedErrorHandler, {signal: deviceEventController.signal});
            device.lost.then((info: GPUDeviceLostInfo) => {
                console.warn(info)
                console.warn(`Device lost occurred: ${info.message}`)
                deviceEventController.abort();
                if (info.reason === 'destroyed') onDestroy?.(info)
            })

            const pageShowHandler = (event: PageTransitionEvent) => {
                debugLog(`pageshow 발동! persisted 여부: ${event.persisted}`);
                if (event.persisted) {
                    // bfcache에서 복원된 경우
                    debugLog('🔄 bfcache에서 복원됨 (뒤로가기 또는 앞으로가기) - 페이지 재로드');
                    redGPUContext.destroy();
                    redGPUContext = null
                    deviceEventController.abort();
                    pageShowEventController.abort(); // 새로고침 직전에 pageshow 리스너 해제
                    pageHideEventController.abort(); // 혹시 남아있을 수 있는 pagehide 리스너 해제
                    window.location.reload();
                }
            };
            const pageHideHandler = (event: PageTransitionEvent) => {
                debugLog(`pagehide 발동! persisted 여부: ${event.persisted}`);
                // 어차피 pageshow에서 리로드하므로, 이탈 시점에는 persisted 여부와 관계없이 무조건 자원 해제
                if (redGPUContext && redGPUContext.gpuDevice) {
                    redGPUContext.destroy();
                    redGPUContext = null;
                }
                deviceEventController.abort();    // 디바이스 리스너 즉시 해제
                pageHideEventController.abort();  // pagehide가 발동했으므로 자기 자신 즉시 해제
            };
            // bfcache에서 복원 시 페이지 재로드 (뒤로가기 + 앞으로가기)
            window?.addEventListener('pageshow', pageShowHandler, {signal: pageShowEventController.signal});
            // [KO] 페이지 이동 시 정리 (bfcache 저장 여부에 따라 조건부 정리)
            // [EN] Clean up on page navigation (conditional clean up based on bfcache storage)
            window?.addEventListener('pagehide', pageHideHandler, {signal: pageHideEventController.signal});

            onWebGPUInitialized(redGPUContext)
        } catch (e) {
            errorHandler(e, '')
            //TODO 이거 먼가 이상하다 확인해야함
        }
    }
    const initializeWebGPU = async () => {
        if (!(onWebGPUInitialized instanceof Function)) {
            errorHandler(null, `Expected onWebGPUInitialized, but received : ${onWebGPUInitialized}`);
            return
        }
        if (!(canvas instanceof HTMLCanvasElement)) {
            errorHandler(null, `Expected HTMLCanvasElement, but received : ${canvas}`);
            return;
        }
        await validateAndRequestAdapter(gpu);
    }
    try {
        await initializeWebGPU()
    } catch (e) {
        errorHandler(e, `Unexpected error occurred during WebGPU initialization: ${e.message}`);
    }
}
export default init
const generateErrorMessage = (e: any, defaultMsg: string): string => {
    let msg = defaultMsg;
    // Check if 'e' is an instance of Error
    if (e instanceof Error) {
        msg = e.message ?? defaultMsg;
        if (typeof e.stack === 'string') {
            msg += `\nStack Trace: ${e.stack}`;
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
    const botPatterns = [
        'googlebot',
        'bingbot',
        'slurp',
        'duckduckbot',
        'baiduspider',
        'yandexbot',
        'facebookexternalhit',
        'twitterbot',
        'rogerbot',
        'linkedinbot',
        'embedly',
        'quora link preview',
        'showyoubot',
        'outbrain',
        'pinterest/0.',
        'developers.google.com/+/web/snippet',
        'www.google.com/webmasters/tools/richsnippets',
        'slackbot',
        'vkshare',
        'w3c_validator',
        'redditbot',
        'applebot',
        'whatsapp',
        'flipboard',
        'tumblr',
        'bitlybot',
        'skypeuripreview',
        'nuzzel',
        'line',
        'discordbot',
        'telegrambot',
        'crawler',
        'spider',
        'bot'
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern));
};
