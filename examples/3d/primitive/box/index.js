import * as RedGPU from "../../../../dist";

// Create and append a canvas
// 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize RedGPU
// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0
		controller.speedDistance = 0.3
		// Setup scene and view
		// 씬과 뷰 설정
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add primitives to the scene
		// 씬에 프리미티브 추가
		createPrimitive(redGPUContext, scene);

		// Start renderer
		// 렌더러 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			// Optional per-frame logic
			// 매 프레임 실행할 로직 (생략 가능)
		});

		// Render test pane
		// 테스트 패널 렌더링
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error('Initialization failed:', failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason; // 실패 원인 표시
		document.body.appendChild(errorMessage);
	}
);

// Create and add basic primitives to the scene
// 기본 프리미티브 객체를 씬에 생성 및 추가
const createPrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const boxMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'), // 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'), // 하늘색 (점 렌더링)
	};

	// Create box geometry
	// 박스 지오메트리 생성
	const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 2, 2, 2);

	// Create and position boxes
	// 박스 생성 및 배치
	const boxes = [
		{material: boxMaterials.solid, position: [0, 0, 0]},
		{material: boxMaterials.wireframe, position: [-2, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
		{material: boxMaterials.point, position: [2, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	boxes.forEach(({material, position, topology}) => {
		const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, material);

		if (topology) {
			box.primitiveState.topology = topology; // 렌더링 방식 변경
		}

		box.setPosition(...position); // 위치 설정
		scene.addChild(box); // 씬에 추가

		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(position[0], 1.25, position[1]);
		topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST
		topologyName.color = '#ffffff';
		topologyName.useBillboard = true
		topologyName.useBillboardPerspective = true
		scene.addChild(topologyName);

	});
	const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
	topologyName.setPosition(0, -1.5, 0);
	topologyName.text = 'Customizable Box Primitive'
	topologyName.color = '#ffffff';
	topologyName.fontSize = 36;
	topologyName.fontWeight = 500;
	topologyName.useBillboard = true
	topologyName.useBillboardPerspective = true
	scene.addChild(topologyName);
};

// Create and configure test pane for Box adjustments
// 박스 조정을 위한 테스트 패널 생성 및 설정
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Configuration for box properties
	// 박스 속성 설정값
	const config = {
		width: 1,
		height: 1,
		depth: 1,
		segmentX: 2,
		segmentY: 2,
		segmentZ: 2,
	};

	// Helper function to recreate geometry and update scene
	// 지오메트리를 재생성하고 씬을 업데이트하는 헬퍼 함수
	const updateBoxGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children; // 씬의 메쉬들 가져오기

		const newGeometry = new RedGPU.Primitive.Box(
			redGPUContext,
			config.width,
			config.height,
			config.depth,
			config.segmentX,
			config.segmentY,
			config.segmentZ
		);

		meshList.forEach((mesh) => (mesh.geometry = newGeometry)); // 메쉬의 지오메트리 교체
	};

	// Utility function for adding binding to config parameters
	// 설정값과 슬라이더를 바인딩하는 유틸리티 함수
	const addBinding = (folder, property, params) => {
		folder.addBinding(config, property, params).on('change', (v) => {
			config[property] = v.value; // 설정값 갱신
			updateBoxGeometry(); // 지오메트리 업데이트
		});
	};

	// Add folder for box dimensions
	// 박스 크기 조정을 위한 폴더 추가
	const boxFolder = pane.addFolder({title: 'Box Dimensions', open: true});
	addBinding(boxFolder, 'width', {min: 0.1, max: 5, step: 0.1}); // 너비 설정
	addBinding(boxFolder, 'height', {min: 0.1, max: 5, step: 0.1}); // 높이 설정
	addBinding(boxFolder, 'depth', {min: 0.1, max: 5, step: 0.1}); // 깊이 설정
	addBinding(boxFolder, 'segmentX', {min: 0, max: 15, step: 1}); // 세그먼트 X축
	addBinding(boxFolder, 'segmentY', {min: 0, max: 15, step: 1}); // 세그먼트 Y축
	addBinding(boxFolder, 'segmentZ', {min: 0, max: 15, step: 1}); // 세그먼트 Z축
};
