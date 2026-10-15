import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import OrthographicCamera from "../camera/OrthographicCamera";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 컨트롤러 초기화 시 전달하는 입력 핸들러 및 옵션 타입입니다.
 * [EN] Input handler and option configuration type passed during controller initialization.
 *
 * @category Core
 */
export type controllerInit = {
    HD_Move?: (deltaX: number, deltaY: number) => void
    HD_Wheel?: (e: WheelEvent) => void
    HD_TouchPinch?: (deltaScale: number) => void
    useKeyboard?: boolean,
    camera?: PerspectiveCamera | OrthographicCamera
}

/**
 * [KO] 마우스, 터치, 키보드 입력을 처리하여 카메라(`PerspectiveCamera` 또는 `OrthographicCamera`)를 제어하는 추상 컨트롤러 클래스입니다.
 * [EN] Abstract controller class that processes mouse, touch, and keyboard inputs to control a camera (`PerspectiveCamera` or `OrthographicCamera`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class AController extends RedGPUObject {
    static #globalKeyboardActiveView: View3D | null = null;
    static #globalKeyboardActiveController: AController | null = null;

    #camera: PerspectiveCamera | OrthographicCamera;
    #initInfo: controllerInit;

    #lastUpdateTime = -1;
    #currentDeltaTime = 0;
    #currentFrameViews = new Set<View3D>();
    #keyboardProcessedThisFrame: boolean = false;

    #hoveredView: View3D | null = null;
    #isDragging: boolean = false;

    #eventTypeKeys: { moveKey: string; upKey: string; downKey: string };
    #dragStartX: number = 0;
    #dragStartY: number = 0;
    #pinchStartDistance: number = 0;
    #isMultiTouch: boolean = false;

    /**
     * [KO] `AController` 인스턴스를 초기화하고 캔버스 입력 이벤트 리스너를 등록합니다.
     * [EN] Initializes the `AController` instance and registers canvas input event listeners.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param initInfo -
     * [KO] 컨트롤러 입력 콜백 및 초기 카메라 설정 옵션
     * [EN] Controller input callbacks and initial camera configuration options
     */
    constructor(redGPUContext: RedGPUContext, initInfo: controllerInit) {
        super(redGPUContext);
        this.#initInfo = initInfo || {};
        this.#camera = this.#initInfo.camera || new PerspectiveCamera();
        const isMobile = this.redGPUContext.detector.isMobile;
        this.#eventTypeKeys = {
            moveKey: isMobile ? 'touchmove' : 'mousemove',
            upKey: isMobile ? 'touchend' : 'mouseup',
            downKey: isMobile ? 'touchstart' : 'mousedown',
        };
        this.#initListener();
    }

    /**
     * [KO] 컨트롤러가 제어 중인 카메라 인스턴스를 반환합니다.
     * [EN] Returns the camera instance controlled by this controller.
     *
     * @returns
     * [KO] 제어 중인 `PerspectiveCamera` 또는 `OrthographicCamera` 인스턴스
     * [EN] Controlled `PerspectiveCamera` or `OrthographicCamera` instance
     */
    get camera(): PerspectiveCamera | OrthographicCamera {
        return this.#camera;
    }

    /**
     * [KO] 제어 중인 카메라의 월드 X 좌표를 반환합니다.
     * [EN] Returns the world X coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     */
    get x(): number {
        return this.camera.x;
    }

    /**
     * [KO] 제어 중인 카메라의 월드 Y 좌표를 반환합니다.
     * [EN] Returns the world Y coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 Y 좌표
     * [EN] Camera world Y coordinate
     */
    get y(): number {
        return this.camera.y;
    }

    /**
     * [KO] 제어 중인 카메라의 월드 Z 좌표를 반환합니다.
     * [EN] Returns the world Z coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     */
    get z(): number {
        return this.camera.z;
    }

    /**
     * [KO] 현재 포인터가 호버링 중인 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the `View3D` instance currently hovered by the pointer.
     *
     * @returns
     * [KO] 호버링 중인 `View3D` 또는 `null`
     * [EN] Hovered `View3D` or `null`
     */
    get hoveredView(): View3D | null {
        return this.#hoveredView;
    }

    /**
     * [KO] 키보드 입력 포커스를 보유한 전역 활성 `View3D`를 가져오거나 설정합니다.
     * [EN] Gets or sets the global active `View3D` holding keyboard input focus.
     *
     * @returns
     * [KO] 키보드 활성 `View3D` 또는 `null`
     * [EN] Keyboard-active `View3D` or `null`
     */
    get keyboardActiveView(): View3D | null {
        return AController.#globalKeyboardActiveView;
    }

    set keyboardActiveView(value: View3D | null) {
        AController.#globalKeyboardActiveView = value;
        if (value === null) {
            AController.#globalKeyboardActiveController = null;
        } else {
            AController.#globalKeyboardActiveController = this;
        }
    }

    /**
     * [KO] 이 컨트롤러가 현재 전역 키보드 입력 활성 컨트롤러인지 여부를 반환합니다.
     * [EN] Returns whether this controller is currently the global keyboard-active controller.
     *
     * @returns
     * [KO] 키보드 활성 컨트롤러 여부
     * [EN] Whether this controller is keyboard-active
     */
    get isKeyboardActiveController(): boolean {
        return AController.#globalKeyboardActiveController === this;
    }

    /**
     * [KO] 현재 프레임에서 키보드 입력이 이미 처리되었는지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether keyboard input has already been processed in the current frame.
     *
     * @returns
     * [KO] 현재 프레임 키보드 입력 처리 완료 여부
     * [EN] Whether keyboard input has been processed this frame
     */
    get keyboardProcessedThisFrame(): boolean {
        return this.#keyboardProcessedThisFrame;
    }

    set keyboardProcessedThisFrame(value: boolean) {
        this.#keyboardProcessedThisFrame = value;
    }

    /**
     * [KO] 컨트롤러에 등록된 캔버스 및 윈도우 이벤트 리스너를 모두 해제하고 내부 참조를 정리합니다.
     * [EN] Removes all canvas and window event listeners registered to the controller and clears internal references.
     */
    destroy() {
        const {moveKey, upKey, downKey} = this.#eventTypeKeys;
        const {htmlCanvas} = this.redGPUContext;
        htmlCanvas.removeEventListener(downKey, this.#HD_down);
        htmlCanvas.removeEventListener(moveKey, this.#HD_hover);
        htmlCanvas.removeEventListener(moveKey, this.#HD_Move);
        window.removeEventListener(upKey, this.#HD_up);
        if (this.#initInfo) {
            if (this.#initInfo.HD_Wheel) {
                htmlCanvas.removeEventListener('wheel', this.#HD_wheel);
            }
            if (this.#initInfo.HD_TouchPinch) {
                htmlCanvas.removeEventListener('touchmove', this.#HD_touchPinch);
            }
        }
        if (AController.#globalKeyboardActiveController === this) {
            AController.#globalKeyboardActiveController = null;
        }
        if (AController.#globalKeyboardActiveView && AController.#globalKeyboardActiveView.camera === this) {
            AController.#globalKeyboardActiveView = null;
        }
        this.#hoveredView = null;
        this.#currentFrameViews.clear();
        this.#initInfo = null;
    }

    /**
     * [KO] 프레임 경과 시간(`deltaTime`)을 계산하고 중복 뷰 갱신을 방지하며 애니메이션 콜백을 실행합니다.
     * [EN] Calculates frame elapsed time (`deltaTime`), prevents duplicate view updates, and executes the animation callback.
     *
     * @param view -
     * [KO] 업데이트할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to update
     * @param time -
     * [KO] 현재 프레임 타임스탬프 (ms)
     * [EN] Current frame timestamp in milliseconds
     * @param updateAnimation -
     * [KO] 초 단위 `deltaTime`을 전달받아 카메라 상태를 갱신하는 콜백 함수 (선택)
     * [EN] Optional callback function receiving `deltaTime` in seconds to update camera state
     */
    update(view: View3D, time: number, updateAnimation?: (view: View3D, deltaTime: number) => void): void {
        if (this.#lastUpdateTime !== time) {
            this.#currentDeltaTime = this.#lastUpdateTime === -1 ? 0 : (time - this.#lastUpdateTime) / 1000;
            this.#lastUpdateTime = time;
            this.#currentFrameViews.clear();
            this.#keyboardProcessedThisFrame = false;
        }
        if (this.#currentFrameViews.has(view)) return;
        this.#currentFrameViews.add(view);
        if (this.#initInfo?.useKeyboard && this.keyboardActiveView && this.keyboardActiveView !== view) return;
        updateAnimation?.(view, this.#currentDeltaTime);
    }

    /**
     * [KO] 지정된 키 매핑 테이블의 입력 여부를 검사하고 현재 `View3D`의 키보드 처리 권한을 획득합니다.
     * [EN] Checks whether any key in the key mapping table is pressed and acquires keyboard processing focus for the current `View3D`.
     *
     * @param view -
     * [KO] 키보드 입력을 검사할 `View3D` 인스턴스
     * [EN] `View3D` instance to check keyboard input for
     * @param keyNameMapper -
     * [KO] 동작 이름과 키 이름을 매핑한 객체 (`Record<string, string>`)
     * [EN] Object mapping action names to key names (`Record<string, string>`)
     * @returns
     * [KO] 현재 뷰에서 키보드 입력을 처리할 수 있으면 `true`, 아니면 `false`
     * [EN] `true` if keyboard input can be processed in the current view, otherwise `false`
     */
    checkKeyboardInput<T extends Record<string, string>>(view: View3D, keyNameMapper: T): boolean {
        if (this.keyboardProcessedThisFrame) return false;
        const {keyboardKeyBuffer} = view.redGPUContext;

        let hasAnyKeyInput = false;
        for (const key in keyNameMapper) {
            if (keyboardKeyBuffer[keyNameMapper[key]]) {
                hasAnyKeyInput = true;
                break;
            }
        }

        if (!hasAnyKeyInput) {
            this.keyboardActiveView = null;
            return false;
        }

        if (!this.keyboardActiveView) {
            if (this.hoveredView === view) {
                this.keyboardActiveView = view;
            } else {
                return false;
            }
        }

        if (this.keyboardActiveView !== view) return false;
        this.keyboardProcessedThisFrame = true;
        return true;
    }

    /**
     * [KO] 마우스, 터치, 휠 이벤트로부터 캔버스 기준 로컬 `{ x, y }` 좌표를 계산합니다.
     * [EN] Calculates canvas-local `{ x, y }` coordinates from a mouse, touch, or wheel event.
     *
     * @param e -
     * [KO] 입력 이벤트 (`MouseEvent` | `TouchEvent` | `WheelEvent`)
     * [EN] Input event (`MouseEvent` | `TouchEvent` | `WheelEvent`)
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @returns
     * [KO] 캔버스 기준 `{ x, y }` 좌표 객체
     * [EN] Canvas-local `{ x, y }` coordinate object
     */
    getCanvasEventPoint = (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
        const isMobile = redGPUContext.detector.isMobile;
        const rect = redGPUContext.boundingClientRect;
        const tX_key = 'clientX';
        const tY_key = 'clientY';
        let clientX: number;
        let clientY: number;
        if (isMobile) {
            const touch = e instanceof WheelEvent ? e : (e as TouchEvent).changedTouches[0];
            clientX = touch[tX_key];
            clientY = touch[tY_key];
        } else {
            const mouseEvent = e as MouseEvent;
            clientX = mouseEvent[tX_key];
            clientY = mouseEvent[tY_key];
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    /**
     * [KO] 입력 이벤트가 발생한 픽셀 좌표가 속한 `View3D` 인스턴스를 탐색하여 반환합니다.
     * [EN] Finds and returns the `View3D` instance containing the pixel coordinates of the input event.
     *
     * @param e -
     * [KO] 마우스 또는 터치 이벤트 (`MouseEvent` | `TouchEvent`)
     * [EN] Mouse or touch event (`MouseEvent` | `TouchEvent`)
     * @returns
     * [KO] 이벤트가 발생한 `View3D` 인스턴스 또는 `null`
     * [EN] `View3D` instance where the event occurred, or `null`
     */
    findTargetViewByInputEvent = (e: MouseEvent | TouchEvent): View3D | null => {
        const {redGPUContext} = this;
        const {renderScale, viewList} = redGPUContext;
        const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
        const scale = window.devicePixelRatio * renderScale;
        const tX = x * scale;
        const tY = y * scale;

        let targetView = null;
        for (const view of viewList) {
            const tViewRect = view.pixelRectObject;
            if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width &&
                tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
                targetView = view;
            }
        }
        return targetView;
    };

    #getTouchDistance = (touches: TouchList): number => {
        if (touches.length < 2) return 0;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    #initListener() {
        const {redGPUContext} = this;
        const {htmlCanvas} = redGPUContext;
        const {downKey, moveKey} = this.#eventTypeKeys;
        htmlCanvas.addEventListener(downKey, this.#HD_down);
        htmlCanvas.addEventListener(moveKey, this.#HD_hover);
        if (this.#initInfo.HD_Wheel) {
            htmlCanvas.addEventListener('wheel', this.#HD_wheel, {passive: false});
        }
        if (this.#initInfo.HD_TouchPinch) {
            htmlCanvas.addEventListener('touchmove', this.#HD_touchPinch, {passive: false});
        }
    }

    #HD_hover = (e: MouseEvent | TouchEvent) => {
        if (AController.#globalKeyboardActiveView || this.#isDragging) return;
        this.#hoveredView = this.findTargetViewByInputEvent(e);
    }

    #HD_down = (e: MouseEvent | TouchEvent) => {
        const targetView = this.findTargetViewByInputEvent(e);
        if (!targetView) return;

        if (!AController.#globalKeyboardActiveView && !this.#isDragging) {
            this.#hoveredView = targetView;
        }

        const {redGPUContext} = this;
        const {moveKey, upKey} = this.#eventTypeKeys;
        const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
        this.#dragStartX = x;
        this.#dragStartY = y;

        if (e instanceof TouchEvent) {
            if (e.touches.length >= 2) {
                this.#isMultiTouch = true;
                this.#pinchStartDistance = this.#getTouchDistance(e.touches);
            } else {
                this.#isMultiTouch = false;
                this.#pinchStartDistance = 0;
            }
        }

        if (this.#currentFrameViews.has(targetView)) {
            this.#isDragging = true;
            AController.#globalKeyboardActiveView = targetView;

            redGPUContext.htmlCanvas.addEventListener(moveKey, this.#HD_Move);
            window.addEventListener(upKey, this.#HD_up);
        }
    }

    #HD_Move = (e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent && e.touches.length >= 2) {
            this.#isMultiTouch = true;
            return;
        }

        this.#isMultiTouch = false;
        const {x, y} = this.getCanvasEventPoint(e, this.redGPUContext);
        const deltaX = x - this.#dragStartX;
        const deltaY = y - this.#dragStartY;
        this.#dragStartX = x;
        this.#dragStartY = y;

        this.#initInfo.HD_Move?.(deltaX, deltaY);
    }

    #HD_touchPinch = (e: TouchEvent) => {
        if (e.touches.length < 2 || !this.#initInfo.HD_TouchPinch) return;
        if (!this.#isMultiTouch) return;
        e.preventDefault();
        const currentDistance = this.#getTouchDistance(e.touches);
        if (this.#pinchStartDistance === 0) {
            this.#pinchStartDistance = currentDistance;
            return;
        }
        const targetView = this.findTargetViewByInputEvent(e);
        if (!targetView) return;
        if (targetView.rawCamera !== this.#camera) return;
        const deltaScale = currentDistance / this.#pinchStartDistance;
        this.#initInfo.HD_TouchPinch?.(deltaScale);
        this.#pinchStartDistance = currentDistance;
    }

    #HD_up = () => {
        const {htmlCanvas} = this.redGPUContext;
        const {moveKey, upKey} = this.#eventTypeKeys;

        this.#isMultiTouch = false;
        this.#pinchStartDistance = 0;
        this.#isDragging = false;

        htmlCanvas.removeEventListener(moveKey, this.#HD_Move);
        window.removeEventListener(upKey, this.#HD_up);
    }

    #HD_wheel = (e: WheelEvent) => {
        const targetView = this.findTargetViewByInputEvent(e);
        if (!targetView) return;
        if (targetView.rawCamera !== this.#camera) return;
        e.stopPropagation();
        e.preventDefault();
        this.#initInfo.HD_Wheel?.(e);
    }
}

Object.freeze(AController);
export default AController;