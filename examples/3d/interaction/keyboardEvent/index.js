import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Keyboard Interaction 예제
 * [EN] Keyboard Interaction example
 *
 * [KO] keyboardKeyBuffer를 사용하여 매 프레임 키보드 상태를 체크하고 객체를 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to check keyboard state every frame and control an object using keyboardKeyBuffer.
 */

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 제어할 박스 메쉬 생성
		// [EN] Create a box mesh to control
		const box = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		box.material.color.setColorByHEX('#00CC99');
		scene.addChild(box);

		const speed = 0.1;

		let lastTime = 0;
		const render = (time) => {
			// [KO] 프레임 간 시간 차이 계산 (60fps 기준 비율)
			// [EN] Calculate time difference between frames (ratio based on 60fps)
			const deltaTime = lastTime ? Math.min((time - lastTime) / 16.666, 2) : 1;
			lastTime = time;

			const { keyboardKeyBuffer } = redGPUContext;

			// [KO] 컨트롤러의 각도를 기반으로 안정적인 이동 방향 계산 (카메라 위치 기반 계산 시의 덜덜거림 방지)
			// [EN] Calculate stable movement direction based on controller angles (prevents jitter caused by camera position-based calculation)
			const panRad = (controller.pan) * Math.PI / 180;
			const fX = -Math.sin(panRad);
			const fZ = -Math.cos(panRad);
			const rX = Math.cos(panRad);
			const rZ = -Math.sin(panRad);

			let moveX = 0;
			let moveZ = 0;

			// [KO] keyboardKeyBuffer를 통한 실시간 키 상태 체크
			// [EN] Real-time key state check via keyboardKeyBuffer
			if (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W'] || keyboardKeyBuffer['ArrowUp']) {
				moveX += fX;
				moveZ += fZ;
			}
			if (keyboardKeyBuffer['s'] || keyboardKeyBuffer['S'] || keyboardKeyBuffer['ArrowDown']) {
				moveX -= fX;
				moveZ -= fZ;
			}
			if (keyboardKeyBuffer['a'] || keyboardKeyBuffer['A'] || keyboardKeyBuffer['ArrowLeft']) {
				moveX -= rX;
				moveZ -= rZ;
			}
			if (keyboardKeyBuffer['d'] || keyboardKeyBuffer['D'] || keyboardKeyBuffer['ArrowRight']) {
				moveX += rX;
				moveZ += rZ;
			}

			// [KO] 이동 방향 정규화 및 속도 적용 (deltaTime 반영)
			// [EN] Normalize movement direction and apply speed (with deltaTime)
			const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
			const currentSpeed = speed * deltaTime;
			if (moveLen > 0) {
				box.x += (moveX / moveLen) * currentSpeed;
				box.z += (moveZ / moveLen) * currentSpeed;
			}

			if (keyboardKeyBuffer[' ']) {
				box.y += currentSpeed;
			} else {
				if (box.y > 0) box.y -= currentSpeed * 0.5;
				if (box.y < 0) box.y = 0;
			}

			// [KO] 회전 제어 (Q, E)
			// [EN] Rotation control (Q, E)
			const rotationSpeed = 2 * deltaTime;
			if (keyboardKeyBuffer['q'] || keyboardKeyBuffer['Q']) {
				box.rotationY += rotationSpeed;
			}
			if (keyboardKeyBuffer['e'] || keyboardKeyBuffer['E']) {
				box.rotationY -= rotationSpeed;
			}

			// [KO] 카메라가 박스를 따라가도록 업데이트
			// [EN] Update camera to follow the box
			controller.centerX = box.x;
			controller.centerY = box.y;
			controller.centerZ = box.z;


		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, redGPUContext.keyboardKeyBuffer);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, keyboardKeyBuffer) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
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
		value: 'Space: Lift, Q/E: Rotate',
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

	// [KO] 현재 눌린 키들을 모니터링하여 표시합니다.
	// [EN] Monitors and displays the currently pressed keys.
	setInterval(() => {
		const activeKeys = Object.entries(keyboardKeyBuffer)
			.filter(([key, pressed]) => pressed)
			.map(([key]) => key === ' ' ? 'Space' : key)
			.join(', ');
		activeKeysMonitor.value = activeKeys || 'None';
	}, 100);
};
