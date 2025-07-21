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

		scene.lightManager.ambientLight	= new RedGPU.Light.AmbientLight();


		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		// 🌊 물 메시 생성
		const water = new RedGPU.Display.Water(redGPUContext, 2000, 2000, 1000);
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

	setSeparator(pane, "🌊 Water Presets");
// 🌊 프리셋 이름과 이모지 매핑
	const PRESET_DISPLAY_CONFIG = {
		calmOcean: { title: '🏖️ Calm Ocean', emoji: '🏖️' },
		gentleWaves: { title: '🌊 Gentle Waves', emoji: '🌊' },
		stormyOcean: { title: '⛈️ Stormy Ocean', emoji: '⛈️' },
		lakeRipples: { title: '🏞️ Lake Ripples', emoji: '🏞️' },
		deepOcean: { title: '🌀 Deep Ocean', emoji: '🌀' },
		choppy: { title: '🌪️ Choppy Waves', emoji: '🌪️' },
		tsunami: { title: '🌋 Tsunami Waves', emoji: '🌋' },
		surfing: { title: '🏄‍♂️ Surfing Waves', emoji: '🏄‍♂️' }
	};

// 🌊 Water.WaterPresets에서 동적으로 버튼 생성
	Object.entries(RedGPU.Display.Water.WaterPresets).forEach(([presetKey, preset]) => {
		const config = PRESET_DISPLAY_CONFIG[presetKey];
		const title = config ? config.title : `${presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}`;

		pane.addButton({ title }).on('click', () => {
			water.applyPreset(preset);
			pane.refresh();
		});
	});


	setSeparator(pane, "🎯 Water Appearance");

	const colorParams = {
		waterColor: '#4D99CC'
	};

	pane.addBinding(colorParams, 'waterColor', {
		label: 'Water Color',
		picker: 'inline',
		view: 'color',
		expanded: true
	}).on('change', (ev) => {
		water.material.color.setColorByHEX(ev.value);
	});

	const presetColors = [
		{ name: '🏖️ Tropical Blue', color: '#00BFFF' },
		{ name: '🌊 Ocean Blue', color: '#006994' },
		{ name: '🏞️ Lake Blue', color: '#4D99CC' },
		{ name: '🌀 Deep Sea', color: '#003366' },
		{ name: '💎 Crystal Clear', color: '#87CEEB' },
		{ name: '🌿 Emerald Green', color: '#50C878' },
		{ name: '🟫 Muddy Brown', color: '#8B4513' },
		{ name: '🖤 Dark Waters', color: '#2F4F4F' }
	];

	presetColors.forEach(preset => {
		pane.addButton({ title: preset.name }).on('click', () => {
			water.material.color.setColorByHEX(preset.color);
			colorParams.waterColor = preset.color;
			pane.refresh();
		});
	});

	setSeparator(pane, "🎯 Global Parameters");

	pane.addBinding(water.material, 'specularStrength', {

		min: 0.01,
		max: 1.0,
		step: 0.001
	});
	pane.addBinding(water, 'waveScale', {

		min: 0.01,
		max: 1.0,
		step: 0.001
	});

	pane.addBinding(water, 'waterLevel', {

		min: -5.0,
		max: 5.0,
		step: 0.01
	});

	const wave1Folder = pane.addFolder({ title: '🌊 Wave 1 (Primary)', expanded: false });

	wave1Folder.addBinding(water, 'amplitude1', {
		label: 'Amplitude',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave1Folder.addBinding(water, 'wavelength1', {
		label: 'Wavelength',
		min: 0.5,
		max: 100,
		step: 0.1
	});

	wave1Folder.addBinding(water, 'speed1', {
		label: 'Speed',
		min: 0,
		max: 10,
		step: 0.01
	});

	wave1Folder.addBinding(water, 'steepness1', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	const wave2Folder = pane.addFolder({ title: '🌊 Wave 2 (Secondary)', expanded: false });

	wave2Folder.addBinding(water, 'amplitude2', {
		label: 'Amplitude',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave2Folder.addBinding(water, 'wavelength2', {
		label: 'Wavelength',
		min: 0.5,
		max: 100,
		step: 0.1
	});

	wave2Folder.addBinding(water, 'speed2', {
		label: 'Speed',
		min: 0,
		max: 10,
		step: 0.01
	});

	wave2Folder.addBinding(water, 'steepness2', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	const wave3Folder = pane.addFolder({ title: '🌊 Wave 3 (Detail)', expanded: false });

	wave3Folder.addBinding(water, 'amplitude3', {
		label: 'Amplitude',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave3Folder.addBinding(water, 'wavelength3', {
		label: 'Wavelength',
		min: 0.5,
		max: 100,
		step: 0.1
	});

	wave3Folder.addBinding(water, 'speed3', {
		label: 'Speed',
		min: 0,
		max: 10,
		step: 0.01
	});

	wave3Folder.addBinding(water, 'steepness3', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	const wave4Folder = pane.addFolder({ title: '🌊 Wave 4 (Ripples)', expanded: false });

	wave4Folder.addBinding(water, 'amplitude4', {
		label: 'Amplitude',
		min: 0,
		max: 5,
		step: 0.01
	});

	wave4Folder.addBinding(water, 'wavelength4', {
		label: 'Wavelength',
		min: 0.5,
		max: 100,
		step: 0.1
	});

	wave4Folder.addBinding(water, 'speed4', {
		label: 'Speed',
		min: 0,
		max: 10,
		step: 0.01
	});

	wave4Folder.addBinding(water, 'steepness4', {
		label: 'Steepness',
		min: 0,
		max: 1,
		step: 0.001
	});

	pane.addBinding(water.material, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	})

	setSeparator(pane, "🎯 Utilities");

	pane.addButton({ title: '📐 Reset to Default' }).on('click', () => {
		water.applyPreset(RedGPU.Display.Water.WaterPresets.calmOcean);
		water.material.color.setColorByHEX('#006994');
		colorParams.waterColor = '#006994';
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

		const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
		water.material.color.setColorByHEX(randomColor.color);
		colorParams.waterColor = randomColor.color;

		console.log(`🌊 Random preset applied: ${randomPreset} with ${randomColor.name}`);
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
			waterLevel: water.waterLevel,
			waterColor: colorParams.waterColor
		};
		console.log('🌊 Water Settings:', JSON.stringify(settings, null, 2));
		navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
		alert('물 설정이 클립보드에 복사되었습니다!');
	});

	console.log('🌊 Water Tweakpane UI가 성공적으로 구축되었습니다!');
};
