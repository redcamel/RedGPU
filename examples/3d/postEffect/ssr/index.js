import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// ============================================
		// 기본 설정
		// ============================================

		// 궤도형 카메라 컨트롤러 생성 (더 가까이 배치)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 8; // 더 멀리 배치하여 반사 효과 확인
		controller.speedDistance = 0.2;
		controller.tilt = -15; // 약간 위에서 내려다보는 각도


		// 씬 생성
		const scene = new RedGPU.Display.Scene();

		// ============================================
		// 뷰 생성 및 설정
		// ============================================

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

		// 일반 뷰 생성
		const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewNormal.ibl = ibl;
		viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
		// redGPUContext.addView(viewNormal);

		// SSR 이펙트 뷰 생성
		const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		viewEffect.ibl = ibl;
		viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
		const ssrEffect = new RedGPU.PostEffect.SSR(redGPUContext);
		const taaEffect = new RedGPU.PostEffect.TAA(redGPUContext)
		viewEffect.postEffectManager.addEffect(ssrEffect);
		viewEffect.postEffectManager.addEffect(taaEffect);
		redGPUContext.addView(viewEffect);

		// ============================================
		// 씬 설정 - SSR에 적합한 반사 물체들 추가
		// ============================================

		// 조명 추가 (더 강한 조명)
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 2.0; // 더 밝게
		scene.lightManager.addDirectionalLight(directionalLight);

		const normalTexture= new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/phongMaterial/test_normalMap.jpg");
		//
		// // 바닥 평면 추가 (반사면)
		const floorGeometry = new RedGPU.Primitive.Circle(redGPUContext, 13.5);
		const floorMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		floorMaterial.color.setColorByHEX('#11332f')
		floorMaterial.color.r = 128
		//
		const floorMesh = new RedGPU.Display.Mesh(redGPUContext, floorGeometry, floorMaterial);
		floorMesh.rotationX = 90

		scene.addChild(floorMesh);

		// 여러 개의 반사 구체 추가
		const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 16);

		// 금속 구체
		const metalMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		// metalMaterial.specularStrength = 0.1
		metalMaterial.color.setColorByHEX('#af532e')

		const metalSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metalMaterial);
		metalSphere.x = -2;
		metalSphere.y = 0;
		scene.addChild(metalSphere);

		// 반투명 구체
		const glassMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		glassMaterial.opacity = 0.3;

		const glassSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, glassMaterial);
		glassSphere.x = 2;
		glassSphere.y = 0;
		scene.addChild(glassSphere);

		// 원래 모델도 유지
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MetalRoughSpheres/glTF-Binary/MetalRoughSpheres.glb');
		// loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf');

		// ============================================
		// 레이아웃 설정
		// ============================================

		// if (redGPUContext.detector.isMobile) {
		// 	// 모바일: 위아래 분할
		// 	viewNormal.setSize('100%', '50%');
		// 	viewNormal.setPosition(0, 0);         // 상단
		// 	viewEffect.setSize('100%', '50%');
		// 	viewEffect.setPosition(0, '50%');     // 하단
		// } else {
		// 	// 데스크톱: 좌우 분할
		// 	viewNormal.setSize('50%', '100%');
		// 	viewNormal.setPosition(0, 0);         // 좌측
		// 	viewEffect.setSize('50%', '100%');
		// 	viewEffect.setPosition('50%', 0);     // 우측
		// }

		// ============================================
		// 애니메이션 추가 (반사 효과를 더 잘 보이게)
		// ============================================

		let time2 = 0;
		const render = (time) => {
			time2 += 0.01;

			// // 구체들을 회전시키고 위아래로 움직임
			if (metalSphere) {
				metalSphere.rotationY += 0.02;
				metalSphere.y = Math.sin(time2) * 0.5;
			}

			if (glassSphere) {
				glassSphere.rotationX += 0.015;
				glassSphere.y = Math.cos(time2 * 1.2) * 0.3;
			}


			// floorMaterial.color.r = Math.floor(Math.abs(Math.sin(time * 0.001)) * 255);
		};

		// ============================================
		// 렌더링 시작
		// ============================================

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, render);

		// SSR 컨트롤 패널 생성
		renderSSRTestPane(redGPUContext, viewEffect, ssrEffect,taaEffect);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(redGPUContext, scene, url) {
	let mesh;
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh']);
			// 모델을 약간 위로 배치
			if (url.includes('DamagedHelmet')) {
				mesh.y = 1;
			}
			if (url.includes('MetalRoughSpheres')) {
				mesh.z = -2
			}
			if (url.includes('Sponza')) {
				mesh.setScale(2)
			}
		}
	);
}
const renderSSRTestPane = async (redGPUContext, targetView, ssrEffect,taaEffect) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createPostEffectLabel} = await import('../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js');
	createPostEffectLabel('SSR (Screen Space Reflection)', redGPUContext.detector.isMobile);
	const {setDebugViewButton,createIblHelper,setAntialiasing_pane} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugViewButton(redGPUContext);
	const pane = new Pane({title: 'SSR Controls'});
	setAntialiasing_pane(pane, redGPUContext, true);
	createIblHelper(pane,targetView,RedGPU)

	const TEST_STATE = {
		enableSSR: true,
		enableTAA: true,
		maxSteps: ssrEffect.maxSteps,
		maxDistance: ssrEffect.maxDistance,
		stepSize: ssrEffect.stepSize,
		reflectionIntensity: ssrEffect.reflectionIntensity,
		fadeDistance: ssrEffect.fadeDistance,
		edgeFade: ssrEffect.edgeFade,
		jitterStrength: taaEffect.jitterStrength,
	};

	const folder = pane.addFolder({title: 'SSR Settings', expanded: true});

	folder.addBinding(TEST_STATE, 'enableSSR').on('change', (v) => {
		if (v.value) {
			targetView.postEffectManager.addEffect(ssrEffect);
		} else {
			targetView.postEffectManager.removeAllEffect();
		}
	});
	folder.addBinding(TEST_STATE, 'enableTAA').on('change', (v) => {
		if (v.value) {
			targetView.postEffectManager.addEffect(taaEffect);
		} else {
			targetView.postEffectManager.removeAllEffect();
			taaEffect.clear()
		}
	});

	folder.addBinding(TEST_STATE, 'jitterStrength', {min: 0, max: 2, step: 0.01})
		.on('change', (v) => {
			taaEffect.jitterStrength = v.value;
			TEST_STATE.jitterStrength = v.value;
		});
	folder.addBinding(taaEffect, 'varianceClipping');
	folder.addBinding(TEST_STATE, 'maxSteps', {min: 16, max: 128, step: 1})
		.on('change', (v) => {
			ssrEffect.maxSteps = v.value;
			TEST_STATE.maxSteps = v.value;
		});

	folder.addBinding(TEST_STATE, 'maxDistance', {min: 1, max: 50, step: 0.01})
		.on('change', (v) => {
			ssrEffect.maxDistance = v.value;
			TEST_STATE.maxDistance = v.value;
		});

	folder.addBinding(TEST_STATE, 'stepSize', {min: 0.00002, max: 0.1, step: 0.0001})
		.on('change', (v) => {
			ssrEffect.stepSize = v.value;
			TEST_STATE.stepSize = v.value;
		});

	folder.addBinding(TEST_STATE, 'reflectionIntensity', {min: 0.1, max: 3.5, step: 0.01})
		.on('change', (v) => {
			ssrEffect.reflectionIntensity = v.value;
			TEST_STATE.reflectionIntensity = v.value;
		});

	folder.addBinding(TEST_STATE, 'fadeDistance', {min: 1, max: 25, step: 0.1})
		.on('change', (v) => {
			ssrEffect.fadeDistance = v.value;
			TEST_STATE.fadeDistance = v.value;
		});

	folder.addBinding(TEST_STATE, 'edgeFade', {min: 0.05, max: 0.3, step: 0.005})
		.on('change', (v) => {
			ssrEffect.edgeFade = v.value;
			TEST_STATE.edgeFade = v.value;
		});


	const presetFolder = pane.addFolder({title: 'Presets'});

	presetFolder.addButton({title: 'High Quality'}).on('click', () => {
		TEST_STATE.maxSteps = 96;
		TEST_STATE.stepSize = 0.05;
		TEST_STATE.reflectionIntensity = 1.0;
		TEST_STATE.fadeDistance = 15;
		TEST_STATE.edgeFade = 0.15;

		Object.assign(ssrEffect, TEST_STATE);
		pane.refresh();
	});

	presetFolder.addButton({title: 'Balanced'}).on('click', () => {
		TEST_STATE.maxSteps = 64;
		TEST_STATE.stepSize = 0.08;
		TEST_STATE.reflectionIntensity = 0.8;
		TEST_STATE.fadeDistance = 12;
		TEST_STATE.edgeFade = 0.12;

		Object.assign(ssrEffect, TEST_STATE);
		pane.refresh();
	});

	presetFolder.addButton({title: 'Performance'}).on('click', () => {
		TEST_STATE.maxSteps = 32;
		TEST_STATE.stepSize = 0.12;
		TEST_STATE.reflectionIntensity = 0.6;
		TEST_STATE.fadeDistance = 8;
		TEST_STATE.edgeFade = 0.1;

		Object.assign(ssrEffect, TEST_STATE);
		pane.refresh();
	});

};
