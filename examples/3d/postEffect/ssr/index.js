import * as RedGPU from "../../../../dist/index.js";

// 캔버스 생성
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

// RedGPU 초기화
RedGPU.init(canvas, (redGPUContext) => {
	// 카메라 설정
	const controller = new RedGPU.Camera.ObitController(redGPUContext);
	controller.distance = 3;
	controller.tilt = -15;

	// 씬 생성
	const scene = new RedGPU.Display.Scene();

	// IBL 및 스카이박스 설정
	const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

	// SSR 뷰 생성
	const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
	view.ibl = ibl;
	view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

	// SSR 이펙트 추가
	const ssrEffect = new RedGPU.PostEffect.SSR(redGPUContext);
	view.postEffectManager.addEffect(ssrEffect);
	redGPUContext.addView(view);

	// 조명 설정
	const directionalLight = new RedGPU.Light.DirectionalLight();
	directionalLight.intensity = 2.0;
	scene.lightManager.addDirectionalLight(directionalLight);

	// 테스트 오브젝트들 생성
	const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 16);

	// 금속 구체
	const metalMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
	metalMaterial.color.setColorByHEX('#af532e');
	metalMaterial.useSSR = true;
	metalMaterial.metallic = 0.1;
	const metalSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metalMaterial);
	metalSphere.x = -1.5;

	scene.addChild(metalSphere);

	{
		const sphereGeometry = new RedGPU.Primitive.Ground(redGPUContext,50,50);
		const metalMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		metalMaterial.color.setColorByHEX('#00ff00');
		metalMaterial.useSSR = true;
		metalMaterial.metallic = 0.5;
		const metalSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metalMaterial);
		metalSphere.y = -1;

		scene.addChild(metalSphere);
	}

	// GLTF 모델 로딩
	const gltfModels = [
		{ url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', position: {} },
		{ url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MetalRoughSpheres/glTF-Binary/MetalRoughSpheres.glb', position: { z: -2 } },
		{ url: '../../../assets/gltf/busterDrone/busterDrone.gltf', position: { x: 2,} },

	];

	gltfModels.forEach(({ url, position,scale }) => {
		new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
			const mesh = scene.addChild(result.resultMesh);
			Object.assign(mesh, position);
		mesh.setScale(scale || 1)

		});
	});

	// 애니메이션 설정
	let time = 0;
	const animate = () => {
		time += 0.01;

		if (metalSphere) {
			metalSphere.rotationY += 0.02;
			metalSphere.y = Math.sin(time) * 0.5;
		}

	};

	// 렌더링 시작
	const renderer = new RedGPU.Renderer(redGPUContext);
	renderer.start(redGPUContext, animate);

	// 컨트롤 패널 생성
	createSSRControls(redGPUContext, view, ssrEffect);
});

// SSR 컨트롤 패널
async function createSSRControls(redGPUContext, targetView, ssrEffect) {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane({ title: 'SSR Controls' });
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(redGPUContext);
	const settings = {
		enableSSR: true,
		maxSteps: ssrEffect.maxSteps,
		maxDistance: ssrEffect.maxDistance,
		stepSize: ssrEffect.stepSize,
		reflectionIntensity: ssrEffect.reflectionIntensity,
		fadeDistance: ssrEffect.fadeDistance,
		edgeFade: ssrEffect.edgeFade,

	};

	// SSR 토글
	pane.addBinding(settings, 'enableSSR').on('change', (e) => {
		if (e.value) {
			targetView.postEffectManager.addEffect(ssrEffect);
		} else {
			targetView.postEffectManager.removeAllEffect();
		}
	});

	// SSR 파라미터 조절
	const params = [
		{ key: 'maxSteps', min: 16, max: 128, step: 1 },
		{ key: 'maxDistance', min: 1, max: 50, step: 0.01 },
		{ key: 'stepSize', min: 0.01, max: 0.1, step: 0.0001 },
		{ key: 'reflectionIntensity', min: 0.1, max: 3.5, step: 0.01 },
		{ key: 'fadeDistance', min: 1, max: 25, step: 0.1 },
		{ key: 'edgeFade', min: 0.05, max: 0.3, step: 0.005 }
	];

	params.forEach(({ key, min, max, step }) => {
		pane.addBinding(settings, key, { min, max, step }).on('change', (e) => {
			ssrEffect[key] = e.value;
		});
	});

	// 프리셋 버튼들
	const presets = {
		'High Quality': { maxSteps: 96, stepSize: 0.05, reflectionIntensity: 1.0, fadeDistance: 15, edgeFade: 0.15 },
		'Balanced': { maxSteps: 64, stepSize: 0.08, reflectionIntensity: 0.8, fadeDistance: 12, edgeFade: 0.12 },
		'Performance': { maxSteps: 32, stepSize: 0.12, reflectionIntensity: 0.6, fadeDistance: 8, edgeFade: 0.1 }
	};

	const presetFolder = pane.addFolder({ title: 'Presets' });
	Object.entries(presets).forEach(([name, preset]) => {
		presetFolder.addButton({ title: name }).on('click', () => {
			Object.assign(settings, preset);
			Object.assign(ssrEffect, preset);
			pane.refresh();
		});
	});
}
