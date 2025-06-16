import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
	// Create a camera controller (Orbit type)
	const controller = new RedGPU.Camera.ObitController(redGPUContext);
	controller.speedDistance = 0.5

	// Create a scene and add a view with the camera controller
	const scene = new RedGPU.Display.Scene();
	const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
	view.grid = true;
	redGPUContext.addView(view);

	const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24)
	const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo)

	scene.addChild(spriteSheet);
	// Sprite3D 10개를 원형 배치
	const spriteCount = 10; // 원에 배치될 Sprite3D 개수
	const radius = 5; // 원의 반지름

	for (let i = 0; i < spriteCount; i++) {
		const angle = (i / spriteCount) * Math.PI * 2; // 각도 계산
		const x = Math.cos(angle) * radius; // x 좌표
		const z = Math.sin(angle) * radius; // z 좌표

		const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);

		spriteSheet.x = x;
		spriteSheet.z = z;
		scene.addChild(spriteSheet); // 씬에 추가
	}

	// Create a renderer and start rendering
	const renderer = new RedGPU.Renderer(redGPUContext);
	const render = () => {
		// 매 프레임 실행될 로직 (필요시 추가)
	};
	renderer.start(redGPUContext, render);

	// Render Test Pane for real-time adjustments
	renderTestPane(scene, redGPUContext);
}, (failReason) => {
	// Handle initialization failure
	console.error('Initialization failed:', failReason);
	const errorMessage = document.createElement('div');
	errorMessage.innerHTML = failReason;
	document.body.appendChild(errorMessage);
});

const renderTestPane = async (scene, redGPUContext) => {
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const controls = {
		testSpriteSheetInfo: 0
	}
	// 초기 컨트롤 값 설정
	const updateTestData = () => {
		const child = scene.children[0];

		// controls 데이터를 scene.children[0] 값으로 동기화
		controls.useBillboardPerspective = child.useBillboardPerspective;
		controls.useBillboard = child.useBillboard;
		controls.billboardFixedScale = child.billboardFixedScale;
		controls.loop = child.loop;
		controls.frameRate = child.frameRate;
		controls.state = child.state; // SpriteSheet 상태
		controls.currentIndex = child.currentIndex || 0; // 현재 프레임 인덱스
		controls.totalFrame = child.totalFrame || 0; // 총 프레임 수
		controls.segmentW = child.segmentW || 0; // SpriteSheet 가로 세그먼트 수
		controls.segmentH = child.segmentH || 0; // SpriteSheet 세로 세그먼트 수
		controls.scaleX = child.scaleX; // x축 스케일
		controls.scaleY = child.scaleY; // y축 스케일
		controls.scaleZ = child.scaleZ; // z축 스케일
		// UI를 갱신하여 변경 사항 반영
		pane.refresh();
	};
	updateTestData()
	const spriteSheetInfos = [
		new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
		new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/walk.png', 8, 1, 8, 0, true, 24),
		new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/jump.png', 8, 1, 8, 0, true, 24),
		new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/attack.png', 6, 1, 6, 0, true, 24)]
// 스프라이트 시트 컨트롤 폴더 추가
	const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

// useBillboardPerspective 바인딩
	spriteSheet3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboardPerspective = evt.value;
		});
		updateBillboardFixedScaleBinding();
	});

// useBillboard 바인딩
	spriteSheet3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboard = evt.value;
		});
		updateBillboardFixedScaleBinding();
	});

// billboardFixedScale 바인딩
	const billboardFixedScaleBinding = spriteSheet3DFolder
		.addBinding(controls, 'billboardFixedScale', {min: 0.1, max: 1})
		.on('change', (evt) => {
			scene.children.forEach((child) => {
				child.billboardFixedScale = evt.value;
			});
		});

// billboardFixedScale 표시 조건 관리 함수
	const updateBillboardFixedScaleBinding = () => {
		const hidden = controls.useBillboardPerspective || !controls.useBillboard;
		billboardFixedScaleBinding.element.style.opacity = hidden ? 0.25 : 1;
		billboardFixedScaleBinding.element.style.pointerEvents = hidden ? 'none' : 'painted';
	};
	updateBillboardFixedScaleBinding();

// loop 및 frameRate 컨트롤
	spriteSheet3DFolder.addBinding(controls, 'loop').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.loop = evt.value;
			child.play();
		});
	});

	spriteSheet3DFolder.addBinding(controls, 'frameRate', {min: 0, max: 60, step: 1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.frameRate = evt.value;
		});
	});

// SpriteSheet Selector 추가
	const spriteSelectorOptions = spriteSheetInfos.map((_, index) => ({
		text: `SpriteSheet ${index + 1}`, value: index,
	}));

	spriteSheet3DFolder.addBinding(controls, 'testSpriteSheetInfo', {
		options: spriteSelectorOptions,
	}).on('change', (evt) => {
		const selectedSpriteSheetInfo = spriteSheetInfos[evt.value];
		scene.children.forEach((child) => {
			child.spriteSheetInfo = selectedSpriteSheetInfo; // 선택한 SpriteSheetInfo로 갱신
		});
		updateTestData()
	});
	setSeparator(pane);

// Play 컨트롤 폴더 추가
	const playControlsFolder = pane.addFolder({title: 'Play Controls', expanded: true});

	playControlsFolder.addButton({title: 'Play'}).on('click', () => {
		scene.children.forEach((child) => child.play());
	});

	playControlsFolder.addButton({title: 'Pause'}).on('click', () => {
		scene.children.forEach((child) => child.pause());
	});

	playControlsFolder.addButton({title: 'Stop'}).on('click', () => {
		scene.children.forEach((child) => child.stop());
	});

	setSeparator(pane);

// 스케일 컨트롤 폴더 추가
	const scaleFolder = pane.addFolder({title: 'SpriteSheet3D Scale', expanded: true});

	scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
		scene.children.forEach((child) => {
			child.scaleX = controls.scaleX;
		});
	});

	scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
		scene.children.forEach((child) => {
			child.scaleY = controls.scaleY;
		});
	});

// 모니터링 폴더 추가
	const monitoringFolder = pane.addFolder({title: 'Monitoring', expanded: true});

	monitoringFolder.addBinding(controls, 'state', {readonly: true});
	monitoringFolder.addBinding(controls, 'currentIndex', {readonly: true});
	monitoringFolder.addBinding(controls, 'totalFrame', {readonly: true});
	monitoringFolder.addBinding(controls, 'segmentW', {readonly: true});
	monitoringFolder.addBinding(controls, 'segmentH', {readonly: true});

// 실시간 갱신 함수
	const refreshMonitoringControls = () => {
		const child = scene.children[0];
		controls.currentIndex = child.currentIndex;
		controls.totalFrame = child.totalFrame;
		controls.segmentW = child.segmentW;
		controls.segmentH = child.segmentH;
		controls.state = child.state;
		requestAnimationFrame(refreshMonitoringControls); // 반복 실행
	};
	requestAnimationFrame(refreshMonitoringControls); // 최초 실행
};
