import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
	// Create a camera controller (Orbit type)
	const controller = new RedGPU.Camera.Camera2D(redGPUContext);

	// Create a scene and add a view with the camera controller
	const scene = new RedGPU.Display.Scene();
	scene.backgroundColor.r = 255
	scene.backgroundColor.g = 0
	scene.backgroundColor.b = 0
	scene.useBackgroundColor = true;
	const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
	redGPUContext.addView(view);

	// Sprite3D 10개를 원형 배치
	const spriteCount = 10; // 원에 배치될 Sprite3D 개수
	const radius = 200; // 원의 반지름
	const centerX = redGPUContext.screenRectObject.width / 2;
	const centerY = redGPUContext.screenRectObject.height / 2;

	for (let i = 0; i < spriteCount; i++) {
		const angle = (i / spriteCount) * Math.PI * 2; // 각도 계산
		const x = centerX + Math.cos(angle) * radius; // x 좌표
		const y = centerY + Math.sin(angle) * radius; // z 좌표

		const TextField2D = new RedGPU.Display.TextField2D(redGPUContext);
		TextField2D.text = TextField2D.name.split(' ').join('<br/>');
		TextField2D.x = Math.floor(x);
		TextField2D.y = Math.floor(y);
		scene.addChild(TextField2D); // 씬에 추가
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

	const controls = {};

	// 기본 스타일 초기값 설정
	const BASE_STYLES = {
		padding: 0,
		background: 'transparent',
		color: '#fff',
		fontFamily: 'Arial',
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'normal',
		letterSpacing: 0,
		wordBreak: 'break-all',
		verticalAlign: 'middle',
		textAlign: 'center',
		borderRadius: '10px',
		lineHeight: 1.4,
		border: '',
		boxShadow: 'none',
		boxSizing: 'border-box',
		filter: '',
	};

	const OPTIONS = {
		fontFamily: ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'],
		fontWeight: ['normal', 'bold', 'bolder', 'lighter'],
		fontStyle: ['normal', 'italic', 'oblique'],
		wordBreak: ['normal', 'break-all', 'keep-all', 'break-word'],
		verticalAlign: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'],
		textAlign: ['left', 'right', 'center', 'justify'],
		background: ['transparent', '#000', '#fff', '#f00', '#0f0', '#00f'],
		color: ['#fff', '#000', '#f00', '#0f0', '#00f'],
		boxSizing: ['content-box', 'border-box'],
	};

	// 초기 상태 업데이트
	const updateTestData = () => {
		const child = scene.children[0];

		// controls 데이터를 scene.children[0] 값으로 동기화
		controls.useBillboardPerspective = child.useBillboardPerspective;
		controls.useBillboard = child.useBillboard;
		// controls.billboardFixedScale = child.billboardFixedScale;
		controls.scaleX = child.scaleX; // x축 스케일
		controls.scaleY = child.scaleY; // y축 스케일
		controls.scaleZ = child.scaleZ; // z축 스케일
		controls.rotation = child.rotation; // z축 스케일
		controls.useSmoothing = child.useSmoothing; // z축 스케일
		// UI를 갱신하여 변경 사항 반영
		pane.refresh();
		// controls에 BASE_STYLES 데이터 바인딩
		Object.keys(BASE_STYLES).forEach((key) => {
			controls[key] = child[key];
		});

		pane.refresh(); // UI 갱신
	};

	updateTestData();
	console.log(controls)
	updateTestData()
	const TextField2DFolder = pane.addFolder({title: 'TextField2D', expanded: true});
	TextField2DFolder.addBinding(controls, 'useSmoothing').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useSmoothing = evt.value
		});
	});
	setSeparator(pane);

// 스케일 컨트롤 폴더 추가
	const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});

	scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.scaleX = evt.value
		});
	});
	scaleFolder.addBinding(controls, 'rotation', {min: 0, max: 360, step: 0.1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.rotation = evt.value
		});
	});
	scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.scaleY = evt.value
		});
	});
	// TextField2D 스타일 변경 UI 폴더 추가
	const styleFolder = pane.addFolder({title: 'Styles', expanded: true});

	styleFolder.addBinding(controls, 'fontSize', {min: 12, max: 50, step: 1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.fontSize = evt.value
		});
	});
	styleFolder.addBinding(controls, 'padding', {min: 0, max: 32, step: 1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.padding = evt.value
		});
	});
	// 각 스타일 속성을 UI 컨트롤로 추가
	Object.keys(OPTIONS).forEach((key) => {
		styleFolder.addBinding(controls, key, {
			options: OPTIONS[key].reduce((obj, value) => {
				obj[value] = value; // 배열 값을 키와 값이 동일한 객체로 변환
				return obj;
			}, {}),
		}).on('change', (evt) => {
			scene.children.forEach((child) => {
				child[key] = evt.value;
			});
		});

	});

	setSeparator(pane);
};
