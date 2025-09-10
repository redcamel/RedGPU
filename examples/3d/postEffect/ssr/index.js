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
		const sphereGeometry = new RedGPU.Primitive.Ground(redGPUContext,100,100);

		// 금속 구체
		const metalMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		metalMaterial.color.setColorByHEX('#278127');
		metalMaterial.useSSR = true;
		metalMaterial.metallic = 0.5;
		const metalSphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, metalMaterial);
		metalSphere.y = -0.5
		metalSphere.y = -1

		scene.addChild(metalSphere);
	}

	// GLTF 모델 로딩
	const gltfModels = [
		{ url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', position: {} },
		{ url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MetalRoughSpheres/glTF-Binary/MetalRoughSpheres.glb', position: { z: -2 } },

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

	// SSR 파라미터 조절 - 개선된 범위와 스텝값
	const params = [
		{ key: 'maxSteps', min: 16, max: 128, step: 1 },
		{ key: 'maxDistance', min: 1, max: 50, step: 0.1 },
		{ key: 'stepSize', min: 0.001, max: 0.1, step: 0.001 },
		{ key: 'reflectionIntensity', min: 0.0, max: 3.0, step: 0.01 },
		{ key: 'fadeDistance', min: 1, max: 25, step: 0.1 },
		{ key: 'edgeFade', min: 0.0, max: 0.5, step: 0.01 }
	];

	params.forEach(({ key, min, max, step }) => {
		pane.addBinding(settings, key, { min, max, step }).on('change', (e) => {
			ssrEffect[key] = e.value;
		});
	});

	// 내장된 품질 프리셋을 활용한 개선된 프리셋 버튼들
	const presetFolder = pane.addFolder({ title: 'Quality Presets' });

	// SSR 클래스의 내장 품질 프리셋 사용
	presetFolder.addButton({ title: 'High Quality' }).on('click', () => {
		ssrEffect.applyQualityPreset('high');
		updateSettingsFromEffect();
		pane.refresh();
	});

	presetFolder.addButton({ title: 'Medium Quality' }).on('click', () => {
		ssrEffect.applyQualityPreset('medium');
		updateSettingsFromEffect();
		pane.refresh();
	});

	presetFolder.addButton({ title: 'Low Quality' }).on('click', () => {
		ssrEffect.applyQualityPreset('low');
		updateSettingsFromEffect();
		pane.refresh();
	});



	// 설정값을 SSR 이펙트에서 다시 읽어오는 헬퍼 함수
	function updateSettingsFromEffect() {
		settings.maxSteps = ssrEffect.maxSteps;
		settings.maxDistance = ssrEffect.maxDistance;
		settings.stepSize = ssrEffect.stepSize;
		settings.reflectionIntensity = ssrEffect.reflectionIntensity;
		settings.fadeDistance = ssrEffect.fadeDistance;
		settings.edgeFade = ssrEffect.edgeFade;
	}


}
