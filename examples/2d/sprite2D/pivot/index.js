import * as RedGPU from "../../../../dist/index.js";

// 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.Camera2D(redGPUContext);

		// 씬 및 뷰 생성
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// 하이라키 구조 생성
		const parentSprite2D = createParentSprite2D(redGPUContext, scene);
		const childSprite2D = createChildSprite2D(redGPUContext, parentSprite2D);

		// 렌더러 생성 및 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
		};
		renderer.start(redGPUContext, render);

		// 테스트 패널 생성 (실시간 제어)
		renderTestPane(redGPUContext, parentSprite2D, childSprite2D);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// 부모 메쉬 생성 함수
const createParentSprite2D = (redGPUContext, scene) => {
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));
	const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
	sprite2D.setSize(100, 100);
	sprite2D.x = redGPUContext.screenRectObject.width / 2;
	sprite2D.y = redGPUContext.screenRectObject.height / 2;
	scene.addChild(sprite2D);

	const pivotPoint = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff'));
	pivotPoint.setSize(10, 10);
	sprite2D.addChild(pivotPoint);
	return sprite2D;
};

// 자식 메쉬 생성 함수
const createChildSprite2D = (redGPUContext, parent) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
	const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
	sprite2D.setSize(50, 50);
	sprite2D.x = 100
	sprite2D.y = 100
	parent.addChild(sprite2D);
	const pivotPoint = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff'));
	pivotPoint.setSize(10, 10);
	sprite2D.addChild(pivotPoint);
	return sprite2D;
};

// 테스트 패널 렌더링 함수
const renderTestPane = async (redGPUContext, parent, child) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const maxW = redGPUContext.screenRectObject.width;
	const maxH = redGPUContext.screenRectObject.height;

	// 부모 메쉬 설정 패널
	const parentFolder = pane.addFolder({title: 'Parent Sprite2D', expanded: true});
	parentFolder.addBinding(parent, 'pivotX', {
		min: -50,
		max: 50,
		step: 0.1
	}).on('change', (evt) => {
		parent.pivotX = evt.value
		parent.getChildAt(0).x = parent.pivotX
	});
	parentFolder.addBinding(parent, 'pivotY', {
		min: -50,
		max: 50,
		step: 0.1
	}).on('change', (evt) => {
		parent.pivotY = evt.value
		parent.getChildAt(0).y = parent.pivotY
	});
	parentFolder.addBinding(parent, 'x', {
		min: 0,
		max: maxW,
		step: 0.1
	}).on('change', (evt) => parent.x = evt.value);
	parentFolder.addBinding(parent, 'y', {
		min: 0,
		max: maxH,
		step: 0.1
	}).on('change', (evt) => parent.y = evt.value);
	parentFolder.addBinding(parent, 'width', {
		min: 0,
		max: parent.width * 2,
		step: 0.1
	}).on('change', (evt) => parent.width = evt.value);
	parentFolder.addBinding(parent, 'height', {
		min: 0,
		max: parent.height * 2,
		step: 0.1
	}).on('change', (evt) => parent.height = evt.value);
	parentFolder.addBinding(parent, 'rotation', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => parent.rotation = evt.value);

	parentFolder.addBinding(parent, 'scaleX', {
		min: 0,
		max: 5,
		step: 0.1
	}).on('change', (evt) => parent.scaleX = evt.value);
	parentFolder.addBinding(parent, 'scaleY', {
		min: 0,
		max: 5,
		step: 0.1
	}).on('change', (evt) => parent.scaleY = evt.value);

	// 자식 메쉬 설정 패널
	const childFolder = pane.addFolder({title: 'Child Sprite2D', expanded: true});
	childFolder.addBinding(child, 'pivotX', {
		min: -50,
		max: 50,
		step: 0.1
	}).on('change', (evt) => {
		child.pivotX = evt.value
		child.getChildAt(0).x = child.pivotX
	});
	childFolder.addBinding(child, 'pivotY', {
		min: -50,
		max: 50,
		step: 0.1
	}).on('change', (evt) => {
		child.pivotY = evt.value
		child.getChildAt(0).y = child.pivotY
	});
	childFolder.addBinding(child, 'x', {
		min: -100,
		max: 100,
		step: 0.1
	}).on('change', (evt) => child.x = evt.value);
	childFolder.addBinding(child, 'y', {
		min: -100,
		max: 100,
		step: 0.1
	}).on('change', (evt) => child.y = evt.value);
	childFolder.addBinding(child, 'width', {
		min: 0,
		max: child.width * 2,
		step: 0.1
	}).on('change', (evt) => child.width = evt.value);
	childFolder.addBinding(child, 'height', {
		min: 0,
		max: child.height * 2,
		step: 0.1
	}).on('change', (evt) => child.height = evt.value);
	childFolder.addBinding(child, 'rotation', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => child.rotation = evt.value);

	childFolder.addBinding(child, 'scaleX', {
		min: 0,
		max: 5,
		step: 0.1
	}).on('change', (evt) => child.scaleX = evt.value);
	childFolder.addBinding(child, 'scaleY', {
		min: 0,
		max: 5,
		step: 0.1
	}).on('change', (evt) => child.scaleY = evt.value);
};
