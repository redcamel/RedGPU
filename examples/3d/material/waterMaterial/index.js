import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 25;
		controller.speedDistance = 1.5;

		const scene = new RedGPU.Display.Scene();
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		view.axis = true;
		redGPUContext.addView(view);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 500, 500);

		// 🌊 WaterMaterial 생성
		const material = new RedGPU.Material.WaterMaterial(redGPUContext);

		// 🌊 메쉬 생성 및 displacement 설정
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = 'none';
		mesh.setPosition(0, 0, 0);

		// 🌊 displacement 속성 설정
		mesh.useDisplacementTexture = true;
		mesh.useDisplacementTextureNormal = true;

		scene.addChild(mesh);

		// 🏝️ 수면 위와 아래 오브젝트 생성
		createWaterSceneObjects(redGPUContext, scene);

		const testData = {useAnimation: true};
		renderTestPane(redGPUContext, material, testData);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			if (testData.useAnimation) {
				if (material.displacementTexture) {
					material.displacementTexture.time = time;
				}
			}
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		errorMessage.style.color = "red";
		errorMessage.style.fontSize = "18px";
		errorMessage.style.padding = "20px";
		document.body.appendChild(errorMessage);
	}
);

// 🏝️ 수면 위와 아래 오브젝트 생성 함수
function createWaterSceneObjects(redGPUContext, scene) {
	const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#98FB98'];

	// 🏝️ 수면 위 오브젝트들 (y > 0)

	// 1. 떠있는 부표들 (Buoys)
	for (let i = 0; i < 4; i++) {
		const angle = (Math.PI * 2 * i) / 4;
		const radius = 8;

		const buoyGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16);
		const buoyMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i]);
		const buoy = new RedGPU.Display.Mesh(redGPUContext, buoyGeometry, buoyMaterial);

		buoy.setPosition(
			Math.cos(angle) * radius,
			1.5, // 수면 위
			Math.sin(angle) * radius
		);

		scene.addChild(buoy);
	}

	// 2. 수면 위 건물들 (Floating structures)
	for (let i = 0; i < 3; i++) {
		const angle = (Math.PI * 2 * i) / 3 + Math.PI / 6;
		const radius = 15;

		const buildingGeometry = new RedGPU.Primitive.Box(redGPUContext, 2, 3, 2);
		const buildingMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i + 4]);
		const building = new RedGPU.Display.Mesh(redGPUContext, buildingGeometry, buildingMaterial);

		building.setPosition(
			Math.cos(angle) * radius,
			2.5, // 수면 위
			Math.sin(angle) * radius
		);

		scene.addChild(building);
	}

	// 3. 수면 위 보트 (Boats)
	for (let i = 0; i < 2; i++) {
		const boatGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 0.5, 8);
		const boatMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
		const boat = new RedGPU.Display.Mesh(redGPUContext, boatGeometry, boatMaterial);

		boat.setPosition(
			i * 12 - 6,
			1.0, // 수면 위
			-12 + i * 6
		);
		boat.setRotation(0, i * 45, 0);

		scene.addChild(boat);
	}

	// 🐠 수면 아래 오브젝트들 (y < 0)

	// 4. 수중 암초들 (Underwater rocks)
	for (let i = 0; i < 8; i++) {
		const angle = (Math.PI * 2 * i) / 8;
		const radius = 5 + Math.random() * 10;

		const rockGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.8 + Math.random() * 0.5, 12, 12);
		const rockMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#696969');
		const rock = new RedGPU.Display.Mesh(redGPUContext, rockGeometry, rockMaterial);

		rock.setPosition(
			Math.cos(angle) * radius,
			-2 - Math.random() * 3, // 수면 아래
			Math.sin(angle) * radius
		);

		// 불규칙한 모양을 위한 스케일 조정
		rock.setScale(
			0.8 + Math.random() * 0.4,
			0.6 + Math.random() * 0.8,
			0.8 + Math.random() * 0.4
		);

		scene.addChild(rock);
	}

	// 5. 수중 식물들 (Underwater plants)
	for (let i = 0; i < 12; i++) {
		const plantGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 0.1, 2 + Math.random() * 2, 8);
		const plantMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#228B22');
		const plant = new RedGPU.Display.Mesh(redGPUContext, plantGeometry, plantMaterial);

		plant.setPosition(
			Math.random() * 30 - 15,
			-3 - Math.random() * 2, // 수면 아래
			Math.random() * 30 - 15
		);

		// 식물이 흔들리는 효과를 위한 약간의 기울기
		plant.setRotation(
			Math.random() * 10 - 5,
			Math.random() * 360,
			Math.random() * 10 - 5
		);

		scene.addChild(plant);
	}

	// 6. 수중 물고기들 (Fish)
	for (let i = 0; i < 15; i++) {
		const fishGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.3, 12, 12);
		const fishMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i % colors.length]);
		const fish = new RedGPU.Display.Mesh(redGPUContext, fishGeometry, fishMaterial);

		fish.setPosition(
			Math.random() * 40 - 20,
			-1 - Math.random() * 4, // 수면 아래
			Math.random() * 40 - 20
		);

		// 물고기 모양을 위한 스케일 조정
		fish.setScale(1.5, 0.8, 0.6);

		scene.addChild(fish);
	}

	// 7. 수중 보물상자들 (Treasure chests)
	for (let i = 0; i < 4; i++) {
		const chestGeometry = new RedGPU.Primitive.Box(redGPUContext, 1, 0.6, 0.8);
		const chestMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8B4513');
		const chest = new RedGPU.Display.Mesh(redGPUContext, chestGeometry, chestMaterial);

		chest.setPosition(
			Math.random() * 20 - 10,
			-4 - Math.random() * 2, // 수면 깊은 곳
			Math.random() * 20 - 10
		);

		scene.addChild(chest);
	}

	// 8. 수중 산호초 (Coral reef)
	for (let i = 0; i < 6; i++) {
		const coralGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8);
		const coralMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#FF7F50');
		const coral = new RedGPU.Display.Mesh(redGPUContext, coralGeometry, coralMaterial);

		coral.setPosition(
			Math.random() * 16 - 8,
			-2.5 - Math.random() * 1, // 수면 아래
			Math.random() * 16 - 8
		);

		// 산호초 모양을 위한 불규칙한 스케일
		coral.setScale(
			0.6 + Math.random() * 0.8,
			1.2 + Math.random() * 0.8,
			0.6 + Math.random() * 0.8
		);

		scene.addChild(coral);
	}

	// 9. 수면을 관통하는 기둥들 (Pillars crossing water surface)
	for (let i = 0; i < 4; i++) {
		const pillarGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 8, 12);
		const pillarMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#708090');
		const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeometry, pillarMaterial);

		const angle = (Math.PI * 2 * i) / 4 + Math.PI / 4;
		const radius = 18;

		pillar.setPosition(
			Math.cos(angle) * radius,
			0, // 수면을 관통
			Math.sin(angle) * radius
		);

		scene.addChild(pillar);
	}

	// 10. 수면 바닥의 모래 언덕들 (Sand dunes)
	for (let i = 0; i < 5; i++) {
		const duneGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 3, 16, 16);
		const duneMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#F4A460');
		const dune = new RedGPU.Display.Mesh(redGPUContext, duneGeometry, duneMaterial);

		dune.setPosition(
			Math.random() * 30 - 15,
			-6, // 수면 바닥
			Math.random() * 30 - 15
		);

		// 언덕 모양을 위한 스케일 조정
		dune.setScale(
			1.5 + Math.random(),
			0.3 + Math.random() * 0.2,
			1.5 + Math.random()
		);

		scene.addChild(dune);
	}
}

