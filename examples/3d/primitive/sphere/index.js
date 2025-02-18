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

		// Add Sphere primitives to the scene
		// 씬에 Sphere 프리미티브 추가
		createSpherePrimitive(redGPUContext, scene);

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

// Create Sphere primitives and add labels
// Sphere 프리미티브를 생성하고 라벨 추가
const createSpherePrimitive = (redGPUContext, scene) => {
	// Define materials for different rendering styles
	// 각기 다른 렌더링 스타일의 재질 정의
	const sphereMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')),

		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		// 초록 (와이어프레임)
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
		// 하늘색 (점 렌더링)
	};

	// Define Sphere properties and their positions
	// Sphere 속성 및 위치 정의
	const gap = 3; // Distance between Spheres (객체 간 간격)
	const sphereProperties = [
		{material: sphereMaterials.solid, position: [0, 0, 0]},
		{
			material: sphereMaterials.wireframe,
			position: [-gap, 0, 0],
			topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		},
		{material: sphereMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	// Default options for Sphere
	// Sphere의 기본 옵션 설정
	const defaultOptions = {
		radius: 1, // Sphere 반지름
		widthSegments: 16, // Sphere의 너비 세그먼트
		heightSegments: 16, // Sphere의 높이 세그먼트
		phiStart: 0, // 시작 각도
		phiLength: Math.PI * 2, // 진행 각도
		thetaStart: 0, // 세타 시작 각도
		thetaLength: Math.PI, // 세타 진행 각도
		uvSize: 1, // UV 크기
	};

	// Create a Sphere for each property and add to the scene
	// 속성에 따라 Sphere 생성 후 씬에 추가
	sphereProperties.forEach(({material, position, topology}) => {
		const sphere = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Sphere(
				redGPUContext,
				defaultOptions.radius,
				defaultOptions.widthSegments,
				defaultOptions.heightSegments,
				defaultOptions.phiStart,
				defaultOptions.phiLength,
				defaultOptions.thetaStart,
				defaultOptions.thetaLength,
				defaultOptions.uvSize
			),
			material
		);

		// Set rendering style (optional)
		// 렌더링 방식 설정 (선택 사항)
		if (topology) {
			sphere.primitiveState.topology = topology;
		}

		// Set Sphere position and add to the scene
		// Sphere의 위치를 설정하고 씬에 추가
		sphere.setPosition(...position);
		scene.addChild(sphere);

		// Add labels for each Sphere
		// 각 Sphere에 대한 라벨 추가
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
	descriptionLabel.text = 'Customizable Sphere Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -2.5, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

// Render a test pane to adjust Sphere properties in real time
// 실시간으로 Sphere 속성을 조정할 수 있는 테스트 창 렌더링
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Initial configuration for Sphere properties
	// Sphere 속성의 초기 설정값
	const config = {
		radius: 1,
		widthSegments: 16,
		heightSegments: 16,
		phiStart: 0,
		phiLength: Math.PI * 2,
		thetaStart: 0,
		thetaLength: Math.PI,
		uvSize: 1,
	};

	// Update Sphere geometry based on configuration
	// 설정값에 따라 Sphere 지오메트리 업데이트
	const updateSphereGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => child.geometry);

		const newGeometry = new RedGPU.Primitive.Sphere(
			redGPUContext,
			config.radius,
			config.widthSegments,
			config.heightSegments,
			config.phiStart,
			config.phiLength,
			config.thetaStart,
			config.thetaLength,
			config.uvSize
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
			updateSphereGeometry();
		});
	};

	// Add slider controls to adjust Sphere properties
	// Sphere 속성을 조정할 슬라이더 컨트롤 추가
	const sphereFolder = pane.addFolder({title: 'Sphere Properties', open: true});
	addBinding(sphereFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
	addBinding(sphereFolder, 'widthSegments', {min: 3, max: 64, step: 1});
	addBinding(sphereFolder, 'heightSegments', {min: 3, max: 64, step: 1});
	addBinding(sphereFolder, 'phiStart', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(sphereFolder, 'phiLength', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(sphereFolder, 'thetaStart', {min: 0, max: Math.PI, step: 0.1});
	addBinding(sphereFolder, 'thetaLength', {min: 0, max: Math.PI, step: 0.1});
	addBinding(sphereFolder, 'uvSize', {min: 0.1, max: 5, step: 0.1});
};
