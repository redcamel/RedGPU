import ColorRGBA from "../color/ColorRGBA";
import View3D from "../display/view/View3D";
import PICKING_EVENT_TYPE from "../picking/PICKING_EVENT_TYPE";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import RedGPUContextDetector from "./core/RedGPUContextDetector";
import RedGPUContextSizeManager, {IRedGPURectObject, RedResizeEvent} from "./core/RedGPUContextSizeManager";
import RedGPUContextViewContainer from "./core/RedGPUContextViewContainer";
import CommandEncoderManager from "../commandEncoderManager/CommandEncoderManager";
import RedGPUContextObserver from "./core/RedGPUContextObserver";
import GlobalStorageBufferManager from "../resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager";

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
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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
class RedGPUContext extends RedGPUContextViewContainer {
    /**
     * [KO] 현재 requestAnimationFrame ID (프레임 루프 관리용)
     * [EN] Current requestAnimationFrame ID (for frame loop management)
     */
    currentRequestAnimationFrame: number
    /**
     * [KO] 리사이즈 이벤트 핸들러 (캔버스 크기 변경 시 호출)
     * [EN] Resize event handler (called when canvas size changes)
     * @param event - [KO] 리사이즈 이벤트 객체 [EN] Resize event object
     */
    onResize: ((event: RedResizeEvent<RedGPUContext>) => void) | null = null;
    /**
     * [KO] 현재 시간(프레임 기준, ms)
     * [EN] Current time (frame based, ms)
     */
    currentTime: number
    /**ㄹ
     * [KO] GPU 캔버스 구성 정보 (WebGPU 설정용)
     * [EN] GPU canvas configuration info (for WebGPU setup)
     */
    #configurationDescription: GPUCanvasConfiguration
    /**
     * [KO] GPU 어댑터 (WebGPU 하드웨어 정보)
     * [EN] GPU Adapter (WebGPU hardware info)
     */
    readonly #gpuAdapter: GPUAdapter
    /**
     * [KO] 알파 모드 (WebGPU 캔버스 알파 설정)
     * [EN] Alpha mode (WebGPU canvas alpha setting)
     */
    #alphaMode: GPUCanvasAlphaMode
    /**
     * [KO] GPU 캔버스 컨텍스트 (WebGPU 렌더링 대상)
     * [EN] GPU Canvas Context (WebGPU rendering target)
     */
    readonly #gpuContext: GPUCanvasContext
    /**
     * [KO] GPU 디바이스 (WebGPU 연산/리소스 관리)
     * [EN] GPU Device (WebGPU computation/resource management)
     */
    readonly #gpuDevice: GPUDevice
    /**
     * [KO] HTML 캔버스 요소 (렌더링 대상 DOM)
     * [EN] HTML Canvas element (Rendering target DOM)
     */
    readonly #htmlCanvas: HTMLCanvasElement
    /**
     * [KO] 크기 관리 매니저 (캔버스/뷰 크기 관리)
     * [EN] Size manager (Canvas/View size management)
     */
    readonly #sizeManager: RedGPUContextSizeManager
    /**
     * [KO] 디바이스/브라우저 환경 감지 매니저
     * [EN] Device/Browser environment detector manager
     */
    readonly #detector: RedGPUContextDetector
    /**
     * [KO] 리소스 매니저 (GPU 리소스 관리)
     * [EN] Resource manager (GPU resource management)
     */
    readonly #resourceManager: ResourceManager
    /**
     * [KO] 커맨드 인코더 매니저 (GPU 커맨드 인코더 관리)
     * [EN] Command encoder manager (GPU command encoder management)
     */
    readonly #commandEncoderManager: CommandEncoderManager
    /**
     * [KO] 안티앨리어싱 매니저
     * [EN] Antialiasing manager
     */
    readonly #antialiasingManager: AntialiasingManager
    /**
     * [KO] 배경색
     * [EN] Background color
     */
    #backgroundColor: ColorRGBA = new ColorRGBA(0, 0, 0, 1)
    /**
     * [KO] 키보드 입력 버퍼
     * [EN] Keyboard input buffer
     */
    #keyboardKeyBuffer: { [key: string]: boolean } = {}

    /**
     * [KO] 글로벌 SSAO 버텍스 버퍼 매니저
     * [EN] Global SSAO vertex buffer manager
     */
    #globalVertexSSBO: GlobalStorageBufferManager

