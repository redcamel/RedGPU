import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 🎯 Height Fog에 최적화된 카메라 설정 (지상 관점)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 15;        // 더 가까이
		controller.speedDistance = 0.2;
		controller.tilt = -10;           // 거의 수평 시선
		controller.pan = 45;
		controller.minDistance = 5;
		controller.maxDistance = 35;
		// controller.minTilt = -25;        // 아래를 많이 못 보게 제한
		// controller.maxTilt = 15;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		redGPUContext.addView(view);

		// 🌫️ Height Fog 최적 설정 (지상 시점용)
		const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
		heightFog.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL;
		heightFog.density = 2.0;
		heightFog.fogColor.setColorByRGB(190, 210, 235);
		heightFog.baseHeight = -1.5;     // 지면 근처에서 시작
		heightFog.thickness = 8.0;       // 적당한 두께
		heightFog.falloff = 1.2;         // 자연스러운 감쇠

		view.postEffectManager.addEffect(heightFog);

		// 🌅 분위기 있는 조명 (새벽/저녁 느낌)
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 0.6;
		directionalLight.directionX = 0.4;
		directionalLight.directionY = -0.3;  // 낮은 각도
		directionalLight.directionZ = 0.7;
		directionalLight.enableDebugger=true
		scene.lightManager.addDirectionalLight(directionalLight);

		createGroundLevelScene(redGPUContext, scene);

		// 🚶‍♂️ 탐험하는 느낌의 카메라 애니메이션
		let autoRotate = true;
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 🌊 안개 속 신비로운 애니메이션
			scene.children.forEach((child, index) => {
				if (child.userData) {
					// 🎈 부유하는 오브젝트들
					if (child.userData.isFloating) {
						const floatSpeed = 0.001 + (index % 3) * 0.0003;
						const floatAmount = 0.2 + (index % 2) * 0.15;
						child.y = child.userData.baseY + Math.sin(time * floatSpeed + index) * floatAmount;
					}

					// 🔄 천천히 회전하는 구조물들
					if (child.userData.isRotating) {
						const rotSpeed = 0.002 + (index % 3) * 0.001;
						child.rotationY += rotSpeed;
					}

					// 💡 깜빡이는 등불들
					if (child.userData.isLantern) {
						const flickerSpeed = 0.003 + (index % 4) * 0.001;
						const brightness = 0.7 + Math.sin(time * flickerSpeed + index * 2) * 0.3;
						child.material.emissive = brightness;
					}
				}
			});

			// 🎬 자동 카메라 회전 (탐험 느낌)
			if (autoRotate) {
				controller.pan += 0.2;
			}
		};

		renderer.start(redGPUContext, render);

		// 🎮 컨트롤 패널 생성
		createHeightFogControlPanel(redGPUContext, view, heightFog, controller, () => {
			autoRotate = !autoRotate;
		});
	},
	(failReason) => {
		console.error('HeightFog 초기화 실패:', failReason);
	}
);

