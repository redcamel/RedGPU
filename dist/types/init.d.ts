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
declare const init: (canvas: HTMLCanvasElement, onWebGPUInitialized: Function, onFailInitialized?: Function, onDestroy?: Function, alphaMode?: GPUCanvasAlphaMode, requestAdapterOptions?: GPURequestAdapterOptions) => Promise<void>;
export default init;
