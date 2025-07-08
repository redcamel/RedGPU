import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 25;
		controller.speedDistance = 0.3;
		controller.tilt = -20;
		controller.pan = 30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		redGPUContext.addView(view);

		// 🌫️ HeightFog 이펙트 생성 및 설정 (더 자연스러운 초기값)
		const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
		heightFog.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL;
		heightFog.density = 1.5;
		heightFog.fogColor.setColorByRGB(210, 230, 255);
		heightFog.baseHeight = -2.0;    // 안개 시작 높이
		heightFog.thickness = 10.0;     // 안개 레이어 두께
		heightFog.falloff = 1.0;        // 높이별 감쇠율

		view.postEffectManager.addEffect(heightFog);

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 0.8;
		directionalLight.directionX = 0.3;
		directionalLight.directionY = -0.7;
		directionalLight.directionZ = 0.2;
		scene.lightManager.addDirectionalLight(directionalLight);

		createHeightFogDemoScene(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 🌊 부유하는 객체들 애니메이션 (더 부드럽게)
			scene.children.forEach((child, index) => {
				if (child.userData && child.userData.isFloating) {
					const floatSpeed = 0.0008 + (index % 3) * 0.0002;
					const floatAmount = 0.3 + (index % 2) * 0.2;
					child.y = child.userData.baseY + Math.sin(time * floatSpeed + index * 0.7) * floatAmount;
				}
				// 🔄 회전하는 객체들 (다양한 속도)
				if (child.userData && child.userData.isRotating) {
					const rotSpeed = 0.005 + (index % 4) * 0.003;
					child.rotationY += rotSpeed;
				}
			});

			// 🌤️ 동적 안개 효과 (시간에 따른 변화)
			if (Math.floor(time / 20000) % 30 === 0) { // 20초마다 약간의 변화
				const baseDensity = 1.5;
				const variation = Math.sin(time * 0.0001) * 0.3;
				heightFog.density = baseDensity + variation;
			}
		};
		renderer.start(redGPUContext, render);

		createHeightFogControlPanel(redGPUContext, view, heightFog);
	},
	(failReason) => {
		console.error('HeightFog 초기화 실패:', failReason);
	}
);

