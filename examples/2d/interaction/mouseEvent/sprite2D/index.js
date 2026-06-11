import * as RedGPU from "../../../../../dist/index.js?t=1781144235516";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781144235516";
import {createEventInfoBox, updateEventInfo} from "../../../../3d/interaction/mouseEvent/eventInfoBox.js?t=1781144235516";

/**
 * [KO] Sprite2D 마우스 이벤트 예제
 * [EN] Sprite2D Mouse Event Example
 *
 * [KO] Sprite2D 객체에서 발생하는 다양한 마우스 이벤트를 처리하고 시각화하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle and visualize various mouse events on Sprite2D objects.
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

		// [KO] 샘플 Sprite2D 객체 생성 및 배치
		// [EN] Create and position sample Sprite2D objects
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
			view.scene.children.forEach((sprite2D, index) => {
				const angle = (index / numChildren) * Math.PI * 2;
				const endX = centerX + Math.cos(angle) * radius;
				const endY = centerY + Math.sin(angle) * radius;

				// [KO] 부드러운 위치 보간 이동
				// [EN] Smooth position interpolation movement
				sprite2D.setPosition(
					sprite2D.x + (endX - sprite2D.x) * 0.1,
					sprite2D.y + (endY - sprite2D.y) * 0.1
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
 * [KO] 샘플 Sprite2D 객체 생성 및 이벤트 등록
 * [EN] Create sample Sprite2D objects and register events
 */
const createSampleSprite2D = (redGPUContext, scene, infoBox) => {
	const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');

	// [KO] 모든 픽킹 이벤트 타입별로 Sprite2D 생성
	// [EN] Create Sprite2D for each picking event type
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName) => {
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
		const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
		sprite2D.setSize(100, 100);
		scene.addChild(sprite2D);

		// [KO] 마우스 이벤트 리스너 등록
		// [EN] Register mouse event listener
		sprite2D.addListener(eventName, (e) => {
			updateEventInfo(infoBox, eventName, e);

			// [KO] 이벤트 발생 시 무작위 틴트 색상 적용
			// [EN] Apply random tint color when event occurs
			sprite2D.material.useTint = true;
			sprite2D.material.tint.r = Math.floor(Math.random() * 256);
			sprite2D.material.tint.g = Math.floor(Math.random() * 256);
			sprite2D.material.tint.b = Math.floor(Math.random() * 256);
		});

		// [KO] 이벤트 명칭을 표시할 라벨 생성
		// [EN] Create label to display event name
		const label = new RedGPU.Display.TextField2D(redGPUContext);
		label.text = `Event: ${eventName}`;
		label.fontSize = 16;
		label.color = '#fff';
		label.y = 70; // [KO] 스프라이트 하단 배치 [EN] Position below the sprite
		sprite2D.addChild(label);
	});
};
