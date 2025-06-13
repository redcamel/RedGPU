import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import OrthographicCamera from "../camera/OrthographicCamera";
import PerspectiveCamera from "../camera/PerspectiveCamera";

class AController {
	#camera: PerspectiveCamera | OrthographicCamera

	constructor() {
	}

	get camera(): PerspectiveCamera | OrthographicCamera {
		return this.#camera;
	}

	set camera(value: PerspectiveCamera | OrthographicCamera) {
		this.#camera = value;
	}

	update(view: View3D, time: number): void {
	}

	getCanvasEventPoint = (e: MouseEvent | TouchEvent, redGPUContext: RedGPUContext) => {
		const canvas = redGPUContext.htmlCanvas;
		const isMobile = redGPUContext.detector.isMobile;
		const rect = canvas.getBoundingClientRect(); // 엘리먼트의 경계를 가져옵니다.
		const tX_key = 'clientX';
		const tY_key = 'clientY';
		let clientX: number;
		let clientY: number;
		if (isMobile) {
			// Mobile (TouchEvent)
			const touch = (e as TouchEvent).changedTouches[0];
			clientX = touch[tX_key];
			clientY = touch[tY_key];
		} else {
			// Desktop (MouseEvent)
			const mouseEvent = e as MouseEvent;
			clientX = mouseEvent[tX_key];
			clientY = mouseEvent[tY_key];
		}
		// 엘리먼트 내 상대 좌표 계산
		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}
}

export default AController