function createGroundLevelScene(redGPUContext, scene) {
	// 🏞️ 넓은 지형 (Height Fog가 빛나는 환경)
	const terrain = new RedGPU.Primitive.Plane(redGPUContext, 200, 200, 1000, 1000);
	const terrainMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d4a2d');

	// 🏔️ 지형 높낮이 (노이즈로 자연스럽게)
	const terrainNoise = new RedGPU.Resource.SimplexTexture(redGPUContext, 512, 512, {
		mainLogic: `
		let noise1 = getSimplexNoiseByDimension(base_uv * 2.0, uniforms);
		let noise2 = getSimplexNoiseByDimension(base_uv * 4.0, uniforms) * 0.5;
		let heightValue = (noise1 + noise2) * 0.3 + 0.7;
		let finalColor = vec4<f32>(heightValue, heightValue, heightValue, 1.0);
	`
	});
	terrainNoise.frequency = 1.8;
	terrainNoise.amplitude = 1.5;
	terrainNoise.octaves = 8;

	terrainMaterial.displacementTexture = terrainNoise;
	terrainMaterial.displacementScale = 12.0;

	const terrainMesh = new RedGPU.Display.Mesh(redGPUContext, terrain, terrainMaterial);
	terrainMesh.rotationX = 90;
	terrainMesh.y = -3;
	scene.addChild(terrainMesh);

	// 🌲 안개 속 숲 (Height Fog 효과 극대화)
	const forestPositions = [
		// 🌫️ 안개층 내부 - 완전히 숨겨짐
		{ x: -15, z: -20, height: 3, radius: 0.3, density: 'dense' },
		{ x: -10, z: -25, height: 4, radius: 0.4, density: 'dense' },
		{ x: 20, z: -15, height: 3.5, radius: 0.35, density: 'dense' },

		// 🌿 안개층 경계 - 부분적으로 보임
		{ x: 0, z: -30, height: 6, radius: 0.5, density: 'medium' },
		{ x: 25, z: 10, height: 7, radius: 0.45, density: 'medium' },
		{ x: -30, z: 5, height: 6.5, radius: 0.4, density: 'medium' },

		// 🌳 안개층 위 - 선명하게 보임
		{ x: 15, z: 20, height: 9, radius: 0.6, density: 'sparse' },
		{ x: -20, z: 25, height: 10, radius: 0.55, density: 'sparse' },
	];

	forestPositions.forEach((pos, index) => {
		const treeHeight = pos.height + Math.random() * 2;
		const tree = new RedGPU.Primitive.Cylinder(redGPUContext, pos.radius, treeHeight, 8);

		const treeColors = {
			dense: '#1a3d1a',    // 어두운 녹색 (안개 속)
			medium: '#2d5a2d',   // 중간 녹색
			sparse: '#4a7c4a'    // 밝은 녹색 (안개 위)
		};

		const treeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, treeColors[pos.density]);
		const treeMesh = new RedGPU.Display.Mesh(redGPUContext, tree, treeMaterial);

		treeMesh.x = pos.x + (Math.random() - 0.5) * 4;
		treeMesh.z = pos.z + (Math.random() - 0.5) * 4;
		treeMesh.y = treeHeight / 2 - 2;

		treeMesh.userData = {
			isRotating: pos.density === 'sparse',
			heightLayer: pos.density
		};

		scene.addChild(treeMesh);

		// 🌿 나무 관목 (나무마다 다른 크기)
		const crownSize = pos.radius * (1.5 + Math.random() * 0.5);
		const crown = new RedGPU.Primitive.Sphere(redGPUContext, crownSize, 12, 12);
		const crownMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#2d6b2d');
		const crownMesh = new RedGPU.Display.Mesh(redGPUContext, crown, crownMaterial);

		crownMesh.x = treeMesh.x;
		crownMesh.z = treeMesh.z;
		crownMesh.y = treeMesh.y + treeHeight / 2 + crownSize * 0.7;
		scene.addChild(crownMesh);
	});

	// 🏛️ 신비로운 고대 유적들 (높이별 배치)
	const monuments = [
		{ x: 0, z: 0, y: 1, height: 8, type: 'obelisk', name: 'Central Obelisk' },
		{ x: -12, z: -8, y: 4, height: 5, type: 'pillar', name: 'Ancient Pillar' },
		{ x: 18, z: -5, y: 7, height: 6, type: 'statue', name: 'Guardian Statue' },
		{ x: -8, z: 15, y: 10, height: 4, type: 'altar', name: 'Sky Altar' },
	];

	monuments.forEach((monument, index) => {
		let monumentGeom, monumentColor;

		switch (monument.type) {
			case 'obelisk':
				monumentGeom = new RedGPU.Primitive.Box(redGPUContext, 1.5, monument.height, 1.5);
				monumentColor = '#8B7355';
				break;
			case 'pillar':
				monumentGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.8, monument.height, 12);
				monumentColor = '#A0522D';
				break;
			case 'statue':
				monumentGeom = new RedGPU.Primitive.Box(redGPUContext, 2, monument.height, 1.2);
				monumentColor = '#696969';
				break;
			case 'altar':
				monumentGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 2, monument.height * 0.3, 8);
				monumentColor = '#8FBC8F';
				break;
		}

		const monumentMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, monumentColor);
		monumentMaterial.roughness = 0.7;
		monumentMaterial.metalness = 0.1;

		const monumentMesh = new RedGPU.Display.Mesh(redGPUContext, monumentGeom, monumentMaterial);
		monumentMesh.x = monument.x;
		monumentMesh.z = monument.z;
		monumentMesh.y = monument.y;

		monumentMesh.userData = {
			monumentName: monument.name,
			heightLevel: monument.y,
			isRotating: monument.type === 'obelisk'
		};

		scene.addChild(monumentMesh);
	});

	// 💡 안개 속 등불들 (안개층 시각화에 도움)
	const lanternPositions = [
		{ x: -5, z: -10, y: 0.5 },   // 안개 깊숙이
		{ x: 8, z: -12, y: 2.5 },    // 안개 중간
		{ x: -15, z: 8, y: 5.5 },    // 안개 경계
		{ x: 12, z: 15, y: 8.5 },    // 안개 위
	];

	lanternPositions.forEach((pos, index) => {
		// 🏮 등불 기둥
		const lanternPole = new RedGPU.Primitive.Cylinder(redGPUContext, 0.15, 3, 8);
		const poleMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
		const poleMesh = new RedGPU.Display.Mesh(redGPUContext, lanternPole, poleMaterial);
		poleMesh.x = pos.x;
		poleMesh.z = pos.z;
		poleMesh.y = pos.y + 1.5;
		scene.addChild(poleMesh);

		// 🔥 등불 불빛
		const lantern = new RedGPU.Primitive.Sphere(redGPUContext, 0.4, 12, 12);
		const lanternMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFD700');
		lanternMaterial.emissive = 0.8;

		const lanternMesh = new RedGPU.Display.Mesh(redGPUContext, lantern, lanternMaterial);
		lanternMesh.x = pos.x;
		lanternMesh.z = pos.z;
		lanternMesh.y = pos.y + 3.2;

		lanternMesh.userData = {
			isLantern: true,
			heightLevel: pos.y
		};

		scene.addChild(lanternMesh);
	});

	// 🌉 안개를 가로지르는 다리
	const bridge = new RedGPU.Primitive.Box(redGPUContext, 20, 0.5, 2.5);
	const bridgeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
	const bridgeMesh = new RedGPU.Display.Mesh(redGPUContext, bridge, bridgeMaterial);
	bridgeMesh.x = 5;
	bridgeMesh.z = 2;
	bridgeMesh.y = 3.5;  // 안개층을 관통
	scene.addChild(bridgeMesh);

	// 🏗️ 다리 기둥들 (안개 속에서 올라옴)
	for (let i = -2; i <= 2; i++) {
		const pillar = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 6, 8);
		const pillarMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
		const pillarMesh = new RedGPU.Display.Mesh(redGPUContext, pillar, pillarMaterial);
		pillarMesh.x = 5 + i * 5;
		pillarMesh.z = 2;
		pillarMesh.y = 0.5;  // 안개 밑에서 시작
		scene.addChild(pillarMesh);
	}

	// 🗿 Height Fog 효과 체험용 테스트 객체들
	const testHeights = [0, 2, 4, 6, 8, 10];
	testHeights.forEach((height, index) => {
		const testSphere = new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16);
		const intensity = Math.min(255, 100 + height * 20);
		const testMaterial = new RedGPU.Material.PhongMaterial(
			redGPUContext,
		);
		testMaterial.r = intensity
		testMaterial.g = intensity + 20
		testMaterial.b = intensity + 40

		const testMesh = new RedGPU.Display.Mesh(redGPUContext, testSphere, testMaterial);
		testMesh.x = -25 + index * 3;
		testMesh.z = 30;
		testMesh.y = height;

		testMesh.userData = {
			isFloating: true,
			baseY: height,
			testHeight: height
		};

		scene.addChild(testMesh);
	});
}

