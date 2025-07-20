import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 135;
		controller.speedDistance = 1.5;

		const scene = new RedGPU.Display.Scene();
		const directionalLight = new RedGPU.Light.DirectionalLight();

		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		// 🌊 물 메시 생성
		const water = new RedGPU.Display.Water(redGPUContext, 80, 80, 800);
		water.setPosition(0, 0, 0);

		// 🌊 재질 설정


		scene.addChild(water);

		// 🌊 애니메이션 데이터
		const animationData = {
			useAnimation: true,
			autoRotateWaves: true,
			intensityModulation: true,
			speedModulation: true
		};

		renderWaterPane(redGPUContext, water, animationData);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {

		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = `
			<h2>🚨 초기화 실패</h2>
			<p style="color: red; font-size: 16px;">${failReason}</p>
		`;
		errorMessage.style.cssText = `
			color: white;
			background: rgba(255,0,0,0.1);
			padding: 20px;
			border-radius: 8px;
			margin: 20px;
			border: 2px solid red;
		`;
		document.body.appendChild(errorMessage);
	}
);

const renderWaterPane = async (redGPUContext, water, animationData) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setSeparator } = await import("../../../exampleHelper/createExample/panes/index.js");

	const pane = new Pane({ title: '🌊 Water Simulation Controls' });

	// 🌊 프리셋 섹션
	setSeparator(pane, "🌊 Water Presets");

	pane.addButton({ title: '🏖️ Calm Ocean' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.calmOcean);
		pane.refresh();
	});

	pane.addButton({ title: '🌊 Gentle Waves' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.gentleWaves);
		pane.refresh();
	});

	pane.addButton({ title: '⛈️ Stormy Ocean' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.stormyOcean);
		pane.refresh();
	});

	pane.addButton({ title: '🏞️ Lake Ripples' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.lakeRipples);
		pane.refresh();
	});

	pane.addButton({ title: '🌀 Tsunami Waves' }).on('click', () => {
		water.waveAmplitude = [2.0, 1.5, 1.0, 0.8];
		water.waveWavelength = [20.0, 15.0, 10.0, 5.0];
		water.waveSpeed = [3.0, 2.8, 3.5, 4.0];
		water.waveSteepness = [0.6, 0.5, 0.4, 0.3];
		water.waveScale = 0.05;
		water.waterLevel = 0.5;
		pane.refresh();
	});

	pane.addButton({ title: '🏄‍♂️ Surfing Waves' }).on('click', () => {
		water.waveAmplitude = [1.5, 1.0, 0.7, 0.3];
		water.waveWavelength = [12.0, 8.0, 5.0, 3.0];
		water.waveSpeed = [2.2, 2.0, 2.8, 3.2];
		water.waveSteepness = [0.5, 0.4, 0.3, 0.2];
		water.setFlowDirectionByDegrees(45);
		water.waveScale = 0.08;
		water.waterLevel = 0.0;
		pane.refresh();
	});

	// 🎯 전역 파라미터 섹션
	setSeparator(pane, "🎯 Global Parameters");

	pane.addBinding(water, 'waveScale', {
		label: 'Wave Scale',
		min: 0.01,
		max: 0.5,
		step: 0.001
	});

	pane.addBinding(water, 'waterLevel', {
		label: 'Water Level',
		min: -5.0,
		max: 5.0,
		step: 0.01
	});

	// 🌊 Wave 1 섹션
	const wave1Folder = pane.addFolder({ title: '🌊 Wave 1 (Primary)', expanded: false });

	wave1Folder.addBinding(water, 'amplitude1', {
		label: 'Amplitude',
		min: 0,
		max: 3,
		step: 0.01
	});

	wave1Folder.addBinding(water, 'wavelength1', {
		label: 'Wavelength',
		min: 0.5,
		max: 30,
		step: 0.1
	});

	wave1Folder.addBinding(water, 'speed1', {
		label: 'Speed',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave1Folder.addBinding(water, 'steepness1', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	// wave1Folder.addBinding(water, 'direction1', {
	// 	label: 'Direction',
	// 	x: { min: -1, max: 1, step: 0.01 },
	// 	y: { min: -1, max: 1, step: 0.01 }
	// });

	// 🌊 Wave 2 섹션
	const wave2Folder = pane.addFolder({ title: '🌊 Wave 2 (Secondary)', expanded: false });

	wave2Folder.addBinding(water, 'amplitude2', {
		label: 'Amplitude',
		min: 0,
		max: 3,
		step: 0.01
	});

	wave2Folder.addBinding(water, 'wavelength2', {
		label: 'Wavelength',
		min: 0.5,
		max: 30,
		step: 0.1
	});

	wave2Folder.addBinding(water, 'speed2', {
		label: 'Speed',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave2Folder.addBinding(water, 'steepness2', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	// wave2Folder.addBinding(water, 'direction2', {
	// 	label: 'Direction',
	// 	x: { min: -1, max: 1, step: 0.01 },
	// 	y: { min: -1, max: 1, step: 0.01 }
	// });

	// 🌊 Wave 3 섹션
	const wave3Folder = pane.addFolder({ title: '🌊 Wave 3 (Detail)', expanded: false });

	wave3Folder.addBinding(water, 'amplitude3', {
		label: 'Amplitude',
		min: 0,
		max: 3,
		step: 0.01
	});

	wave3Folder.addBinding(water, 'wavelength3', {
		label: 'Wavelength',
		min: 0.5,
		max: 30,
		step: 0.1
	});

	wave3Folder.addBinding(water, 'speed3', {
		label: 'Speed',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave3Folder.addBinding(water, 'steepness3', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	// wave3Folder.addBinding(water, 'direction3', {
	// 	label: 'Direction',
	// 	x: { min: -1, max: 1, step: 0.01 },
	// 	y: { min: -1, max: 1, step: 0.01 }
	// });

	// 🌊 Wave 4 섹션
	const wave4Folder = pane.addFolder({ title: '🌊 Wave 4 (Ripples)', expanded: false });

	wave4Folder.addBinding(water, 'amplitude4', {
		label: 'Amplitude',
		min: 0,
		max: 3,
		step: 0.01
	});

	wave4Folder.addBinding(water, 'wavelength4', {
		label: 'Wavelength',
		min: 0.5,
		max: 30,
		step: 0.1
	});

	wave4Folder.addBinding(water, 'speed4', {
		label: 'Speed',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave4Folder.addBinding(water, 'steepness4', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	// wave4Folder.addBinding(water, 'direction4', {
	// 	label: 'Direction',
	// 	x: { min: -1, max: 1, step: 0.01 },
	// 	y: { min: -1, max: 1, step: 0.01 }
	// });



	// 🎯 유틸리티 섹션
	setSeparator(pane, "🎯 Utilities");

	pane.addButton({ title: '📐 Reset to Default' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.calmOcean);
		animationData.useAnimation = true;
		animationData.autoRotateWaves = true;
		animationData.intensityModulation = true;
		animationData.speedModulation = true;
		pane.refresh();
	});

	pane.addButton({ title: '🔀 Random Preset' }).on('click', () => {
		const presets = Object.keys(RedGPU.Display.Water.WaterPresets);
		const randomPreset = presets[Math.floor(Math.random() * presets.length)];
		water.applyPreset(RedGPU.Display.Water.WaterPresets[randomPreset]);
		console.log(`🌊 Random preset applied: ${randomPreset}`);
		pane.refresh();
	});

	pane.addButton({ title: '📋 Export Settings' }).on('click', () => {
		const settings = {
			waveAmplitude: water.waveAmplitude,
			waveWavelength: water.waveWavelength,
			waveSpeed: water.waveSpeed,
			waveSteepness: water.waveSteepness,
			waveDirection1: water.waveDirection1,
			waveDirection2: water.waveDirection2,
			waveDirection3: water.waveDirection3,
			waveDirection4: water.waveDirection4,
			waveScale: water.waveScale,
			waterLevel: water.waterLevel
		};
		console.log('🌊 Water Settings:', JSON.stringify(settings, null, 2));
		navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
		alert('물 설정이 클립보드에 복사되었습니다!');
	});

	console.log('🌊 Water Tweakpane UI가 성공적으로 구축되었습니다!');
};
