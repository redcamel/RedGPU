import RedGPUContext from "./context/RedGPUContext";
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
 */
declare const init: (canvas: HTMLCanvasElement, onWebGPUInitialized: (redGPUContext: RedGPUContext) => void, onFailInitialized?: (message?: string) => void, onDestroy?: (info: GPUDeviceLostInfo) => void, alphaMode?: GPUCanvasAlphaMode, requestAdapterOptions?: GPURequestAdapterOptions) => Promise<void>;
export default init;
