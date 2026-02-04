import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import OrthographicCamera from "../camera/OrthographicCamera";
import PerspectiveCamera from "../camera/PerspectiveCamera";

export type controllerInit = {
    HD_Move?: (deltaX: number, deltaY: number) => void
    HD_Wheel?: (e: WheelEvent) => void
    HD_TouchPinch?: (deltaScale: number) => void
    useKeyboard?: boolean,
    camera?: PerspectiveCamera | OrthographicCamera
}

/**
 * [KO] 카메라 컨트롤러의 추상 클래스입니다.
 * [EN] Abstract class for camera controllers.
 *
 * [KO] PerspectiveCamera, OrthographicCamera 등 다양한 카메라 타입을 제어하는 공통 인터페이스를 제공합니다.
 * [EN] Provides a common interface for controlling various camera types such as PerspectiveCamera and OrthographicCamera.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접적인 인스턴스 생성은 불가능하며, 필요한 경우 이를 상속받아 구현하십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Direct instantiation is not possible; inherit and implement if necessary.
 * :::
 *
 * @category Core
 */
abstract class AController {
	// ==================== Static - 전역 상태 ====================
	/**
	 * [KO] 전역 키보드 활성 View - 모든 컨트롤러 인스턴스에서 공유
	 * [EN] Global keyboard active View - Shared across all controller instances
	 */
	static #globalKeyboardActiveView: View3D | null = null;
	/**
	 * [KO] 전역 키보드 활성 컨트롤러 - 어떤 컨트롤러가 키보드를 사용 중인지 추적
	 * [EN] Global keyboard active controller - Tracks which controller is using the keyboard
	 */
	static #globalKeyboardActiveController: AController | null = null;

	// ==================== 인스턴스 정보 ====================
	#instanceId: number;
	#name: string;
	#redGPUContext: RedGPUContext;
	#camera: PerspectiveCamera | OrthographicCamera
	#initInfo: controllerInit;

	// ==================== 프레임 관리 ====================
	#lastUpdateTime = -1;
	#currentFrameViews = new Set<View3D>();
	#keyboardProcessedThisFrame: boolean = false

	// ==================== View 상태 ====================
	#hoveredView: View3D | null = null
	#isDragging: boolean = false

	// ==================== 입력 이벤트 관련 ====================
	#eventTypeKeys: { moveKey: string; upKey: string; downKey: string };
	#dragStartX: number = 0;
	#dragStartY: number = 0;
	#pinchStartDistance: number = 0;
	#isMultiTouch: boolean = false;



