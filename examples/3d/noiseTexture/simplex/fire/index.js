import * as RedGPU from "../../../../../dist/index.js?t=1767864574385";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
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

		material.diffuseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
			mainLogic: `
				let flame_uv = vec2<f32>(
					base_uv.x + sin(uniforms.time * uniforms.flickerSpeed + base_uv.y * 5.0) * uniforms.turbulence,
					base_uv.y + uniforms.time * uniforms.fireSpeed 
				);

				let main_noise = getSimplexNoiseByDimension(flame_uv, uniforms);

				let detail_factor = base_uv.y * 0.8;
				let detail_uv = vec2<f32>(
					base_uv.x * 2.0 + sin(uniforms.time * 3.0 + base_uv.y * 8.0) * 0.05 * detail_factor,
					base_uv.y * 1.5 + uniforms.time * uniforms.fireSpeed * 0.8
				);
				let detail_noise = getSimplexNoiseByDimension(detail_uv, uniforms) * 0.3;

				let flame_shape = smoothstep(1.0 - uniforms.fireHeight, 1.0, base_uv.y);

				let combined_noise = main_noise + detail_noise;
				let fire_intensity = combined_noise * flame_shape * uniforms.fireIntensity;

				let flame_heat = fire_intensity * (1.2 - base_uv.y * 0.5);

				let inner_flame = vec3<f32>(1.0, 0.8, 0.2);
				let outer_flame = vec3<f32>(1.0, 0.4, 0.1);
				let flame_edge = vec3<f32>(0.6, 0.1, 0.0);

				var fire_color: vec3<f32>;
				if (flame_heat > 0.6) {
					fire_color = mix(outer_flame, inner_flame, (flame_heat - 0.6) / 0.4);
				} else if (flame_heat > 0.2) {
					fire_color = mix(flame_edge, outer_flame, (flame_heat - 0.2) / 0.4);
				} else {
					fire_color = flame_edge * (flame_heat / 0.2);
				}

				let alpha = clamp(fire_intensity, 0.0, 1.0);
				let finalColor = vec4<f32>(fire_color, alpha);
			`,
			uniformStruct: `
				fireHeight: f32,
				fireIntensity: f32,
				flickerSpeed: f32,
				turbulence: f32,
				fireSpeed: f32,
			`,
			uniformDefaults: {
				fireHeight: 1,
				fireIntensity: 1.2,
				flickerSpeed: 1.0,
				turbulence: 0.1,
				fireSpeed: 0.8
			}
		});

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
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

