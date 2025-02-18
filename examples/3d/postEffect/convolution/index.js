import * as RedGPU from "../../../../dist/index.js";

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

		const effect = new RedGPU.PostEffect.Convolution(redGPUContext)

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
			"../../../assets/skybox/px.jpg", // Positive X
			"../../../assets/skybox/nx.jpg", // Negative X
			"../../../assets/skybox/py.jpg", // Positive Y
			"../../../assets/skybox/ny.jpg", // Negative Y
			"../../../assets/skybox/pz.jpg", // Positive Z
			"../../../assets/skybox/nz.jpg", // Negative Z
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

	const view = redGPUContext.viewList[0];
	const TEST_STATE = {
		Convolution: true,
		kernel: 'BLUR',
		useCustomKernel: false,
		customMatrix: [...view.postEffectManager.getEffectAt(0).kernel]
	};

	const convolutionMatrices = {
		NORMAL: RedGPU.PostEffect.Convolution.NORMAL,
		SHARPEN: RedGPU.PostEffect.Convolution.SHARPEN,
		BLUR: RedGPU.PostEffect.Convolution.BLUR,
		EDGE: RedGPU.PostEffect.Convolution.EDGE,
		EMBOSE: RedGPU.PostEffect.Convolution.EMBOSE,
	};

	const updateEffectKernel = () => {
		const effect = view.postEffectManager.getEffectAt(0);
		if (!effect) return;
		effect.kernel = TEST_STATE.useCustomKernel
			? TEST_STATE.customMatrix
			: convolutionMatrices[TEST_STATE.kernel];
	};

	const folder = pane.addFolder({title: 'PostEffect', expanded: true});

	// Convolution 활성화/비활성화
	folder.addBinding(TEST_STATE, 'Convolution').on('change', (v) => {
		if (v.value) {
			const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
			effect.kernel = TEST_STATE.useCustomKernel
				? TEST_STATE.customMatrix
				: convolutionMatrices[TEST_STATE.kernel];
			view.postEffectManager.addEffect(effect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		typeControl.disabled = !v.value && TEST_STATE.useCustomKernel;
		customMatrixFolder.hidden = !v.value;
	});

	// 필터 타입 선택
	const typeControl = folder.addBinding(TEST_STATE, 'kernel', {
		options: {
			Normal: 'NORMAL',
			Sharpen: 'SHARPEN',
			Blur: 'BLUR',
			Edge: 'EDGE',
			Embose: 'EMBOSE',
		},
	}).on('change', (v) => {
		const effect = view.postEffectManager.getEffectAt(0);
		if (effect) {
			TEST_STATE.customMatrix.forEach(
				(_, index) => (TEST_STATE.customMatrix[index] = convolutionMatrices[v.value][index])
			);
			updateEffectKernel();
			pane.refresh();
		}
	});

	// Custom Kernel
	const customMatrixFolder = pane.addFolder({title: 'Custom Kernel', expanded: true});
	customMatrixFolder.addBinding(TEST_STATE, 'useCustomKernel').on('change', (v) => {
		typeControl.disabled = v.value;
		customMatrixSliders.forEach((slider, index) => {
			slider.disabled = !v.value || index % 4 === 3; // useCustomKernel이 false이거나 마지막 컬럼인 경우 비활성화
		});
		if (v.value) {
			TEST_STATE.customMatrix.forEach(
				(_, index) => (TEST_STATE.customMatrix[index] = convolutionMatrices[TEST_STATE.kernel][index])
			);
			updateEffectKernel();
			pane.refresh();
		} else {
			updateEffectKernel();
		}
	});

	// Custom Matrix 입력 슬라이더 생성
// Custom Matrix 입력 슬라이더 생성
	const customMatrixSliders = [];
	TEST_STATE.customMatrix.forEach((_, index) => {
		const slider = customMatrixFolder.addBinding(TEST_STATE.customMatrix, index, {
			min: -2,
			max: 2,
			step: 0.001,
			label: `Row ${Math.floor(index / 4) + 1}, Col ${index % 4 + 1}`,
		});
		slider.disabled = true; // 마지막 컬럼 비활성화
		customMatrixSliders.push(slider);
	});

	// 값 변경 시 반영
	pane.on('change', updateEffectKernel);

};
