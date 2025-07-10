import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import AController from "../core/AController";

let currentEventView: View3D;

class ObitController extends AController {
	#instanceId: number;
	#name: string;
	// 공통 설정값들
	#centerX = 0;
	#centerY = 0;
	#centerZ = 0;
	#distance = 15;
	#speedDistance = 2;
	#delayDistance = 0.1;
	#speedRotation = 3;
	#delayRotation = 0.1;
	#tilt = -35;
	#minTilt = -90;
	#maxTilt = 90;
	#pan = 0;
	// 애니메이션용 현재 상태
	#currentPan = 0;
	#currentTilt = 0;
	#currentDistance = 0;
	// 현재 프레임에서 활성화된 View 목록
	#currentFrameViews = new Set<View3D>();
	#lastUpdateTime = -1;

	constructor(redGPUContext: RedGPUContext) {
		super();
		this.camera = new PerspectiveCamera();
		const isMobile = redGPUContext.detector.isMobile;
		const detector = {
			move: isMobile ? 'touchmove' : 'mousemove',
			up: isMobile ? 'touchend' : 'mouseup',
			down: isMobile ? 'touchstart' : 'mousedown',
		};
		let sX: number, sY: number;
		// 현재 마우스/터치 위치에서 해당하는 View를 찾는 함수
		const findTargetView = (e: MouseEvent | TouchEvent): View3D | null => {
			const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
			let tX: number, tY: number;
			if (isMobile) {
				tX = x * window.devicePixelRatio * redGPUContext.renderScale;
				tY = y * window.devicePixelRatio * redGPUContext.renderScale;
			} else {
				tX = x * window.devicePixelRatio * redGPUContext.renderScale;
				tY = y * window.devicePixelRatio * redGPUContext.renderScale;
			}
			// 현재 프레임에서 활성화된 View들을 검사하여 마우스/터치 위치에 해당하는 View 찾기
			for (const view of this.#currentFrameViews) {
				const tViewRect = view.pixelRectObject;
				if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width &&
					tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
					return view;
				}
			}
			return null;
		};
		sX = 0;
		sY = 0;
		const HD_down = (e: MouseEvent | TouchEvent) => {
			// 현재 마우스/터치 위치에서 해당하는 View 찾기
			const targetView = findTargetView(e);
			if (!targetView) return;
			// 찾은 View를 현재 이벤트 View로 설정
			currentEventView = targetView;
			const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
			sX = x;
			sY = y;
			redGPUContext.htmlCanvas.addEventListener(detector.move, HD_Move);
			window.addEventListener(detector.up, HD_up);
		};
		const HD_Move = (e: MouseEvent | TouchEvent) => {
			// 현재 이벤트가 진행 중인 View가 있는지 확인
			if (!currentEventView) return;
			const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
			const deltaX = x - sX;
			const deltaY = y - sY;
			sX = x;
			sY = y;
			this.#pan -= deltaX * this.#speedRotation * 0.1;
			this.#tilt -= deltaY * this.#speedRotation * 0.1;
		};
		const HD_up = () => {
			currentEventView = null;
			redGPUContext.htmlCanvas.removeEventListener(detector.move, HD_Move);
			window.removeEventListener(detector.up, HD_up);
		};
		const HD_wheel = (e: WheelEvent) => {
			// 현재 마우스 위치에서 해당하는 View 찾기
			const targetView = findTargetView(e);
			if (!targetView) return;
			// 거리 조정
			this.#distance += e.deltaY / 100 * this.#speedDistance;
		};
		redGPUContext.htmlCanvas.addEventListener(detector.down, HD_down);
		redGPUContext.htmlCanvas.addEventListener('wheel', HD_wheel);
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		this.#centerX = value;
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		this.#centerY = value;
	}

	get centerZ(): number {
		return this.#centerZ;
	}

	set centerZ(value: number) {
		this.#centerZ = value;
	}

	get distance(): number {
		return this.#distance;
	}

	set distance(value: number) {
		validateNumberRange(value, 0);
		this.#distance = value;
	}

	get speedDistance(): number {
		return this.#speedDistance;
	}

	set speedDistance(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedDistance = value;
	}

	get delayDistance(): number {
		return this.#delayDistance;
	}

	set delayDistance(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayDistance = value;
	}

	get speedRotation(): number {
		return this.#speedRotation;
	}

	set speedRotation(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedRotation = value;
	}

	get delayRotation(): number {
		return this.#delayRotation;
	}

	set delayRotation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayRotation = value;
	}

	get minTilt(): number {
		return this.#minTilt;
	}

	set minTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#minTilt = value;
	}

	get maxTilt(): number {
		return this.#maxTilt;
	}

	set maxTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#maxTilt = value;
	}

	get pan(): number {
		return this.#pan;
	}

	set pan(value: number) {
		this.#pan = value;
	}

	get tilt(): number {
		return this.#tilt;
	}

	set tilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#tilt = value;
	}

	update(view: View3D, time: number): void {
		// 새로운 프레임이 시작되면 View 목록 초기화
		if (this.#lastUpdateTime !== time) {
			this.#lastUpdateTime = time;
			this.#currentFrameViews.clear();
		}
		// 현재 프레임에서 사용되는 View 추가
		this.#currentFrameViews.add(view);
		// 첫 번째 View에서만 애니메이션 업데이트 실행
		if (this.#currentFrameViews.size === 1) {
			this.#updateAnimation();
		}
	}

	#updateAnimation(): void {
		const PER_PI = Math.PI / 180;
		// tilt 범위 제한
		if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
		if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
		const {camera} = this;
		// 공통 현재 상태를 목표값으로 애니메이션
		this.#currentPan += (this.#pan - this.#currentPan) * this.#delayRotation;
		this.#currentTilt += (this.#tilt - this.#currentTilt) * this.#delayRotation;
		if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
		this.#currentDistance += (this.#distance - this.#currentDistance) * this.#delayDistance;
		if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;
		const tMTX0 = camera.modelMatrix;
		mat4.identity(tMTX0);
		mat4.translate(tMTX0, tMTX0, [this.#centerX, this.#centerY, this.#centerZ]);
		mat4.rotateY(tMTX0, tMTX0, this.#currentPan * PER_PI);
		mat4.rotateX(tMTX0, tMTX0, this.#currentTilt * PER_PI);
		mat4.translate(tMTX0, tMTX0, [0, 0, this.#currentDistance]);
		camera.x = tMTX0[12];
		camera.y = tMTX0[13];
		camera.z = tMTX0[14];
		this.camera.lookAt(this.#centerX, this.#centerY, this.#centerZ);
	}
}

export default ObitController;