function createHeightFogDemoScene(redGPUContext, scene) {
	// 🏔️ 지형 바닥 (더 큰 지형)
	const terrain = new RedGPU.Primitive.Plane(redGPUContext, 1000, 1000, 1000, 1000);
	const terrainMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#1e3a1e');

	// 노이즈 텍스처로 높이 변화 (더 디테일하게)
	const terrainNoise = new RedGPU.Resource.SimplexTexture(redGPUContext, 1024, 1024, {
		mainLogic: `
		let noise1 = getSimplexNoiseByDimension(base_uv * 3.0, uniforms);
		let noise2 = getSimplexNoiseByDimension(base_uv * 6.0, uniforms) * 0.5;
		let noise3 = getSimplexNoiseByDimension(base_uv * 12.0, uniforms) * 0.25;
		let heightValue = (noise1 + noise2 + noise3) * 0.4 + 0.6;
		let finalColor = vec4<f32>(heightValue, heightValue, heightValue, 1.0);
	`
	});
	terrainNoise.frequency = 2.5;
	terrainNoise.amplitude = 1.8;
	terrainNoise.octaves = 4;

	terrainMaterial.displacementTexture = terrainNoise;
	terrainMaterial.displacementScale = 6.0;

	const terrainMesh = new RedGPU.Display.Mesh(redGPUContext, terrain, terrainMaterial);
	terrainMesh.rotationX = 90;
	terrainMesh.y = -4;
	scene.addChild(terrainMesh);

	// 🎯 높이별 테스트 구조물들 (더 많은 레벨)
	const heightLevels = [
		{ y: -3, color: '#8B0000', name: 'Deep Underground' },
		{ y: -1, color: '#FF4444', name: 'Underground' },
		{ y: 1, color: '#FF8844', name: 'Ground Level' },
		{ y: 3, color: '#FFCC44', name: 'Low Height' },
		{ y: 5, color: '#CCFF44', name: 'Medium Height' },
		{ y: 7, color: '#44FF88', name: 'High' },
		{ y: 9, color: '#44CCFF', name: 'Very High' },
		{ y: 11, color: '#8844FF', name: 'Peak Level' },
		{ y: 13, color: '#FF44FF', name: 'Above Fog' },
	];

	heightLevels.forEach((level, index) => {
		// 🏗️ 고정 타워 (다양한 크기)
		const towerRadius = 0.6 + (index % 3) * 0.3;
		const towerHeight = 2.0 + (index % 4) * 0.5;
		const tower = new RedGPU.Primitive.Cylinder(redGPUContext, towerRadius, towerHeight, 8);
		const towerMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, level.color);
		towerMaterial.roughness = 0.3;
		towerMaterial.metalness = 0.1;

		const towerMesh = new RedGPU.Display.Mesh(redGPUContext, tower, towerMaterial);
		towerMesh.x = -35 + index * 8;
		towerMesh.z = -20;
		towerMesh.y = level.y;
		towerMesh.userData = {
			heightLevel: level.name,
			isRotating: true,
			index: index
		};
		scene.addChild(towerMesh);

		// 🎈 부유하는 구체 (다양한 크기)
		const balloonRadius = 0.5 + (index % 3) * 0.2;
		const balloon = new RedGPU.Primitive.Sphere(redGPUContext, balloonRadius, 20, 20);
		const balloonMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, level.color);
		balloonMaterial.roughness = 0.1;
		balloonMaterial.metalness = 0.8;

		const balloonMesh = new RedGPU.Display.Mesh(redGPUContext, balloon, balloonMaterial);
		balloonMesh.x = -35 + index * 8;
		balloonMesh.z = -15;
		balloonMesh.y = level.y;
		balloonMesh.userData = {
			heightLevel: level.name,
			isFloating: true,
			baseY: level.y,
			index: index
		};
		scene.addChild(balloonMesh);

		// 📊 높이 표시 라벨 (작은 박스)
		const label = new RedGPU.Primitive.Box(redGPUContext, 1.5, 0.1, 0.5);
		const labelMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFFFFF');
		const labelMesh = new RedGPU.Display.Mesh(redGPUContext, label, labelMaterial);
		labelMesh.x = -35 + index * 8;
		labelMesh.z = -12;
		labelMesh.y = level.y + 1.5;
		scene.addChild(labelMesh);
	});

	// 🌲 숲 생성 (더 밀도 있게)
	for (let i = 0; i < 40; i++) {
		const treeHeight = 2 + Math.random() * 5;
		const treeRadius = 0.2 + Math.random() * 0.3;
		const tree = new RedGPU.Primitive.Cylinder(redGPUContext, treeRadius, treeHeight, 8);
		const treeColor = Math.random() > 0.7 ? '#2F5F2F' : '#228B22';
		const treeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, treeColor);
		const treeMesh = new RedGPU.Display.Mesh(redGPUContext, tree, treeMaterial);

		treeMesh.x = (Math.random() - 0.5) * 80;
		treeMesh.z = (Math.random() - 0.5) * 80;
		treeMesh.y = treeHeight / 2 - 2;
		scene.addChild(treeMesh);

		// 🌿 나무 꼭대기 (잎사귀)
		const crown = new RedGPU.Primitive.Sphere(redGPUContext, treeRadius * 2, 12, 12);
		const crownMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#32CD32');
		const crownMesh = new RedGPU.Display.Mesh(redGPUContext, crown, crownMaterial);
		crownMesh.x = treeMesh.x;
		crownMesh.z = treeMesh.z;
		crownMesh.y = treeMesh.y + treeHeight / 2 + treeRadius;
		scene.addChild(crownMesh);
	}

	// 🏔️ 산 봉우리들 (더 웅장하게)
	const mountains = [
		{ x: 25, z: -30, height: 15, width: 5, color: '#696969' },
		{ x: -40, z: 25, height: 18, width: 6, color: '#708090' },
		{ x: 40, z: 20, height: 22, width: 7, color: '#778899' },
		{ x: -20, z: -35, height: 12, width: 4, color: '#6A6A6A' },
		{ x: 0, z: 40, height: 16, width: 5, color: '#777777' },
	];

	mountains.forEach((mountain, index) => {
		const peak = new RedGPU.Primitive.Cylinder(redGPUContext, mountain.width, mountain.height, 12);
		const peakMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, mountain.color);
		peakMaterial.roughness = 0.8;
		const peakMesh = new RedGPU.Display.Mesh(redGPUContext, peak, peakMaterial);
		peakMesh.x = mountain.x;
		peakMesh.z = mountain.z;
		peakMesh.y = mountain.height / 2 - 3;
		scene.addChild(peakMesh);

		// ❄️ 산 정상 눈 덮개
		if (mountain.height > 15) {
			const snowCap = new RedGPU.Primitive.Sphere(redGPUContext, mountain.width * 0.8, 12, 12);
			const snowMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FFFAFA');
			const snowMesh = new RedGPU.Display.Mesh(redGPUContext, snowCap, snowMaterial);
			snowMesh.x = mountain.x;
			snowMesh.z = mountain.z;
			snowMesh.y = mountain.height - 2;
			scene.addChild(snowMesh);
		}
	});

	// 🌉 다리 구조물들 (높이 테스트용)
	const bridges = [
		{ x: 0, z: 8, y: 2, width: 25, height: 1, color: '#8B4513' },
		{ x: -15, z: 15, y: 5, width: 20, height: 1, color: '#CD853F' },
		{ x: 20, z: -10, y: 8, width: 18, height: 1, color: '#D2691E' },
	];

	bridges.forEach((bridge) => {
		const bridgeGeom = new RedGPU.Primitive.Box(redGPUContext, bridge.width, bridge.height, 3);
		const bridgeMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, bridge.color);
		const bridgeMesh = new RedGPU.Display.Mesh(redGPUContext, bridgeGeom, bridgeMaterial);
		bridgeMesh.x = bridge.x;
		bridgeMesh.z = bridge.z;
		bridgeMesh.y = bridge.y;
		scene.addChild(bridgeMesh);

		// 🏗️ 다리 기둥들
		for (let i = -2; i <= 2; i++) {
			const pillar = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, bridge.y + 2, 8);
			const pillarMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#654321');
			const pillarMesh = new RedGPU.Display.Mesh(redGPUContext, pillar, pillarMaterial);
			pillarMesh.x = bridge.x + i * 6;
			pillarMesh.z = bridge.z;
			pillarMesh.y = (bridge.y + 2) / 2 - 3;
			scene.addChild(pillarMesh);
		}
	});

	// 🏠 마을 건물들
	for (let i = 0; i < 8; i++) {
		const buildingWidth = 2 + Math.random() * 2;
		const buildingHeight = 3 + Math.random() * 4;
		const building = new RedGPU.Primitive.Box(redGPUContext, buildingWidth, buildingHeight, buildingWidth);
		const buildingColors = ['#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F'];
		const buildingMaterial = new RedGPU.Material.PhongMaterial(
			redGPUContext,
			buildingColors[Math.floor(Math.random() * buildingColors.length)]
		);
		const buildingMesh = new RedGPU.Display.Mesh(redGPUContext, building, buildingMaterial);

		buildingMesh.x = -10 + (i % 4) * 5;
		buildingMesh.z = 25 + Math.floor(i / 4) * 5;
		buildingMesh.y = buildingHeight / 2 - 1;
		scene.addChild(buildingMesh);

		// 🏠 지붕
		const roof = new RedGPU.Primitive.Cylinder(redGPUContext, buildingWidth * 0.8, 0.5, 4);
		const roofMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B0000');
		const roofMesh = new RedGPU.Display.Mesh(redGPUContext, roof, roofMaterial);
		roofMesh.x = buildingMesh.x;
		roofMesh.z = buildingMesh.z;
		roofMesh.y = buildingMesh.y + buildingHeight / 2 + 0.3;
		roofMesh.rotationX = 90;
		scene.addChild(roofMesh);
	}
}