async function createHeightFogControlPanel(redGPUContext, view, heightFog, controller, toggleAutoRotate) {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const pane = new Pane({ title: '🌫️ Height Fog Demo', expanded: true });

	const PARAMS = {
		enabled: true,
		autoRotate: true,
		fogType: 'EXPONENTIAL',
		density: heightFog.density,
		baseHeight: heightFog.baseHeight,
		thickness: heightFog.thickness,
		falloff: heightFog.falloff,
		fogColor: { r: 190, g: 210, b: 235 },
		// 카메라 프리셋
		cameraPreset: 'Ground Explorer'
	};

	// 🎮 체험 컨트롤
	const experienceFolder = pane.addFolder({ title: '🎮 Experience', expanded: true });

	experienceFolder.addBinding(PARAMS, 'enabled').on('change', (ev) => {
		if (ev.value) {
			view.postEffectManager.addEffect(heightFog);
		} else {
			view.postEffectManager.removeAllEffect();
		}
	});

	experienceFolder.addBinding(PARAMS, 'autoRotate').on('change', toggleAutoRotate);

	// 📷 카메라 프리셋 (Height Fog 최적 시점들)
	experienceFolder.addBinding(PARAMS, 'cameraPreset', {
		options: {
			'🚶‍♂️ Ground Explorer': 'Ground Explorer',
			'🌲 Forest Walker': 'Forest Walker',
			'🏛️ Monument Viewer': 'Monument Viewer',
			'🌉 Bridge Crosser': 'Bridge Crosser',
			'🔍 Detail Inspector': 'Detail Inspector'
		}
	}).on('change', (ev) => {
		switch (ev.value) {
			case 'Ground Explorer':
				controller.distance = 15;
				controller.tilt = -10;
				controller.pan = 45;
				break;
			case 'Forest Walker':
				controller.distance = 12;
				controller.tilt = -5;
				controller.pan = 120;
				break;
			case 'Monument Viewer':
				controller.distance = 20;
				controller.tilt = -15;
				controller.pan = 0;
				break;
			case 'Bridge Crosser':
				controller.distance = 8;
				controller.tilt = 0;
				controller.pan = 90;
				break;
			case 'Detail Inspector':
				controller.distance = 6;
				controller.tilt = -20;
				controller.pan = 60;
				break;
		}
	});

	// 🌫️ 안개 설정
	const fogFolder = pane.addFolder({ title: '🌫️ Fog Settings', expanded: true });

	fogFolder.addBinding(PARAMS, 'fogType', {
		options: {
			'🌫️ EXPONENTIAL': 'EXPONENTIAL',
			'📏 LINEAR': 'LINEAR'
		}
	}).on('change', (ev) => {
		heightFog.fogType = ev.value === 'EXPONENTIAL' ?
			RedGPU.PostEffect.HeightFog.EXPONENTIAL :
			RedGPU.PostEffect.HeightFog.LINEAR;
	});

	fogFolder.addBinding(PARAMS, 'density', {
		min: 0, max: 4, step: 0.1
	}).on('change', (ev) => {
		heightFog.density = ev.value;
	});

	fogFolder.addBinding(PARAMS, 'baseHeight', {
		label: 'Base Height',
		min: -5, max: 8, step: 0.1
	}).on('change', (ev) => {
		heightFog.baseHeight = ev.value;
	});

	fogFolder.addBinding(PARAMS, 'thickness', {
		min: 2, max: 20, step: 0.5
	}).on('change', (ev) => {
		heightFog.thickness = ev.value;
	});

	fogFolder.addBinding(PARAMS, 'falloff', {
		min: 0.1, max: 2, step: 0.1
	}).on('change', (ev) => {
		heightFog.falloff = ev.value;
	});

	fogFolder.addBinding(PARAMS, 'fogColor').on('change', (ev) => {
		heightFog.fogColor.setColorByRGB(
			Math.round(ev.value.r),
			Math.round(ev.value.g),
			Math.round(ev.value.b)
		);
	});

	// 🎯 시나리오 프리셋
	const scenarioFolder = pane.addFolder({ title: '🎯 Scenarios', expanded: true });

	scenarioFolder.addButton({ title: '🌅 Dawn Valley' }).on('click', () => {
		applyPreset(1.8, -2, 6, 1.0, { r: 255, g: 245, b: 220 }, 'EXPONENTIAL');
	});

	scenarioFolder.addButton({ title: '🌲 Mysterious Forest' }).on('click', () => {
		applyPreset(2.5, -1, 8, 1.4, { r: 180, g: 200, b: 180 }, 'EXPONENTIAL');
	});

	scenarioFolder.addButton({ title: '🏛️ Ancient Ruins' }).on('click', () => {
		applyPreset(2.0, 0, 7, 1.2, { r: 200, g: 190, b: 160 }, 'EXPONENTIAL');
	});

	scenarioFolder.addButton({ title: '🌙 Moonlit Mist' }).on('click', () => {
		applyPreset(1.5, -1.5, 9, 0.8, { r: 160, g: 170, b: 200 }, 'LINEAR');
	});

	function applyPreset(density, baseHeight, thickness, falloff, fogColor, fogType) {
		PARAMS.density = density;
		PARAMS.baseHeight = baseHeight;
		PARAMS.thickness = thickness;
		PARAMS.falloff = falloff;
		PARAMS.fogColor = fogColor;
		PARAMS.fogType = fogType;

		heightFog.density = density;
		heightFog.baseHeight = baseHeight;
		heightFog.thickness = thickness;
		heightFog.falloff = falloff;
		heightFog.fogType = fogType === 'EXPONENTIAL' ?
			RedGPU.PostEffect.HeightFog.EXPONENTIAL :
			RedGPU.PostEffect.HeightFog.LINEAR;
		heightFog.fogColor.setColorByRGB(fogColor.r, fogColor.g, fogColor.b);

		pane.refresh();
	}
}
