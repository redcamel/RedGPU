import RedGPUContext from "./context/RedGPUContext";
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
declare const init: (canvas: HTMLCanvasElement, onWebGPUInitialized: (redGPUContext: RedGPUContext) => void, onFailInitialized?: (message?: string) => void, onDestroy?: (info: GPUDeviceLostInfo) => void, alphaMode?: GPUCanvasAlphaMode, requestAdapterOptions?: GPURequestAdapterOptions) => Promise<void>;
export default init;
