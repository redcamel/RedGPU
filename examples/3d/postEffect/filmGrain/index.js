import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 3
		controller.speedDistance = 0.1
		controller.tilt = 0

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		scene.lightManager.addDirectionalLight(directionalLightTest)
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',);

		const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext)
		view.postEffectManager.addEffect(effect)

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			effect.update(time * 0.001);
		};
		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext)

	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view
	const cubeTexture =
		new RedGPU.Resource.CubeTexture(redGPUContext, [
			"../../../assets/skybox/px.jpg",
			"../../../assets/skybox/nx.jpg",
			"../../../assets/skybox/py.jpg",
			"../../../assets/skybox/ny.jpg",
			"../../../assets/skybox/pz.jpg",
			"../../../assets/skybox/nz.jpg",
		])
	view.iblTexture = cubeTexture
	view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
		}
	)
}

const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const view = redGPUContext.viewList[0];
	const TEST_STATE = {
		FilmGrain: true,
		filmGrainIntensity: view.postEffectManager.getEffectAt(0).filmGrainIntensity,
		filmGrainResponse: view.postEffectManager.getEffectAt(0).filmGrainResponse,
		filmGrainScale: view.postEffectManager.getEffectAt(0).filmGrainScale
	};

	const updateEffect = () => {
		const effect = view.postEffectManager.getEffectAt(0);
		if (!effect) return;
		effect.filmGrainIntensity = TEST_STATE.filmGrainIntensity;
		effect.filmGrainResponse = TEST_STATE.filmGrainResponse;
		effect.filmGrainScale = TEST_STATE.filmGrainScale;
	};

	const applyPreset = (presetName) => {
		const effect = view.postEffectManager.getEffectAt(0);
		if (effect) {
			effect.applyPreset(RedGPU.PostEffect.FilmGrain[presetName]);
			TEST_STATE.filmGrainIntensity = effect.filmGrainIntensity;
			TEST_STATE.filmGrainResponse = effect.filmGrainResponse;
			TEST_STATE.filmGrainScale = effect.filmGrainScale;
			pane.refresh();
		}
	};

	const folder = pane.addFolder({title: 'Film Grain', expanded: true});

	folder.addBinding(TEST_STATE, 'FilmGrain').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
			effect.filmGrainIntensity = TEST_STATE.filmGrainIntensity;
			effect.filmGrainResponse = TEST_STATE.filmGrainResponse;
			effect.filmGrainScale = TEST_STATE.filmGrainScale;
			view.postEffectManager.addEffect(effect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		intensityControl.disabled = !v.value;
		responseControl.disabled = !v.value;
		scaleControl.disabled = !v.value;
	});

	const intensityControl = folder.addBinding(TEST_STATE, 'filmGrainIntensity', {
		min: 0.0,
		max: 1.0,
		step: 0.01,
		label: 'Intensity'
	}).on('change', updateEffect);

	const responseControl = folder.addBinding(TEST_STATE, 'filmGrainResponse', {
		min: 0.0,
		max: 2.0,
		step: 0.1,
		label: 'Response'
	}).on('change', updateEffect);

	const scaleControl = folder.addBinding(TEST_STATE, 'filmGrainScale', {
		min: 0.1,
		max: 5.0,
		step: 0.1,
		label: 'Scale'
	}).on('change', updateEffect);

	// 프리셋 버튼들 추가
	const presetFolder = folder.addFolder({title: 'Presets', expanded: true});

	presetFolder.addButton({title: 'Subtle'}).on('click', () => applyPreset('SUBTLE'));
	presetFolder.addButton({title: 'Medium'}).on('click', () => applyPreset('MEDIUM'));
	presetFolder.addButton({title: 'Heavy'}).on('click', () => applyPreset('HEAVY'));
	presetFolder.addButton({title: 'Vintage'}).on('click', () => applyPreset('VINTAGE'));
};
