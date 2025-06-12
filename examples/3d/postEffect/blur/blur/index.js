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
		controller.distance = 3;
		controller.speedDistance = 0.1;
		controller.tilt = 0;

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
		viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.Blur(redGPUContext));
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
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createPostEffectLabel} = await import('../../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js');
	createPostEffectLabel('Blur', redGPUContext.detector.isMobile)
	const pane = new Pane();

	const TEST_STATE = {
		Blur: true,
		size: targetView.postEffectManager.getEffectAt(0).size,
	}
	const folder = pane.addFolder({title: 'PostEffect', expanded: true})
	// Blur 토글
	folder.addBinding(TEST_STATE, 'Blur').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.Blur(redGPUContext);
			effect.size = TEST_STATE.size;
			targetView.postEffectManager.addEffect(effect);
		} else {
			targetView.postEffectManager.removeAllEffect();
		}

	});
};
