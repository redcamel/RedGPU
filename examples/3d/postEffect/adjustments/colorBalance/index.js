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
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',);

		const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext)

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
	const TEST_STATE = {
		ColorBalance: true,

		shadowCyanRed: view.postEffectManager.getEffectAt(0).shadowCyanRed,
		shadowMagentaGreen: view.postEffectManager.getEffectAt(0).shadowMagentaGreen,
		shadowYellowBlue: view.postEffectManager.getEffectAt(0).shadowYellowBlue,

		midtoneCyanRed: view.postEffectManager.getEffectAt(0).midtoneCyanRed,
		midtoneMagentaGreen: view.postEffectManager.getEffectAt(0).midtoneMagentaGreen,
		midtoneYellowBlue: view.postEffectManager.getEffectAt(0).midtoneYellowBlue,

		highlightCyanRed: view.postEffectManager.getEffectAt(0).highlightCyanRed,
		highlightMagentaGreen: view.postEffectManager.getEffectAt(0).highlightMagentaGreen,
		highlightYellowBlue: view.postEffectManager.getEffectAt(0).highlightYellowBlue,

		preserveLuminosity: view.postEffectManager.getEffectAt(0).preserveLuminosity,



	}
	const folder = pane.addFolder({title: 'PostEffect', expanded: true})
	// ColorBalance 토글
	folder.addBinding(TEST_STATE, 'ColorBalance').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
			effect.shadowCyanRed = TEST_STATE.shadowCyanRed;
			effect.shadowMagentaGreen = TEST_STATE.shadowMagentaGreen;
			effect.shadowYellowBlue = TEST_STATE.shadowYellowBlue;

			effect.midtoneCyanRed = TEST_STATE.midtoneCyanRed;
			effect.midtoneMagentaGreen = TEST_STATE.midtoneMagentaGreen;
			effect.midtoneYellowBlue = TEST_STATE.midtoneYellowBlue;

			effect.highlightCyanRed = TEST_STATE.highlightCyanRed;
			effect.highlightMagentaGreen = TEST_STATE.highlightMagentaGreen;
			effect.highlightYellowBlue = TEST_STATE.highlightYellowBlue;

			effect.preserveLuminosity = TEST_STATE.preserveLuminosity;
			view.postEffectManager.addEffect(effect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		// 조정바 활성화/비활성화
		shadowCyanRedControl.disabled = !v.value;
		shadowMagentaGreenControl.disabled = !v.value;
		shadowYellowBlueControl.disabled = !v.value;

		midtoneCyanRedControl.disabled = !v.value;
		midtoneMagentaGreenControl.disabled = !v.value;
		midtoneYellowBlueControl.disabled = !v.value;

		highlightCyanRedControl.disabled = !v.value;
		highlightMagentaGreenControl.disabled = !v.value;
		highlightYellowBlueControl.disabled = !v.value;

		preserveLuminosityControl.disabled = !v.value;
	});
	const shadowCyanRedControl = folder.addBinding(TEST_STATE, 'shadowCyanRed', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).shadowCyanRed = v.value
	})
	const shadowMagentaGreenControl = folder.addBinding(TEST_STATE, 'shadowMagentaGreen', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).shadowMagentaGreen = v.value
	})
	const shadowYellowBlueControl = folder.addBinding(TEST_STATE, 'shadowYellowBlue', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).shadowYellowBlue = v.value
	})
	const midtoneCyanRedControl = folder.addBinding(TEST_STATE, 'midtoneCyanRed', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).midtoneCyanRed = v.value
	})
	const midtoneMagentaGreenControl = folder.addBinding(TEST_STATE, 'midtoneMagentaGreen', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).midtoneMagentaGreen = v.value
	})
	const midtoneYellowBlueControl = folder.addBinding(TEST_STATE, 'midtoneYellowBlue', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).midtoneYellowBlue = v.value
	})
	const highlightCyanRedControl = folder.addBinding(TEST_STATE, 'highlightCyanRed', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).highlightCyanRed = v.value
	})
	const highlightMagentaGreenControl = folder.addBinding(TEST_STATE, 'highlightMagentaGreen', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).highlightMagentaGreen = v.value
	})
	const highlightYellowBlueControl = folder.addBinding(TEST_STATE, 'highlightYellowBlue', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).highlightYellowBlue = v.value
	})

		const preserveLuminosityControl = folder.addBinding(TEST_STATE, 'preserveLuminosity').on('change', (v) => {
		view.postEffectManager.getEffectAt(0).preserveLuminosity = v.value
	})




};
