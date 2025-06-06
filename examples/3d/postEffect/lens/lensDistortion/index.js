import * as RedGPU from "../../../../../dist";

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

		const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext)

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
	const {setRedGPUTest_pane} = await import("../../../../exampleHelper/createExample/panes/index.js");

	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, true);

	const view = redGPUContext.viewList[0]
	const TEST_STATE = {
		LensDistortion: true,
		barrelStrength: view.postEffectManager.getEffectAt(0).barrelStrength,
		pincushionStrength: view.postEffectManager.getEffectAt(0).pincushionStrength,
		centerX: view.postEffectManager.getEffectAt(0).centerX,
		centerY: view.postEffectManager.getEffectAt(0).centerY,
	}
	const folder = pane.addFolder({title: 'PostEffect', expanded: true})
	// LensDistortion 토글
	folder.addBinding(TEST_STATE, 'LensDistortion').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
			effect.barrelStrength = TEST_STATE.barrelStrength;
			effect.pincushionStrength = TEST_STATE.pincushionStrength;
			effect.centerX = TEST_STATE.centerX;
			effect.centerY = TEST_STATE.centerY;
			view.postEffectManager.addEffect(effect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		// 조정바 활성화/비활성화
		barrelStrengthControl.disabled = !v.value;
		pincushionStrengthControl.disabled = !v.value;
		centerXControl.disabled = !v.value;
		centerYControl.disabled = !v.value;
	});
	const barrelStrengthControl = folder.addBinding(TEST_STATE, 'barrelStrength', {
		min: 0,
		max: 2
	}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).barrelStrength = v.value
	})
	const pincushionStrengthControl = folder.addBinding(TEST_STATE, 'pincushionStrength', {
		min: 0,
		max: 2
	}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).pincushionStrength = v.value
	})
	const centerXControl = folder.addBinding(TEST_STATE, 'centerX', {min: -300, max: 300}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).centerX = v.value
	})
	const centerYControl = folder.addBinding(TEST_STATE, 'centerY', {min: -300, max: 300}).on('change', (v) => {
		view.postEffectManager.getEffectAt(0).centerY = v.value
	})
};
