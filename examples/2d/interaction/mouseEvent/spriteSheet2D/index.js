import * as RedGPU from "../../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781134103100";
import {createEventInfoBox, updateEventInfo} from "../../../../3d/interaction/mouseEvent/eventInfoBox.js?t=1781134103100";

/**
 * [KO] SpriteSheet2D 마우스 이벤트 예제
 * [EN] SpriteSheet2D Mouse Event Example
 *
 * [KO] SpriteSheet2D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on SpriteSheet2D objects.
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

		// [KO] 샘플 SpriteSheet2D 객체 생성 및 배치
		// [EN] Create and position sample SpriteSheet2D objects
		createSampleSprite2D(redGPUContext, scene, infoBox);

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
			view.scene.children.forEach((spriteSheet2D, index) => {
				const angle = (index / numChildren) * Math.PI * 2;
				const endX = centerX + Math.cos(angle) * radius;
				const endY = centerY + Math.sin(angle) * radius;

				// [KO] 부드러운 위치 보간 이동
				// [EN] Smooth position interpolation movement
				spriteSheet2D.setPosition(
					spriteSheet2D.x + (endX - spriteSheet2D.x) * 0.3,
					spriteSheet2D.y + (endY - spriteSheet2D.y) * 0.3
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
 * [KO] 샘플 SpriteSheet2D 객체 생성 및 이벤트 등록
 * [EN] Create sample SpriteSheet2D objects and register events
 */
const createSampleSprite2D = async (redGPUContext, scene, infoBox) => {
	const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);

	// [KO] 모든 픽킹 이벤트 타입별로 SpriteSheet2D 생성
	// [EN] Create SpriteSheet2D for each picking event type
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName) => {
		const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
		scene.addChild(spriteSheet);

		// [KO] 마우스 이벤트 리스너 등록
		// [EN] Register mouse event listener
		spriteSheet.addListener(eventName, (e) => {
			updateEventInfo(infoBox, eventName, e);

			// [KO] 이벤트 발생 시 무작위 틴트 색상 적용
			// [EN] Apply random tint color when event occurs
			spriteSheet.material.useTint = true;
			spriteSheet.material.tint.r = Math.floor(Math.random() * 256);
			spriteSheet.material.tint.g = Math.floor(Math.random() * 256);
			spriteSheet.material.tint.b = Math.floor(Math.random() * 256);
		});

		// [KO] 이벤트 명칭을 표시할 라벨 생성
		// [EN] Create label to display event name
		const label = new RedGPU.Display.TextField2D(redGPUContext);
		label.text = `Event: ${eventName}`;
		label.padding = 12;
		label.fontSize = 16
		label.borderRadius = 8;
		label.background = 'rgba(104,54,54,0.9)';
		spriteSheet.addChild(label);
	});
};
