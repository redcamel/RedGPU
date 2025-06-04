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

		const effect = new RedGPU.PostEffect.Vibrance(redGPUContext)

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
		Vibrance: true,

		vibrance: view.postEffectManager.getEffectAt(0).vibrance,
		saturation: view.postEffectManager.getEffectAt(0).saturation,



	}
	const folder = pane.addFolder({title: 'PostEffect', expanded: true})
	// Vibrance 토글
	folder.addBinding(TEST_STATE, 'Vibrance').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
			effect.vibrance = TEST_STATE.vibrance;
			effect.saturation = TEST_STATE.saturation;
			view.postEffectManager.addEffect(effect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		// 조정바 활성화/비활성화
		vibranceControl.disabled = !v.value;
		saturationControl.disabled = !v.value;
	});
	const vibranceControl = folder.addBinding(TEST_STATE, 'vibrance', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).vibrance = v.value
	})
	const saturationControl = folder.addBinding(TEST_STATE, 'saturation', {min: -100, max: 100}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).saturation = v.value
	})




};
