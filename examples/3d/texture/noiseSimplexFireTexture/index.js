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
		view.skybox = createSkybox(redGPUContext);
		redGPUContext.addView(view);

		const geometry = new RedGPU.Primitive.Plane(redGPUContext, 50, 50, 1000, 1000);
		// const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 5, 32,32,32);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		material.diffuseTexture = new RedGPU.Resource.NoiseFireTexture(redGPUContext);

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = 'none';
		mesh.setPosition(0, 0, 0);

		scene.addChild(mesh);

		const testData = {useAnimation: true};
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
const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	setSeparator(pane, "Fire Presets");

	pane.addButton({title: '🕯️ Candle Flame'}).on('click', () => {
		targetNoiseTexture.frequency = 3.5;
		targetNoiseTexture.amplitude = 0.7;
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.35;
		targetNoiseTexture.lacunarity = 1.9;
		targetNoiseTexture.seed = 101;
		targetNoiseTexture.fireHeight = 0.6;
		targetNoiseTexture.fireIntensity = 0.8;
		targetNoiseTexture.flickerSpeed = 1.8;
		targetNoiseTexture.turbulence = 0.04;
		targetNoiseTexture.fireSpeed = 0.5; // 촛불 - 천천히 상승
		pane.refresh();
	});

	pane.addButton({title: '🔥 Torch Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 5.5;
		targetNoiseTexture.amplitude = 1.0;
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.45;
		targetNoiseTexture.lacunarity = 2.0;
		targetNoiseTexture.seed = 202;
		targetNoiseTexture.fireHeight = 0.75;
		targetNoiseTexture.fireIntensity = 1.1;
		targetNoiseTexture.flickerSpeed = 2.5;
		targetNoiseTexture.turbulence = 0.08;
		targetNoiseTexture.fireSpeed = 0.8; // 횃불 - 보통 속도
		pane.refresh();
	});

	pane.addButton({title: '🌋 Volcano Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 7.0;
		targetNoiseTexture.amplitude = 1.4;
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.65;
		targetNoiseTexture.lacunarity = 2.3;
		targetNoiseTexture.seed = 303;
		targetNoiseTexture.fireHeight = 0.85;
		targetNoiseTexture.fireIntensity = 1.6;
		targetNoiseTexture.flickerSpeed = 4.0;
		targetNoiseTexture.turbulence = 0.18;
		targetNoiseTexture.fireSpeed = 1.2; // 화산 - 빠르게 분출
		pane.refresh();
	});

	pane.addButton({title: '🏕️ Campfire'}).on('click', () => {
		targetNoiseTexture.frequency = 4.8;
		targetNoiseTexture.amplitude = 0.9;
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.5;
		targetNoiseTexture.lacunarity = 2.1;
		targetNoiseTexture.seed = 404;
		targetNoiseTexture.fireHeight = 0.68;
		targetNoiseTexture.fireIntensity = 1.0;
		targetNoiseTexture.flickerSpeed = 2.2;
		targetNoiseTexture.turbulence = 0.07;
		targetNoiseTexture.fireSpeed = 0.7; // 캠프파이어 - 편안한 속도
		pane.refresh();
	});

	pane.addButton({title: '🔥 Dragon Breath'}).on('click', () => {
		targetNoiseTexture.frequency = 9.0;
		targetNoiseTexture.amplitude = 1.8;
		targetNoiseTexture.octaves = 6;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 2.5;
		targetNoiseTexture.seed = 505;
		targetNoiseTexture.fireHeight = 0.9;
		targetNoiseTexture.fireIntensity = 2.2;
		targetNoiseTexture.flickerSpeed = 5.5;
		targetNoiseTexture.turbulence = 0.25;
		targetNoiseTexture.fireSpeed = 1.8; // 용의 숨 - 매우 빠름
		pane.refresh();
	});

	pane.addButton({title: '🌙 Spirit Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 2.8;
		targetNoiseTexture.amplitude = 0.6;
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.3;
		targetNoiseTexture.lacunarity = 1.7;
		targetNoiseTexture.seed = 606;
		targetNoiseTexture.fireHeight = 0.55;
		targetNoiseTexture.fireIntensity = 0.7;
		targetNoiseTexture.flickerSpeed = 1.2;
		targetNoiseTexture.turbulence = 0.03;
		targetNoiseTexture.fireSpeed = 0.3; // 영혼불 - 신비롭게 천천히
		pane.refresh();
	});

	pane.addButton({title: '⚡ Lightning Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 12.0;
		targetNoiseTexture.amplitude = 1.5;
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.8;
		targetNoiseTexture.lacunarity = 3.0;
		targetNoiseTexture.seed = 707;
		targetNoiseTexture.fireHeight = 0.8;
		targetNoiseTexture.fireIntensity = 1.8;
		targetNoiseTexture.flickerSpeed = 8.0;
		targetNoiseTexture.turbulence = 0.15;
		targetNoiseTexture.fireSpeed = 2.5; // 번개불 - 극도로 빠름
		pane.refresh();
	});

	pane.addButton({title: '🍃 Gentle Breeze'}).on('click', () => {
		targetNoiseTexture.frequency = 3.0;
		targetNoiseTexture.amplitude = 0.5;
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.25;
		targetNoiseTexture.lacunarity = 1.6;
		targetNoiseTexture.seed = 808;
		targetNoiseTexture.fireHeight = 0.5;
		targetNoiseTexture.fireIntensity = 0.6;
		targetNoiseTexture.flickerSpeed = 1.0;
		targetNoiseTexture.turbulence = 0.02;
		targetNoiseTexture.fireSpeed = 0.4; // 부드러운 바람 - 느리고 우아함
		pane.refresh();
	});

	setSeparator(pane, "Fire Parameters");

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

	// Fire specific parameters
	const fireParams = pane.addFolder({title: 'Fire Settings', expanded: true});

	fireParams.addBinding(targetNoiseTexture, 'fireHeight', {
		min: 0,
		max: 1,
		step: 0.01
	});

	fireParams.addBinding(targetNoiseTexture, 'fireIntensity', {
		min: 0,
		max: 3,
		step: 0.01
	});

	fireParams.addBinding(targetNoiseTexture, 'flickerSpeed', {
		min: 0,
		max: 10,
		step: 0.1
	});

	fireParams.addBinding(targetNoiseTexture, 'turbulence', {
		min: 0,
		max: 0.5,
		step: 0.01
	});
	fireParams.addBinding(targetNoiseTexture, 'fireSpeed', {
		min: 0,
		max: 2,
		step: 0.01
	});

	pane.addBinding(targetNoiseTexture, 'noiseDimension', {
		options: RedGPU.Resource.NOISE_DIMENSION
	});

	const animation = pane.addFolder({title: 'Animation', expanded: true});
	animation.addBinding(testData, 'useAnimation');

};
