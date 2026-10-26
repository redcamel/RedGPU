import ColorRGBA from "../color/ColorRGBA";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import RedGPUContextDetector from "./core/RedGPUContextDetector";
import RedGPUContextSizeManager, { IRedGPURectObject, RedResizeEvent } from "./core/RedGPUContextSizeManager";
import RedGPUContextViewContainer from "./core/RedGPUContextViewContainer";
import CommandEncoderManager from "../commandEncoderManager/CommandEncoderManager";
import GlobalStorageBufferManager from "../resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager";
import DrawBufferManager from "../renderer/core/DrawBufferManager";
import Renderer from "../renderer/Renderer";
/**
 * [KO] WebGPU 초기화 후 생성되는 최상위 컨텍스트 클래스로, GPU 디바이스/어댑터, 캔버스, `View3D` 컨테이너, 리소스·커맨드·안티앨리어싱 매니저를 통합 관리합니다.
 * [EN] Top-level context class created after WebGPU initialization, managing the GPU device/adapter, canvas, `View3D` container, and resource, command, and anti-aliasing managers.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * RedGPU.init(canvas, (redGPUContext) => {
 *     redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
 * });
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/helloWorld/" style="width:100%; height:500px;"></iframe>
 * @see [Hello World example](/RedGPU/examples/3d/helloWorld/)
 * @category Context
 */
