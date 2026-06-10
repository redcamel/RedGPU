import * as RedGPU from "../../../../dist/index.js?t=1781132303147";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132303147";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] 2D Keyboard Interaction 예제
 * [EN] 2D Keyboard Interaction Example
 *
 * [KO] keyboardKeyBuffer를 사용하여 2D 환경에서 객체를 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to control an object in a 2D environment using keyboardKeyBuffer.
 */

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);

		// [KO] 제어할 Sprite2D 생성
		// [EN] Create a Sprite2D to control
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
		const sprite = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.BitmapMaterial(redGPUContext, texture));
		sprite.setSize(100, 100);
		scene.addChild(sprite);

		// [KO] 화면 중앙에 배치
		// [EN] Position in the center of the screen
		sprite.x = redGPUContext.screenRectObject.width / 2;
		sprite.y = redGPUContext.screenRectObject.height / 2;

		const speed = 5;

		/**
		 * [KO] 렌더 루프
		 * [EN] Render loop
		 */
		const render = () => {
			const { keyboardKeyBuffer } = redGPUContext;

			// [KO] keyboardKeyBuffer를 통한 실시간 키 상태 체크
			// [EN] Real-time key state check via keyboardKeyBuffer
			if (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W'] || keyboardKeyBuffer['ArrowUp']) {
				sprite.y -= speed;
			}
			if (keyboardKeyBuffer['s'] || keyboardKeyBuffer['S'] || keyboardKeyBuffer['ArrowDown']) {
				sprite.y += speed;
			}
			if (keyboardKeyBuffer['a'] || keyboardKeyBuffer['A'] || keyboardKeyBuffer['ArrowLeft']) {
				sprite.x -= speed;
			}
			if (keyboardKeyBuffer['d'] || keyboardKeyBuffer['D'] || keyboardKeyBuffer['ArrowRight']) {
				sprite.x += speed;
			}

			// [KO] 회전 및 스케일 제어
			// [EN] Rotation and scale control
			if (keyboardKeyBuffer['q'] || keyboardKeyBuffer['Q']) {
				sprite.rotation -= 2;
			}
			if (keyboardKeyBuffer['e'] || keyboardKeyBuffer['E']) {
				sprite.rotation += 2;
			}
			if (keyboardKeyBuffer['+'] || keyboardKeyBuffer['=']) {
				sprite.scaleX += 0.01;
				sprite.scaleY += 0.01;
			}
			if (keyboardKeyBuffer['-'] || keyboardKeyBuffer['_']) {
				sprite.scaleX -= 0.01;
				sprite.scaleY -= 0.01;
			}
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		// [KO] 테스트용 GUI 헬퍼 초기화
		// [EN] Initialize GUI helper for testing
		renderTestPane(redGPUContext, redGPUContext.keyboardKeyBuffer);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
	}
);

/**
 * [KO] 테스트용 GUI 렌더링
 * [EN] Render GUI for testing
 */
const renderTestPane = (redGPUContext, keyboardKeyBuffer) => {
	new RedGPUExampleHelper(redGPUContext, {
		gui: (pane) => {
			pane.addBlade({
				view: 'text',
				label: 'Movement',
				value: 'WASD / Arrows',
				parse: (v) => v,
				readonly: true
			});
			pane.addBlade({
				view: 'text',
				label: 'Action',
				value: 'Q/E: Rotate, +/-: Scale',
				parse: (v) => v,
				readonly: true
			});

			const activeKeysFolder = pane.addFolder({ title: 'Active Keys' });
			const activeKeysMonitor = activeKeysFolder.addBlade({
				view: 'text',
				label: 'Pressed',
				value: '',
				parse: (v) => v,
				readonly: true
			});

			setInterval(() => {
				const activeKeys = Object.entries(keyboardKeyBuffer)
					.filter(([key, pressed]) => pressed)
					.map(([key]) => key === ' ' ? 'Space' : key)
					.join(', ');
				activeKeysMonitor.value = activeKeys || 'None';
			}, 100);
		}
	});
};
