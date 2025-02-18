import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
	// Create a camera controller (Orbit type)
	const controller = new RedGPU.Camera.Camera2D(redGPUContext);

	// Create a scene and add a view with the camera controller
	const scene = new RedGPU.Display.Scene();
	const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
	redGPUContext.addView(view);

	const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24)
	// Sprite3D 10개를 원형 배치
	const spriteCount = 4; // 원에 배치될 Sprite3D 개수
	const centerX = view.screenRectObject.width / 2
	const centerY = view.screenRectObject.height / 2
	for (let i = 0; i < spriteCount; i++) {
		const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
		spriteSheet.x = centerX;
		spriteSheet.y = centerY;
		scene.addChild(spriteSheet); // 씬에 추가
	}

	// Create a renderer and start rendering
	const renderer = new RedGPU.Renderer(redGPUContext);
	const render = () => {
		// 원형 배치 업데이트
		const radius = 250; // 원형의 반지름
		const numChildren = view.scene.children.length;

		const centerX = view.screenRectObject.width / 2
		const centerY = view.screenRectObject.height / 2
		// 원형으로 배치하면서 애니메이션 적용
		view.scene.children.forEach((spriteSheet2D, index) => {
			const angle = (index / numChildren) * Math.PI * 2; // 각도를 계산
			const endX = centerX + Math.cos(angle) * radius; // 목표 X 좌표
			const endY = centerY + Math.sin(angle) * radius; // 목표 Z 좌표

			spriteSheet2D.x += (endX - spriteSheet2D.x) * 0.3
			spriteSheet2D.y += (endY - spriteSheet2D.y) * 0.3

		});
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
// Function to render Test Pane (for controls)
const renderTestPane = async (scene, redGPUContext) => {
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes");
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const controls = {
		testSpriteSheetInfo: 0
	}
	// 초기 컨트롤 값 설정
	const updateTestData = () => {
		const child = scene.children[0];
		// controls 데이터를 scene.children[0] 값으로 동기화
		controls.loop = child.loop;
		controls.frameRate = child.frameRate;
		controls.state = child.state; // SpriteSheet 상태
		controls.currentIndex = child.currentIndex || 0; // 현재 프레임 인덱스
		controls.totalFrame = child.totalFrame || 0; // 총 프레임 수
		controls.segmentW = child.segmentW || 0; // SpriteSheet 가로 세그먼트 수
		controls.segmentH = child.segmentH || 0; // SpriteSheet 세로 세그먼트 수
		controls.scaleX = child.scaleX; // x축 스케일
		controls.scaleY = child.scaleY; // y축 스케일
		controls.width = child.width;
		controls.height = child.height;
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
	const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet2D', expanded: true});
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
	const scaleFolder = pane.addFolder({title: 'SpriteSheet2D', expanded: true});
	// scaleFolder.addBinding(controls, 'width', {min: 0, max: 256, step: 0.1}).on('change', () => {
	//     scene.children.forEach((child) => {
	//         child.width = controls.width;
	//     });
	// });
	//
	// scaleFolder.addBinding(controls, 'height', {min: 0, max: 256, step: 0.1}).on('change', () => {
	//     scene.children.forEach((child) => {
	//         child.height = controls.height;
	//     });
	// });
	scaleFolder.addBinding(controls, 'scaleX', {min: 0, max: 1, step: 0.1}).on('change', () => {
		scene.children.forEach((child) => {
			child.scaleX = controls.scaleX;
		});
	});

	scaleFolder.addBinding(controls, 'scaleY', {min: 0, max: 1, step: 0.1}).on('change', () => {
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
