import RedGPUContext from "./context/RedGPUContext";
import ensureVertexIndexBuiltin from "./resources/wgslParser/core/ensureVertexIndexBuiltin";
import {keepLog} from "./utils";

/**
 * WebGPU를 비동기적으로 초기화합니다. 초기화에 실패한 경우 선택적으로 제공된 콜백 함수를 호출합니다.
 * <br/>Asynchronously initializes WebGPU. If initialization fails, it invokes an optionally provided callback function.
 *
 * @param {HTMLCanvasElement} canvas - WebGPU 초기화를 위한 HTML 캔버스 요소입니다.
 * <br/>The HTMLCanvasElement for WebGPU initialization.
 *
 * @param {Function} onWebGPUInitialized - WebGPU가 성공적으로 초기화된 후 호출되는 함수입니다.
 * <br/>The function to be called after WebGPU has been successfully initialized.
 *
 * @param {function=} onFailInitialized - WebGPU 초기화가 실패한 후에 호출되는 선택적인 함수입니다.
 * <br/>An optional function that is called if WebGPU initialization fails.
 *
 * @param {function=} onDestroy - 장치가 손실된 경우에 호출되는 선택적인 함수입니다.
 * <br/>An optional function that is called when the device is lost.
 *
 * @param {GPUCanvasAlphaMode} alphaMode - 캔버스의 알파 모드로서 기본 값은 premultiplied 입니다.
 * <br/>The alpha mode of the canvas, the default value is 'premultiplied'.
 *
 * @param {GPURequestAdapterOptions} requestAdapterOptions - 어댑터 요청에 대한 옵션으로써 기본 값은 { powerPreference: "high-performance", forceFallbackAdapter: false }입니다.
 * <br/>The options for adapter request, defaults to { powerPreference: "high-performance", forceFallbackAdapter: false }.
 *
 */
const init = async (
    canvas: HTMLCanvasElement,
    onWebGPUInitialized: Function,
    onFailInitialized?: Function,
    onDestroy?: Function,
    alphaMode: GPUCanvasAlphaMode = 'premultiplied',
    requestAdapterOptions: GPURequestAdapterOptions = {
        powerPreference: "high-performance",
        forceFallbackAdapter: false,
    },
) => {
    if (isSearchEngineBot()) {
        keepLog('🤖 Search engine bot detected - skipping WebGPU initialization');
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
        const requiredFeatures = []
        if (adapter?.features.has("texture-compression-astc")) {
            //TODO - 확장확인
            requiredFeatures.push("texture-compression-astc");
        }
        const gpuDeviceDescriptor: GPUDeviceDescriptor = {
            requiredFeatures
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
            return
        }
        try {
            {
                const originalCreateShaderModule = device.createShaderModule.bind(device);
                device.createShaderModule = function (descriptor) {
                    descriptor.code = ensureVertexIndexBuiltin(descriptor.code)
                    const result = originalCreateShaderModule(descriptor);
                    return result
                };
            }
            const redGPUContext: RedGPUContext = new RedGPUContext(canvas, adapter, device, context, alphaMode)
            onWebGPUInitialized(redGPUContext)
            device.addEventListener('uncapturederror', (event: GPUUncapturedErrorEvent) => {
                console.warn('TODO A WebGPU error was not captured:', event);
                console.warn(event.error?.message);
                // onFailInitialized?.(errorMsg);
                window.cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
            });
            device.lost.then((info: GPUDeviceLostInfo) => {
                console.warn(info)
                console.warn(`Device lost occurred: ${info.message}`)
                if (info.reason === 'destroyed') onDestroy?.(info)
            })
            const clearDevice = () => {
                if (redGPUContext.gpuContext) {
                    try {
                        redGPUContext.gpuContext.unconfigure();
                        keepLog('🧹 Canvas Context unconfigure 완료');
                    } catch (e) {
                        keepLog('⚠️ Canvas Context unconfigure 실패:', e);
                    }
                }
                window?.cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
                redGPUContext.gpuDevice.destroy();
            }
            // 페이지 종료 시 GPU 디바이스 정리
            window?.addEventListener('beforeunload', () => {
                if (redGPUContext && redGPUContext.gpuDevice) {
                    keepLog('🧹 페이지 종료 시 GPU 디바이스 정리');
                    clearDevice()
                }
            });
            // bfcache에서 복원 시 페이지 재로드 (뒤로가기 + 앞으로가기)
            window?.addEventListener('pageshow', (event) => {
                if (event.persisted) {
                    // bfcache에서 복원된 경우
                    keepLog('🔄 bfcache에서 복원됨 (뒤로가기 또는 앞으로가기) - 페이지 재로드');
                    window.location.reload();
                }
            });
            // bfcache에 저장되기 전 정리
            window?.addEventListener('pagehide', (event) => {
                if (event.persisted) {
                    // bfcache에 저장되는 경우
                    keepLog('💾 bfcache에 저장됨');
                    if (redGPUContext && redGPUContext.gpuDevice) {
                        clearDevice()
                    }
                }
            });
        } catch (e) {
            onFailInitialized(errorHandler(e, ''))
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
