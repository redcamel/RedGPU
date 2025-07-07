import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 15;
		controller.speedDistance = 0.3;
		controller.tilt = -10;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		redGPUContext.addView(view);

		const fogEffect = new RedGPU.PostEffect.Fog(redGPUContext);
		fogEffect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL;
		fogEffect.density = 0.1;
		fogEffect.nearDistance = 5;
		fogEffect.farDistance = 30;
		fogEffect.fogColor.setColorByRGB(200, 210, 255);

		view.postEffectManager.addEffect(fogEffect);

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		createTestScene(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {};
		renderer.start(redGPUContext, render);

		createControlPanel(redGPUContext, view, fogEffect);
	},
	(failReason) => {
		console.error('초기화 실패:', failReason);
		const errorDiv = document.createElement('div');
		errorDiv.style.cssText = 'color: red; padding: 20px; font-size: 16px;';
		errorDiv.textContent = `초기화 실패: ${failReason}`;
		document.body.appendChild(errorDiv);
	}
);

function createTestScene(redGPUContext, scene) {
	new RedGPU.GLTFLoader(
		redGPUContext,
		'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',
		(result) => {
			const mainMesh = scene.addChild(result['resultMesh']);
			mainMesh.x = 0;
			mainMesh.y = 0;
			mainMesh.z = 0;
			mainMesh.scaleX = mainMesh.scaleY = mainMesh.scaleZ = 2;
		}
	);

	const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

	// 🏔️ 높이별 오브젝트 배치 (Height Fog 테스트용)
	for (let i = 0; i < 6; i++) {
		const angle = (Math.PI * 2 * i) / 6;
		const radius = 7;

		const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 16, 16);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i]);
		const mesh = new RedGPU.Display.Mesh(redGPUContext, sphere, material);

		mesh.x = Math.cos(angle) * radius;
		mesh.z = Math.sin(angle) * radius;
		mesh.y = Math.sin(i * 0.5) * 2; // 높이 변화

		scene.addChild(mesh);
	}

	// 중간 거리 - 다양한 높이의 박스들
	for (let i = 0; i < 8; i++) {
		const angle = (Math.PI * 2 * i) / 8;
		const radius = 17;

		const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i % colors.length]);
		const mesh = new RedGPU.Display.Mesh(redGPUContext, box, material);

		mesh.x = Math.cos(angle) * radius;
		mesh.z = Math.sin(angle) * radius;
		mesh.y = Math.sin(i * 0.8) * 3; // 더 큰 높이 변화

		scene.addChild(mesh);
	}

	// 원거리 - 계단식 배치 (Height Fog 효과가 잘 보이도록)
	for (let i = 0; i < 10; i++) {
		const angle = (Math.PI * 2 * i) / 10;
		const radius = 30;

		const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 2, 12);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i % colors.length]);
		const mesh = new RedGPU.Display.Mesh(redGPUContext, cylinder, material);

		mesh.x = Math.cos(angle) * radius;
		mesh.z = Math.sin(angle) * radius;
		mesh.y = (i % 3) * 2 - 2; // -2, 0, 2 높이로 배치

		scene.addChild(mesh);
	}

	// 🏞️ 지면 표현용 큰 평면 추가
	const groundPlane = new RedGPU.Primitive.Plane(redGPUContext, 100, 100, 1, 1);
	const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8FBC8F');
	const groundMesh = new RedGPU.Display.Mesh(redGPUContext, groundPlane, groundMaterial);

	groundMesh.rotationX = -90;
	groundMesh.y = -3;
	groundMesh.alpha = 0.3;

	scene.addChild(groundMesh);
}