    /**
     * [KO] 글로벌 SSAO 프래그먼트 버퍼 매니저
     * [EN] Global SSAO fragment buffer manager
     */
    #globalFragmentSSBO_PBR: GlobalStorageBufferManager
    #globalFragmentSSBO_BuiltIn: GlobalStorageBufferManager


    #boundingClientRect: DOMRect

    /**
     * [KO] 캔버스 환경 변화 감지 옵저버
     * [EN] Canvas environment change detector observer
     */
    #observer: RedGPUContextObserver

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
    constructor(
        htmlCanvas: HTMLCanvasElement,
        gpuAdapter: GPUAdapter,
        gpuDevice: GPUDevice,
        gpuContext: GPUCanvasContext,
        alphaMode: GPUCanvasAlphaMode
    ) {
        super()
        this.#gpuAdapter = gpuAdapter
        this.#gpuDevice = gpuDevice
        this.#gpuContext = gpuContext
        this.#alphaMode = alphaMode
        this.#htmlCanvas = htmlCanvas
        this.#sizeManager = new RedGPUContextSizeManager(this)
        this.#detector = new RedGPUContextDetector(this)
        this.#resourceManager = new ResourceManager(this)
        this.#commandEncoderManager = new CommandEncoderManager(this)
        this.#antialiasingManager = new AntialiasingManager()
        // keepLog(ResourceManager.GLOBAL_FRAGMENT_PBR_STRUCT)
        // keepLog('ResourceManager.GLOBAL_VERTEX_STRUCT.size',ResourceManager.GLOBAL_VERTEX_STRUCT.size)
        this.#globalVertexSSBO = new GlobalStorageBufferManager(this, ResourceManager.GLOBAL_VERTEX_STRUCT.size, 50000, "GLOBAL_VERTEX_BUFFER")
        this.#globalFragmentSSBO_PBR = new GlobalStorageBufferManager(this, ResourceManager.GLOBAL_FRAGMENT_STRUCT_PBR.size, 1024, "GLOBAL_FRAGMENT_BUFFER")
        this.#globalFragmentSSBO_BuiltIn = new GlobalStorageBufferManager(this, ResourceManager.GLOBAL_FRAGMENT_STRUCT_BUILT_IN.size, 1024, "GLOBAL_FRAGMENT_BUILT_IN_BUFFER")
        this.#initialize()
    }

    /**
     * [KO] 커맨드 인코더 매니저를 반환합니다.
     * [EN] Returns the command encoder manager.
     */
    get commandEncoderManager(): CommandEncoderManager {
        return this.#commandEncoderManager;
    }

    /**
     * [KO] HTML 캔버스의 BoundingClientRect 정보를 반환합니다.
     * [EN] Returns the BoundingClientRect info of the HTML canvas.
     */
    get boundingClientRect(): DOMRect {
        return this.#boundingClientRect
    }

    /**
     * [KO] 안티앨리어싱 매니저를 반환합니다.
     * [EN] Returns the antialiasing manager.
     */
    get antialiasingManager(): AntialiasingManager {
        return this.#antialiasingManager;
    }

    /**
     * [KO] 글로벌 SSAO 버텍스 버퍼 매니저를 반환합니다.
     * [EN] Returns the global SSAO vertex buffer manager.
     */
    get globalVertexSSBO(): GlobalStorageBufferManager {
        return this.#globalVertexSSBO;
    }

    /**
     * [KO] 글로벌 SSAO 프래그먼트 버퍼 매니저를 반환합니다.
     * [EN] Returns the global SSAO fragment buffer manager.
     */
    get globalFragmentSSBO_PBR(): GlobalStorageBufferManager {
        return this.#globalFragmentSSBO_PBR;
    }


    get globalFragmentSSBO_BuiltIn(): GlobalStorageBufferManager {
        return this.#globalFragmentSSBO_BuiltIn;
    }

    /**
     * [KO] 배경색을 반환합니다.
     * [EN] Returns the background color.
     */
    get backgroundColor(): ColorRGBA {
        return this.#backgroundColor;
    }

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
    set backgroundColor(value: ColorRGBA) {
        if (!(value instanceof ColorRGBA)) consoleAndThrowError('allow only ColorRGBA instance')
        this.#backgroundColor = value;
    }

    /**
     * [KO] RedGPUContextDetector 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContextDetector instance.
     */
    get detector(): RedGPUContextDetector {
        return this.#detector;
    }

