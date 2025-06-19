import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 55;
		controller.speedDistance = 2;

		const scene = new RedGPU.Display.Scene();

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 2;
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const geometry = new RedGPU.Primitive.Plane(redGPUContext, 50, 50, 1000, 1000);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		material.diffuseTexture = new RedGPU.Resource.NoiseSimplexNormalTexture(redGPUContext);
		material.normalTexture = material.diffuseTexture
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = 'none';
		mesh.setPosition(0, 0, 0);
		mesh.rotationX = 90;
		scene.addChild(mesh);

		const testData = {useAnimation: false};
		renderTestPane(redGPUContext, material.diffuseTexture, testData);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			if (testData.useAnimation) {
				if (material.diffuseTexture) material.diffuseTexture.time = time;
			}
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		errorMessage.style.color = "red";
		errorMessage.style.fontSize = "18px";
		errorMessage.style.padding = "20px";
		document.body.appendChild(errorMessage);
	}
);
const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	setSeparator(pane, "Presets");

	pane.addButton({title: '🏔️ Rocky Surface'}).on('click', () => {
		targetNoiseTexture.frequency = 8.0;
		targetNoiseTexture.amplitude = 0.3;    // 노말맵은 진폭이 작아야 함
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.6;
		targetNoiseTexture.lacunarity = 2.0;
		targetNoiseTexture.seed = 42;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Water Ripples'}).on('click', () => {
		targetNoiseTexture.frequency = 15.0;
		targetNoiseTexture.amplitude = 0.15;   // 물결은 부드럽게
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.3;
		targetNoiseTexture.lacunarity = 2.5;
		targetNoiseTexture.seed = 123;
		pane.refresh();
	});

	pane.addButton({title: '🌋 Lava Bumps'}).on('click', () => {
		targetNoiseTexture.frequency = 6.0;
		targetNoiseTexture.amplitude = 0.4;    // 용암은 거친 표면
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 1.8;
		targetNoiseTexture.seed = 999;
		pane.refresh();
	});

	pane.addButton({title: '👴 Skin Wrinkles'}).on('click', () => {
		targetNoiseTexture.frequency = 20.0;
		targetNoiseTexture.amplitude = 0.1;    // 피부는 미세한 디테일
		targetNoiseTexture.octaves = 6;
		targetNoiseTexture.persistence = 0.5;
		targetNoiseTexture.lacunarity = 2.2;
		targetNoiseTexture.seed = 666;
		pane.refresh();
	});

	pane.addButton({title: '🪨 Stone Bricks'}).on('click', () => {
		targetNoiseTexture.frequency = 12.0;
		targetNoiseTexture.amplitude = 0.25;   // 벽돌의 적당한 요철
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.4;
		targetNoiseTexture.lacunarity = 3.0;
		targetNoiseTexture.seed = 777;
		pane.refresh();
	});

	pane.addButton({title: '🏜️ Sand Dunes'}).on('click', () => {
		targetNoiseTexture.frequency = 4.0;
		targetNoiseTexture.amplitude = 0.2;    // 모래언덕의 부드러운 곡선
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.6;
		targetNoiseTexture.lacunarity = 1.5;
		targetNoiseTexture.seed = 333;
		pane.refresh();
	});

	pane.addButton({title: '🪸 Coral Bumps'}).on('click', () => {
		targetNoiseTexture.frequency = 25.0;
		targetNoiseTexture.amplitude = 0.35;   // 산호의 복잡한 표면
		targetNoiseTexture.octaves = 7;
		targetNoiseTexture.persistence = 0.8;
		targetNoiseTexture.lacunarity = 2.8;
		targetNoiseTexture.seed = 555;
		pane.refresh();
	});

	pane.addButton({title: '🌳 Tree Bark'}).on('click', () => {
		targetNoiseTexture.frequency = 10.0;
		targetNoiseTexture.amplitude = 0.3;    // 나무껍질의 거친 질감
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.65;
		targetNoiseTexture.lacunarity = 2.1;
		targetNoiseTexture.seed = 888;
		pane.refresh();
	});

	setSeparator(pane, "Parameters");

	pane.addBinding(targetNoiseTexture, 'frequency', {
		min: 0,
		max: 30,
		step: 0.01
	});

	pane.addBinding(targetNoiseTexture, 'amplitude', {
		min: 0,
		max: 10,
		step: 0.01
	});

	pane.addBinding(targetNoiseTexture, 'octaves', {
		min: 1,
		max: 8,
		step: 1
	});

	pane.addBinding(targetNoiseTexture, 'persistence', {
		min: 0,
		max: 1,
		step: 0.01
	});

	pane.addBinding(targetNoiseTexture, 'lacunarity', {
		min: 0,
		max: 10,
		step: 0.01
	});

	pane.addBinding(targetNoiseTexture, 'seed', {
		min: 0,
		max: 1000,
		step: 0.01
	});
	pane.addBinding(targetNoiseTexture, 'strength', {
		min: 0,
		max: 5,
		step: 0.01
	});


	pane.addBinding(targetNoiseTexture, 'noiseDimension', {
		options: RedGPU.Resource.NOISE_DIMENSION
	});

	const animation = pane.addFolder({title: 'Animation', expanded: true});
	animation.addBinding(testData, 'useAnimation');
	animation.addBinding(targetNoiseTexture, 'animationSpeed', {
		min: 0,
		max: 1,
		step: 0.001
	});
	animation.addBinding(targetNoiseTexture, 'animationX', {
		min: -1,
		max: 1,
		step: 0.001
	});
	animation.addBinding(targetNoiseTexture, 'animationY', {
		min: -1,
		max: 1,
		step: 0.001
	});
};