const renderTestPane = async (redGPUContext, material, testData) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	// 🌊 WaterMaterial의 정적 프리셋 사용
	const waterPresets = RedGPU.Material.WaterMaterial.WaterPresets;

	// 🌊 물 프리셋 색상 정의
	const waterPresetColors = {
		calmOcean: '#4A90E2',
		stormyOcean: '#2E4F6B',
		gentleWaves: '#87CEEB',
		lakeRipples: '#6BB6FF'
	};

	// 컨트롤 패널 데이터 객체 생성 (wavelength 사용)
	const controlData = {
		// Wave 1
		amplitude1: material.amplitude1,
		wavelength1: material.wavelength1,
		speed1: material.speed1,
		steepness1: material.steepness1,
		// Wave 2
		amplitude2: material.amplitude2,
		wavelength2: material.wavelength2,
		speed2: material.speed2,
		steepness2: material.steepness2,
		// Wave 3
		amplitude3: material.amplitude3,
		wavelength3: material.wavelength3,
		speed3: material.speed3,
		steepness3: material.steepness3,
		// Wave 4
		amplitude4: material.amplitude4,
		wavelength4: material.wavelength4,
		speed4: material.speed4,
		steepness4: material.steepness4,
		// Detail
		detailScale1: material.detailScale1,
		detailSpeed1: material.detailSpeed1,
		detailStrength1: material.detailStrength1,
		detailScale2: material.detailScale2,
		detailSpeed2: material.detailSpeed2,
		detailStrength2: material.detailStrength2,
		// Global
		waveRange: material.waveRange,
		foamThreshold: material.foamThreshold,
		// Normal
		normalOffset: material.normalOffset,
		normalStrength: material.normalStrength
	};

	// 🌊 프리셋 적용 함수
	const applyPreset = (preset, colorKey) => {
		material.applyPreset(preset);
		waterColorData.color.r = material.waterColor.r;
		waterColorData.color.g = material.waterColor.g;
		waterColorData.color.b = material.waterColor.b;
		pane.refresh()
		// 🌊 displacementTexture 설정이 있으면 UI 업데이트
		if (preset.displacementTexture) {
			Object.entries(preset.displacementTexture).forEach(([key, value]) => {
				if (key in controlData) {
					controlData[key] = value;
				}
			});
		}


		pane.refresh();
	};

	setSeparator(pane, "🌊 Water Presets");

	pane.addButton({title: '🌊 Calm Ocean'}).on('click', () => {
		applyPreset(waterPresets.calmOcean, 'calmOcean');
	});

	pane.addButton({title: '🌊 Stormy Ocean'}).on('click', () => {
		applyPreset(waterPresets.stormyOcean, 'stormyOcean');
	});

	pane.addButton({title: '🌊 Gentle Waves'}).on('click', () => {
		applyPreset(waterPresets.gentleWaves, 'gentleWaves');
	});

	pane.addButton({title: '🏞️ Lake Ripples'}).on('click', () => {
		applyPreset(waterPresets.lakeRipples, 'lakeRipples');
	});

	setSeparator(pane, "🌊 Wave Parameters");

	// 🌊 개별 웨이브 컨트롤 (wavelength 사용)
	const wave1Folder = pane.addFolder({title: '🌊 Wave 1 (Primary)', expanded: false});
	wave1Folder.addBinding(controlData, 'amplitude1', {min: 0, max: 2, step: 0.1})
		.on('change', (ev) => {
			material.amplitude1 = ev.value;
		});
	wave1Folder.addBinding(controlData, 'wavelength1', {min: 0.1, max: 20, step: 0.1})
		.on('change', (ev) => {
			material.wavelength1 = ev.value;
		});
	wave1Folder.addBinding(controlData, 'speed1', {min: 0, max: 3, step: 0.1})
		.on('change', (ev) => {
			material.speed1 = ev.value;
		});
	wave1Folder.addBinding(controlData, 'steepness1', {min: 0, max: 1, step: 0.01})
		.on('change', (ev) => {
			material.steepness1 = ev.value;
		});

	const wave2Folder = pane.addFolder({title: '🌊 Wave 2 (Secondary)', expanded: false});
	wave2Folder.addBinding(controlData, 'amplitude2', {min: 0, max: 2, step: 0.1})
		.on('change', (ev) => {
			material.amplitude2 = ev.value;
		});
	wave2Folder.addBinding(controlData, 'wavelength2', {min: 0.1, max: 20, step: 0.1})
		.on('change', (ev) => {
			material.wavelength2 = ev.value;
		});
	wave2Folder.addBinding(controlData, 'speed2', {min: 0, max: 3, step: 0.1})
		.on('change', (ev) => {
			material.speed2 = ev.value;
		});
	wave2Folder.addBinding(controlData, 'steepness2', {min: 0, max: 1, step: 0.01})
		.on('change', (ev) => {
			material.steepness2 = ev.value;
		});

	const wave3Folder = pane.addFolder({title: '🌊 Wave 3 (Tertiary)', expanded: false});
	wave3Folder.addBinding(controlData, 'amplitude3', {min: 0, max: 2, step: 0.1})
		.on('change', (ev) => {
			material.amplitude3 = ev.value;
		});
	wave3Folder.addBinding(controlData, 'wavelength3', {min: 0.1, max: 20, step: 0.1})
		.on('change', (ev) => {
			material.wavelength3 = ev.value;
		});
	wave3Folder.addBinding(controlData, 'speed3', {min: 0, max: 3, step: 0.1})
		.on('change', (ev) => {
			material.speed3 = ev.value;
		});
	wave3Folder.addBinding(controlData, 'steepness3', {min: 0, max: 1, step: 0.01})
		.on('change', (ev) => {
			material.steepness3 = ev.value;
		});

	const wave4Folder = pane.addFolder({title: '🌊 Wave 4 (Detail)', expanded: false});
	wave4Folder.addBinding(controlData, 'amplitude4', {min: 0, max: 2, step: 0.1})
		.on('change', (ev) => {
			material.amplitude4 = ev.value;
		});
	wave4Folder.addBinding(controlData, 'wavelength4', {min: 0.1, max: 20, step: 0.1})
		.on('change', (ev) => {
			material.wavelength4 = ev.value;
		});
	wave4Folder.addBinding(controlData, 'speed4', {min: 0, max: 3, step: 0.1})
		.on('change', (ev) => {
			material.speed4 = ev.value;
		});
	wave4Folder.addBinding(controlData, 'steepness4', {min: 0, max: 1, step: 0.01})
		.on('change', (ev) => {
			material.steepness4 = ev.value;
		});

	// 🎯 디테일 노이즈 컨트롤
	const detailFolder = pane.addFolder({title: '🎯 Detail Noise', expanded: false});
	detailFolder.addBinding(controlData, 'detailScale1', {min: 1, max: 50, step: 0.01})
		.on('change', (ev) => {
			material.detailScale1 = ev.value;
		});
	detailFolder.addBinding(controlData, 'detailSpeed1', {min: 0, max: 2, step: 0.01})
		.on('change', (ev) => {
			material.detailSpeed1 = ev.value;
		});
	detailFolder.addBinding(controlData, 'detailStrength1', {min: 0, max: 0.5, step: 0.01})
		.on('change', (ev) => {
			material.detailStrength1 = ev.value;
		});
	detailFolder.addBinding(controlData, 'detailScale2', {min: 1, max: 50, step: 0.01})
		.on('change', (ev) => {
			material.detailScale2 = ev.value;
		});
	detailFolder.addBinding(controlData, 'detailSpeed2', {min: 0, max: 2, step: 0.01})
		.on('change', (ev) => {
			material.detailSpeed2 = ev.value;
		});
	detailFolder.addBinding(controlData, 'detailStrength2', {min: 0, max: 0.5, step: 0.01})
		.on('change', (ev) => {
			material.detailStrength2 = ev.value;
		});

	setSeparator(pane, "🌊 Global Settings");

	// 🌊 전역 설정
	pane.addBinding(controlData, 'waveRange', {min: 0.1, max: 5, step: 0.1})
		.on('change', (ev) => {
			material.waveRange = ev.value;
		});
	pane.addBinding(controlData, 'foamThreshold', {min: 0, max: 1, step: 0.01})
		.on('change', (ev) => {
			material.foamThreshold = ev.value;
		});

	// 🎯 노말 맵 설정
	setSeparator(pane, "🎯 Normal Map");
	pane.addBinding(controlData, 'normalOffset', {min: 0.001, max: 0.1, step: 0.001})
		.on('change', (ev) => {
			material.normalOffset = ev.value;
		});
	pane.addBinding(controlData, 'normalStrength', {min: 0, max: 3, step: 0.1})
		.on('change', (ev) => {
			material.normalStrength = ev.value;
		});

	// 🌊 물 외관 설정
	setSeparator(pane, "🌊 Water Appearance");

	// 🎯 ColorRGB 인스턴스의 r, g, b 값은 0-255 범위입니다
	const waterColorData = {
		color: {
			r: material.waterColor.r,
			g: material.waterColor.g,
			b: material.waterColor.b,
		}
	};

	setSeparator(pane, "🎯 Precise Angles");

	pane.addButton({title: '🎯 0°'}).on('click', () => {
		material.setFlowDirectionByDegrees(0);
	});

	pane.addButton({title: '🎯 45°'}).on('click', () => {
		material.setFlowDirectionByDegrees(45);
	});

	pane.addButton({title: '🎯 90°'}).on('click', () => {
		material.setFlowDirectionByDegrees(90);
	});

	pane.addButton({title: '🎯 135°'}).on('click', () => {
		material.setFlowDirectionByDegrees(135);
	});

	pane.addButton({title: '🎯 180°'}).on('click', () => {
		material.setFlowDirectionByDegrees(180);
	});

	pane.addButton({title: '🎯 225° '}).on('click', () => {
		material.setFlowDirectionByDegrees(225);
	});

	pane.addButton({title: '🎯 270°'}).on('click', () => {
		material.setFlowDirectionByDegrees(270);
	});

	pane.addButton({title: '🎯 315° (Southeast)'}).on('click', () => {
		material.setFlowDirectionByDegrees(315);
	});

	pane.addBinding(waterColorData, 'color', {
		picker: 'inline',
		view: 'color',
		expanded: false,
		color: {
			alpha: false,
		},
	}).on('change', (ev) => {
		const color = ev.value;
		material.waterColor.setColorByRGB(
			Math.floor(color.r),
			Math.floor(color.g),
			Math.floor(color.b)
		);
	});

	pane.addBinding(material, 'waterIOR', {min: 1, max: 1.6, step: 0.01});
	pane.addBinding(material, 'opacity', {min: 0, max: 1, step: 0.01});
	pane.addBinding(material, 'waterColorStrength', {min: 0, max: 1, step: 0.01});

	// 🌊 기본 SimplexTexture 컨트롤
	setSeparator(pane, "🌊 Base Noise");

	// SimplexTexture의 기본 속성들 - material getter/setter를 통해 접근
	pane.addBinding(material, 'noiseScale', {min: 0, max: 20, step: 0.1});
	pane.addBinding(material, 'seed', {min: 0, max: 1000, step: 1});

	// 노이즈 차원 설정 (SimplexTexture의 noiseDimension 사용)
	if (material.displacementTexture.noiseDimension !== undefined) {
		pane.addBinding(material.displacementTexture, 'noiseDimension', {
			options: RedGPU.Resource.NOISE_DIMENSION,
		});
	}
};