const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767864574385');
	const {
		setSeparator,
		setDebugButtons
	} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1767864574385");
	setDebugButtons(redGPUContext);
	const pane = new Pane();

	setSeparator(pane, "Fire Presets");

	pane.addButton({title: '🕯️ Candle Flame'}).on('click', () => {
		targetNoiseTexture.frequency = 3.5;
		targetNoiseTexture.amplitude = 0.7;
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.35;
		targetNoiseTexture.lacunarity = 1.9;
		targetNoiseTexture.seed = 101;
		targetNoiseTexture.updateUniform('fireHeight', 0.6);
		targetNoiseTexture.updateUniform('fireIntensity', 0.8);
		targetNoiseTexture.updateUniform('flickerSpeed', 1.8);
		targetNoiseTexture.updateUniform('turbulence', 0.04);
		targetNoiseTexture.updateUniform('fireSpeed', 0.5);
		pane.refresh();
	});

	pane.addButton({title: '🔥 Torch Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 5.5;
		targetNoiseTexture.amplitude = 1.0;
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.45;
		targetNoiseTexture.lacunarity = 2.0;
		targetNoiseTexture.seed = 202;
		targetNoiseTexture.updateUniform('fireHeight', 0.75);
		targetNoiseTexture.updateUniform('fireIntensity', 1.1);
		targetNoiseTexture.updateUniform('flickerSpeed', 2.5);
		targetNoiseTexture.updateUniform('turbulence', 0.08);
		targetNoiseTexture.updateUniform('fireSpeed', 0.8);
		pane.refresh();
	});

	pane.addButton({title: '🌋 Volcano Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 7.0;
		targetNoiseTexture.amplitude = 1.4;
		targetNoiseTexture.octaves = 5;
		targetNoiseTexture.persistence = 0.65;
		targetNoiseTexture.lacunarity = 2.3;
		targetNoiseTexture.seed = 303;
		targetNoiseTexture.updateUniform('fireHeight', 0.85);
		targetNoiseTexture.updateUniform('fireIntensity', 1.6);
		targetNoiseTexture.updateUniform('flickerSpeed', 4.0);
		targetNoiseTexture.updateUniform('turbulence', 0.18);
		targetNoiseTexture.updateUniform('fireSpeed', 1.2);
		pane.refresh();
	});

	pane.addButton({title: '🏕️ Campfire'}).on('click', () => {
		targetNoiseTexture.frequency = 4.8;
		targetNoiseTexture.amplitude = 0.9;
		targetNoiseTexture.octaves = 4;
		targetNoiseTexture.persistence = 0.5;
		targetNoiseTexture.lacunarity = 2.1;
		targetNoiseTexture.seed = 404;
		targetNoiseTexture.updateUniform('fireHeight', 0.68);
		targetNoiseTexture.updateUniform('fireIntensity', 1.0);
		targetNoiseTexture.updateUniform('flickerSpeed', 2.2);
		targetNoiseTexture.updateUniform('turbulence', 0.07);
		targetNoiseTexture.updateUniform('fireSpeed', 0.7);
		pane.refresh();
	});

	pane.addButton({title: '🔥 Dragon Breath'}).on('click', () => {
		targetNoiseTexture.frequency = 9.0;
		targetNoiseTexture.amplitude = 1.8;
		targetNoiseTexture.octaves = 6;
		targetNoiseTexture.persistence = 0.7;
		targetNoiseTexture.lacunarity = 2.5;
		targetNoiseTexture.seed = 505;
		targetNoiseTexture.updateUniform('fireHeight', 0.9);
		targetNoiseTexture.updateUniform('fireIntensity', 2.2);
		targetNoiseTexture.updateUniform('flickerSpeed', 5.5);
		targetNoiseTexture.updateUniform('turbulence', 0.25);
		targetNoiseTexture.updateUniform('fireSpeed', 1.8);
		pane.refresh();
	});

	pane.addButton({title: '🌙 Spirit Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 2.8;
		targetNoiseTexture.amplitude = 0.6;
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.3;
		targetNoiseTexture.lacunarity = 1.7;
		targetNoiseTexture.seed = 606;
		targetNoiseTexture.updateUniform('fireHeight', 0.55);
		targetNoiseTexture.updateUniform('fireIntensity', 0.7);
		targetNoiseTexture.updateUniform('flickerSpeed', 1.2);
		targetNoiseTexture.updateUniform('turbulence', 0.03);
		targetNoiseTexture.updateUniform('fireSpeed', 0.3);
		pane.refresh();
	});

	pane.addButton({title: '⚡ Lightning Fire'}).on('click', () => {
		targetNoiseTexture.frequency = 12.0;
		targetNoiseTexture.amplitude = 1.5;
		targetNoiseTexture.octaves = 3;
		targetNoiseTexture.persistence = 0.8;
		targetNoiseTexture.lacunarity = 3.0;
		targetNoiseTexture.seed = 707;
		targetNoiseTexture.updateUniform('fireHeight', 0.8);
		targetNoiseTexture.updateUniform('fireIntensity', 1.8);
		targetNoiseTexture.updateUniform('flickerSpeed', 8.0);
		targetNoiseTexture.updateUniform('turbulence', 0.15);
		targetNoiseTexture.updateUniform('fireSpeed', 2.5);
		pane.refresh();
	});

	pane.addButton({title: '🍃 Gentle Breeze'}).on('click', () => {
		targetNoiseTexture.frequency = 3.0;
		targetNoiseTexture.amplitude = 0.5;
		targetNoiseTexture.octaves = 2;
		targetNoiseTexture.persistence = 0.25;
		targetNoiseTexture.lacunarity = 1.6;
		targetNoiseTexture.seed = 808;
		targetNoiseTexture.updateUniform('fireHeight', 0.5);
		targetNoiseTexture.updateUniform('fireIntensity', 0.6);
		targetNoiseTexture.updateUniform('flickerSpeed', 1.0);
		targetNoiseTexture.updateUniform('turbulence', 0.02);
		targetNoiseTexture.updateUniform('fireSpeed', 0.4);
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

	const fireParams = pane.addFolder({title: 'Fire Settings', expanded: true});

	const fireHeightBinding = pane.addBinding({fireHeight: 1}, 'fireHeight', {
		min: 0,
		max: 1,
		step: 0.01
	});
	fireHeightBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('fireHeight', ev.value);
	});

	const fireIntensityBinding = pane.addBinding({fireIntensity: 1.2}, 'fireIntensity', {
		min: 0,
		max: 3,
		step: 0.01
	});
	fireIntensityBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('fireIntensity', ev.value);
	});

	const flickerSpeedBinding = pane.addBinding({flickerSpeed: 1.0}, 'flickerSpeed', {
		min: 0,
		max: 10,
		step: 0.1
	});
	flickerSpeedBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('flickerSpeed', ev.value);
	});

	const turbulenceBinding = pane.addBinding({turbulence: 0.1}, 'turbulence', {
		min: 0,
		max: 0.5,
		step: 0.01
	});
	turbulenceBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('turbulence', ev.value);
	});

	const fireSpeedBinding = pane.addBinding({fireSpeed: 0.8}, 'fireSpeed', {
		min: 0,
		max: 2,
		step: 0.01
	});
	fireSpeedBinding.on('change', (ev) => {
		targetNoiseTexture.updateUniform('fireSpeed', ev.value);
	});

	pane.addBinding(targetNoiseTexture, 'noiseDimension', {
		options: RedGPU.Resource.NOISE_DIMENSION
	});

	const animation = pane.addFolder({title: 'Animation', expanded: true});
	animation.addBinding(testData, 'useAnimation');
};
