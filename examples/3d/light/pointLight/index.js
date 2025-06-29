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
		view.axis = true;
		redGPUContext.addView(view);

		// Add a Point Light to the scene
		const light = createPointLight(scene);

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

// Function to create and add a Point Light
const createPointLight = (scene) => {
	// Default position, intensity, and color for the point light
	const intensity = 1;

	// Create and configure the light
	const light = new RedGPU.Light.PointLight('#fff', intensity);
	light.intensity = intensity;
	light.x = 4
	light.y = 4
	light.radius = 10
	scene.lightManager.addPointLight(light);

	return light;
};

// Function to create a sample mesh
const createSampleMeshes = (redGPUContext, scene) => {
	const material = new RedGPU.Material.PhongMaterial(redGPUContext);
	material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
		redGPUContext,
		'../../../assets/UV_Grid_Sm.jpg'
	);

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
		radius: light.radius,
		intensity: light.intensity,
		color: {r: light.color.r, g: light.color.g, b: light.color.b},
	};

	// Light folder
	const lightFolder = pane.addFolder({title: 'Point Light', expanded: true});
	lightFolder.addBinding(lightConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.x = evt.value
	});
	lightFolder.addBinding(lightConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.y = evt.value
	});
	lightFolder.addBinding(lightConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		light.z = evt.value
	});
	lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
		light.intensity = evt.value;
	});
	lightFolder.addBinding(lightConfig, 'radius', {min: 0, max: 20, step: 0.1}).on('change', (evt) => {
		light.radius = evt.value;
	});
	lightFolder
		.addBinding(lightConfig, 'color', {picker: 'inline', view: 'color', expanded: true})
		.on('change', (evt) => {
			const {r, g, b} = evt.value;
			light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});

};