declare class RedGPUContext extends RedGPUContextViewContainer {
    #private;
    /**
     * [KO] 현재 실행 중인 `requestAnimationFrame` 루프 ID
     * [EN] Currently active `requestAnimationFrame` loop ID
     */
    currentRequestAnimationFrame: number;
    /**
     * [KO] 캔버스 크기 변경 시 호출되는 리사이즈 이벤트 콜백 (`RedResizeEvent<RedGPUContext>`)
     * [EN] Resize event callback invoked when the canvas size changes (`RedResizeEvent<RedGPUContext>`)
     */
    onResize: ((event: RedResizeEvent<RedGPUContext>) => void) | null;
    /**
     * [KO] 현재 프레임의 타임스탬프 (ms)
     * [EN] Timestamp of the current frame (ms)
     */
    currentTime: number;
    /**
     * [KO] 현재 컨텍스트를 렌더링 중인 대상 `Renderer` 인스턴스
     * [EN] Target `Renderer` instance currently rendering this context
     */
    targetRenderer: Renderer;
    /**
     * [KO] RedGPUContext 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContext instance.
     *
     * @param htmlCanvas -
     * [KO] 렌더링 대상 `HTMLCanvasElement`
     * [EN] Target `HTMLCanvasElement` for rendering
     * @param gpuAdapter -
     * [KO] 초기화된 WebGPU `GPUAdapter`
     * [EN] Initialized WebGPU `GPUAdapter`
     * @param gpuDevice -
     * [KO] 초기화된 WebGPU `GPUDevice`
     * [EN] Initialized WebGPU `GPUDevice`
     * @param gpuContext -
     * [KO] 캔버스 WebGPU 컨텍스트 (`GPUCanvasContext`)
     * [EN] Canvas WebGPU context (`GPUCanvasContext`)
     * @param alphaMode -
     * [KO] 캔버스 알파 합성 모드 (`GPUCanvasAlphaMode`)
     * [EN] Canvas alpha compositing mode (`GPUCanvasAlphaMode`)
     * @param onDestroy -
     * [KO] 디바이스 파괴 시 호출될 선택적 콜백 함수
     * [EN] Optional callback function invoked when the device is destroyed
     */
    constructor(htmlCanvas: HTMLCanvasElement, gpuAdapter: GPUAdapter, gpuDevice: GPUDevice, gpuContext: GPUCanvasContext, alphaMode: GPUCanvasAlphaMode, onDestroy?: (info: GPUDeviceLostInfo) => void);
    /**
     * [KO] 컨텍스트가 파기(`destroy`)되었는지 여부를 반환합니다.
     * [EN] Returns whether the context has been destroyed.
     *
     * @returns
     * [KO] 컨텍스트 파기 여부
     * [EN] Whether the context is destroyed
     */
    get destroyed(): boolean;
    /**
     * [KO] 드로우 버퍼 매니저(`DrawBufferManager`)를 반환합니다.
     * [EN] Returns the draw buffer manager (`DrawBufferManager`).
     *
     * @returns
     * [KO] `DrawBufferManager` 인스턴스
     * [EN] `DrawBufferManager` instance
     */
    get drawBufferManager(): DrawBufferManager;
    /**
     * [KO] 커맨드 인코더 매니저(`CommandEncoderManager`)를 반환합니다.
     * [EN] Returns the command encoder manager (`CommandEncoderManager`).
     *
     * @returns
     * [KO] `CommandEncoderManager` 인스턴스
     * [EN] `CommandEncoderManager` instance
     */
    get commandEncoderManager(): CommandEncoderManager;
    /**
     * [KO] HTML 캔버스의 `DOMRect` 영역 정보를 반환합니다.
     * [EN] Returns the `DOMRect` bounding area of the HTML canvas.
     *
     * @returns
     * [KO] 캔버스 `DOMRect` 객체
     * [EN] Canvas `DOMRect` object
     */
    get boundingClientRect(): DOMRect;
    /**
     * [KO] 안티앨리어싱 매니저(`AntialiasingManager`)를 반환합니다.
     * [EN] Returns the anti-aliasing manager (`AntialiasingManager`).
     *
     * @returns
     * [KO] `AntialiasingManager` 인스턴스
     * [EN] `AntialiasingManager` instance
     */
    get antialiasingManager(): AntialiasingManager;
    /**
     * [KO] 글로벌 버텍스 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.
     * [EN] Returns the global vertex storage buffer manager (`GlobalStorageBufferManager`).
     *
     * @returns
     * [KO] 글로벌 버텍스 `GlobalStorageBufferManager` 인스턴스
     * [EN] Global vertex `GlobalStorageBufferManager` instance
     */
    get globalVertexSSBO(): GlobalStorageBufferManager;
    /**
     * [KO] PBR 머티리얼용 글로벌 프래그먼트 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.
     * [EN] Returns the global fragment storage buffer manager (`GlobalStorageBufferManager`) for PBR materials.
     *
     * @returns
     * [KO] PBR용 글로벌 프래그먼트 `GlobalStorageBufferManager` 인스턴스
     * [EN] Global fragment `GlobalStorageBufferManager` instance for PBR
     */
    get globalFragmentSSBO_PBR(): GlobalStorageBufferManager;
    /**
     * [KO] 빌트인 머티리얼용 글로벌 프래그먼트 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.
     * [EN] Returns the global fragment storage buffer manager (`GlobalStorageBufferManager`) for built-in materials.
     *
     * @returns
     * [KO] 빌트인용 글로벌 프래그먼트 `GlobalStorageBufferManager` 인스턴스
     * [EN] Global fragment `GlobalStorageBufferManager` instance for built-in materials
     */
    get globalFragmentSSBO_BuiltIn(): GlobalStorageBufferManager;
    /**
     * [KO] 컨텍스트의 기본 배경색(`ColorRGBA`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the default background color (`ColorRGBA`) of the context.
     *
     * @returns
     * [KO] 배경색 `ColorRGBA` 인스턴스
     * [EN] Background `ColorRGBA` instance
     * @throws
     * [KO] 설정 시 `ColorRGBA` 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws an error when setting a value that is not a `ColorRGBA` instance
     */
    get backgroundColor(): ColorRGBA;
    set backgroundColor(value: ColorRGBA);
    /**
     * [KO] 하드웨어 및 브라우저 환경 감지 매니저(`RedGPUContextDetector`)를 반환합니다.
     * [EN] Returns the hardware and browser environment detector (`RedGPUContextDetector`).
     *
     * @returns
     * [KO] `RedGPUContextDetector` 인스턴스
     * [EN] `RedGPUContextDetector` instance
     */
    get detector(): RedGPUContextDetector;
    /**
     * [KO] WebGPU 캔버스 구성 정보(`GPUCanvasConfiguration`)를 반환합니다.
     * [EN] Returns the WebGPU canvas configuration (`GPUCanvasConfiguration`).
     *
     * @returns
     * [KO] `GPUCanvasConfiguration` 객체
     * [EN] `GPUCanvasConfiguration` object
     */
    get configurationDescription(): GPUCanvasConfiguration;
    /**
     * [KO] WebGPU 어댑터(`GPUAdapter`)를 반환합니다.
     * [EN] Returns the WebGPU adapter (`GPUAdapter`).
     *
     * @returns
     * [KO] `GPUAdapter` 인스턴스
     * [EN] `GPUAdapter` instance
     */
    get gpuAdapter(): GPUAdapter;
    /**
     * [KO] 캔버스의 알파 합성 모드(`GPUCanvasAlphaMode`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the alpha compositing mode (`GPUCanvasAlphaMode`) of the canvas.
     *
     * @returns
     * [KO] 현재 설정된 `GPUCanvasAlphaMode`
     * [EN] Currently configured `GPUCanvasAlphaMode`
     */
    get alphaMode(): GPUCanvasAlphaMode;
    set alphaMode(value: GPUCanvasAlphaMode);
    /**
     * [KO] WebGPU 캔버스 컨텍스트(`GPUCanvasContext`)를 반환합니다.
     * [EN] Returns the WebGPU canvas context (`GPUCanvasContext`).
     *
     * @returns
     * [KO] `GPUCanvasContext` 인스턴스
     * [EN] `GPUCanvasContext` instance
     */
    get gpuContext(): GPUCanvasContext;
    /**
     * [KO] WebGPU 논리 디바이스(`GPUDevice`)를 반환합니다.
     * [EN] Returns the WebGPU logical device (`GPUDevice`).
     *
     * @returns
     * [KO] `GPUDevice` 인스턴스
     * [EN] `GPUDevice` instance
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 렌더링 대상 `HTMLCanvasElement`를 반환합니다.
     * [EN] Returns the target `HTMLCanvasElement` for rendering.
     *
     * @returns
     * [KO] `HTMLCanvasElement` 인스턴스
     * [EN] `HTMLCanvasElement` instance
     */
    get htmlCanvas(): HTMLCanvasElement;
    /**
     * [KO] 키보드 키 입력 상태 버퍼를 반환하거나 설정합니다.
     * [EN] Gets or sets the keyboard key input state buffer.
     *
     * @returns
     * [KO] 키별 눌림 상태 맵 (`{ [key: string]: boolean }`)
     * [EN] Key press state map (`{ [key: string]: boolean }`)
     */
    get keyboardKeyBuffer(): {
        [p: string]: boolean;
    };
    set keyboardKeyBuffer(value: {
        [p: string]: boolean;
    });
    /**
     * [KO] GPU 리소스 매니저(`ResourceManager`)를 반환합니다.
     * [EN] Returns the GPU resource manager (`ResourceManager`).
     *
     * @returns
     * [KO] `ResourceManager` 인스턴스
     * [EN] `ResourceManager` instance
     */
    get resourceManager(): ResourceManager;
    /**
     * [KO] 캔버스 크기 및 해상도 관리 매니저(`RedGPUContextSizeManager`)를 반환합니다.
     * [EN] Returns the canvas size and resolution manager (`RedGPUContextSizeManager`).
     *
     * @returns
     * [KO] `RedGPUContextSizeManager` 인스턴스
     * [EN] `RedGPUContextSizeManager` instance
     */
    get sizeManager(): RedGPUContextSizeManager;
    /**
     * [KO] 캔버스의 가로 크기(숫자 또는 `px`/`%` 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the canvas width (number or `px`/`%` string).
     *
     * @returns
     * [KO] 설정된 가로 크기 값
     * [EN] Configured width value
     */
    get width(): number | string;
    set width(value: number | string);
    /**
     * [KO] 캔버스의 세로 크기(숫자 또는 `px`/`%` 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the canvas height (number or `px`/`%` string).
     *
     * @returns
     * [KO] 설정된 세로 크기 값
     * [EN] Configured height value
     */
    get height(): number | string;
    set height(value: number | string);
    /**
     * [KO] CSS 논리 픽셀 단위의 화면 영역 정보를 반환합니다.
     * [EN] Returns the screen area information in CSS logical pixels.
     *
     * @returns
     * [KO] CSS 픽셀 영역 객체 (`IRedGPURectObject`)
     * [EN] CSS pixel rect object (`IRedGPURectObject`)
     */
    get screenRectObject(): IRedGPURectObject;
    /**
     * [KO] 물리 픽셀 단위의 렌더링 영역 정보를 반환합니다.
     * [EN] Returns the rendering area information in physical pixels.
     *
     * @returns
     * [KO] 물리 픽셀 영역 객체 (`IRedGPURectObject`)
     * [EN] Physical pixel rect object (`IRedGPURectObject`)
     */
    get pixelRectObject(): IRedGPURectObject;
    /**
     * [KO] 렌더링 해상도 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the rendering resolution scale factor.
     *
     * @returns
     * [KO] 현재 렌더링 스케일 배율
     * [EN] Current rendering scale factor
     */
    get renderScale(): number;
    set renderScale(value: number);
    /**
     * [KO] RedGPUContext 인스턴스를 파기하고 등록된 모든 뷰, 매니저, 이벤트 리스너 및 WebGPU 디바이스 리소스를 해제합니다.
     * [EN] Destroys the RedGPUContext instance and releases all registered views, managers, event listeners, and WebGPU device resources.
     */
    destroy(): void;
    /**
     * [KO] 컨텍스트(캔버스)의 가로 및 세로 크기를 설정합니다.
     * [EN] Sets the width and height of the context (canvas).
     *
     * @param w -
     * [KO] 가로 크기 (기본값: 현재 설정된 `width`)
     * [EN] Width (default: currently configured `width`)
     * @param h -
     * [KO] 세로 크기 (기본값: 현재 설정된 `height`)
     * [EN] Height (default: currently configured `height`)
     */
    setSize(w?: string | number, h?: string | number): void;
}
export default RedGPUContext;
