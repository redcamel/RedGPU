import ColorRGBA from "../color/ColorRGBA";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import RedGPUContextDetector from "./core/RedGPUContextDetector";
import RedGPUContextSizeManager from "./core/RedGPUContextSizeManager";
import RedGPUContextViewContainer from "./core/RedGPUContextViewContainer";
/**
 * [KO] RedGPUContext 클래스는 WebGPU 초기화 후 제공되는 최상위 컨텍스트 객체입니다.
 * [EN] The RedGPUContext class is the top-level context object provided after WebGPU initialization.
 *
 * [KO] GPU, 캔버스, 디바이스, 어댑터 등 WebGPU의 핵심 정보를 속성으로 가집니다.
 * [EN] It holds core WebGPU information such as GPU, canvas, device, and adapter as properties.
 * [KO] View3D 객체를 소유하며, 실제 최상위 컨테이너 역할을 합니다.
 * [EN] It owns View3D objects and acts as the actual top-level container.
 * [KO] 리사이즈, 배경색, 디버그 패널, 안티앨리어싱, 리소스 관리 등 다양한 기능을 제공합니다.
 * [EN] It provides various features such as resizing, background color, debug panel, anti-aliasing, and resource management.
 *
 * ::: warning
 * [KO] 이 클래스는 RedGPU.init()에 의해 내부적으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is created internally by RedGPU.init().<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * RedGPU.init(canvas, (redGPUContext) => {
 *     console.log('Context created:', redGPUContext);
 *     redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
 * });
 * ```
 *
 * @category Context
 */
