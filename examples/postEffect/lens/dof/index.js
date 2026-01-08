import * as RedGPU from "../../../../dist/index.js?t=1767866967649";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// ============================================
		// 기본 설정 (DOF에 최적화)
		// ============================================

		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15; // 🎯 더 가까이 배치
		controller.speedDistance = 0.5;
		controller.tilt = -15;

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
		viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.DOF(redGPUContext));
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
			viewNormal.setPosition(0, 0);
			viewEffect.setSize('100%', '50%');
			viewEffect.setPosition(0, '50%');
		} else {
			// 데스크톱: 좌우 분할
			viewNormal.setSize('50%', '100%');
			viewNormal.setPosition(0, 0);
			viewEffect.setSize('50%', '100%');
			viewEffect.setPosition('50%', 0);
		}

		// ============================================
		// 렌더링 시작
		// ============================================

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 추가 렌더링 로직
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
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))

			// 🎯 Z축 일렬 배치 (DOF 테스트 최적화)
			const zLineObjects = 15;        // 객체 수 줄임
			const zStart = -30;             // 🎯 범위 축소: 더 가까이
			const zEnd = 40;                // 🎯 범위 축소: 더 가까이
			const zInterval = (zEnd - zStart) / (zLineObjects - 1);

			for (let i = 0; i < zLineObjects; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				// Z축 일정 간격 배치
				mesh.x = 0;
				mesh.y = 0;
				mesh.z = zStart + (i * zInterval);

				// 🎯 크기를 더 다양하게 (DOF 효과 강화)
				const normalizedDistance = i / (zLineObjects - 1);
				const scale = 2 + normalizedDistance * 3;  // 2~5 크기
				mesh.setScale(scale);

				// 회전으로 구분
				mesh.rotationY = i * 20;

				scene.addChild(mesh);
			}

			// 🌐 배경 랜덤 객체들 (범위 축소)
			const totalRandomObjects = 150;  // 수 줄임
			const cubeSize = 30;              // 🎯 범위 축소
			const halfSize = cubeSize / 2;

			for (let i = 0; i < totalRandomObjects; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				// 🎯 더 좁은 범위에 배치
				mesh.x = (Math.random() - 0.5) * cubeSize;
				mesh.y = (Math.random() - 0.5) * cubeSize;
				mesh.z = (Math.random() - 0.5) * 60; // Z 범위 축소

				// 중앙 Z축 라인과 겹치지 않도록
				if (Math.abs(mesh.x) < 8 && Math.abs(mesh.y) < 8) {
					mesh.x += mesh.x > 0 ? 12 : -12;
				}

				// 랜덤 회전
				mesh.rotationX = Math.random() * 360;
				mesh.rotationY = Math.random() * 360;
				mesh.rotationZ = Math.random() * 360;

				// 🎯 크기 다양화 (DOF 효과용)
				const distanceFromCenter = Math.sqrt(mesh.x * mesh.x + mesh.y * mesh.y + mesh.z * mesh.z);
				const scale = 0.8 + (distanceFromCenter / halfSize) * 1.5;  // 0.8~2.3 크기
				mesh.setScale(scale);

				scene.addChild(mesh);
			}

			// 🎯 포커스 참조용 마커들 (거리 조정)
			const focusMarkers = [
				{z: -20, color: 'near', label: 'NEAR'},   // 근거리
				{z: 15, color: 'focus', label: 'FOCUS'},  // 포커스 지점 (카메라 거리와 동일)
				{z: 35, color: 'far', label: 'FAR'}       // 원거리
			];

			focusMarkers.forEach((marker, index) => {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				mesh.x = 15;  // 오른쪽에 배치
				mesh.y = 5;   // 약간 위에
				mesh.z = marker.z;

				// 🎯 마커별 크기 차별화
				const scale = marker.color === 'focus' ? 6 : 4;
				mesh.setScale(scale);

				// 마커별 다른 회전
				mesh.rotationY = index * 90;

				scene.addChild(mesh);
			});

			// 🎯 추가: 전경/배경 구분용 큰 객체들
			// 전경 (Near blur 테스트용)
			const nearObject = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
			nearObject.x = -10;
			nearObject.y = 0;
			nearObject.z = 5;   // 매우 가까이
			nearObject.setScale(4);
			nearObject.rotationY = 45;
			scene.addChild(nearObject);

			// 배경 (Far blur 테스트용)
			const farObject = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
			farObject.x = 10;
			farObject.y = 0;
			farObject.z = 50;   // 멀리
			farObject.setScale(8);
			farObject.rotationY = -45;
			scene.addChild(farObject);
		}
	)
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {createPostEffectLabel} = await import('../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js?t=1767866967649');
	createPostEffectLabel('DOF', redGPUContext.detector.isMobile)
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767866967649");
	setDebugButtons(redGPUContext);
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767866967649');
	const pane = new Pane();
	const effect = targetView.postEffectManager.getEffectAt(0)

	const TEST_STATE = {
		DOF: true,
		currentPreset: 'Game Default',
		focusDistance: effect.focusDistance,
		aperture: effect.aperture,
		maxCoC: effect.maxCoC,
		nearPlane: effect.nearPlane,
		farPlane: effect.farPlane,
		nearBlurSize: effect.nearBlurSize,
		farBlurSize: effect.farBlurSize,
		nearStrength: effect.nearStrength,
		farStrength: effect.farStrength,
	}

	const folder = pane.addFolder({title: 'DOF Settings', expanded: true})

	// DOF On/Off
	folder.addBinding(TEST_STATE, 'DOF').on('change', (v) => {
		if (v.value) {
			const newEffect = new RedGPU.PostEffect.DOF(redGPUContext);
			newEffect.focusDistance = TEST_STATE.focusDistance;
			newEffect.aperture = TEST_STATE.aperture;
			newEffect.maxCoC = TEST_STATE.maxCoC;
			newEffect.nearPlane = TEST_STATE.nearPlane;
			newEffect.farPlane = TEST_STATE.farPlane;
			newEffect.nearBlurSize = TEST_STATE.nearBlurSize;
			newEffect.farBlurSize = TEST_STATE.farBlurSize;
			newEffect.nearStrength = TEST_STATE.nearStrength;
			newEffect.farStrength = TEST_STATE.farStrength;
			targetView.postEffectManager.addEffect(newEffect);
		} else {
			targetView.postEffectManager.removeAllEffect();
		}
		updateControlsState(!v.value);
	});

	folder.addBinding(TEST_STATE, 'currentPreset', {
		readonly: true,
		label: 'Current Preset'
	});

	const detailFolder = folder.addFolder({title: 'Manual Controls', expanded: true});

	const focusDistanceControl = detailFolder.addBinding(TEST_STATE, 'focusDistance', {
		min: 5,
		max: 50,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.focusDistance = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const apertureControl = detailFolder.addBinding(TEST_STATE, 'aperture', {
		min: 1.0,
		max: 8.0,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.aperture = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const maxCoCControl = detailFolder.addBinding(TEST_STATE, 'maxCoC', {
		min: 10,
		max: 100,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.maxCoC = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const nearBlurSizeControl = detailFolder.addBinding(TEST_STATE, 'nearBlurSize', {
		min: 5,
		max: 50,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.nearBlurSize = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const farBlurSizeControl = detailFolder.addBinding(TEST_STATE, 'farBlurSize', {
		min: 5,
		max: 50,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.farBlurSize = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const nearStrengthControl = detailFolder.addBinding(TEST_STATE, 'nearStrength', {
		min: 0,
		max: 3.0,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.nearStrength = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	const farStrengthControl = detailFolder.addBinding(TEST_STATE, 'farStrength', {
		min: 0,
		max: 3.0,
		step: 0.1
	}).on('change', (v) => {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (currentEffect) {
			currentEffect.farStrength = v.value;
			TEST_STATE.currentPreset = 'Custom';
			pane.refresh();
		}
	});

	// 프리셋 폴더
	const presetFolder = folder.addFolder({title: 'DOF Presets', expanded: true});

	function applyPreset(presetName, presetMethod) {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (!currentEffect) return;

		if (presetMethod && typeof currentEffect[presetMethod] === 'function') {
			currentEffect[presetMethod]();
		}

		TEST_STATE.currentPreset = presetName;
		updateUIFromEffect(currentEffect);
	}

	presetFolder.addButton({
		title: '🎮 Game Default',
	}).on('click', () => {
		applyPreset('Game Default', 'setGameDefault');
	});

	presetFolder.addButton({
		title: '🎬 Cinematic',
	}).on('click', () => {
		applyPreset('Cinematic', 'setCinematic');
	});

	presetFolder.addButton({
		title: '📷 Portrait',
	}).on('click', () => {
		applyPreset('Portrait', 'setPortrait');
	});

	presetFolder.addButton({
		title: '🌄 Landscape',
	}).on('click', () => {
		applyPreset('Landscape', 'setLandscape');
	});

	presetFolder.addButton({
		title: '🔍 Macro',
	}).on('click', () => {
		applyPreset('Macro', 'setMacro');
	});

	presetFolder.addButton({
		title: '🏃 Sports',
	}).on('click', () => {
		applyPreset('Sports', 'setSports');
	});

	presetFolder.addButton({
		title: '🌙 Night Mode',
	}).on('click', () => {
		applyPreset('Night Mode', 'setNightMode');
	});

	// 유틸리티 함수들
	function updateControlsState(disabled) {
		focusDistanceControl.disabled = disabled;
		apertureControl.disabled = disabled;
		maxCoCControl.disabled = disabled;
		nearBlurSizeControl.disabled = disabled;
		farBlurSizeControl.disabled = disabled;
		nearStrengthControl.disabled = disabled;
		farStrengthControl.disabled = disabled;
	}

	function updateUIFromEffect(effect) {
		TEST_STATE.focusDistance = effect.focusDistance;
		TEST_STATE.aperture = effect.aperture;
		TEST_STATE.maxCoC = effect.maxCoC;
		TEST_STATE.nearBlurSize = effect.nearBlurSize;
		TEST_STATE.farBlurSize = effect.farBlurSize;
		TEST_STATE.nearStrength = effect.nearStrength;
		TEST_STATE.farStrength = effect.farStrength;

		pane.refresh();
	}
};