async function createControlPanel(redGPUContext, view, fogEffect) {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const pane = new Pane({ title: '🌫️ Enhanced Fog Test' });

	const PARAMS = {
		enabled: true,
		fogType: 'Exponential',
		density: fogEffect.density,
		nearDistance: fogEffect.nearDistance,
		farDistance: fogEffect.farDistance,
		fogColor: { r: 200, g: 210, b: 255 },
		// 🆕 Height Fog 파라미터
		fogHeight: fogEffect.fogHeight,
		fogHeightDensity: fogEffect.fogHeightDensity,
		fogHeightFalloff: fogEffect.fogHeightFalloff
	};

	// 기본 컨트롤
	pane.addBinding(PARAMS, 'enabled', {
		label: 'Enable Fog'
	}).on('change', (ev) => {
		if (ev.value) {
			view.postEffectManager.addEffect(fogEffect);
		} else {
			view.postEffectManager.removeAllEffect();
		}
	});

	pane.addBinding(PARAMS, 'fogType', {
		label: 'Fog Type',
		options: {
			'Exponential': 'Exponential',
			'Exponential Squared': 'ExponentialSquared',
			'🏔️ Height Fog': 'HeightFog'  // 🆕 Height Fog 추가
		}
	}).on('change', (ev) => {
		switch(ev.value) {
			case 'Exponential':
				fogEffect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL;
				break;
			case 'ExponentialSquared':
				fogEffect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
				break;
			case 'HeightFog':
				fogEffect.fogType = RedGPU.PostEffect.Fog.HEIGHT_FOG;
				break;
		}
		updateHeightFogVisibility(ev.value === 'HeightFog');
	});

	pane.addBinding(PARAMS, 'density', {
		label: 'Density',
		min: 0.001,
		max: 1,
		step: 0.001
	}).on('change', (ev) => {
		fogEffect.density = ev.value;
	});

	pane.addBinding(PARAMS, 'nearDistance', {
		label: 'Near Distance',
		min: 0,
		max: 30,
		step: 0.1
	}).on('change', (ev) => {
		fogEffect.nearDistance = ev.value;
		if (PARAMS.farDistance <= ev.value) {
			PARAMS.farDistance = ev.value + 1;
			fogEffect.farDistance = PARAMS.farDistance;
			pane.refresh();
		}
	});

	pane.addBinding(PARAMS, 'farDistance', {
		label: 'Far Distance',
		min: 1,
		max: 100,
		step: 0.1
	}).on('change', (ev) => {
		PARAMS.farDistance = Math.max(ev.value, PARAMS.nearDistance + 1);
		fogEffect.farDistance = PARAMS.farDistance;
	});

	pane.addBinding(PARAMS, 'fogColor', {
		label: 'Fog Color'
	}).on('change', (ev) => {
		fogEffect.fogColor.setColorByRGB(Math.floor(ev.value.r), Math.floor(ev.value.g), Math.floor(ev.value.b));
	});

	pane.addBlade({ view: 'separator' });

	// 🆕 Height Fog 컨트롤 폴더
	const heightFogFolder = pane.addFolder({
		title: '🏔️ Height Fog Settings',
		expanded: true,
		hidden: true  // 초기에는 숨김
	});

	const heightBindings = [];

	heightBindings.push(heightFogFolder.addBinding(PARAMS, 'fogHeight', {
		label: 'Fog Height (Y)',
		min: -10,
		max: 10,
		step: 0.1
	}).on('change', (ev) => {
		fogEffect.fogHeight = ev.value;
	}));

	heightBindings.push(heightFogFolder.addBinding(PARAMS, 'fogHeightDensity', {
		label: 'Height Density',
		min: 0,
		max: 1,
		step: 0.01
	}).on('change', (ev) => {
		fogEffect.fogHeightDensity = ev.value;
	}));

	heightBindings.push(heightFogFolder.addBinding(PARAMS, 'fogHeightFalloff', {
		label: 'Height Falloff',
		min: 0.1,
		max: 5,
		step: 0.1
	}).on('change', (ev) => {
		fogEffect.fogHeightFalloff = ev.value;
	}));

	// Height Fog 가시성 제어 함수
	function updateHeightFogVisibility(isVisible) {
		heightFogFolder.hidden = !isVisible;
	}

	// 🆕 Height Fog 프리셋 버튼들
	heightFogFolder.addButton({ title: '🏞️ Valley Mist' }).on('click', () => {
		applyHeightPreset('HeightFog', 0.15, 5, 40, { r: 200, g: 220, b: 255 }, -1, 0.4, 2.0);
	});

	heightFogFolder.addButton({ title: '🌊 Lake Fog' }).on('click', () => {
		applyHeightPreset('HeightFog', 0.2, 3, 35, { r: 180, g: 200, b: 240 }, -2, 0.6, 1.5);
	});

	heightFogFolder.addButton({ title: '🏔️ Mountain Fog' }).on('click', () => {
		applyHeightPreset('HeightFog', 0.1, 8, 60, { r: 220, g: 230, b: 255 }, 1, 0.3, 3.0);
	});

	pane.addBlade({ view: 'separator' });

	// 기존 프리셋 폴더
	const presetFolder = pane.addFolder({
		title: '🎯 Classic Presets',
		expanded: true
	});

	presetFolder.addButton({ title: '💨 Light Mist' }).on('click', () => {
		applyPreset('Exponential', 0.05, 8, 50, { r: 230, g: 235, b: 255 });
	});

	presetFolder.addButton({ title: '🌫️ Medium Fog' }).on('click', () => {
		applyPreset('Exponential', 0.15, 5, 35, { r: 200, g: 210, b: 230 });
	});

	presetFolder.addButton({ title: '☁️ Dense Fog' }).on('click', () => {
		applyPreset('ExponentialSquared', 0.25, 3, 25, { r: 180, g: 180, b: 200 });
	});

	presetFolder.addButton({ title: '🌊 Ocean Mist' }).on('click', () => {
		applyPreset('Exponential', 0.08, 10, 60, { r: 180, g: 200, b: 255 });
	});

	function applyPreset(type, density, near, far, color) {
		PARAMS.fogType = type === 'Exponential' ? 'Exponential' : 'ExponentialSquared';
		PARAMS.density = density;
		PARAMS.nearDistance = near;
		PARAMS.farDistance = far;
		PARAMS.fogColor = color;

		fogEffect.fogType = type === 'Exponential'
			? RedGPU.PostEffect.Fog.EXPONENTIAL
			: RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
		fogEffect.density = density;
		fogEffect.nearDistance = near;
		fogEffect.farDistance = far;
		fogEffect.fogColor.setColorByRGB(color.r, color.g, color.b);

		updateHeightFogVisibility(false);
		pane.refresh();
	}

	// 🆕 Height Fog 프리셋 적용 함수
	function applyHeightPreset(type, density, near, far, color, height, heightDensity, heightFalloff) {
		PARAMS.fogType = 'HeightFog';
		PARAMS.density = density;
		PARAMS.nearDistance = near;
		PARAMS.farDistance = far;
		PARAMS.fogColor = color;
		PARAMS.fogHeight = height;
		PARAMS.fogHeightDensity = heightDensity;
		PARAMS.fogHeightFalloff = heightFalloff;

		fogEffect.fogType = RedGPU.PostEffect.Fog.HEIGHT_FOG;
		fogEffect.density = density;
		fogEffect.nearDistance = near;
		fogEffect.farDistance = far;
		fogEffect.fogColor.setColorByRGB(color.r, color.g, color.b);
		fogEffect.fogHeight = height;
		fogEffect.fogHeightDensity = heightDensity;
		fogEffect.fogHeightFalloff = heightFalloff;

		updateHeightFogVisibility(true);
		pane.refresh();
	}

	const infoFolder = pane.addFolder({
		title: 'ℹ️ Info',
		expanded: false
	});

	infoFolder.addBlade({
		view: 'text',
		label: 'Objects',
		value: '가까움: 구체 (7유닛, 높이변화)\n중간: 박스 (17유닛, 높이변화)\n멀음: 원기둥 (30유닛, 계단형)\n지면: 평면 (Y=-3)',
		parse: (v) => String(v),
		format: (v) => String(v)
	});

	infoFolder.addBlade({
		view: 'text',
		label: 'Height Fog',
		value: 'Y좌표 기반 포그 적용\n낮은 곳에 포그가 더 짙음\n계곡/호수 효과에 적합',
		parse: (v) => String(v),
		format: (v) => String(v)
	});
}
