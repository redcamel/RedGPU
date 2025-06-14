import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 25
		controller.speedDistance = 0.5;

		// Create a scene and add a view with the camera controller
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		// view.grid = true;
		view.skybox = createSkybox(redGPUContext);
		redGPUContext.addView(view);

		// Add SpotLights to the scene
		const lights = createSpotLight(scene);

		// Add a sample mesh to the scene
		const mesh = createSampleMeshes(redGPUContext, scene);

		// Create a renderer and start rendering
		const renderer = new RedGPU.Renderer(redGPUContext);
		let time = 0;
		const render = () => {
			time += 0.016; // ~60fps 기준

			// 모든 스포트라이트 애니메이션
			lights.forEach((lightData) => {
				const { light, originalPos, rotationSpeed, orbitRadius } = lightData;

				// 원운동 계산
				const angle = time * rotationSpeed;


				// 라이트 방향을 중심점을 향하도록 설정 (약간의 랜덤성 추가)
				const centerX = originalPos.x + Math.sin(angle * 0.3) * 2;
				const centerZ = originalPos.z + Math.cos(angle * 0.5) * 2;
				light.lookAt(centerX, 0, centerZ);
			});
		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
	},
	(failReason) => {
		// Handle initialization failure
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSkybox = (redGPUContext) => {
	// Define texture paths for skybox
	// 스카이박스 텍스처 경로 정의
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg", // Positive X
		"../../../assets/skybox/nx.jpg", // Negative X
		"../../../assets/skybox/py.jpg", // Positive Y
		"../../../assets/skybox/ny.jpg", // Negative Y
		"../../../assets/skybox/pz.jpg", // Positive Z
		"../../../assets/skybox/nz.jpg", // Negative Z
	];

	const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);

	const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
	return skybox;
};

const createSpotLight = (scene) => {
	// Default position, intensity, and color for the point light
	const intensity = 2;

	// 그리드 설정
	const gridSize = 32; // 32x32 그리드
	const spacing = 4; // 조명 간의 간격
	const height = 3; // 조명의 높이

	const lights = []; // 모든 라이트 정보를 저장할 배열

	// 그리드로 조명 배치
	for(let row = 0; row < gridSize; row++) {
		for(let col = 0; col < gridSize; col++) {
			const light = new RedGPU.Light.SpotLight('#fff', intensity);
			light.intensity = intensity;

			// 그리드 위치 계산 (중앙을 기준으로 배치)
			const x = col * spacing - ((gridSize - 1) * spacing) / 2;
			const z = row * spacing - ((gridSize - 1) * spacing) / 2;
			const y = height;

			// 조명 위치 설정
			light.x = x;
			light.y = y;
			light.z = z;
			light.radius = 5;
			light.innerCutoff = 10;
			light.outerCutoff = Math.random() * 30 + 11;
			light.color.r = Math.floor(Math.random() * 255);
			light.color.g = Math.floor(Math.random() * 255);
			light.color.b = Math.floor(Math.random() * 255);

			// 초기 방향 설정
			light.lookAt(x, 0, z);

			scene.lightManager.addSpotLight(light);

			// 애니메이션을 위한 추가 정보 저장
			lights.push({
				light: light,
				originalPos: { x, y, z }, // 원래 위치 (원운동의 중심)
				rotationSpeed: 0.5 + Math.random() * 1.0, // 각각 다른 회전 속도
				orbitRadius: 1.0 + Math.random() * 2.0 // 각각 다른 궤도 반지름
			});
		}
	}

	return lights;
};

// Function to create a sample mesh
const createSampleMeshes = (redGPUContext, scene) => {
	const material = new RedGPU.Material.PhongMaterial(redGPUContext);
	material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
		redGPUContext,
		'../../../assets/UV_Grid_Sm.jpg'
	);

	const plane = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Plane(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext, '#fff'))
	plane.setScale(200)
	plane.rotationX = 90
	plane.y = -0.01
	scene.addChild(plane)

	const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 32);

	const gridSize = 4; // 4x4 그리드 크기
	const spacing = 5; // 구체 간의 간격

	// 그리드 순회하며 구체 생성 및 배치
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

			// 각 구체의 위치를 계산
			const x = col * spacing - ((gridSize - 1) * spacing) / 2;
			const z = row * spacing - ((gridSize - 1) * spacing) / 2;
			const y = 0; // 구체는 평면 위에 위치

			// 구체의 위치 설정
			mesh.setPosition(x, y, z);

			// 장면(scene)에 추가
			scene.addChild(mesh);
		}
	}
};