    /**
     * [KO] GPU 캔버스 구성 정보를 반환합니다.
     * [EN] Returns the GPU canvas configuration information.
     */
    get configurationDescription(): GPUCanvasConfiguration {
        return this.#configurationDescription;
    }

    /**
     * [KO] GPU 어댑터를 반환합니다.
     * [EN] Returns the GPU adapter.
     */
    get gpuAdapter(): GPUAdapter {
        return this.#gpuAdapter;
    }

    /**
     * [KO] 캔버스의 알파 모드를 반환합니다.
     * [EN] Returns the alpha mode of the canvas.
     */
    get alphaMode(): GPUCanvasAlphaMode {
        return this.#alphaMode;
    }

    /**
     * [KO] 캔버스의 알파 모드를 설정합니다.
     * [EN] Sets the alpha mode of the canvas.
     * @param value -
     * [KO] 설정할 GPUCanvasAlphaMode 값
     * [EN] GPUCanvasAlphaMode value to set
     */
    set alphaMode(value: GPUCanvasAlphaMode) {
        this.#alphaMode = value;
        this.#configure()
    }

    /**
     * [KO] GPU 캔버스 컨텍스트를 반환합니다.
     * [EN] Returns the GPU canvas context.
     */
    get gpuContext(): GPUCanvasContext {
        return this.#gpuContext;
    }

    /**
     * [KO] GPU 디바이스를 반환합니다.
     * [EN] Returns the GPU device.
     */
    get gpuDevice(): GPUDevice {
        return this.#gpuDevice;
    }

    /**
     * [KO] HTML 캔버스 요소를 반환합니다.
     * [EN] Returns the HTML canvas element.
     */
    get htmlCanvas(): HTMLCanvasElement {
        return this.#htmlCanvas;
    }

    /**
     * [KO] 키보드 입력 상태 버퍼를 반환합니다.
     * [EN] Returns the keyboard input state buffer.
     */
    get keyboardKeyBuffer(): { [p: string]: boolean } {
        return this.#keyboardKeyBuffer;
    }

    /**
     * [KO] 키보드 입력 상태 버퍼를 설정합니다.
     * [EN] Sets the keyboard input state buffer.
     * @param value -
     * [KO] 키보드 상태 객체
     * [EN] Keyboard state object
     */
    set keyboardKeyBuffer(value: { [p: string]: boolean }) {
        this.#keyboardKeyBuffer = value;
    }

    /**
     * [KO] 리소스 매니저를 반환합니다.
     * [EN] Returns the resource manager.
     */
    get resourceManager(): ResourceManager {
        return this.#resourceManager;
    }

    /**
     * [KO] RedGPUContextSizeManager 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContextSizeManager instance.
     */
    get sizeManager(): RedGPUContextSizeManager {
        return this.#sizeManager;
    }

    /**
     * [KO] 너비를 반환합니다.
     * [EN] Returns the width.
     */
    get width(): number | string {
        return this.#sizeManager.width;
    }

    /**
     * [KO] 너비를 설정합니다.
     * [EN] Sets the width.
     * @param value -
     * [KO] 너비 값 (숫자 또는 문자열)
     * [EN] Width value (number or string)
     */
    set width(value: number | string) {
        this.#sizeManager.width = value;
    }

    /**
     * [KO] 높이를 반환합니다.
     * [EN] Returns the height.
     */
    get height(): number | string {
        return this.#sizeManager.height;
    }

    /**
     * [KO] 높이를 설정합니다.
     * [EN] Sets the height.
     * @param value -
     * [KO] 높이 값 (숫자 또는 문자열)
     * [EN] Height value (number or string)
     */
    set height(value: number | string) {
        this.#sizeManager.height = value;
    }

    /**
     * [KO] 화면 크기 정보(Screen)를 반환합니다. (CSS 픽셀 단위)
     * [EN] Returns the screen size information. (in CSS pixels)
     */
    get screenRectObject(): IRedGPURectObject {
        return this.#sizeManager.screenRectObject
    }

    /**
     * [KO] 픽셀 단위 화면 크기 정보(Pixel)를 반환합니다. (물리 픽셀 단위)
     * [EN] Returns the pixel size information. (in physical pixels)
     */
    get pixelRectObject(): IRedGPURectObject {
        return this.#sizeManager.pixelRectObject
    }

    /**
     * [KO] 렌더 스케일을 반환합니다.
     * [EN] Returns the render scale.
     */
    get renderScale(): number {
        return this.#sizeManager.renderScale;
    }

