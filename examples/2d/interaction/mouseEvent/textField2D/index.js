import * as RedGPU from "../../../../../dist/index.js?t=1783323704031";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783323704031";
import {createEventInfoBox, updateEventInfo} from "../../../../3d/interaction/mouseEvent/eventInfoBox.js?t=1783323704031";

/**
 * [KO] TextField2D 마우스 이벤트 예제
 * [EN] TextField2D Mouse Event Example
 *
 * [KO] TextField2D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on TextField2D objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);

		// [KO] 이벤트 정보 표시용 박스 생성
		// [EN] Create a box for displaying event information
		const infoBox = createEventInfoBox(redGPUContext.detector.isMobile);

		// [KO] 샘플 TextField2D 객체 생성 및 배치
		// [EN] Create and position sample TextField2D objects
		createSampleTextField2D(redGPUContext, scene, infoBox);

		const renderer = new RedGPU.Renderer();

		/**
		 * [KO] 렌더 루프
		 * [EN] Render loop
		 */
		const render = () => {
			const radius = 250;
			const numChildren = view.scene.children.length;
			let centerX = redGPUContext.screenRectObject.width / 2;
			let centerY = redGPUContext.screenRectObject.height / 2;
			view.scene.children.forEach((textField2D, index) => {
				const angle = (index / numChildren) * Math.PI * 2;
				const endX = centerX + Math.cos(angle) * radius;
				const endY = centerY + Math.sin(angle) * radius;

				// [KO] 부드러운 위치 보간 이동
				// [EN] Smooth position interpolation movement
				textField2D.setPosition(
					textField2D.x + (endX - textField2D.x) * 0.3,
					textField2D.y + (endY - textField2D.y) * 0.3
				);
			});
		};
		renderer.start(redGPUContext, render);

		// [KO] 테스트용 GUI 헬퍼 초기화
		// [EN] Initialize GUI helper for testing
		new RedGPUExampleHelper(redGPUContext);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
	}
);

/**
 * [KO] 샘플 TextField2D 객체 생성 및 이벤트 등록
 * [EN] Create sample TextField2D objects and register events
 */
const createSampleTextField2D = async (redGPUContext, scene, infoBox) => {
	// [KO] 모든 픽킹 이벤트 타입별로 TextField2D 생성
	// [EN] Create TextField2D for each picking event type
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName) => {
		const textField = new RedGPU.Display.TextField2D(redGPUContext);

		textField.text = `Event: ${eventName}`;
		textField.background = 'blue';
		textField.color = 'white';
		textField.fontSize = 16;
		textField.padding = 10;
		textField.borderRadius = 10;

		scene.addChild(textField);

		// [KO] 마우스 이벤트 리스너 등록
		// [EN] Register mouse event listener
		textField.addListener(eventName, (e) => {
			updateEventInfo(infoBox, eventName, e);

			// [KO] 이벤트 발생 시 무작위 배경색 적용
			// [EN] Apply random background color when event occurs
			e.target.background = getRandomHexValue();
		});
	});
};

/**
 * [KO] 무작위 16진수 색상 값 반환
 * [EN] Return random hex color value
 */
const getRandomHexValue = () => {
	let result = '';
	const characters = '0123456789ABCDEF';
	for (let i = 0; i < 6; i++) {
		result += characters[Math.floor(Math.random() * 16)];
	}
	return `#${result}`;
};
