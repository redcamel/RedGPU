import * as RedGPU from "../../../../dist/index.js";

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

		// Add Plane primitives to the scene
		// 씬에 Plane 프리미티브 추가
		createPlanePrimitive(redGPUContext, scene);

		// Start the renderer
		// 렌더러 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
			// Logic to run every frame (optional)
			// 매 프레임 실행될 로직 (필요시 추가)
		});

		// Render the test control pane
		// 테스트 제어 패널 렌더링
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error("Initialization failed:", failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		// 실패 원인을 화면에 표시
		document.body.appendChild(errorMessage);
	}
);

// Create Plane primitives and add labels
// Plane 프리미티브를 생성하고 라벨 추가
const createPlanePrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const planeMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),

		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		// 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
		// 하늘색 (점 렌더링)
	};

	// Define Plane properties and their positions
	// Plane 속성 및 위치 정의
	const gap = 5; // Distance between Planes (객체 간 간격)
	const planeProperties = [
		{material: planeMaterials.solid, position: [0, 0, 0]},
		{material: planeMaterials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
		{material: planeMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	// Default options for Plane
	// Plane의 기본 옵션 설정
	const defaultOptions = {
		width: 4, // Plane 폭
		height: 4, // Plane 높이
		widthSegments: 10, // Plane 너비 세그먼트
		heightSegments: 10, // Plane 높이 세그먼트
	};

	// Create a Plane for each property and add to the scene
	// 속성에 따라 Plane 생성 후 씬에 추가
	planeProperties.forEach(({material, position, topology}) => {
		const plane = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Plane(
				redGPUContext,
				defaultOptions.width,
				defaultOptions.height,
				defaultOptions.widthSegments,
				defaultOptions.heightSegments
			),
			material
		);

		// Set rendering style (optional)
		// 렌더링 방식 설정 (선택 사항)
		if (topology) {
			plane.primitiveState.topology = topology;
		}

		// Set Plane position and add to the scene
		// Plane의 위치를 설정하고 씬에 추가
		plane.setPosition(...position);
		scene.addChild(plane);

		// Add labels for each Plane
		// 각 Plane에 대한 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.setPosition(position[0], 3, position[2]); // 라벨 위치
		label.text = topology || 'Solid'; // 라벨 내용
		label.color = '#ffffff';
		label.fontSize = 26;
		label.useBillboard = true;
		label.useBillboardPerspective = true;
		scene.addChild(label);
	});

	// Add a central description label
	// 중앙 설명 라벨 추가
	const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
	descriptionLabel.text = 'Customizable Plane Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -3, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

// Render a test pane to adjust Plane properties in real time
// 실시간으로 Plane 속성을 조정할 수 있는 테스트 창 렌더링
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Initial configuration for Plane properties
	// Plane 속성의 초기 설정값
	const config = {
		width: 4,
		height: 4,
		widthSegments: 10,
		heightSegments: 10,
	};

	// Update Plane geometry based on configuration
	// 설정값에 따라 Plane 지오메트리 업데이트
	const updatePlaneGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => child.geometry);

		const newGeometry = new RedGPU.Primitive.Plane(
			redGPUContext,
			config.width,
			config.height,
			config.widthSegments,
			config.heightSegments
		);

		// Replace geometry in all meshes
		// 씬 내 모든 메쉬의 지오메트리를 변경
		meshList.forEach(mesh => mesh.geometry = newGeometry);
	};

	// Helper function to add slider bindings
	// 슬라이더와 설정값을 바인딩하는 헬퍼 함수
	const addBinding = (folder, property, params) => {
		folder.addBinding(config, property, params).on('change', (v) => {
			config[property] = v.value;
			updatePlaneGeometry();
		});
	};

	// Add slider controls to adjust Plane properties
	// Plane 속성을 조정할 슬라이더 컨트롤 추가
	const planeFolder = pane.addFolder({title: 'Plane Properties', open: true});
	addBinding(planeFolder, 'width', {min: 1, max: 10, step: 1});
	addBinding(planeFolder, 'height', {min: 1, max: 10, step: 1});
	addBinding(planeFolder, 'widthSegments', {min: 1, max: 64, step: 1});
	addBinding(planeFolder, 'heightSegments', {min: 1, max: 64, step: 1});
};
