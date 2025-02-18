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
		controller.tilt = 0;
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
		console.error("Initialization failed:", failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		// 실패 원인 표시
		document.body.appendChild(errorMessage);
	}
);

// Create and add basic primitives to the scene
// 기본 프리미티브 객체를 씬에 생성 및 추가
const createPrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const circleMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
		// 빨강 (기본)
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		// 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
		// 하늘색 (점 렌더링)
	};

	// Create circle geometry
	// 원(Circle) 지오메트리 생성
	const circleGeometry = new RedGPU.Primitive.Circle(redGPUContext, 1, 64);
	// 반지름 1, 세그먼트 64

	// Create and position circles
	// 원 생성 및 배치
	const circles = [
		{material: circleMaterials.solid, position: [0, 0, 0]},
		{material: circleMaterials.wireframe, position: [-3, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
		{material: circleMaterials.point, position: [3, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	circles.forEach(({material, position, topology}) => {
		const circle = new RedGPU.Display.Mesh(redGPUContext, circleGeometry, material);

		if (topology) {
			circle.primitiveState.topology = topology;
			// 렌더링 방식 변경
		}

		circle.setPosition(...position);
		// 위치 설정
		scene.addChild(circle);
		// 씬에 추가

		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(position[0], 1.5, position[1]);
		topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
		topologyName.color = '#ffffff';
		topologyName.fontSize = 26;
		topologyName.useBillboard = true;
		topologyName.useBillboardPerspective = true;
		scene.addChild(topologyName);
	});

	const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
	topologyName.setPosition(0, -2, 0);
	topologyName.text = 'Customizable Circle Primitive';
	topologyName.color = '#ffffff';
	topologyName.fontSize = 36;
	topologyName.fontWeight = 500;
	topologyName.useBillboard = true;
	topologyName.useBillboardPerspective = true;
	scene.addChild(topologyName);
};

// Create and configure test pane for Circle adjustments
// 원(Circle) 조정을 위한 테스트 패널 생성 및 설정
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Configuration for circle properties
	// 원 속성 설정값
	const config = {
		radius: 1,
		// 반지름
		segments: 64,
		// 세그먼트 수 (원 곡선의 정밀도)
	};

	// Helper function to recreate geometry and update scene
	// 지오메트리를 재생성하고 씬을 업데이트하는 헬퍼 함수
	const updateCircleGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children;
		// 씬의 메쉬들 가져오기

		const newGeometry = new RedGPU.Primitive.Circle(
			redGPUContext,
			config.radius,
			config.segments
		);

		meshList.forEach((mesh) => (mesh.geometry = newGeometry));
		// 메쉬의 지오메트리 교체
	};

	// Utility function for adding binding to config parameters
	// 설정값과 슬라이더를 바인딩하는 유틸리티 함수
	const addBinding = (folder, property, params) => {
		folder.addBinding(config, property, params).on('change', (v) => {
			config[property] = v.value;
			// 설정값 갱신
			updateCircleGeometry();
			// 지오메트리 업데이트
		});
	};

	// Add folder for circle dimensions
	// 원 크기 조정을 위한 폴더 추가
	const circleFolder = pane.addFolder({title: 'Circle Properties', open: true});
	addBinding(circleFolder, 'radius', {min: 0.1, max: 5, step: 0.1});
	// 반지름 설정
	addBinding(circleFolder, 'segments', {min: 3, max: 128, step: 1});
	// 세그먼트 설정
};
