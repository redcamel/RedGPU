import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = 0
		controller.speedDistance = 0.3
		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Create and add Primitive objects to the scene
		// 기본 Primitive 객체를 생성하여 씬에 추가
		createPrimitive(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// Logic for each frame
			// 매 프레임마다 실행될 로직
		};
		renderer.start(redGPUContext, render);

		// Test pane for UI setup
		// UI 설정을 위한 테스트 패널 추가
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);
// Function to create and add Primitive objects to the scene
// 기본 Primitive 객체를 생성하여 씬에 추가하는 함수
const createPrimitive = (redGPUContext, scene) => {
	// Define standard material for normal objects
	// 기본 객체를 위한 표준 Material 정의
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))

	// Define wireframe material for wireframe objects
	// 와이어프레임 객체를 위한 Material 정의
	const wireframeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');

	// Define point material for point objects
	// 점(Point) 객체를 위한 Material 정의
	const pointMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'); // 파랑색 설정 (Optional)

	// Shared position variables for alignment
	// 정렬을 위한 중심 위치 설정
	const gap = 3.0; // 객체 간 간격
	const centerX = 0; // X축 중심 기준
	const startY = 2.5; // 첫 번째 라인의 높이
	const wireframeY = -0.5; // 두 번째 라인의 높이 설정
	const pointY = -3.5; // 세 번째 라인의 높이 설정 (점 라인)

	// Create and add normal objects to the scene
	// 기본 객체들을 씬에 추가
	const primitives = [
		{constructor: RedGPU.Primitive.Box, args: [redGPUContext, 1, 1, 1, 2, 2, 2]},
		{constructor: RedGPU.Primitive.Circle, args: [redGPUContext, 1, 64]},
		{constructor: RedGPU.Primitive.Cylinder, args: [redGPUContext, 0.5, 1, 2, 64, 64]},
		{constructor: RedGPU.Primitive.Plane, args: [redGPUContext, 2, 2, 10, 10]},
		{constructor: RedGPU.Primitive.Sphere, args: [redGPUContext, 1, 32, 32]},
		{constructor: RedGPU.Primitive.Torus, args: [redGPUContext, 0.7, 0.3, 32, 32]},
		{constructor: RedGPU.Primitive.TorusKnot, args: [redGPUContext, 0.5, 0.2, 128, 64, 2, 3]}
	];

	{
		// Add primitives with standard material to the first line
		// 첫 번째 라인으로 표준 Material을 가진 객체 추가
		primitives.forEach((primitive, index) => {
			const geometry = new primitive.constructor(...primitive.args);
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, startY, 0);
			// Set position of the object
			// 객체의 위치 설정
			scene.addChild(mesh);
			// Add normal object to the scene
			// 기본 객체를 씬에 추가

			const primitiveName = new RedGPU.Display.TextField3D(redGPUContext);
			primitiveName.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, startY + 2, 0);
			primitiveName.text = primitive.constructor.name
			primitiveName.color = '#ffffff';
			primitiveName.fontSize = 32;
			primitiveName.useBillboard = true
			primitiveName.useBillboardPerspective = true
			scene.addChild(primitiveName);
		});
		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(centerX - gap * (primitives.length) / 2 - 1, startY, 0);
		topologyName.text = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST
		topologyName.color = '#ffffff';
		topologyName.fontSize = 32;
		topologyName.useBillboard = true
		topologyName.useBillboardPerspective = true
		scene.addChild(topologyName);
	}

	{
		// Add primitives with wireframe material to the second line
		// 두 번째 라인으로 와이어프레임 Material을 가진 객체 추가
		primitives.forEach((primitive, index) => {
			const geometry = new primitive.constructor(...primitive.args);
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, wireframeMaterial);
			mesh.primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST; // 와이어프레임으로 렌더
			mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, wireframeY, 0);
			// Set position of the wireframe object
			// 와이어프레임 객체의 위치 설정
			scene.addChild(mesh);
			// Add wireframe object to the scene
			// 와이어프레임 객체를 씬에 추가
		});
		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(centerX - gap * (primitives.length) / 2 - 1, wireframeY, 0);
		topologyName.text = RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		topologyName.color = '#ffffff';
		topologyName.fontSize = 32;
		topologyName.useBillboard = true
		topologyName.useBillboardPerspective = true
		scene.addChild(topologyName);
	}

	{
		// Add primitives with point material to the third line
		// 세 번째 라인으로 점(Point) Material을 가진 객체 추가
		primitives.forEach((primitive, index) => {
			const geometry = new primitive.constructor(...primitive.args);
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, pointMaterial);
			mesh.primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST; // 점(Point) 렌더링 활성화
			mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, pointY, 0);
			// Set position of the point object
			// 점 객체의 위치 설정
			scene.addChild(mesh);
			// Add point object to the scene
			// 점 객체를 씬에 추가
		});
		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(centerX - gap * (primitives.length) / 2 - 1, pointY, 0);
		topologyName.text = RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST
		topologyName.color = '#ffffff';
		topologyName.fontSize = 32;
		topologyName.useBillboard = true
		topologyName.useBillboardPerspective = true
		scene.addChild(topologyName);
	}
};

// Function to render Test Pane (for development or debugging purposes)
// 테스트 패널 렌더링 함수 (개발 또는 디버그용)
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setRedGPUTest_pane} = await import("../../../exampleHelper/createExample/panes/index.js");

	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, false);
};
