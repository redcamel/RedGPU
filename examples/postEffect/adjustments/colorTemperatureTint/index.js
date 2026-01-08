import * as RedGPU from "../../../../dist/index.js?t=1767866967649";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// ============================================
		// 기본 설정
		// ============================================

		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 3;
		controller.speedDistance = 0.1;
		controller.tilt = 0;

		// 스카이박스 텍스처 생성

		// 씬 생성
		const scene = new RedGPU.Display.Scene();

		// ============================================
		// 뷰 생성 및 설정
		// ============================================

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
		// 일반 뷰 생성
		const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewNormal.ibl = ibl;
		viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
		redGPUContext.addView(viewNormal);

		// 이펙트 뷰 생성
		const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewEffect.ibl = ibl;
		viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
		viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext));
		redGPUContext.addView(viewEffect);
		// ============================================
		// 씬 설정
		// ============================================

		// 조명 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 3D 모델 로드
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

		// ============================================
		// 레이아웃 설정
		// ============================================

		if (redGPUContext.detector.isMobile) {
			// 모바일: 위아래 분할
			viewNormal.setSize('100%', '50%');
			viewNormal.setPosition(0, 0);         // 상단
			viewEffect.setSize('100%', '50%');
			viewEffect.setPosition(0, '50%');     // 하단
		} else {
			// 데스크톱: 좌우 분할
			viewNormal.setSize('50%', '100%');
			viewNormal.setPosition(0, 0);         // 좌측
			viewEffect.setSize('50%', '100%');
			viewEffect.setPosition('50%', 0);     // 우측
		}

		// ============================================
		// 렌더링 시작
		// ============================================

		// 렌더러 생성 및 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 추가 렌더링 로직이 필요하면 여기에 작성
		};
		renderer.start(redGPUContext, render);

		// 컨트롤 패널 생성
		renderTestPane(redGPUContext, viewEffect);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(redGPUContext, scene, url) {

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
		}
	)
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767866967649');
	const {createPostEffectLabel} = await import('../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js?t=1767866967649');
	createPostEffectLabel('ColorTemperatureTint', redGPUContext.detector.isMobile)
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767866967649");
	setDebugButtons(redGPUContext);
	const pane = new Pane();
	const effect = targetView.postEffectManager.getEffectAt(0);

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
			targetView.postEffectManager.addEffect(newEffect);
		} else {
			targetView.postEffectManager.removeAllEffect();
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
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
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
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.tint = v.value;
		}
	});

	const strengthControl = folder.addBinding(TEST_STATE, 'strength', {
		min: 0,
		max: 100,
		step: 1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
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
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 3200;
			currentEffect.tint = -10;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '☀️ Noon (6500K, 0)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 6500;
			currentEffect.tint = 0;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🌆 Sunset (2800K, +5)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 2800;
			currentEffect.tint = 5;
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🌙 Moonlight (4000K, +15)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.temperature = 4000;
			currentEffect.tint = 15;
			updateUI(currentEffect);
		}
	});

	// 조명 타입별 프리셋
	actionFolder.addButton({title: '🕯️ Candle Light (1900K, -5)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCandleLight();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '🔥 Warm Tone (3200K, -10)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setWarmTone();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '💡 Daylight (5600K, 0)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setDaylight();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '⚪ Neutral (6500K, 0)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setNeutral();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '☁️ Cloudy Day (7500K, +5)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCloudyDay();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '❄️ Cool Tone (8000K, +10)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.setCoolTone();
			updateUI(currentEffect);
		}
	});

	actionFolder.addButton({title: '💫 Neon Light (9000K, +15)'}).on('click', () => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
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
