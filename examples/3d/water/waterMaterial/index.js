import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 100;
		controller.speedDistance = 2;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);
		view.axis = true
		view.grid = true

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		{
			let i  = 100
			while(i--){
				const light = new RedGPU.Light.PointLight();
				light.color.r = Math.floor(Math.random() * 255);
				light.color.g = Math.floor(Math.random() * 255);
				light.color.b = Math.floor(Math.random() * 255);
				light.x = Math.random() * 50 - 25;
				light.z = Math.random() * 50 - 25;
				light.y = 2
				light.radius = 5
				// light.enableDebugger = true
				scene.lightManager.addPointLight(light);
			}
		}

		const material = new RedGPU.Material.WaterMaterial(redGPUContext);
		const mesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 10, 10),
			material
		);

		scene.addChild(mesh);

		renderUI(redGPUContext, mesh);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			mesh.material.normalTexture.time = time
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
	}
);

const PRESETS = {
	"광활한 바다": {
		waveHeight: 0.35,
		waveScale: 15.0,
		foamEdgeSize: 0.6,
		// 메인 파도 (큰 스웰)
		wave1DirectionX: 1.2, wave1DirectionY: 0.3, wave1Steepness: 0.25, wave1Wavelength: 18.0, wave1Speed: 1.1,
		wave2DirectionX: -0.9, wave2DirectionY: 1.3, wave2Steepness: 0.22, wave2Wavelength: 20.0, wave2Speed: 0.9,
		wave3DirectionX: 0.7, wave3DirectionY: -1.1, wave3Steepness: 0.19, wave3Wavelength: 22.0, wave3Speed: 1.2,
		wave4DirectionX: -1.2, wave4DirectionY: 0.6, wave4Steepness: 0.17, wave4Wavelength: 24.0, wave4Speed: 0.8,
		// 중간 파도 (바람파)
		wave5DirectionX: 1.0, wave5DirectionY: 0.9, wave5Steepness: 0.15, wave5Wavelength: 10.0, wave5Speed: 1.4,
		wave6DirectionX: -0.6, wave6DirectionY: -1.4, wave6Steepness: 0.13, wave6Wavelength: 11.5, wave6Speed: 1.5,
		wave7DirectionX: 1.4, wave7DirectionY: -0.3, wave7Steepness: 0.12, wave7Wavelength: 13.0, wave7Speed: 0.9,
		wave8DirectionX: -0.3, wave8DirectionY: 1.5, wave8Steepness: 0.11, wave8Wavelength: 14.5, wave8Speed: 1.6,
		// 작은 파도 (캡피리파)
		wave9DirectionX: 0.8, wave9DirectionY: -1.0, wave9Steepness: 0.10, wave9Wavelength: 5.5, wave9Speed: 1.8,
		wave10DirectionX: -1.3, wave10DirectionY: 0.7, wave10Steepness: 0.09, wave10Wavelength: 6.2, wave10Speed: 1.3,
		wave11DirectionX: 0.6, wave11DirectionY: 1.2, wave11Steepness: 0.08, wave11Wavelength: 7.0, wave11Speed: 2.0,
		wave12DirectionX: -1.0, wave12DirectionY: -0.5, wave12Steepness: 0.07, wave12Wavelength: 8.0, wave12Speed: 1.7,
		// 극소 파도 (미세 디테일)
		wave13DirectionX: 1.5, wave13DirectionY: 0.2, wave13Steepness: 0.06, wave13Wavelength: 3.0, wave13Speed: 2.3,
		wave14DirectionX: -0.4, wave14DirectionY: -1.6, wave14Steepness: 0.05, wave14Wavelength: 3.5, wave14Speed: 2.1,
		wave15DirectionX: 0.9, wave15DirectionY: 1.0, wave15Steepness: 0.04, wave15Wavelength: 4.0, wave15Speed: 2.5,
		wave16DirectionX: -1.1, wave16DirectionY: 0.3, wave16Steepness: 0.035, wave16Wavelength: 4.5, wave16Speed: 1.9,
	},
	"잔잔한 호수": {
		waveHeight: 0.08,
		waveScale: 6.0,
		foamEdgeSize: 0.15,
		// 메인 파도 (작고 부드러운)
		wave1DirectionX: 0.8, wave1DirectionY: 0.2, wave1Steepness: 0.08, wave1Wavelength: 12.0, wave1Speed: 0.6,
		wave2DirectionX: -0.6, wave2DirectionY: 0.9, wave2Steepness: 0.07, wave2Wavelength: 14.0, wave2Speed: 0.5,
		wave3DirectionX: 0.4, wave3DirectionY: -0.8, wave3Steepness: 0.06, wave3Wavelength: 16.0, wave3Speed: 0.7,
		wave4DirectionX: -0.9, wave4DirectionY: 0.3, wave4Steepness: 0.05, wave4Wavelength: 18.0, wave4Speed: 0.4,
		// 중간 파도 (거의 없음)
		wave5DirectionX: 0.7, wave5DirectionY: 0.6, wave5Steepness: 0.04, wave5Wavelength: 8.0, wave5Speed: 0.8,
		wave6DirectionX: -0.3, wave6DirectionY: -1.0, wave6Steepness: 0.035, wave6Wavelength: 9.0, wave6Speed: 0.9,
		wave7DirectionX: 1.0, wave7DirectionY: -0.1, wave7Steepness: 0.03, wave7Wavelength: 10.0, wave7Speed: 0.3,
		wave8DirectionX: -0.1, wave8DirectionY: 1.1, wave8Steepness: 0.025, wave8Wavelength: 11.0, wave8Speed: 1.0,
		// 작은 파도 (미세)
		wave9DirectionX: 0.5, wave9DirectionY: -0.7, wave9Steepness: 0.02, wave9Wavelength: 4.0, wave9Speed: 1.1,
		wave10DirectionX: -0.8, wave10DirectionY: 0.4, wave10Steepness: 0.018, wave10Wavelength: 4.5, wave10Speed: 0.7,
		wave11DirectionX: 0.3, wave11DirectionY: 0.9, wave11Steepness: 0.015, wave11Wavelength: 5.0, wave11Speed: 1.3,
		wave12DirectionX: -0.6, wave12DirectionY: -0.2, wave12Steepness: 0.012, wave12Wavelength: 5.5, wave12Speed: 1.0,
		// 극소 파도 (거의 보이지 않음)
		wave13DirectionX: 1.1, wave13DirectionY: 0.05, wave13Steepness: 0.01, wave13Wavelength: 2.0, wave13Speed: 1.5,
		wave14DirectionX: -0.15, wave14DirectionY: -1.2, wave14Steepness: 0.008, wave14Wavelength: 2.3, wave14Speed: 1.4,
		wave15DirectionX: 0.6, wave15DirectionY: 0.7, wave15Steepness: 0.006, wave15Wavelength: 2.7, wave15Speed: 1.7,
		wave16DirectionX: -0.8, wave16DirectionY: 0.1, wave16Steepness: 0.005, wave16Wavelength: 3.0, wave16Speed: 1.2,
	},
	"폭풍우 치는 대양": {
		waveHeight: 0.65,
		waveScale: 22.0,
		foamEdgeSize: 0.9,
		// 메인 파도 (거대하고 격렬한)
		wave1DirectionX: 1.5, wave1DirectionY: 0.4, wave1Steepness: 0.35, wave1Wavelength: 25.0, wave1Speed: 1.8,
		wave2DirectionX: -1.2, wave2DirectionY: 1.6, wave2Steepness: 0.33, wave2Wavelength: 28.0, wave2Speed: 1.5,
		wave3DirectionX: 0.9, wave3DirectionY: -1.4, wave3Steepness: 0.30, wave3Wavelength: 30.0, wave3Speed: 2.0,
		wave4DirectionX: -1.6, wave4DirectionY: 0.8, wave4Steepness: 0.28, wave4Wavelength: 32.0, wave4Speed: 1.3,
		// 중간 파도 (강한 바람파)
		wave5DirectionX: 1.3, wave5DirectionY: 1.2, wave5Steepness: 0.25, wave5Wavelength: 15.0, wave5Speed: 2.2,
		wave6DirectionX: -0.8, wave6DirectionY: -1.7, wave6Steepness: 0.22, wave6Wavelength: 17.0, wave6Speed: 2.4,
		wave7DirectionX: 1.7, wave7DirectionY: -0.4, wave7Steepness: 0.20, wave7Wavelength: 19.0, wave7Speed: 1.6,
		wave8DirectionX: -0.5, wave8DirectionY: 1.8, wave8Steepness: 0.18, wave8Wavelength: 21.0, wave8Speed: 2.6,
		// 작은 파도 (거친 캡피리파)
		wave9DirectionX: 1.0, wave9DirectionY: -1.3, wave9Steepness: 0.16, wave9Wavelength: 8.0, wave9Speed: 2.8,
		wave10DirectionX: -1.5, wave10DirectionY: 0.9, wave10Steepness: 0.14, wave10Wavelength: 9.0, wave10Speed: 2.1,
		wave11DirectionX: 0.7, wave11DirectionY: 1.5, wave11Steepness: 0.12, wave11Wavelength: 10.0, wave11Speed: 3.0,
		wave12DirectionX: -1.2, wave12DirectionY: -0.6, wave12Steepness: 0.10, wave12Wavelength: 11.0, wave12Speed: 2.5,
		// 극소 파도 (거친 디테일)
		wave13DirectionX: 1.8, wave13DirectionY: 0.3, wave13Steepness: 0.08, wave13Wavelength: 4.0, wave13Speed: 3.2,
		wave14DirectionX: -0.6, wave14DirectionY: -1.9, wave14Steepness: 0.07, wave14Wavelength: 4.5, wave14Speed: 2.9,
		wave15DirectionX: 1.1, wave15DirectionY: 1.3, wave15Steepness: 0.06, wave15Wavelength: 5.0, wave15Speed: 3.5,
		wave16DirectionX: -1.4, wave16DirectionY: 0.4, wave16Steepness: 0.05, wave16Wavelength: 5.5, wave16Speed: 2.7,
	},
	"거대한 강": {
		waveHeight: 0.18,
		waveScale: 8.0,
		foamEdgeSize: 0.35,
		// 메인 파도 (일방향 흐름)
		wave1DirectionX: 1.8, wave1DirectionY: 0.1, wave1Steepness: 0.12, wave1Wavelength: 16.0, wave1Speed: 1.8,
		wave2DirectionX: 1.6, wave2DirectionY: -0.2, wave2Steepness: 0.11, wave2Wavelength: 18.0, wave2Speed: 1.6,
		wave3DirectionX: 1.9, wave3DirectionY: 0.3, wave3Steepness: 0.10, wave3Wavelength: 20.0, wave3Speed: 2.0,
		wave4DirectionX: 1.4, wave4DirectionY: -0.1, wave4Steepness: 0.09, wave4Wavelength: 22.0, wave4Speed: 1.4,
		// 중간 파도 (흐름 방향)
		wave5DirectionX: 1.7, wave5DirectionY: 0.4, wave5Steepness: 0.08, wave5Wavelength: 10.0, wave5Speed: 2.2,
		wave6DirectionX: 1.3, wave6DirectionY: -0.3, wave6Steepness: 0.07, wave6Wavelength: 11.0, wave6Speed: 2.0,
		wave7DirectionX: 1.9, wave7DirectionY: 0.2, wave7Steepness: 0.06, wave7Wavelength: 12.0, wave7Speed: 1.8,
		wave8DirectionX: 1.5, wave8DirectionY: -0.4, wave8Steepness: 0.05, wave8Wavelength: 13.0, wave8Speed: 2.4,
		// 작은 파도 (가로 방향 약간)
		wave9DirectionX: 0.3, wave9DirectionY: 1.8, wave9Steepness: 0.04, wave9Wavelength: 6.0, wave9Speed: 1.9,
		wave10DirectionX: -0.2, wave10DirectionY: 1.9, wave10Steepness: 0.035, wave10Wavelength: 6.5, wave10Speed: 1.5,
		wave11DirectionX: 0.4, wave11DirectionY: 1.7, wave11Steepness: 0.03, wave11Wavelength: 7.0, wave11Speed: 2.1,
		wave12DirectionX: -0.1, wave12DirectionY: 1.8, wave12Steepness: 0.025, wave12Wavelength: 7.5, wave12Speed: 1.7,
		// 극소 파도 (난류)
		wave13DirectionX: 0.8, wave13DirectionY: 1.2, wave13Steepness: 0.02, wave13Wavelength: 3.5, wave13Speed: 2.5,
		wave14DirectionX: -0.6, wave14DirectionY: 1.4, wave14Steepness: 0.018, wave14Wavelength: 4.0, wave14Speed: 2.3,
		wave15DirectionX: 1.1, wave15DirectionY: 0.8, wave15Steepness: 0.015, wave15Wavelength: 4.5, wave15Speed: 2.7,
		wave16DirectionX: -0.4, wave16DirectionY: 1.6, wave16Steepness: 0.012, wave16Wavelength: 5.0, wave16Speed: 2.1,
	},
	"고요한 연못": {
		waveHeight: 0.03,
		waveScale: 3.0,
		foamEdgeSize: 0.05,
		// 메인 파도 (거의 없음)
		wave1DirectionX: 0.5, wave1DirectionY: 0.1, wave1Steepness: 0.015, wave1Wavelength: 8.0, wave1Speed: 0.3,
		wave2DirectionX: -0.3, wave2DirectionY: 0.4, wave2Steepness: 0.012, wave2Wavelength: 9.0, wave2Speed: 0.25,
		wave3DirectionX: 0.2, wave3DirectionY: -0.5, wave3Steepness: 0.010, wave3Wavelength: 10.0, wave3Speed: 0.35,
		wave4DirectionX: -0.4, wave4DirectionY: 0.15, wave4Steepness: 0.008, wave4Wavelength: 11.0, wave4Speed: 0.2,
		// 중간 파도 (미미한)
		wave5DirectionX: 0.3, wave5DirectionY: 0.3, wave5Steepness: 0.006, wave5Wavelength: 5.0, wave5Speed: 0.4,
		wave6DirectionX: -0.15, wave6DirectionY: -0.45, wave6Steepness: 0.005, wave6Wavelength: 5.5, wave6Speed: 0.45,
		wave7DirectionX: 0.4, wave7DirectionY: -0.05, wave7Steepness: 0.004, wave7Wavelength: 6.0, wave7Speed: 0.15,
		wave8DirectionX: -0.05, wave8DirectionY: 0.5, wave8Steepness: 0.003, wave8Wavelength: 6.5, wave8Speed: 0.5,
		// 작은 파도 (거의 보이지 않음)
		wave9DirectionX: 0.2, wave9DirectionY: -0.3, wave9Steepness: 0.002, wave9Wavelength: 2.5, wave9Speed: 0.6,
		wave10DirectionX: -0.35, wave10DirectionY: 0.2, wave10Steepness: 0.0018, wave10Wavelength: 2.8, wave10Speed: 0.35,
		wave11DirectionX: 0.15, wave11DirectionY: 0.4, wave11Steepness: 0.0015, wave11Wavelength: 3.0, wave11Speed: 0.7,
		wave12DirectionX: -0.25, wave12DirectionY: -0.1, wave12Steepness: 0.0012, wave12Wavelength: 3.3, wave12Speed: 0.5,
		// 극소 파도 (거의 없음)
		wave13DirectionX: 0.4, wave13DirectionY: 0.02, wave13Steepness: 0.001, wave13Wavelength: 1.5, wave13Speed: 0.8,
		wave14DirectionX: -0.08, wave14DirectionY: -0.5, wave14Steepness: 0.0008, wave14Wavelength: 1.7, wave14Speed: 0.75,
		wave15DirectionX: 0.25, wave15DirectionY: 0.3, wave15Steepness: 0.0006, wave15Wavelength: 1.9, wave15Speed: 0.9,
		wave16DirectionX: -0.35, wave16DirectionY: 0.05, wave16Steepness: 0.0005, wave16Wavelength: 2.1, wave16Speed: 0.6,
	}
};

