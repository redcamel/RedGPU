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
		controller.speedDistance = 0.3
		// Setup scene and view
		// 씬과 뷰 설정
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add Torus primitives to the scene
		// 씬에 Torus 프리미티브 추가
		createTorusPrimitive(redGPUContext, scene);

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

// Create Torus primitives and add labels
// Torus 프리미티브를 생성하고 라벨 추가
const createTorusPrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const torusMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'), // 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'), // 하늘색 (점 렌더링)
	};

	// Define Torus properties and their positions
	// Torus 속성 및 위치 정의
	const gap = 4; // Distance between Torus (객체 간 간격)
	const torusProperties = [
		{material: torusMaterials.solid, position: [0, 0, 0]},
		{material: torusMaterials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
		{material: torusMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	// Default options for Torus
	// Torus의 기본 옵션 설정
	const defaultOptions = {
		radius: 1, // Torus 반지름
		thickness: 0.5, // Torus 두께
		radialSubdivisions: 16, // Torus의 원형 세그먼트 수
		bodySubdivisions: 16, // Torus의 본체 세그먼트 수
		startAngle: 0, // 시작 각도
		endAngle: Math.PI * 2, // 종료 각도
	};

	// Create a Torus for each property and add to the scene
	// 속성에 따라 Torus 생성 후 씬에 추가
	torusProperties.forEach(({material, position, topology}) => {
		const torus = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Torus(
				redGPUContext,
				defaultOptions.radius,
				defaultOptions.thickness,
				defaultOptions.radialSubdivisions,
				defaultOptions.bodySubdivisions,
				defaultOptions.startAngle,
				defaultOptions.endAngle
			),
			material
		);

		// Set rendering style (optional)
		// 렌더링 방식 설정 (선택 사항)
		if (topology) {
			torus.primitiveState.topology = topology;
		}

		// Set Torus position and add to the scene
		// Torus의 위치를 설정하고 씬에 추가
		torus.setPosition(...position);
		scene.addChild(torus);

		// Add labels for each Torus
		// 각 Torus에 대한 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.setPosition(position[0], 2, position[2]); // 라벨 위치
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
	descriptionLabel.text = 'Customizable Torus Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -2.5, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

// Render a test pane to adjust Torus properties in real time
// 실시간으로 Torus 속성을 조정할 수 있는 테스트 창 렌더링
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Initial configuration for Torus properties
	// Torus 속성의 초기 설정값
	const config = {
		radius: 1,
		thickness: 0.5,
		radialSubdivisions: 16,
		bodySubdivisions: 16,
		startAngle: 0,
		endAngle: Math.PI * 2,
	};

	// Update Torus geometry based on configuration
	// 설정값에 따라 Torus 지오메트리 업데이트
	const updateTorusGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => child.geometry);

		const newGeometry = new RedGPU.Primitive.Torus(
			redGPUContext,
			config.radius,
			config.thickness,
			config.radialSubdivisions,
			config.bodySubdivisions,
			config.startAngle,
			config.endAngle
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
			updateTorusGeometry();
		});
	};

	// Add slider controls to adjust Torus properties
	// Torus 속성을 조정할 슬라이더 컨트롤 추가
	const torusFolder = pane.addFolder({title: 'Torus Properties', open: true});
	addBinding(torusFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
	addBinding(torusFolder, 'thickness', {min: 0.1, max: 2, step: 0.1});
	addBinding(torusFolder, 'radialSubdivisions', {min: 3, max: 64, step: 1});
	addBinding(torusFolder, 'bodySubdivisions', {min: 3, max: 64, step: 1});
	addBinding(torusFolder, 'startAngle', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(torusFolder, 'endAngle', {min: 0, max: Math.PI * 2, step: 0.1});
};
