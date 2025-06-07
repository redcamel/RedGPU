import * as RedGPU from "../../../../../dist";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 15  // 카메라를 더 멀리
		controller.speedDistance = 0.5
		controller.tilt = -15     // 약간 위에서 내려다보기

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);
		const cubeTexture =
			new RedGPU.Resource.CubeTexture(redGPUContext, [
				"../../../../assets/skybox/px.jpg",
				"../../../../assets/skybox/nx.jpg",
				"../../../../assets/skybox/py.jpg",
				"../../../../assets/skybox/ny.jpg",
				"../../../../assets/skybox/pz.jpg",
				"../../../../assets/skybox/nz.jpg",
			])
		view.iblTexture = cubeTexture
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		scene.lightManager.addDirectionalLight(directionalLightTest)
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',);

		const effect = new RedGPU.PostEffect.DOF(redGPUContext)

		view.postEffectManager.addEffect(effect)

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {

		};
		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext)

	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view

	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			const originalMesh = v['resultMesh']

			// DOF 효과가 잘 보이도록 정육면체 공간에 랜덤 배치
			const totalObjects = 600

			// 정육면체 크기 설정
			const cubeSize = 30  // 정육면체 한 변의 길이
			const halfSize = cubeSize / 2

			for (let i = 0; i < totalObjects; i++) {
				const mesh = originalMesh.clone()

				// 정육면체 내부에 완전 랜덤 배치
				mesh.x = (Math.random() - 0.5) * cubeSize  // -40 ~ +40
				mesh.y = (Math.random() - 0.5) * cubeSize  // -40 ~ +40
				mesh.z = (Math.random() - 0.5) * cubeSize  // -40 ~ +40

				// 랜덤 회전 (더 자연스럽게)
				mesh.rotationX = Math.random() * Math.PI * 2
				mesh.rotationY = Math.random() * Math.PI * 2
				mesh.rotationZ = Math.random() * Math.PI * 2

				// 거리에 따른 크기 조정 (원근감)
				const distanceFromCenter = Math.sqrt(mesh.x * mesh.x + mesh.y * mesh.y + mesh.z * mesh.z)
				const scale = 8 + (distanceFromCenter / halfSize) * 4  // 8~12 크기
				// mesh.setScale(scale)


				scene.addChild(mesh)
			}

		}
	)
}

const renderTestPane = async (redGPUContext) => {
	const {setRedGPUTest_pane} = await import("../../../../exampleHelper/createExample/panes/index.js");

	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();
	const view = redGPUContext.viewList[0]
	const effect = view.postEffectManager.getEffectAt(0)

	const TEST_STATE = {
		DOF: true,
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
			view.postEffectManager.addEffect(newEffect);
		} else {
			view.postEffectManager.removeAllEffect();
		}

		focusDistanceControl.disabled = !v.value;
		apertureControl.disabled = !v.value;
		maxCoCControl.disabled = !v.value;
		// nearPlaneControl.disabled = !v.value;
		// farPlaneControl.disabled = !v.value;
		nearBlurSizeControl.disabled = !v.value;
		farBlurSizeControl.disabled = !v.value;
		nearStrengthControl.disabled = !v.value;
		farStrengthControl.disabled = !v.value;
	});

	// Focus Distance - 오브젝트 배치 범위에 맞춘 조정
	const focusDistanceControl = folder.addBinding(TEST_STATE, 'focusDistance', {
		min: 10,      // 가까운 오브젝트
		max: 200,     // 먼 오브젝트
		step: 5       // 5 유닛 단위로 조절
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).focusDistance = v.value
		}
	})

	// Aperture
	const apertureControl = folder.addBinding(TEST_STATE, 'aperture', {
		min: 1.0,     // 매우 넓은 조리개 (더 강한 효과)
		max: 8.0,     // 적당히 좁은 조리개
		step: 0.1
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).aperture = v.value
		}
	})

	// MaxCoC
	const maxCoCControl = folder.addBinding(TEST_STATE, 'maxCoC', {
		min: 10,      // 최소 흐림
		max: 100,     // 매우 큰 흐림
		step: 5
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).maxCoC = v.value
		}
	})
	//
	// // Near Plane - 새로 추가
	// const nearPlaneControl = folder.addBinding(TEST_STATE, 'nearPlane', {
	// 	min: 0.01,    // 매우 가까운 근평면
	// 	max: 1.0,     // 조금 먼 근평면
	// 	step: 0.01
	// }).on('change', (v) => {
	// 	if (view.postEffectManager.getEffectAt(0)) {
	// 		view.postEffectManager.getEffectAt(0).nearPlane = v.value
	// 	}
	// })
	//
	// // Far Plane - 새로 추가
	// const farPlaneControl = folder.addBinding(TEST_STATE, 'farPlane', {
	// 	min: 100,     // 가까운 원평면
	// 	max: 5000,    // 매우 먼 원평면
	// 	step: 100
	// }).on('change', (v) => {
	// 	if (view.postEffectManager.getEffectAt(0)) {
	// 		view.postEffectManager.getEffectAt(0).farPlane = v.value
	// 	}
	// })

	// Near Blur Size
	const nearBlurSizeControl = folder.addBinding(TEST_STATE, 'nearBlurSize', {
		min: 5,       // 최소 블러
		max: 50,      // 매우 큰 블러
		step: 2
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).nearBlurSize = v.value
		}
	})

	// Far Blur Size
	const farBlurSizeControl = folder.addBinding(TEST_STATE, 'farBlurSize', {
		min: 5,       // 최소 블러
		max: 50,      // 매우 큰 블러
		step: 2
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).farBlurSize = v.value
		}
	})

	// Near Strength
	const nearStrengthControl = folder.addBinding(TEST_STATE, 'nearStrength', {
		min: 0,       // 효과 없음
		max: 3.0,     // 매우 강한 효과
		step: 0.1
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).nearStrength = v.value
		}
	})

	// Far Strength
	const farStrengthControl = folder.addBinding(TEST_STATE, 'farStrength', {
		min: 0,       // 효과 없음
		max: 3.0,     // 매우 강한 효과
		step: 0.1
	}).on('change', (v) => {
		if (view.postEffectManager.getEffectAt(0)) {
			view.postEffectManager.getEffectAt(0).farStrength = v.value
		}
	})
};
