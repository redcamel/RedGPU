import * as RedGPU from "../../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 3
		controller.speedDistance = 0.1
		controller.tilt = 0

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		scene.lightManager.addDirectionalLight(directionalLightTest)
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf');

		const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext)

		view.postEffectManager.addEffect(effect)

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {

		};
		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext)

	},
	(failReason) => {
		// Handle initialization failure
		console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view
	const cubeTexture =
		new RedGPU.Resource.CubeTexture(redGPUContext, [
			"../../../../assets/skybox/px.jpg", // Positive X
			"../../../../assets/skybox/nx.jpg", // Negative X
			"../../../../assets/skybox/py.jpg", // Positive Y
			"../../../../assets/skybox/ny.jpg", // Negative Y
			"../../../../assets/skybox/pz.jpg", // Positive Z
			"../../../../assets/skybox/nz.jpg", // Negative Z
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

// Function to render Test Pane (for controls)
// 테스트 패널을 렌더링하는 함수
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const view = redGPUContext.viewList[0]
	const effect = view.postEffectManager.getEffectAt(0);

	// 이펙트의 실제 초기값으로 TEST_STATE 설정
	const TEST_STATE = {
		ColorTemperatureTint: true,
		temperature: effect.temperature,
		tint: effect.tint,
		strength: effect.strength
	}

	const folder = pane.addFolder({title: 'Color Temperature & Tint', expanded: true})

	// ColorTemperatureTint 토글
	folder.addBinding(TEST_STATE, 'ColorTemperatureTint').on('change', (v) => {
		if (v.value) {
			const newEffect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
			newEffect.temperature = TEST_STATE.temperature;
			newEffect.tint = TEST_STATE.tint;
			newEffect.strength = TEST_STATE.strength;
			view.postEffectManager.addEffect(newEffect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		// 조정바 활성화/비활성화
		temperatureControl.disabled = !v.value;
		tintControl.disabled = !v.value;
		strengthControl.disabled = !v.value;
	});

	// 메인 컨트롤들
	const temperatureControl = folder.addBinding(TEST_STATE, 'temperature', {
		min: 1000,
		max: 20000,
		step: 100
	}).on('change', (v) => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = v.value;
			updateTemperatureInfo(v.value);
		}
	});

	const tintControl = folder.addBinding(TEST_STATE, 'tint', {
		min: -100,
		max: 100,
		step: 1
	}).on('change', (v) => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.tint = v.value;
		}
	});

	const strengthControl = folder.addBinding(TEST_STATE, 'strength', {
		min: 0,
		max: 100,
		step: 1
	}).on('change', (v) => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.strength = v.value;
		}
	});

	// 실시간 정보 표시 폴더
	const infoFolder = pane.addFolder({title: 'Information', expanded: false});

	const temperatureInfo = {
		kelvinValue: `${TEST_STATE.temperature}K`,
		description: getTemperatureDescription(TEST_STATE.temperature)
	};

	const kelvinDisplay = infoFolder.addBinding(temperatureInfo, 'kelvinValue', {readonly: true});
	const descDisplay = infoFolder.addBinding(temperatureInfo, 'description', {readonly: true});

	// 온도 정보 업데이트 함수
	function updateTemperatureInfo(temperature) {
		temperatureInfo.kelvinValue = `${temperature}K`;
		temperatureInfo.description = getTemperatureDescription(temperature);
		kelvinDisplay.refresh();
		descDisplay.refresh();
	}

	// 퀵 액션 버튼들 (프리셋 통합)
	const actionFolder = pane.addFolder({title: 'Quick Actions & Presets', expanded: true});

	// 시간대별 프리셋
	actionFolder.addButton({title: '🌅 Sunrise (3200K, -10)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 3200;
			currentEffect.tint = -10;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '☀️ Noon (6500K, 0)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 6500;
			currentEffect.tint = 0;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🌆 Sunset (2800K, +5)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 2800;
			currentEffect.tint = 5;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🌙 Moonlight (4000K, +15)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 4000;
			currentEffect.tint = 15;
			updateUI(currentEffect);
		}
	});

	// 조명 타입별 프리셋
	actionFolder.addButton({title: '🕯️ Candle Light (1900K, -5)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCandleLight();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🔥 Warm Tone (3200K, -10)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setWarmTone();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '💡 Daylight (5600K, 0)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setDaylight();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '⚪ Neutral (6500K, 0)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setNeutral();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '☁️ Cloudy Day (7500K, +5)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCloudyDay();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '❄️ Cool Tone (8000K, +10)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCoolTone();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '💫 Neon Light (9000K, +15)'}).on('click', () => {
		const currentEffect = view.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setNeonLight();
			updateUI(currentEffect);
		}
	});

	function updateUI(effect) {
		// TEST_STATE 업데이트
		TEST_STATE.temperature = effect.temperature;
		TEST_STATE.tint = effect.tint;

		// UI 컨트롤 새로고침
		temperatureControl.refresh();
		tintControl.refresh();

		// 온도 정보 업데이트
		updateTemperatureInfo(effect.temperature);
	}
};

// 색온도에 따른 설명 반환
function getTemperatureDescription(temperature) {
	if (temperature < 2000) return "매우 따뜻함 (촛불)";
	if (temperature < 3000) return "따뜻함 (백열등)";
	if (temperature < 4000) return "약간 따뜻함 (할로겐)";
	if (temperature < 5000) return "중성 (형광등)";
	if (temperature < 6000) return "약간 차가움 (플래시)";
	if (temperature < 7000) return "자연광 (태양)";
	if (temperature < 8000) return "차가움 (흐린 하늘)";
	if (temperature < 10000) return "매우 차가움 (그늘)";
	return "극도로 차가움 (파란 하늘)";
}