    /**
     * [KO] 렌더 스케일을 설정합니다.
     * [EN] Sets the render scale.
     * @param value -
     * [KO] 렌더 스케일 값
     * [EN] Render scale value
     */
    set renderScale(value: number) {
        this.#sizeManager.renderScale = value;
        this.viewList.forEach((view: View3D) => {
            view.setPosition()
            view.setSize()
        })
    }

    /**
     * [KO] GPU 디바이스를 파기하고 리소스를 해제합니다.
     * [EN] Destroys the GPU device and releases resources.
     */
    destroy() {
        this.#observer?.stop()
        this.#gpuDevice.destroy()
    }

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
    setSize(w: string | number = this.width, h: string | number = this.height) {
        this.sizeManager.setSize(w, h)
    }

    /**
     * [KO] BoundingClientRect 정보를 갱신합니다. (내부용)
     * [EN] Updates the BoundingClientRect information. (Internal use)
     */
    #updateBoundingClientRect() {
        this.#boundingClientRect = this.#htmlCanvas.getBoundingClientRect();
    }

    /**
     * [KO] 초기화 메서드 (내부용)
     * [EN] Initialization method (Internal use)
     */
    #initialize() {
        this.#configure()
        this.#updateBoundingClientRect();
        this.sizeManager.setSize('100%', '100%')
        this.#observer = new RedGPUContextObserver(this, () => this.#updateBoundingClientRect())
        const eventList = this.detector.isMobile ?
            [
                'click',
                'touchmove',
                'touchstart',
                'touchend'
            ]
            :
            [
                'click',
                'mousemove',
                'mousedown',
                'mouseup'
            ]
        eventList.forEach((eventName) => {
            const eventMap = (
                this.detector.isMobile
                    ?
                    {
                        click: PICKING_EVENT_TYPE.CLICK,
                        touchmove: PICKING_EVENT_TYPE.MOVE,
                        touchstart: PICKING_EVENT_TYPE.DOWN,
                        touchend: PICKING_EVENT_TYPE.UP,
                    } :
                    {
                        click: PICKING_EVENT_TYPE.CLICK,
                        mousemove: PICKING_EVENT_TYPE.MOVE,
                        mousedown: PICKING_EVENT_TYPE.DOWN,
                        mouseup: PICKING_EVENT_TYPE.UP,
                    }
            )
            this.#htmlCanvas.addEventListener(eventName, (e: MouseEvent) => {
                const eventTypeForDevice = eventMap[e.type]
                // console.log('eventTypeForDevice',e.type)
                this.viewList.forEach((view: View3D) => {
                    if (this.detector.isMobile && e instanceof TouchEvent && e.touches.length > 0) {
                        // Touch event
                        view.pickingManager.mouseX = e.touches[0].clientX - view.pixelRectObject.x;
                        view.pickingManager.mouseY = e.touches[0].clientY - view.pixelRectObject.y;
                    } else if (e instanceof MouseEvent) {
                        // Mouse event
                        view.pickingManager.mouseX = e.offsetX - view.pixelRectObject.x;
                        view.pickingManager.mouseY = e.offsetY - view.pixelRectObject.y;
                    }
                    if (eventTypeForDevice === PICKING_EVENT_TYPE.CLICK) {
                        view.pickingManager.lastMouseClickEvent = {...e, type: eventTypeForDevice}
                    } else {
                        view.pickingManager.lastMouseEvent = {...e, type: eventTypeForDevice}
                    }
                })
            })
        })
        {
            // 키보드 이벤트 설정
            const HD_keyDown = (e: KeyboardEvent) => {
                this.#keyboardKeyBuffer[e.key] = true
            };
            const HD_keyUp = (e: KeyboardEvent) => {
                this.#keyboardKeyBuffer[e.key] = false
            };
            window?.addEventListener('keyup', HD_keyUp);
            window?.addEventListener('keydown', HD_keyDown);
        }
    }

    /**
     * [KO] GPU 컨텍스트를 구성합니다. (내부용)
     * [EN] Configures the GPU context. (Internal use)
     */
    #configure() {
        const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        this.#configurationDescription = {
            device: this.#gpuDevice,
            format: presentationFormat,
            alphaMode: this.#alphaMode,
        };
        console.log(`configurationDescription`, this.#configurationDescription);
        this.#gpuContext.configure(this.#configurationDescription);
    }
}

Object.freeze(RedGPUContext)
export default RedGPUContext