	/**
	 * [KO] AController 생성자
	 * [EN] AController constructor
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU Context
	 * @param initInfo -
	 * [KO] 컨트롤러 초기화 정보
	 * [EN] Controller initialization info
	 */
	constructor(redGPUContext: RedGPUContext, initInfo: controllerInit) {
		this.#redGPUContext = redGPUContext
		this.#initInfo = initInfo || {}
		this.#camera = initInfo.camera || new PerspectiveCamera()
		const isMobile = this.#redGPUContext.detector.isMobile;
		this.#eventTypeKeys = {
			moveKey: isMobile ? 'touchmove' : 'mousemove',
			upKey: isMobile ? 'touchend' : 'mouseup',
			downKey: isMobile ? 'touchstart' : 'mousedown',
		};
		this.#initListener();
	}

	// ==================== Public Getters/Setters ====================
	/**
	 * [KO] 컨트롤러의 이름을 반환합니다.
	 * [EN] Returns the name of the controller.
	 *
	 * @returns
	 * [KO] 컨트롤러 이름
	 * [EN] Controller name
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * [KO] 컨트롤러의 이름을 설정합니다.
	 * [EN] Sets the name of the controller.
	 *
	 * @param value -
	 * [KO] 설정할 이름
	 * [EN] Name to set
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * [KO] RedGPU 컨텍스트를 반환합니다.
	 * [EN] Returns the RedGPU context.
	 *
	 * @returns
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 */
	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}

	/**
	 * [KO] 이 컨트롤러가 제어하는 카메라를 반환합니다.
	 * [EN] Returns the camera controlled by this controller.
	 *
	 * @returns
	 * [KO] 제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)
	 * [EN] Controlled camera (PerspectiveCamera or OrthographicCamera)
	 */
	get camera(): PerspectiveCamera | OrthographicCamera {
		return this.#camera;
	}

	/**
	 * [KO] 카메라의 현재 월드 X 좌표를 가져옵니다.
	 * [EN] Gets the camera's current world X coordinate.
	 *
	 * @returns
	 * [KO] X 좌표
	 * [EN] X coordinate
	 */
	get x(): number {
		return this.camera.x;
	}

	/**
	 * [KO] 카메라의 현재 월드 Y 좌표를 가져옵니다.
	 * [EN] Gets the camera's current world Y coordinate.
	 *
	 * @returns
	 * [KO] Y 좌표
	 * [EN] Y coordinate
	 */
	get y(): number {
		return this.camera.y;
	}

	/**
	 * [KO] 카메라의 현재 월드 Z 좌표를 가져옵니다.
	 * [EN] Gets the camera's current world Z coordinate.
	 *
	 * @returns
	 * [KO] Z 좌표
	 * [EN] Z coordinate
	 */
	get z(): number {
		return this.camera.z;
	}
	// ==================== Protected - 파생 클래스 전용 ====================
	/**
	 * [KO] 현재 마우스가 호버링 중인 View를 반환합니다.
	 * [EN] Returns the View currently being hovered by the mouse.
	 *
	 * @returns
	 * [KO] 호버링 중인 View 또는 null
	 * [EN] Hovered View or null
	 * @internal
	 */
	get hoveredView(): View3D | null {
		return this.#hoveredView;
	}

	/**
	 * [KO] 키보드 입력이 활성화된 View를 반환합니다.
	 * [EN] Returns the View with active keyboard input.
	 *
	 * @returns
	 * [KO] 키보드 활성 View 또는 null
	 * [EN] Keyboard active View or null
	 * @internal
	 */
	get keyboardActiveView(): View3D | null {
		return AController.#globalKeyboardActiveView;
	}

	/**
	 * [KO] 키보드 입력이 활성화된 View를 설정합니다.
	 * [EN] Sets the View with active keyboard input.
	 *
	 * @param value -
	 * [KO] 설정할 View 또는 null
	 * [EN] View to set or null
	 * @internal
	 */
	set keyboardActiveView(value: View3D | null) {
		AController.#globalKeyboardActiveView = value;
		// View가 null이면 컨트롤러도 null로 설정
		if (value === null) {
			AController.#globalKeyboardActiveController = null;
		} else {
			// View가 설정되면 현재 컨트롤러를 활성 컨트롤러로 설정
			AController.#globalKeyboardActiveController = this;
		}
	}

	/**
	 * [KO] 현재 컨트롤러가 키보드 입력을 처리 중인지 여부를 반환합니다.
	 * [EN] Returns whether the current controller is processing keyboard input.
	 *
	 * @returns
	 * [KO] 키보드 활성 컨트롤러 여부
	 * [EN] Whether it is the keyboard active controller
	 * @internal
	 */
	get isKeyboardActiveController(): boolean {
		return AController.#globalKeyboardActiveController === this;
	}

	/**
	 * [KO] 이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.
	 * [EN] Returns whether keyboard input has already been processed in this frame.
	 *
	 * @returns
	 * [KO] 처리 여부
	 * [EN] Processing status
	 * @internal
	 */
	get keyboardProcessedThisFrame(): boolean {
		return this.#keyboardProcessedThisFrame;
	}

	/**
	 * [KO] 이번 프레임에서 키보드 입력이 처리되었는지 여부를 설정합니다.
	 * [EN] Sets whether keyboard input has been processed in this frame.
	 *
	 * @param value -
	 * [KO] 설정할 처리 여부
	 * [EN] Processing status to set
	 * @internal
	 */
	set keyboardProcessedThisFrame(value: boolean) {
		this.#keyboardProcessedThisFrame = value;
	}

	/**
	 * [KO] 컨트롤러를 제거하고 이벤트 리스너를 해제합니다.
	 * [EN] Destroys the controller and removes event listeners.
	 */
	destroy() {
		const {moveKey, upKey, downKey} = this.#eventTypeKeys;
		const {htmlCanvas} = this.redGPUContext;
		htmlCanvas.removeEventListener(downKey, this.#HD_down);
		htmlCanvas.removeEventListener(moveKey, this.#HD_hover);
		htmlCanvas.removeEventListener(moveKey, this.#HD_Move);
		window.removeEventListener(upKey, this.#HD_up);
		if (this.#initInfo.HD_Wheel) {
			htmlCanvas.removeEventListener('wheel', this.#HD_wheel);
		}
	}

	// ==================== Update ====================
	/**
	 * [KO] 컨트롤러 상태를 업데이트합니다. 파생 클래스에서 구현해야 합니다.
	 * [EN] Updates the controller state. Must be implemented in derived classes.
	 *
	 * @param view -
	 * [KO] 현재 View
	 * [EN] Current View
	 * @param time -
	 * [KO] 현재 시간 (ms)
	 * [EN] Current time (ms)
	 * @param updateAnimation -
	 * [KO] 애니메이션 업데이트 콜백
	 * [EN] Animation update callback
	 */
	update(view: View3D, time: number, updateAnimation: () => void): void {
		// 새로운 프레임이 시작되면 상태 초기화
		if (this.#lastUpdateTime !== time) {
			this.#lastUpdateTime = time;
			this.#currentFrameViews.clear();
			this.#keyboardProcessedThisFrame = false;
		}
		// 중복 업데이트 방지
		if (this.#currentFrameViews.has(view)) return;
		this.#currentFrameViews.add(view);
		if (this.#initInfo.useKeyboard && this.keyboardActiveView && this.keyboardActiveView !== view) return;
		updateAnimation?.();
	}

	/**
	 * [KO] 키보드 입력이 있는지 체크하고 활성 View를 설정합니다.
	 * [EN] Checks for keyboard input and sets the active View.
	 * @param view -
	 * [KO] 현재 View
	 * [EN] Current View
	 * @param keyNameMapper -
	 * [KO] 키 매핑 객체
	 * [EN] Key mapping object
	 * @returns
	 * [KO] 키보드 입력 처리가 가능하면 true, 아니면 false
	 * [EN] True if keyboard input processing is possible, otherwise false
	 */
	checkKeyboardInput<T extends Record<string, string>>(view: View3D, keyNameMapper: T): boolean {
		if (this.keyboardProcessedThisFrame) return false;
		const {keyboardKeyBuffer} = view.redGPUContext;

		// 키보드 입력 체크
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

		// 활성 View 설정
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
	 * [KO] 캔버스 상의 이벤트 좌표를 가져옵니다.
	 * [EN] Gets the event coordinates on the canvas.
	 *
	 * @param e -
	 * [KO] 마우스, 터치 또는 휠 이벤트
	 * [EN] Mouse, touch, or wheel event
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 * @returns
	 * [KO] {x, y} 좌표 객체
	 * [EN] {x, y} coordinate object
	 * @internal
	 */
	getCanvasEventPoint = (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
		const canvas = redGPUContext.htmlCanvas;
		const isMobile = redGPUContext.detector.isMobile;
		//TODO getBoundingClientRect 를 redGPUContext 쪽에서 캐싱 관리하는 방안 고려
		// const rect = canvas.getBoundingClientRect();
		const rect = redGPUContext.boundingClientRect
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
	 * [KO] 입력 이벤트가 발생한 View를 찾습니다.
	 * [EN] Finds the View where the input event occurred.
	 *
	 * @param e -
	 * [KO] 마우스 또는 터치 이벤트
	 * [EN] Mouse or touch event
	 * @returns
	 * [KO] 해당 View 또는 null
	 * [EN] Corresponding View or null
	 * @internal
	 */
	findTargetViewByInputEvent = (e: MouseEvent | TouchEvent): View3D | null => {
		const redGPUContext = this.#redGPUContext;
		const isMobile = redGPUContext.detector.isMobile;
		const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
		const scale = window.devicePixelRatio * redGPUContext.renderScale
		const tX = x * scale;
		const tY = y * scale;

		let targetView = null
		for (const view of this.redGPUContext.viewList) {
			const tViewRect = view.pixelRectObject;
			if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width &&
				tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
				targetView = view;
			}
		}
		// keepLog(e, tX, tY, targetView)
		return targetView;
	};

	// ==================== Private Helpers ====================
	/**
	 * [KO] 두 터치 점 사이의 거리를 계산합니다.
	 * [EN] Calculates the distance between two touch points.
	 *
	 * @param touches -
	 * [KO] 터치 리스트
	 * [EN] Touch list
	 * @returns
	 * [KO] 거리 값
	 * [EN] Distance value
	 * @internal
	 */
	#getTouchDistance = (touches: TouchList): number => {
		if (touches.length < 2) return 0;
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// ==================== 마우스/터치 이벤트 핸들러 ====================
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
		// 키보드 활성 View가 있거나 드래그 중이면 hover 갱신 차단
		if (AController.#globalKeyboardActiveView || this.#isDragging) return;

		this.#hoveredView = this.findTargetViewByInputEvent(e);
	}

	#HD_down = (e: MouseEvent | TouchEvent) => {
		const targetView = this.findTargetViewByInputEvent(e);
		if (!targetView) return;

		// hover 업데이트 (모바일에서 hover가 설정되지 않는 문제 해결)
		if (!AController.#globalKeyboardActiveView && !this.#isDragging) {
			this.#hoveredView = targetView;
		}

		const {redGPUContext} = this;
		const {moveKey, upKey} = this.#eventTypeKeys;
		const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
		this.#dragStartX = x;
		this.#dragStartY = y;

		// 멀티터치 감지
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
			// 드래그 시작 - View 고정 및 키보드 활성 View로 설정
			this.#isDragging = true;
			AController.#globalKeyboardActiveView = targetView;

			redGPUContext.htmlCanvas.addEventListener(moveKey, this.#HD_Move);
			window.addEventListener(upKey, this.#HD_up);
		}
	}

	#HD_Move = (e: MouseEvent | TouchEvent) => {
		// 멀티터치 상태에서는 드래그 무시
		if (e instanceof TouchEvent && e.touches.length >= 2) {
			this.#isMultiTouch = true;
			return;
		}

		this.#isMultiTouch = false;
		const {x, y} = this.getCanvasEventPoint(e, this.#redGPUContext);
		const deltaX = x - this.#dragStartX;
		const deltaY = y - this.#dragStartY;
		this.#dragStartX = x;
		this.#dragStartY = y;

		this.#initInfo.HD_Move?.(deltaX, deltaY)
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
		if (targetView.rawCamera !== this.#camera) return;
		const deltaScale = currentDistance / this.#pinchStartDistance;
		this.#initInfo.HD_TouchPinch?.(deltaScale);
		this.#pinchStartDistance = currentDistance;
	}

	#HD_up = () => {
		const {htmlCanvas} = this.#redGPUContext;
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

export default AController