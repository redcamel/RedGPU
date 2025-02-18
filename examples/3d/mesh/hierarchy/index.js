import * as RedGPU from "../../../../dist";

// 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.speedDistance = 0.3
		// 씬 및 뷰 생성
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true; // 그리드 활성화
		view.axis = true; // 축 표시 활성화
		redGPUContext.addView(view);

		// 하이라키 구조 생성
		const parentMesh = createParentMesh(redGPUContext, scene);
		const childMesh = createChildMesh(redGPUContext, parentMesh);

		// 렌더러 생성 및 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)
		};
		renderer.start(redGPUContext, render);

		// 테스트 패널 생성 (실시간 제어)
		renderTestPane(redGPUContext, parentMesh, childMesh);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// 부모 메쉬 생성 함수
const createParentMesh = (redGPUContext, scene) => {
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
	const parentMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	parentMesh.setPosition(0, 0, 0); // 부모 메쉬 위치 설정
	scene.addChild(parentMesh);

	return parentMesh;
};

// 자식 메쉬 생성 함수
const createChildMesh = (redGPUContext, parentMesh) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
	const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	childMesh.setPosition(3, 3, 0); // 자식 메쉬의 상대 위치
	parentMesh.addChild(childMesh); // 부모 메쉬에 자식 메쉬 추가

	return childMesh;
};

// 테스트 패널 렌더링 함수
const renderTestPane = async (redGPUContext, parentMesh, childMesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// 부모 메쉬 설정
	const parentConfig = {
		x: parentMesh.x,
		y: parentMesh.y,
		z: parentMesh.z,
		rotationX: parentMesh.rotationX,
		rotationY: parentMesh.rotationY,
		rotationZ: parentMesh.rotationZ,
		scaleX: parentMesh.scaleX,
		scaleY: parentMesh.scaleY,
		scaleZ: parentMesh.scaleZ,
	};

	// 자식 메쉬 설정
	const childConfig = {
		x: childMesh.x,
		y: childMesh.y,
		z: childMesh.z,
		rotationX: childMesh.rotationX,
		rotationY: childMesh.rotationY,
		rotationZ: childMesh.rotationZ,
		scaleX: childMesh.scaleX,
		scaleY: childMesh.scaleY,
		scaleZ: childMesh.scaleZ,
	};

	// 부모 메쉬 설정 패널
	const parentFolder = pane.addFolder({title: 'Parent Mesh', expanded: true});
	parentFolder.addBinding(parentConfig, 'x', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => parentMesh.setPosition(evt.value, parentConfig.y, parentConfig.z));
	parentFolder.addBinding(parentConfig, 'y', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => parentMesh.setPosition(parentConfig.x, evt.value, parentConfig.z));
	parentFolder.addBinding(parentConfig, 'z', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => parentMesh.setPosition(parentConfig.x, parentConfig.y, evt.value));
	parentFolder.addBinding(parentConfig, 'rotationX', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => parentMesh.setRotation(evt.value, parentConfig.rotationY, parentConfig.rotationZ));
	parentFolder.addBinding(parentConfig, 'rotationY', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => parentMesh.setRotation(parentConfig.rotationX, evt.value, parentConfig.rotationZ));
	parentFolder.addBinding(parentConfig, 'rotationZ', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => parentMesh.setRotation(parentConfig.rotationX, parentConfig.rotationY, evt.value));
	parentFolder.addBinding(parentConfig, 'scaleX', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => parentMesh.setScale(evt.value, parentConfig.scaleY, parentConfig.scaleZ));
	parentFolder.addBinding(parentConfig, 'scaleY', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => parentMesh.setScale(parentConfig.scaleX, evt.value, parentConfig.scaleZ));
	parentFolder.addBinding(parentConfig, 'scaleZ', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => parentMesh.setScale(parentConfig.scaleX, parentConfig.scaleY, evt.value));

	// 자식 메쉬 설정 패널
	const childFolder = pane.addFolder({title: 'Child Mesh', expanded: true});
	childFolder.addBinding(childConfig, 'x', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => childMesh.setPosition(evt.value, childConfig.y, childConfig.z));
	childFolder.addBinding(childConfig, 'y', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => childMesh.setPosition(childConfig.x, evt.value, childConfig.z));
	childFolder.addBinding(childConfig, 'z', {
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (evt) => childMesh.setPosition(childConfig.x, childConfig.y, evt.value));
	childFolder.addBinding(childConfig, 'rotationX', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => childMesh.setRotation(evt.value, childConfig.rotationY, childConfig.rotationZ));
	childFolder.addBinding(childConfig, 'rotationY', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => childMesh.setRotation(childConfig.rotationX, evt.value, childConfig.rotationZ));
	childFolder.addBinding(childConfig, 'rotationZ', {
		min: 0,
		max: 360,
		step: 0.01
	}).on('change', (evt) => childMesh.setRotation(childConfig.rotationX, childConfig.rotationY, evt.value));
	childFolder.addBinding(childConfig, 'scaleX', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => childMesh.setScale(evt.value, childConfig.scaleY, childConfig.scaleZ));
	childFolder.addBinding(childConfig, 'scaleY', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => childMesh.setScale(childConfig.scaleX, evt.value, childConfig.scaleZ));
	childFolder.addBinding(childConfig, 'scaleZ', {
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (evt) => childMesh.setScale(childConfig.scaleX, childConfig.scaleY, evt.value));
};
