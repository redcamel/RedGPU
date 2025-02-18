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

		// Add Cylinder primitives to the scene
		// 씬에 Cylinder 프리미티브 추가
		createCylinderPrimitive(redGPUContext, scene);

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

// Create Cylinder primitives and add labels
// Cylinder 프리미티브를 생성하고 라벨 추가
const createCylinderPrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const cylinderMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),
		// 빨강 (기본)
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		// 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
		// 하늘색 (점 렌더링)
	};

	// Define Cylinder properties and their positions
	// Cylinder 속성 및 위치 정의
	const gap = 4; // Distance between Cylinders (객체 간 간격)
	const cylinderProperties = [
		{material: cylinderMaterials.solid, position: [0, 0, 0]},
		{
			material: cylinderMaterials.wireframe,
			position: [-gap, 0, 0],
			topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		},
		{material: cylinderMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	// Default options for Cylinder
	// Cylinder의 기본 옵션 설정
	const defaultOptions = {
		radiusTop: 1,
		radiusBottom: 1.0,
		height: 1.0,
		radialSegments: 8,
		heightSegments: 8,
		openEnded: false,
		thetaStart: 0,
		thetaLength: Math.PI * 2,
	};

	// Create a Cylinder for each property and add to the scene
	// 속성에 따라 Cylinder 생성 후 씬에 추가
	cylinderProperties.forEach(({material, position, topology}) => {
		const cylinder = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Cylinder(
				redGPUContext,
				defaultOptions.radiusTop,
				defaultOptions.radiusBottom,
				defaultOptions.height,
				defaultOptions.radialSegments,
				defaultOptions.heightSegments,
				defaultOptions.openEnded,
				defaultOptions.thetaStart,
				defaultOptions.thetaLength
			),
			material
		);

		// Set rendering style (optional)
		// 렌더링 방식 설정 (선택 사항)
		if (topology) {
			cylinder.primitiveState.topology = topology;
		}

		// Set Cylinder position and add to the scene
		// Cylinder의 위치를 설정하고 씬에 추가
		cylinder.setPosition(...position);
		scene.addChild(cylinder);

		// Add labels for each Cylinder
		// 각 Cylinder에 대한 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.setPosition(position[0], 1.5, position[2]);
		label.text = topology || 'Solid';
		label.color = '#ffffff';
		label.fontSize = 26;
		label.useBillboard = true;
		label.useBillboardPerspective = true;
		scene.addChild(label);
	});

	// Add a central description label
	// 중앙 설명 라벨 추가
	const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
	descriptionLabel.text = 'Customizable Cylinder Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -2, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

// Render a test pane to adjust Cylinder properties in real time
// 실시간으로 Cylinder 속성을 조정할 수 있는 테스트 창 렌더링
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Initial configuration for Cylinder properties
	// Cylinder 속성의 초기 설정값
	const config = {
		radiusTop: 1,
		radiusBottom: 1.0,
		height: 1.0,
		radialSegments: 8,
		heightSegments: 8,
		openEnded: false,
		thetaStart: 0,
		thetaLength: Math.PI * 2,
	};

	// Update Cylinder geometry based on configuration
	// 설정값에 따라 Cylinder 지오메트리 업데이트
	const updateCylinderGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => child.geometry);

		const newGeometry = new RedGPU.Primitive.Cylinder(
			redGPUContext,
			config.radiusTop,
			config.radiusBottom,
			config.height,
			config.radialSegments,
			config.heightSegments,
			config.openEnded,
			config.thetaStart,
			config.thetaLength
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
			updateCylinderGeometry();
		});
	};

	// Add slider controls to adjust Cylinder properties
	// Cylinder 속성을 조정할 슬라이더 컨트롤 추가
	const cylinderFolder = pane.addFolder({title: 'Cylinder Properties', open: true});
	addBinding(cylinderFolder, 'radiusTop', {min: 0.1, max: 2, step: 0.1});
	addBinding(cylinderFolder, 'radiusBottom', {min: 0.1, max: 2, step: 0.1});
	addBinding(cylinderFolder, 'height', {min: 0.5, max: 5, step: 0.1});
	addBinding(cylinderFolder, 'radialSegments', {min: 3, max: 128, step: 1});
	addBinding(cylinderFolder, 'heightSegments', {min: 1, max: 64, step: 1});
	addBinding(cylinderFolder, 'openEnded', {view: 'boolean'});
	addBinding(cylinderFolder, 'thetaStart', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(cylinderFolder, 'thetaLength', {min: 0, max: Math.PI * 2, step: 0.1});
};