const renderUI = async (redGPUContext, mesh) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const {
		setSeparator,
		createIblHelper,
		setDebugButtons
	} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(redGPUContext);

	const pane = new Pane();
	createIblHelper(pane, redGPUContext.viewList[0], RedGPU)
	const material = mesh.material;
	const normalTexture = material.normalTexture;

	// 프리셋 폴더
	const presetFolder = pane.addFolder({title: "🌊 환경 프리셋"});
	Object.keys(PRESETS).forEach((presetName) => {
		presetFolder.addButton({
			title: presetName
		}).on('click', () => {
			for (const key in PRESETS[presetName]) {
				normalTexture[key] = PRESETS[presetName][key];
			}
			pane.refresh();
		});
	});

	// 기본 파도 설정
	const basicFolder = pane.addFolder({title: '🌊 기본 파도 설정'});

	basicFolder.addBinding(normalTexture, 'waveHeight', {
		min: 0.01,
		max: 0.8,
		step: 0.01,
		label: '파도 높이'
	});

	basicFolder.addBinding(normalTexture, 'waveScale', {
		min: 1.0,
		max: 300.0,
		step: 0.1,
		label: '파장 스케일'
	});

	basicFolder.addBinding(normalTexture, 'foamEdgeSize', {
		min: 0.0,
		max: 1.0,
		step: 0.1,
		label: '폼 크기'
	});
	basicFolder.addBinding(material, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01,
	});
	// 거스트너 파도 제어 (주요 4개 파도만 노출)
	const gerstnerFolder = pane.addFolder({title: '🌀 거스트너 파도 세부 설정', expanded: false});

	// 파도 1 (메인)
	const wave1Folder = gerstnerFolder.addFolder({title: '파도 1 (메인)', expanded: false});
	wave1Folder.addBinding(normalTexture, 'wave1DirectionX', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 X'
	});
	wave1Folder.addBinding(normalTexture, 'wave1DirectionY', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 Y'
	});
	wave1Folder.addBinding(normalTexture, 'wave1Steepness', {
		min: 0.0,
		max: 0.5,
		step: 0.01,
		label: '가파름'
	});
	wave1Folder.addBinding(normalTexture, 'wave1Wavelength', {
		min: 1.0,
		max: 20.0,
		step: 0.1,
		label: '파장'
	});
	wave1Folder.addBinding(normalTexture, 'wave1Speed', {
		min: 0.1,
		max: 3.0,
		step: 0.1,
		label: '속도'
	});

	// 파도 2 (메인)
	const wave2Folder = gerstnerFolder.addFolder({title: '파도 2 (메인)', expanded: false});
	wave2Folder.addBinding(normalTexture, 'wave2DirectionX', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 X'
	});
	wave2Folder.addBinding(normalTexture, 'wave2DirectionY', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 Y'
	});
	wave2Folder.addBinding(normalTexture, 'wave2Steepness', {
		min: 0.0,
		max: 0.5,
		step: 0.01,
		label: '가파름'
	});
	wave2Folder.addBinding(normalTexture, 'wave2Wavelength', {
		min: 1.0,
		max: 20.0,
		step: 0.1,
		label: '파장'
	});
	wave2Folder.addBinding(normalTexture, 'wave2Speed', {
		min: 0.1,
		max: 3.0,
		step: 0.1,
		label: '속도'
	});

	// 파도 3 (중간)
	const wave3Folder = gerstnerFolder.addFolder({title: '파도 3 (중간)', expanded: false});
	wave3Folder.addBinding(normalTexture, 'wave3DirectionX', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 X'
	});
	wave3Folder.addBinding(normalTexture, 'wave3DirectionY', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 Y'
	});
	wave3Folder.addBinding(normalTexture, 'wave3Steepness', {
		min: 0.0,
		max: 0.4,
		step: 0.01,
		label: '가파름'
	});
	wave3Folder.addBinding(normalTexture, 'wave3Wavelength', {
		min: 2.0,
		max: 25.0,
		step: 0.1,
		label: '파장'
	});
	wave3Folder.addBinding(normalTexture, 'wave3Speed', {
		min: 0.1,
		max: 3.0,
		step: 0.1,
		label: '속도'
	});

	// 파도 4 (중간)
	const wave4Folder = gerstnerFolder.addFolder({title: '파도 4 (중간)', expanded: false});
	wave4Folder.addBinding(normalTexture, 'wave4DirectionX', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 X'
	});
	wave4Folder.addBinding(normalTexture, 'wave4DirectionY', {
		min: -2.0,
		max: 2.0,
		step: 0.1,
		label: '방향 Y'
	});
	wave4Folder.addBinding(normalTexture, 'wave4Steepness', {
		min: 0.0,
		max: 0.4,
		step: 0.01,
		label: '가파름'
	});
	wave4Folder.addBinding(normalTexture, 'wave4Wavelength', {
		min: 2.0,
		max: 25.0,
		step: 0.1,
		label: '파장'
	});
	wave4Folder.addBinding(normalTexture, 'wave4Speed', {
		min: 0.1,
		max: 3.0,
		step: 0.1,
		label: '속도'
	});


	// 빠른 조정 버튼들
	const quickControlsFolder = pane.addFolder({title: '⚡ 빠른 조정'});

	quickControlsFolder.addButton({title: '모든 파도 리셋'}).on('click', () => {
		// 기본값으로 리셋 (BASE_OPTIONS와 동일)
		normalTexture.waveHeight = 0.3;
		normalTexture.waveScale = 10.0;
		normalTexture.foamEdgeSize = 0.4;

		// 16개 파도 모두 기본값으로 리셋
		const baseValues = {
			wave1DirectionX: 1.0, wave1DirectionY: 0.3, wave1Steepness: 0.20, wave1Wavelength: 15.0, wave1Speed: 1.0,
			wave2DirectionX: -0.8, wave2DirectionY: 1.2, wave2Steepness: 0.18, wave2Wavelength: 18.0, wave2Speed: 0.9,
			wave3DirectionX: 0.6, wave3DirectionY: -1.0, wave3Steepness: 0.16, wave3Wavelength: 20.0, wave3Speed: 1.1,
			wave4DirectionX: -1.1, wave4DirectionY: 0.5, wave4Steepness: 0.14, wave4Wavelength: 22.0, wave4Speed: 0.8,
			wave5DirectionX: 0.9, wave5DirectionY: 0.8, wave5Steepness: 0.12, wave5Wavelength: 8.0, wave5Speed: 1.2,
			wave6DirectionX: -0.4, wave6DirectionY: -1.3, wave6Steepness: 0.11, wave6Wavelength: 9.5, wave6Speed: 1.3,
			wave7DirectionX: 1.3, wave7DirectionY: -0.2, wave7Steepness: 0.10, wave7Wavelength: 11.0, wave7Speed: 0.7,
			wave8DirectionX: -0.2, wave8DirectionY: 1.4, wave8Steepness: 0.09, wave8Wavelength: 12.5, wave8Speed: 1.4,
			wave9DirectionX: 0.7, wave9DirectionY: -0.9, wave9Steepness: 0.08, wave9Wavelength: 4.5, wave9Speed: 1.6,
			wave10DirectionX: -1.2, wave10DirectionY: 0.6, wave10Steepness: 0.07, wave10Wavelength: 5.2, wave10Speed: 1.1,
			wave11DirectionX: 0.5, wave11DirectionY: 1.1, wave11Steepness: 0.06, wave11Wavelength: 6.0, wave11Speed: 1.8,
			wave12DirectionX: -0.9, wave12DirectionY: -0.4, wave12Steepness: 0.05, wave12Wavelength: 7.0, wave12Speed: 1.5,
			wave13DirectionX: 1.4, wave13DirectionY: 0.1, wave13Steepness: 0.04, wave13Wavelength: 2.5, wave13Speed: 2.0,
			wave14DirectionX: -0.3, wave14DirectionY: -1.5, wave14Steepness: 0.035, wave14Wavelength: 3.0, wave14Speed: 1.9,
			wave15DirectionX: 0.8, wave15DirectionY: 0.9, wave15Steepness: 0.03, wave15Wavelength: 3.5, wave15Speed: 2.2,
			wave16DirectionX: -1.0, wave16DirectionY: 0.2, wave16Steepness: 0.025, wave16Wavelength: 4.0, wave16Speed: 1.7,
		};

		for (const key in baseValues) {
			normalTexture[key] = baseValues[key];
		}
		pane.refresh();
	});

	quickControlsFolder.addButton({title: '파도 멈춤/재생'}).on('click', () => {
		// 모든 파도의 속도를 0으로 설정하거나 기본값으로 복구
		const isRunning = normalTexture.wave1Speed > 0;
		const baseSpeeds = [1.0, 0.9, 1.1, 0.8, 1.2, 1.3, 0.7, 1.4, 1.6, 1.1, 1.8, 1.5, 2.0, 1.9, 2.2, 1.7];

		for (let i = 1; i <= 16; i++) {
			normalTexture[`wave${i}Speed`] = isRunning ? 0 : baseSpeeds[i-1];
		}
		pane.refresh();
	});

	quickControlsFolder.addButton({title: '랜덤 파도 생성'}).on('click', () => {
		// 랜덤한 값들로 설정
		normalTexture.waveHeight = Math.random() * 0.4 + 0.1;
		normalTexture.waveScale = Math.random() * 20 + 5;
		normalTexture.foamEdgeSize = Math.random() * 0.6 + 0.2;

		// 16개 파도 모두 랜덤 설정
		for (let i = 1; i <= 16; i++) {
			normalTexture[`wave${i}DirectionX`] = (Math.random() - 0.5) * 4.0; // -2.0 ~ 2.0
			normalTexture[`wave${i}DirectionY`] = (Math.random() - 0.5) * 4.0; // -2.0 ~ 2.0
			normalTexture[`wave${i}Steepness`] = Math.random() * 0.3 + 0.05; // 0.05 ~ 0.35
			normalTexture[`wave${i}Wavelength`] = Math.random() * 20 + 5; // 5 ~ 25
			normalTexture[`wave${i}Speed`] = Math.random() * 2.5 + 0.5; // 0.5 ~ 3.0
		}
		pane.refresh();
	});
};
