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
		view.grid = true;
		view.skybox = createSkybox(redGPUContext);
		redGPUContext.addView(view);

		const dLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(dLight);

		// Add a SpotLight to the scene
		const light = createSpotLight(scene);

		// Add a sample mesh to the scene
		const mesh = createSampleMeshes(redGPUContext, scene);

		// Create a renderer and start rendering
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// Frame-based logic (add updates here as needed)
		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
		renderTestPaneWithLightControl(redGPUContext, light);
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

	// Create and configure the light
	const light = new RedGPU.Light.SpotLight('#fff', intensity);
	light.intensity = intensity;
	light.x = 4
	light.y = 8
	light.radius = 10
	scene.lightManager.addSpotLight(light);

	return light;
};

// Function to create a sample mesh
const createSampleMeshes = (redGPUContext, scene) => {
	const material = new RedGPU.Material.PhongMaterial(redGPUContext);
	material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
		redGPUContext,
		'../../../assets/UV_Grid_Sm.jpg'
	);

	const plane = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Plane(redGPUContext),
		material
		// new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
	)
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

// Function to render Test Pane with light controls
const renderTestPaneWithLightControl = async (redGPUContext, light) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Light configuration including position, intensity, and color
	const lightConfig = {
		x: light.position[0],
		y: light.position[1],
		z: light.position[2],
		directionX: light.directionX,
		directionY: light.directionY,
		directionZ: light.directionZ,
		radius: light.radius,
		innerCutoff: light.innerCutoff,
		outerCutoff: light.outerCutoff,
		intensity: light.intensity,
		color: {r: light.color.r, g: light.color.g, b: light.color.b},
	};

	// Light folder
	const lightFolder = pane.addFolder({title: 'Spot Light', expanded: true});
	lightFolder.addBinding(lightConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.x = evt.value
	});
	lightFolder.addBinding(lightConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.y = evt.value
	});
	lightFolder.addBinding(lightConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.z = evt.value
	});

	lightFolder.addBinding(lightConfig, 'directionX', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.directionX = evt.value
	});

	lightFolder.addBinding(lightConfig, 'directionY', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.directionY = evt.value
	});

	lightFolder.addBinding(lightConfig, 'directionZ', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.directionZ = evt.value
	});
	lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
		light.intensity = evt.value;
	});
	lightFolder.addBinding(lightConfig, 'radius', {min: 0, max: 20, step: 0.1}).on('change', (evt) => {
		light.radius = evt.value;
	});

	lightFolder.addBinding(lightConfig, 'innerCutoff', {min: 0, max: 60, step: 0.1}).on('change', (evt) => {
		light.innerCutoff = evt.value;
	});

	lightFolder.addBinding(lightConfig, 'outerCutoff', {min: 0, max: 60, step: 0.1}).on('change', (evt) => {
		light.outerCutoff = evt.value;
	});
	lightFolder
		.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color', expanded: true})
		.on('change', (evt) => {
			const {r, g, b} = evt.value;
			light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});

};
