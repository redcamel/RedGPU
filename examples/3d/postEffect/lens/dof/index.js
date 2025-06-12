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
		controller.distance = 30;
		controller.speedDistance = 0.5;
		controller.tilt = -15;

		// 스카이박스 텍스처 생성
		const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
			"../../../../assets/skybox/px.jpg", // Positive X
			"../../../../assets/skybox/nx.jpg", // Negative X
			"../../../../assets/skybox/py.jpg", // Positive Y
			"../../../../assets/skybox/ny.jpg", // Negative Y
			"../../../../assets/skybox/pz.jpg", // Positive Z
			"../../../../assets/skybox/nz.jpg", // Negative Z
		]);

		// 씬 생성
		const scene = new RedGPU.Display.Scene();

		// ============================================
		// 뷰 생성 및 설정
		// ============================================

		// 일반 뷰 생성
		const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewNormal.iblTexture = cubeTexture;
		viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
		redGPUContext.addView(viewNormal);

		// 이펙트 뷰 생성
		const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewEffect.iblTexture = cubeTexture;
		viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
		viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.DOF(redGPUContext));
		redGPUContext.addView(viewEffect);

		// ============================================
		// 씬 설정
		// ============================================

		// 조명 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 3D 모델 로드
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf');

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

	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg'))

			// 🎯 Z축 일렬 배치 (DOF 테스트용)
			const zLineObjects = 20;        // Z축 일렬로 배치할 오브젝트 수
			const zStart = -100;            // 시작 Z 위치 (가까운 곳)
			const zEnd = 100;               // 끝 Z 위치 (먼 곳)
			const zInterval = (zEnd - zStart) / (zLineObjects - 1);

			for (let i = 0; i < zLineObjects; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				// Z축 일정 간격 배치
				mesh.x = 0;                 // 중앙에 배치
				mesh.y = 0;                 // 중앙에 배치
				mesh.z = zStart + (i * zInterval);  // Z축으로 일정 간격

				// 거리별로 다른 색상/크기로 구분
				const normalizedDistance = i / (zLineObjects - 1);  // 0~1
				const scale = 3 + normalizedDistance * 2;  // 3~5 크기 (먼 것일수록 크게)
				mesh.setScale(scale);

				// 약간의 회전으로 구분 쉽게
				mesh.rotationY = i * 15;  // 각각 다른 Y축 회전

				scene.addChild(mesh);
			}

			// 🌐 기존 랜덤 배치 (배경용)
			const totalRandomObjects = 300;  // 랜덤 오브젝트 수 줄임
			const cubeSize = 50;
			const halfSize = cubeSize / 2;

			for (let i = 0; i < totalRandomObjects; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				// 정육면체 내부에 완전 랜덤 배치 (하지만 중앙 Z축은 피하기)
				mesh.x = (Math.random() - 0.5) * cubeSize;
				mesh.y = (Math.random() - 0.5) * cubeSize;
				mesh.z = (Math.random() - 0.5) * cubeSize * 4;

				// 중앙 Z축 라인과 겹치지 않도록 조정
				if (Math.abs(mesh.x) < 15 && Math.abs(mesh.y) < 15) {
					mesh.x += mesh.x > 0 ? 20 : -20;  // 중앙에서 벗어나게
				}

				// 랜덤 회전
				mesh.rotationX = Math.random() * 360;
				mesh.rotationY = Math.random() * 360;
				mesh.rotationZ = Math.random() * 360;

				// 거리에 따른 크기 조정
				const distanceFromCenter = Math.sqrt(mesh.x * mesh.x + mesh.y * mesh.y + mesh.z * mesh.z);
				const scale = 1 + (distanceFromCenter / halfSize) * 2;  // 1~3 크기 (작게)
				mesh.setScale(scale);

				scene.addChild(mesh);
			}

			// 🎯 추가: 포커스 참조용 특별한 오브젝트들
			const focusMarkers = [
				{z: -50, color: 'near'},   // 근거리 마커
				{z: 0, color: 'focus'},    // 포커스 지점 마커
				{z: 50, color: 'far'}      // 원거리 마커
			];

			focusMarkers.forEach((marker, index) => {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);

				mesh.x = 25;  // 오른쪽에 배치
				mesh.y = 0;
				mesh.z = marker.z;

				// 마커별로 다른 크기
				const scale = marker.color === 'focus' ? 8 : 5;  // 포커스 지점은 크게
				mesh.setScale(scale);

				// 마커별로 다른 회전
				mesh.rotationY = index * 120;  // 120도씩 다르게

				scene.addChild(mesh);
			});
		}
	)
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {createPostEffectLabel} = await import('../../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js');
	createPostEffectLabel('DOF', redGPUContext.detector.isMobile)

	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();
	const effect = targetView.postEffectManager.getEffectAt(0)

	const TEST_STATE = {
		DOF: true,
		currentPreset: 'Game Default', // 현재 활성화된 프리셋 표시용
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
			// 현재 설정값들로 복원
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

	// 현재 프리셋 표시 (읽기 전용)
	folder.addBinding(TEST_STATE, 'currentPreset', {
		readonly: true,
		label: 'Current Preset'
	});

	// 세부 설정 폴더
	const detailFolder = folder.addFolder({title: 'Manual Controls', expanded: true});

	// 세부 설정 컨트롤들
	const focusDistanceControl = detailFolder.addBinding(TEST_STATE, 'focusDistance', {
		min: 1,
		max: 100,
		step: 1
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
		step: 5
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
		step: 2
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
		step: 2
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

	// 🎯 프리셋 버튼들
	const presetFolder = folder.addFolder({title: 'DOF Presets', expanded: true});

	// 프리셋 적용 함수
	function applyPreset(presetName, presetMethod) {
		const currentEffect = targetView.postEffectManager.getEffectAt(0);
		if (!currentEffect) return;

		// 프리셋 메서드 호출
		if (presetMethod && typeof currentEffect[presetMethod] === 'function') {
			currentEffect[presetMethod]();
		}

		// UI 상태 업데이트
		TEST_STATE.currentPreset = presetName;
		updateUIFromEffect(currentEffect);
	}

	// 🎮 게임 기본 버튼
	presetFolder.addButton({
		title: '🎮 Game Default',
	}).on('click', () => {
		applyPreset('Game Default', 'setGameDefault');
	});

	// 🎬 시네마틱 버튼
	presetFolder.addButton({
		title: '🎬 Cinematic',
	}).on('click', () => {
		applyPreset('Cinematic', 'setCinematic');
	});

	// 📷 인물 사진 버튼
	presetFolder.addButton({
		title: '📷 Portrait',
	}).on('click', () => {
		applyPreset('Portrait', 'setPortrait');
	});

	// 🌄 풍경 사진 버튼
	presetFolder.addButton({
		title: '🌄 Landscape',
	}).on('click', () => {
		applyPreset('Landscape', 'setLandscape');
	});

	// 🔍 매크로 촬영 버튼
	presetFolder.addButton({
		title: '🔍 Macro',
	}).on('click', () => {
		applyPreset('Macro', 'setMacro');
	});

	// 🏃 액션/스포츠 버튼
	presetFolder.addButton({
		title: '🏃 Sports',
	}).on('click', () => {
		applyPreset('Sports', 'setSports');
	});

	// 🌙 야간 촬영 버튼
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

		// UI 새로고침
		pane.refresh();
	}
};
