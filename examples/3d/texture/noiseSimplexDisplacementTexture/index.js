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
		material.diffuseTexture = new RedGPU.Resource.NoiseSimplexDisplacementTexture(redGPUContext);
		material.displacementTexture = material.diffuseTexture
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

	pane.addButton({title: '🏔️ Mountain Peaks'}).on('click', () => {
		targetNoiseTexture.frequency = 3.0;
		targetNoiseTexture.amplitude = 2.5;    // 디스플레이스먼트는 큰 진폭 필요
		targetNoiseTexture.octaves = 6;
		targetNoiseTexture.persistence = 0.65;
		targetNoiseTexture.lacunarity = 2.0;
		targetNoiseTexture.seed = 42;
		pane.refresh();
	});

	pane.addButton({title: '🌊 Ocean Waves'}).on('click', () => {
		targetNoiseTexture.frequency = 6.0;
		targetNoiseTexture.amplitude = 1.8;    // 파도의 높낮이
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.4;
		targetNoiseTexture.lacunarity = 2.5;
		targetNoiseTexture.seed = 123;
		pane.refresh();
	});

	pane.addButton({title: '🌋 Lava Flow'}).on('click', () => {
		targetNoiseTexture.frequency = 4.0;
		targetNoiseTexture.amplitude = 3.0;    // 용암의 거친 흐름
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.8;
		targetNoiseTexture.lacunarity = 1.8;
		targetNoiseTexture.seed = 999;
		pane.refresh();
	});

	pane.addButton({title: '👤 Facial Features'}).on('click', () => {
		targetNoiseTexture.frequency = 12.0;
		targetNoiseTexture.amplitude = 0.8;    // 얼굴의 미세한 변형
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.5;
		targetNoiseTexture.lacunarity = 2.2;
		targetNoiseTexture.seed = 666;
		pane.refresh();
	});

	pane.addButton({title: '🪨 Rock Formation'}).on('click', () => {
		targetNoiseTexture.frequency = 5.0;
		targetNoiseTexture.amplitude = 2.2;    // 암석층의 굴곡
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.6;
		targetNoiseTexture.lacunarity = 3.0;
		targetNoiseTexture.seed = 777;
		pane.refresh();
	});

	pane.addButton({title: '🏜️ Sand Waves'}).on('click', () => {
		targetNoiseTexture.frequency = 2.5;
		targetNoiseTexture.amplitude = 1.5;    // 모래언덕의 큰 흐름
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 1.5;
		targetNoiseTexture.seed = 333;
		pane.refresh();
	});

	pane.addButton({title: '🪸 Coral Spikes'}).on('click', () => {
		targetNoiseTexture.frequency = 15.0;
		targetNoiseTexture.amplitude = 1.2;    // 산호의 돌출부
		targetNoiseTexture.octaves = 6;
		targetNoiseTexture.persistence = 0.85;
		targetNoiseTexture.lacunarity = 2.8;
		targetNoiseTexture.seed = 555;
		pane.refresh();
	});

	pane.addButton({title: '🌳 Tree Trunk'}).on('click', () => {
		targetNoiseTexture.frequency = 8.0;
		targetNoiseTexture.amplitude = 1.0;    // 나무줄기의 변형
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.6;
		targetNoiseTexture.lacunarity = 2.1;
		targetNoiseTexture.seed = 888;
		pane.refresh();
	});
	pane.addButton({title: '🏗️ Concrete Cracks'}).on('click', () => {
		targetNoiseTexture.frequency = 20.0;
		targetNoiseTexture.amplitude = 0.4;    // 콘크리트 균열
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.8;
		targetNoiseTexture.lacunarity = 3.5;
		targetNoiseTexture.seed = 111;
		pane.refresh();
	});

	pane.addButton({title: '🪙 Hammered Metal'}).on('click', () => {
		targetNoiseTexture.frequency = 25.0;
		targetNoiseTexture.amplitude = 0.6;    // 두드린 금속의 요철
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.4;
		targetNoiseTexture.lacunarity = 2.8;
		targetNoiseTexture.seed = 222;
		pane.refresh();
	});

	pane.addButton({title: '🧊 Ice Formations'}).on('click', () => {
		targetNoiseTexture.frequency = 7.0;
		targetNoiseTexture.amplitude = 2.8;    // 얼음 결정의 큰 변형
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 2.0;
		targetNoiseTexture.seed = 444;
		pane.refresh();
	});

	pane.addButton({title: '🍄 Mushroom Caps'}).on('click', () => {
		targetNoiseTexture.frequency = 10.0;
		targetNoiseTexture.amplitude = 1.4;    // 버섯갓의 굴곡
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.6;
		targetNoiseTexture.lacunarity = 1.9;
		targetNoiseTexture.seed = 666;
		pane.refresh();
	});

	pane.addButton({title: '🌪️ Tornado Swirl'}).on('click', () => {
		targetNoiseTexture.frequency = 4.0;
		targetNoiseTexture.amplitude = 4.0;    // 토네이도의 강한 변형
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.9;
		targetNoiseTexture.lacunarity = 1.6;
		targetNoiseTexture.seed = 777;
		pane.refresh();
	});

	pane.addButton({title: '🦴 Bone Structure'}).on('click', () => {
		targetNoiseTexture.frequency = 18.0;
		targetNoiseTexture.amplitude = 0.8;    // 뼈의 미세한 굴곡
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.5;
		targetNoiseTexture.lacunarity = 2.4;
		targetNoiseTexture.seed = 999;
		pane.refresh();
	});

	pane.addButton({title: '🌍 Planet Surface'}).on('click', () => {
		targetNoiseTexture.frequency = 1.5;
		targetNoiseTexture.amplitude = 5.0;    // 행성 표면의 큰 기복
		targetNoiseTexture.octaves = 7;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 2.2;
		targetNoiseTexture.seed = 1234;
		pane.refresh();
	});

	pane.addButton({title: '🔥 Fire Distortion'}).on('click', () => {
		targetNoiseTexture.frequency = 30.0;
		targetNoiseTexture.amplitude = 0.5;    // 불꽃의 빠른 변형
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.3;
		targetNoiseTexture.lacunarity = 4.0;
		targetNoiseTexture.seed = 555;
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
