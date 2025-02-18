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

		// Add TorusKnot primitives to the scene
		// 씬에 TorusKnot 프리미티브 추가
		createTorusKnotPrimitive(redGPUContext, scene);

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

// Create TorusKnot primitives and add labels
// TorusKnot 프리미티브를 생성하고 라벨 추가
const createTorusKnotPrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const torusNutMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'), // Wireframe (초록)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'), // Point Rendering (하늘색)
	};

	// Define TorusKnot properties and their positions
	// TorusKnot 속성 및 위치 정의
	const gap = 4; // Distance between TorusKnot (객체 간 간격)
	const torusNutProperties = [
		{material: torusNutMaterials.solid, position: [0, 0, 0]},
		{
			material: torusNutMaterials.wireframe,
			position: [-gap, 0, 0],
			topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		},
		{material: torusNutMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	// Default options for TorusKnot
	// TorusKnot의 기본 옵션 설정
	const defaultOptions = {
		radius: 1, // TorusKnot의 기본 반지름
		tube: 0.4, // 튜브의 반지름
		tubularSegments: 64, // 튜브의 세그먼트 수
		radialSegments: 8, // 반지름 세그먼트 수
		p: 2, // 비율 p
		q: 3, // 비율 q
	};

	// Create a TorusKnot for each property and add to the scene
	// 속성에 따라 TorusKnot 생성 후 씬에 추가
	torusNutProperties.forEach(({material, position, topology}) => {
		const torusNut = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.TorusKnot(
				redGPUContext,
				defaultOptions.radius,
				defaultOptions.tube,
				defaultOptions.tubularSegments,
				defaultOptions.radialSegments,
				defaultOptions.p,
				defaultOptions.q
			),
			material
		);

		// Set rendering style (optional)
		// 렌더링 방식 설정 (선택 사항)
		if (topology) {
			torusNut.primitiveState.topology = topology;
		}

		// Set TorusKnot position and add to the scene
		// TorusKnot의 위치를 설정하고 씬에 추가
		torusNut.setPosition(...position);
		scene.addChild(torusNut);

		// Add labels for each TorusKnot
		// 각 TorusKnot에 대한 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.setPosition(position[0], 2.5, position[2]); // 라벨 위치
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
	descriptionLabel.text = 'Customizable TorusKnot Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -3, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

// Render a test pane to adjust TorusKnot properties in real time
// 실시간으로 TorusKnot 속성을 조정할 수 있는 테스트 창 렌더링
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Initial configuration for TorusKnot properties
	// TorusKnot 속성의 초기 설정값
	const config = {
		radius: 1,
		tube: 0.4,
		tubularSegments: 64,
		radialSegments: 8,
		p: 2,
		q: 3,
	};

	// Update TorusKnot geometry based on configuration
	// 설정값에 따라 TorusKnot 지오메트리 업데이트
	const updateTorusKnotGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => child.geometry);

		const newGeometry = new RedGPU.Primitive.TorusKnot(
			redGPUContext,
			config.radius,
			config.tube,
			config.tubularSegments,
			config.radialSegments,
			config.p,
			config.q
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
			updateTorusKnotGeometry();
		});
	};

	// Add slider controls to adjust TorusKnot properties
	// TorusKnot 속성을 조정할 슬라이더 컨트롤 추가
	const torusNutFolder = pane.addFolder({title: 'TorusKnot Properties', open: true});
	addBinding(torusNutFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
	addBinding(torusNutFolder, 'tube', {min: 0.1, max: 2, step: 0.1});
	addBinding(torusNutFolder, 'tubularSegments', {min: 3, max: 128, step: 1});
	addBinding(torusNutFolder, 'radialSegments', {min: 3, max: 32, step: 1});
	addBinding(torusNutFolder, 'p', {min: 1, max: 10, step: .1});
	addBinding(torusNutFolder, 'q', {min: 1, max: 10, step: .1});
};