async function createHeightFogControlPanel(redGPUContext, view, heightFog) {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const pane = new Pane({ title: '🌫️ Height Fog Controls', expanded: true });

	const PARAMS = {
		enabled: true,
		fogType: 'EXPONENTIAL',
		density: heightFog.density,
		baseHeight: heightFog.baseHeight,
		thickness: heightFog.thickness,
		falloff: heightFog.falloff,
		fogColor: { r: 210, g: 230, b: 255 },
		// 🆕 추가 컨트롤
		animateFog: false,
		debugMode: false
	};

	// 🔧 기본 컨트롤
	const basicFolder = pane.addFolder({ title: '🔧 Basic Settings', expanded: true });

	basicFolder.addBinding(PARAMS, 'enabled').on('change', (ev) => {
		if (ev.value) {
			view.postEffectManager.addEffect(heightFog);
		} else {
			view.postEffectManager.removeAllEffect();
		}
	});

	basicFolder.addBinding(PARAMS, 'fogType', {
		options: {
			'EXPONENTIAL': 'EXPONENTIAL',
			'LINEAR': 'LINEAR'
		}
	}).on('change', (ev) => {
		heightFog.fogType = ev.value === 'EXPONENTIAL' ?
			RedGPU.PostEffect.HeightFog.EXPONENTIAL :
			RedGPU.PostEffect.HeightFog.LINEAR;
	});

	basicFolder.addBinding(PARAMS, 'animateFog', {
		label: 'Animate Fog'
	}).on('change', (ev) => {
		// 애니메이션은 render 루프에서 처리
	});

	// 🏔️ 높이 설정
	const heightFolder = pane.addFolder({ title: '🏔️ Height Settings', expanded: true });

	heightFolder.addBinding(PARAMS, 'baseHeight', {
		label: 'Base Height',
		min: -8, max: 15, step: 0.1
	}).on('change', (ev) => {
		heightFog.baseHeight = ev.value;

	});

	heightFolder.addBinding(PARAMS, 'thickness', {
		label: 'Thickness',
		min: 0.5, max: 30, step: 0.1
	}).on('change', (ev) => {
		heightFog.thickness = ev.value;

	});

	heightFolder.addBinding(PARAMS, 'falloff', {
		label: 'Falloff',
		min: 0.01, max: 2.0, step: 0.01
	}).on('change', (ev) => {
		heightFog.falloff = ev.value;
	});

	// 🎨 외관 설정
	const appearanceFolder = pane.addFolder({ title: '🎨 Appearance', expanded: true });

	appearanceFolder.addBinding(PARAMS, 'density', {
		label: 'Density',
		min: 0, max: 8, step: 0.01
	}).on('change', (ev) => {
		heightFog.density = ev.value;
	});

	appearanceFolder.addBinding(PARAMS, 'fogColor', {
		label: 'Fog Color'
	}).on('change', (ev) => {
		heightFog.fogColor.setColorByRGB(
			Math.round(ev.value.r),
			Math.round(ev.value.g),
			Math.round(ev.value.b)
		);
	});

	// 🎯 프리셋 (더 다양하게)
	const presetFolder = pane.addFolder({ title: '🎯 Fog Presets', expanded: true });

	presetFolder.addButton({ title: '🌊 Valley Mist' }).on('click', () => {
		applyPreset(2.2, -3, 8, 1.2, { r: 220, g: 240, b: 255 }, 'EXPONENTIAL');
	});

	presetFolder.addButton({ title: '☁️ Morning Fog' }).on('click', () => {
		applyPreset(1.8, -1, 6, 0.8, { r: 255, g: 250, b: 240 }, 'EXPONENTIAL');
	});

	presetFolder.addButton({ title: '🌁 Mountain Layer' }).on('click', () => {
		applyPreset(1.5, 6, 10, 0.6, { r: 200, g: 220, b: 255 }, 'LINEAR');
	});

	presetFolder.addButton({ title: '🌫️ Dense Low Fog' }).on('click', () => {
		applyPreset(3.5, -2, 5, 1.8, { r: 180, g: 200, b: 220 }, 'EXPONENTIAL');
	});

	presetFolder.addButton({ title: '🌙 Night Mist' }).on('click', () => {
		applyPreset(2.0, -1, 7, 1.0, { r: 150, g: 160, b: 200 }, 'EXPONENTIAL');
	});

	presetFolder.addButton({ title: '🔥 Heat Haze' }).on('click', () => {
		applyPreset(1.2, -4, 4, 0.4, { r: 255, g: 240, b: 200 }, 'LINEAR');
	});

	presetFolder.addButton({ title: '❄️ Arctic Fog' }).on('click', () => {
		applyPreset(2.8, -2, 12, 1.4, { r: 240, g: 248, b: 255 }, 'EXPONENTIAL');
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