declare class RedGPUContext extends RedGPUContextViewContainer {
    #private;
    /**
     * [KO] 현재 requestAnimationFrame ID (프레임 루프 관리용)
     * [EN] Current requestAnimationFrame ID (for frame loop management)
     */
    currentRequestAnimationFrame: number;
    /**
     * [KO] 리사이즈 이벤트 핸들러 (캔버스 크기 변경 시 호출)
     * [EN] Resize event handler (called when canvas size changes)
     */
    onResize: ((width: number, height: number) => void) | null;
    /**
     * [KO] 현재 시간(프레임 기준, ms)
     * [EN] Current time (frame based, ms)
     */
    currentTime: number;
    /**
     * [KO] RedGPUContext 생성자
     * [EN] RedGPUContext constructor
     * @param htmlCanvas -
     * [KO] 렌더링할 HTMLCanvasElement
     * [EN] HTMLCanvasElement to render
     * @param gpuAdapter -
     * [KO] WebGPU Adapter
     * [EN] WebGPU Adapter
     * @param gpuDevice -
     * [KO] WebGPU Device
     * [EN] WebGPU Device
     * @param gpuContext -
     * [KO] WebGPU Canvas Context
     * [EN] WebGPU Canvas Context
     * @param alphaMode -
     * [KO] 캔버스 알파 모드
     * [EN] Canvas alpha mode
     */
    constructor(htmlCanvas: HTMLCanvasElement, gpuAdapter: GPUAdapter, gpuDevice: GPUDevice, gpuContext: GPUCanvasContext, alphaMode: GPUCanvasAlphaMode);
    get boundingClientRect(): DOMRect;
    /**
     * [KO] 안티앨리어싱 매니저를 반환합니다.
     * [EN] Returns the antialiasing manager.
     */
    get antialiasingManager(): AntialiasingManager;
    /**
     * [KO] 디버그 패널 사용 여부를 반환합니다.
     * [EN] Returns whether the debug panel is used.
     */
    get useDebugPanel(): boolean;
    /**
     * [KO] 디버그 패널 사용 여부를 설정합니다.
     * [EN] Sets whether to use the debug panel.
     * @param value -
     * [KO] 사용 여부
     * [EN] Usage status
     */
    set useDebugPanel(value: boolean);
    /**
     * [KO] 배경색을 반환합니다.
     * [EN] Returns the background color.
     */
    get backgroundColor(): ColorRGBA;
    /**
     * [KO] 배경색을 설정합니다.
     * [EN] Sets the background color.
     * @param value -
     * [KO] 설정할 ColorRGBA 객체
     * [EN] ColorRGBA object to set
     * @throws
     * [KO] value가 ColorRGBA 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws error if value is not an instance of ColorRGBA
     */
    set backgroundColor(value: ColorRGBA);
    /**
     * [KO] RedGPUContextDetector 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContextDetector instance.
     */
    get detector(): RedGPUContextDetector;
    /**
     * [KO] GPU 캔버스 구성 정보를 반환합니다.
     * [EN] Returns the GPU canvas configuration information.
     */
    get configurationDescription(): GPUCanvasConfiguration;
    /**
     * [KO] GPU 어댑터를 반환합니다.
     * [EN] Returns the GPU adapter.
     */
    get gpuAdapter(): GPUAdapter;
    /**
     * [KO] 캔버스의 알파 모드를 반환합니다.
     * [EN] Returns the alpha mode of the canvas.
     */
    get alphaMode(): GPUCanvasAlphaMode;
    /**
     * [KO] 캔버스의 알파 모드를 설정합니다.
     * [EN] Sets the alpha mode of the canvas.
     * @param value -
     * [KO] 설정할 GPUCanvasAlphaMode 값
     * [EN] GPUCanvasAlphaMode value to set
     */
    set alphaMode(value: GPUCanvasAlphaMode);
    /**
     * [KO] GPU 캔버스 컨텍스트를 반환합니다.
     * [EN] Returns the GPU canvas context.
     */
    get gpuContext(): GPUCanvasContext;
    /**
     * [KO] GPU 디바이스를 반환합니다.
     * [EN] Returns the GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] HTML 캔버스 요소를 반환합니다.
     * [EN] Returns the HTML canvas element.
     */
    get htmlCanvas(): HTMLCanvasElement;
    /**
     * [KO] 키보드 입력 버퍼를 반환합니다.
     * [EN] Returns the keyboard input buffer.
     */
    get keyboardKeyBuffer(): {
        [p: string]: boolean;
    };
    /**
     * [KO] 키보드 입력 버퍼를 설정합니다.
     * [EN] Sets the keyboard input buffer.
     * @param value -
     * [KO] 키보드 상태 객체
     * [EN] Keyboard state object
     */
    set keyboardKeyBuffer(value: {
        [p: string]: boolean;
    });
    /**
     * [KO] 리소스 매니저를 반환합니다.
     * [EN] Returns the resource manager.
     */
    get resourceManager(): ResourceManager;
    /**
     * [KO] RedGPUContextSizeManager 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContextSizeManager instance.
     */
    get sizeManager(): RedGPUContextSizeManager;
    /**
     * [KO] 너비를 반환합니다.
     * [EN] Returns the width.
     */
    get width(): number | string;
    /**
     * [KO] 너비를 설정합니다.
     * [EN] Sets the width.
     * @param value -
     * [KO] 너비 값 (숫자 또는 문자열)
     * [EN] Width value (number or string)
     */
    set width(value: number | string);
    /**
     * [KO] 높이를 반환합니다.
     * [EN] Returns the height.
     */
    get height(): number | string;
    /**
     * [KO] 높이를 설정합니다.
     * [EN] Sets the height.
     * @param value -
     * [KO] 높이 값 (숫자 또는 문자열)
     * [EN] Height value (number or string)
     */
    set height(value: number | string);
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * [KO] 렌더 스케일을 반환합니다.
     * [EN] Returns the render scale.
     */
    get renderScale(): number;
    /**
     * [KO] 렌더 스케일을 설정합니다.
     * [EN] Sets the render scale.
     * @param value -
     * [KO] 렌더 스케일 값
     * [EN] Render scale value
     */
    set renderScale(value: number);
    /**
     * [KO] GPU 디바이스를 파기하고 리소스를 해제합니다.
     * [EN] Destroys the GPU device and releases resources.
     */
    destroy(): void;
    /**
     * [KO] 컨텍스트의 크기를 설정합니다.
     * [EN] Sets the size of the context.
     * @param w -
     * [KO] 너비 (기본값: 현재 width)
     * [EN] Width (default: current width)
     * @param h -
     * [KO] 높이 (기본값: 현재 height)
     * [EN] Height (default: current height)
     */
    setSize(w?: string | number, h?: string | number): void;
}
export default RedGPUContext;
