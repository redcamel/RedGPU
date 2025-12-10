import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {keepLog} from "../../utils";
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
 * 카메라 컨트롤러의 추상 클래스입니다.
 *
 * PerspectiveCamera, OrthographicCamera 등 다양한 카메라 타입을 제어하는 공통 인터페이스를 제공합니다.
 *
 * 파생 컨트롤러에서 update, getCanvasEventPoint 등을 구현하여 다양한 카메라 조작 방식을 지원할 수 있습니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 * @category Core
 *
 */
abstract class AController {
	// ==================== Static - 전역 상태 ====================
	/** 전역 키보드 활성 View - 모든 컨트롤러 인스턴스에서 공유 */
	static #globalKeyboardActiveView: View3D | null = null;

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
	 * AController 생성자
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
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}

	get camera(): PerspectiveCamera {
		return this.#camera;
	}

	// ==================== Protected - 파생 클래스 전용 ====================
	get hoveredView(): View3D | null {
		return this.#hoveredView;
	}

	get keyboardActiveView(): View3D | null {
		return AController.#globalKeyboardActiveView;
	}

	set keyboardActiveView(value: View3D | null) {
		AController.#globalKeyboardActiveView = value;
	}

	get keyboardProcessedThisFrame(): boolean {
		return this.#keyboardProcessedThisFrame;
	}

	set keyboardProcessedThisFrame(value: boolean) {
		this.#keyboardProcessedThisFrame = value;
	}

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
		updateAnimation?.();
	}

	// ==================== Private Helpers ====================
	#getTouchDistance = (touches: TouchList): number => {
		if (touches.length < 2) return 0;
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	getCanvasEventPoint = (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
		const canvas = redGPUContext.htmlCanvas;
		const isMobile = redGPUContext.detector.isMobile;
		//TODO getBoundingClientRect 를 redGPUContext 쪽에서 캐싱 관리하는 방안 고려
		const rect = canvas.getBoundingClientRect();
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

	findTargetViewByInputEvent = (e: MouseEvent | TouchEvent): View3D | null => {
		const redGPUContext = this.#redGPUContext;
		const isMobile = redGPUContext.detector.isMobile;
		const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
		const scale = window.devicePixelRatio * redGPUContext.renderScale
		const tX = x * scale;
		const tY = y * scale;

		for (const view of this.redGPUContext.viewList) {
			const tViewRect = view.pixelRectObject;
			if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width &&
				tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
				return view;
			}
		}
		keepLog(e, tX, tY, null)
		return null;
	};

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
