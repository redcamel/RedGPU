import * as RedGPU from "../../../../../dist/index.js";

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
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 15; // 포그 효과를 보기 위해 거리 증가
		controller.speedDistance = 0.5;
		controller.tilt = -10;

		// 씬 생성
		const scene = new RedGPU.Display.Scene();

		// ============================================
		// 뷰 생성 및 설정
		// ============================================

		// IBL 설정
		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')

		// 일반 뷰 생성 (포그 없음)
		const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewNormal.ibl = ibl;
		viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
		redGPUContext.addView(viewNormal);

		// 포그 이펙트 뷰 생성
		const viewFog = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewFog.ibl = ibl;
		viewFog.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		// 포그 이펙트 추가 (수정된 API 사용)
		const fogEffect = new RedGPU.PostEffect.Fog(redGPUContext);
		// 기본 Linear Fog 설정 (편의 메서드 제거로 개별 설정)
		fogEffect.fogType = RedGPU.PostEffect.Fog.LINEAR;
		fogEffect.nearDistance = 5;
		fogEffect.farDistance = 50;
		fogEffect.density = 0.5;
		// 색상은 ColorRGB 객체를 직접 조작
		fogEffect.fogColor.setColorByRGB(178, 178, 204);

		viewFog.postEffectManager.addEffect(fogEffect);
		redGPUContext.addView(viewFog);

		// ============================================
		// 씬 설정
		// ============================================

		// 조명 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 2.0;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 여러 개의 3D 모델 로드 (깊이감을 위해)
		loadMultipleModels(redGPUContext, scene);

		// ============================================
		// 레이아웃 설정
		// ============================================

		if (redGPUContext.detector.isMobile) {
			// 모바일: 위아래 분할
			viewNormal.setSize('100%', '50%');
			viewNormal.setPosition(0, 0);         // 상단 (포그 없음)
			viewFog.setSize('100%', '50%');
			viewFog.setPosition(0, '50%');        // 하단 (포그 있음)
		} else {
			// 데스크톱: 좌우 분할
			viewNormal.setSize('50%', '100%');
			viewNormal.setPosition(0, 0);         // 좌측 (포그 없음)
			viewFog.setSize('50%', '100%');
			viewFog.setPosition('50%', 0);        // 우측 (포그 있음)
		}

		// ============================================
		// 렌더링 시작
		// ============================================

		// 렌더러 생성 및 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 카메라 자동 회전 (포그 효과 시연)
			controller.rotationY += 0.003;

			// 카메라 정보 업데이트 (포그 이펙트에 필요)
			const currentFogEffect = viewFog.postEffectManager.getEffectAt(0);
			if (currentFogEffect) {
				currentFogEffect.updateCameraInfo(viewFog);
			}
		};
		renderer.start(redGPUContext, render);

		// 컨트롤 패널 생성
		renderTestPane(redGPUContext, viewFog);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadMultipleModels(redGPUContext, scene) {
	// 메인 헬멧 모델 (중앙)
	new RedGPU.GLTFLoader(
		redGPUContext,
		'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',
		(result) => {
			const mainMesh = scene.addChild(result['resultMesh']);
			mainMesh.x = 0;
			mainMesh.z = 0;
			mainMesh.scaleX = mainMesh.scaleY = mainMesh.scaleZ = 2;
		}
	);

	// 다양한 색상 팔레트
	const colors = [
		'#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
		'#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
		'#F39C12', '#E74C3C', '#9B59B6', '#3498DB', '#1ABC9C',
		'#2ECC71', '#F1C40F', '#E67E22', '#34495E', '#95A5A6'
	];

	// 거리별 원형 배치 설정
	const circleConfigs = [
		{ radius: 5,  count: 8,  size: 0.3, height: [-0.5, 1.5] },   // 가장 가까운 원
		{ radius: 10, count: 12, size: 0.5, height: [-1, 2] },       // 두 번째 원
		{ radius: 15, count: 16, size: 0.7, height: [-1.5, 2.5] },   // 세 번째 원
		{ radius: 20, count: 20, size: 0.9, height: [-2, 3] },       // 네 번째 원
		{ radius: 30, count: 24, size: 1.2, height: [-2.5, 4] },     // 다섯 번째 원
		{ radius: 40, count: 28, size: 1.5, height: [-3, 5] },       // 여섯 번째 원
		{ radius: 55, count: 32, size: 2.0, height: [-3.5, 6] },     // 일곱 번째 원
		{ radius: 70, count: 36, size: 2.5, height: [-4, 7] },       // 여덟 번째 원
		{ radius: 90, count: 40, size: 3.0, height: [-4.5, 8] }      // 가장 먼 원
	];

	console.log('🌕 거리별 Sphere 원형 배치 시작...');

	circleConfigs.forEach((config, circleIndex) => {
		console.log(`📍 Circle ${circleIndex + 1}: radius=${config.radius}, count=${config.count}`);

		for (let i = 0; i < config.count; i++) {
			// 원형 배치 각도 계산
			const angle = (Math.PI * 2 * i) / config.count;

			// 약간의 랜덤 오프셋 추가 (자연스러운 배치)
			const radiusOffset = config.radius + (Math.random() - 0.5) * config.radius * 0.2;
			const angleOffset = angle + (Math.random() - 0.5) * 0.3;

			// 위치 계산
			const x = Math.cos(angleOffset) * radiusOffset;
			const z = Math.sin(angleOffset) * radiusOffset;
			const y = config.height[0] + Math.random() * (config.height[1] - config.height[0]);

			// Sphere 지오메트리 생성 (거리에 따라 해상도 조절)
			const sphereDetail = Math.max(8, 16 - circleIndex * 2); // 멀수록 낮은 해상도
			const geometry = new RedGPU.Primitive.Sphere(
				redGPUContext,
				config.size,
				sphereDetail,
				sphereDetail
			);

			// 랜덤 색상 선택
			const color = colors[Math.floor(Math.random() * colors.length)];
			const material = new RedGPU.Material.ColorMaterial(redGPUContext, color);

			// 메시 생성
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

			// 위치 설정
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;

			// 크기 변화 (기본 크기에서 ±30% 변화)
			const scaleVariation = 0.7 + Math.random() * 0.6;
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = scaleVariation;

			// 씬에 추가
			scene.addChild(mesh);
		}
	});

	// 추가 랜덤 Sphere들 (중간 거리를 채우기 위해)
	console.log('🎲 추가 랜덤 Sphere 배치...');

	for (let i = 0; i < 50; i++) {
		// 5~100 사이의 랜덤 거리
		const distance = 5 + Math.random() * 95;
		const angle = Math.random() * Math.PI * 2;

		const x = Math.cos(angle) * distance;
		const z = Math.sin(angle) * distance;
		const y = -5 + Math.random() * 10;

		// 거리에 따른 크기 조절
		const size = 0.2 + (distance / 100) * 2.5;
		const detail = Math.max(6, 20 - Math.floor(distance / 10));

		const geometry = new RedGPU.Primitive.Sphere(redGPUContext, size, detail, detail);
		const color = colors[Math.floor(Math.random() * colors.length)];
		const material = new RedGPU.Material.ColorMaterial(redGPUContext, color);

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.x = x;
		mesh.y = y;
		mesh.z = z;

		const scale = 0.5 + Math.random() * 1.0;
		mesh.scaleX = mesh.scaleY = mesh.scaleZ = scale;

		scene.addChild(mesh);
	}

	console.log('✨ 총 Sphere 개수:', circleConfigs.reduce((sum, config) => sum + config.count, 0) + 50);
	console.log('🌫️ 포그 효과 테스트 준비 완료!');
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createPostEffectLabel} = await import('../../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js');

	createPostEffectLabel('Advanced Fog System', redGPUContext.detector.isMobile);
	const pane = new Pane();

	let fogEffect = targetView.postEffectManager.getEffectAt(0);

	const TEST_STATE = {
		// 포그 토글
		enableFog: true,

		// 포그 타입
		fogType: 'Linear',

		// 기본 설정
		density: fogEffect.density,
		nearDistance: fogEffect.nearDistance,
		farDistance: fogEffect.farDistance,

		// 포그 색상 (RGB)
		fogColorR: fogEffect.fogColor.r,
		fogColorG: fogEffect.fogColor.g,
		fogColorB: fogEffect.fogColor.b,
	};

	const folder = pane.addFolder({title: '🌫️ Advanced Fog System', expanded: true});

	// 포그 온/오프 토글
	const fogToggle = folder.addBinding(TEST_STATE, 'enableFog', {
		label: 'Enable Fog'
	}).on('change', (v) => {
		if (v.value) {
			const newFogEffect = new RedGPU.PostEffect.Fog(redGPUContext);
			applyCurrentSettings(newFogEffect);
			targetView.postEffectManager.addEffect(newFogEffect);
			fogEffect = newFogEffect;
		} else {
			targetView.postEffectManager.removeAllEffect();
		}
		updateControlsState(v.value);
	});

	// 포그 타입 선택
	const typeFolder = folder.addFolder({title: '🎯 Fog Type', expanded: true});
	const fogTypeControl = typeFolder.addBinding(TEST_STATE, 'fogType', {
		label: 'Type',
		options: {
			'Linear': 'Linear',
			'Exponential': 'Exponential',
			'Exponential²': 'ExponentialSquared'
		}
	}).on('change', (v) => {
		if (!fogEffect) return;

		const effect = targetView.postEffectManager.getEffectAt(0);
		if (effect) {
			switch(v.value) {
				case 'Linear':
					effect.fogType = RedGPU.PostEffect.Fog.LINEAR;
					break;
				case 'Exponential':
					effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL;
					break;
				case 'ExponentialSquared':
					effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
					break;
			}
		}
	});

	// 기본 설정 폴더
	const basicFolder = folder.addFolder({title: '⚙️ Parameters', expanded: true});

	const densityControl = basicFolder.addBinding(TEST_STATE, 'density', {
		min: 0.01,
		max: 3.0,
		step: 0.01,
		label: 'Density'
	}).on('change', (v) => {
		TEST_STATE.density = v.value;
		if (targetView.postEffectManager.getEffectAt(0)) {
			targetView.postEffectManager.getEffectAt(0).density = v.value;
		}
	});

	const nearControl = basicFolder.addBinding(TEST_STATE, 'nearDistance', {
		min: 0,
		max: 50,
		step: 0.001,
		label: 'Near Distance'
	}).on('change', (v) => {
		TEST_STATE.nearDistance = v.value;
		if (TEST_STATE.farDistance <= v.value) {
			TEST_STATE.farDistance = v.value + 1;
			pane.refresh();
		}

		if (targetView.postEffectManager.getEffectAt(0)) {
			targetView.postEffectManager.getEffectAt(0).nearDistance = v.value;
			targetView.postEffectManager.getEffectAt(0).farDistance = TEST_STATE.farDistance;
		}
	});

	const farControl = basicFolder.addBinding(TEST_STATE, 'farDistance', {
		min: 10,
		max: 200,
		step: 0.001,
		label: 'Far Distance'
	}).on('change', (v) => {
		TEST_STATE.farDistance = Math.max(v.value, TEST_STATE.nearDistance + 1);
		if (targetView.postEffectManager.getEffectAt(0)) {
			targetView.postEffectManager.getEffectAt(0).farDistance = TEST_STATE.farDistance;
		}
	});

	// 포그 색상 폴더
	const colorFolder = folder.addFolder({title: '🎨 Fog Color', expanded: true});

	const colorRControl = colorFolder.addBinding(TEST_STATE, 'fogColorR', {
		min: 0, max: 255, step: 1, label: 'Red'
	}).on('change', updateFogColor);

	const colorGControl = colorFolder.addBinding(TEST_STATE, 'fogColorG', {
		min: 0, max: 255, step: 1, label: 'Green'
	}).on('change', updateFogColor);

	const colorBControl = colorFolder.addBinding(TEST_STATE, 'fogColorB', {
		min: 0, max: 255, step: 1, label: 'Blue'
	}).on('change', updateFogColor);

	function updateFogColor() {
		if (targetView.postEffectManager.getEffectAt(0)) {
			targetView.postEffectManager.getEffectAt(0).fogColor.setColorByRGB(
				TEST_STATE.fogColorR,
				TEST_STATE.fogColorG,
				TEST_STATE.fogColorB
			);
		}
	}

	function applyCurrentSettings(effect) {
		// 현재 설정을 새로운 이펙트에 적용 - 개별 프로퍼티 설정
		switch(TEST_STATE.fogType) {
			case 'Linear':
				effect.fogType = RedGPU.PostEffect.Fog.LINEAR;
				break;
			case 'Exponential':
				effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL;
				break;
			case 'ExponentialSquared':
				effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
				break;
		}

		effect.density = TEST_STATE.density;
		effect.nearDistance = TEST_STATE.nearDistance;
		effect.farDistance = TEST_STATE.farDistance;
		effect.fogColor.setColorByRGB(
			TEST_STATE.fogColorR,
			TEST_STATE.fogColorG,
			TEST_STATE.fogColorB
		);
	}

	// 컨트롤 상태 업데이트 함수
	function updateControlsState(enabled) {
		fogTypeControl.disabled = !enabled;
		densityControl.disabled = !enabled;
		nearControl.disabled = !enabled;
		farControl.disabled = !enabled;
		colorRControl.disabled = !enabled;
		colorGControl.disabled = !enabled;
		colorBControl.disabled = !enabled;
	}

	// 프리셋 버튼 추가 - 편의 메서드 제거로 개별 설정 방식 사용
	const presetFolder = folder.addFolder({title: '🎯 Quick Presets', expanded: true});

	presetFolder.addButton({title: '🌫️ Light Morning Mist'}).on('click', () => {
		applyPreset('Linear', 0.3, 2, 40, [230, 230, 255]);
	});

	presetFolder.addButton({title: '☁️ Medium Fog'}).on('click', () => {
		applyPreset('Linear', 0.6, 5, 60, [180, 180, 200]);
	});

	presetFolder.addButton({title: '🌁 Dense Linear Fog'}).on('click', () => {
		applyPreset('Linear', 0.9, 1, 25, [150, 150, 180]);
	});

	presetFolder.addButton({title: '💨 Exponential Haze'}).on('click', () => {
		applyPreset('Exponential', 0.08, 5, 100, [200, 220, 255]);
	});

	presetFolder.addButton({title: '🌊 Exponential² Ocean'}).on('click', () => {
		applyPreset('ExponentialSquared', 0.03, 3, 80, [180, 200, 255]);
	});

	presetFolder.addButton({title: '🌅 Sunset Atmosphere'}).on('click', () => {
		applyPreset('Exponential', 0.05, 8, 70, [255, 200, 150]);
	});

	function applyPreset(type, density, near, far, color) {
		TEST_STATE.fogType = type;
		TEST_STATE.density = density;
		TEST_STATE.nearDistance = near;
		TEST_STATE.farDistance = far;
		TEST_STATE.fogColorR = color[0];
		TEST_STATE.fogColorG = color[1];
		TEST_STATE.fogColorB = color[2];

		pane.refresh();

		// 이펙트 적용 - 편의 메서드 대신 개별 프로퍼티 설정
		const effect = targetView.postEffectManager.getEffectAt(0);
		if (effect) {
			switch(type) {
				case 'Linear':
					effect.fogType = RedGPU.PostEffect.Fog.LINEAR;
					break;
				case 'Exponential':
					effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL;
					break;
				case 'ExponentialSquared':
					effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
					break;
			}
			effect.density = density;
			effect.nearDistance = near;
			effect.farDistance = far;
			effect.fogColor.setColorByRGB(color[0], color[1], color[2]);
		}
	}
};
