import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let spotLightGroups = [];

const lightSettings = {
	radius: 7.0,
	count: 4,
	positionRadius: 1.5,
	focusRadius: 0.5,
	height: 5.5,
	innerCutoff: 4,
	outerCutoff: 5,
	intensity: 1
};

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 10
		controller.speedDistance = 0.5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const plane = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Plane(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext, '#fff'))
		plane.setScale(200)
		plane.rotationX = 90
		plane.y = -0.01
		scene.addChild(plane)

		const renderer = new RedGPU.Renderer(redGPUContext);

		const render = () => {

		};
		renderer.start(redGPUContext, render);
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf', -2, 1);
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF/Corset.gltf', 2, 0,30);
		renderTestPane(redGPUContext, scene, view);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(redGPUContext, scene, url, xPosition, yPosition,scale=1) {
	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
			mesh.x = xPosition
			mesh.y = yPosition
			mesh.setScale(scale)

			createCircularSpotLights(scene, xPosition)
		}
	)
}

function createCircularSpotLights(scene, centerX) {
	const lightGroup = {
		lights: [],
		centerX: centerX,
		positionRadius: lightSettings.positionRadius,
		focusRadius: lightSettings.focusRadius,
		height: lightSettings.height,
		count: lightSettings.count
	};

	for (let i = 0; i < lightSettings.count; i++) {
		const light = new RedGPU.Light.SpotLight('#fff', lightSettings.intensity);
		light.intensity = lightSettings.intensity;

		const angle = (i / lightSettings.count) * Math.PI * 2;

		// 라이트 위치 설정
		const x = centerX + Math.cos(angle) * lightSettings.positionRadius;
		const z = Math.sin(angle) * lightSettings.positionRadius;
		const y = lightSettings.height;

		light.x = x;
		light.y = y;
		light.z = z;

		// 라이트가 바라볼 타겟 위치 설정
		const lookAtAngle = angle + Math.PI; // 반대 방향
		const targetX = centerX + Math.cos(lookAtAngle) * lightSettings.focusRadius;
		const targetY = lightSettings.height;
		const targetZ = Math.sin(lookAtAngle) * lightSettings.focusRadius;

		// lookAt 메서드 사용
		light.lookAt(targetX, targetY, targetZ);

		light.radius = lightSettings.radius;
		light.innerCutoff = lightSettings.innerCutoff;
		light.outerCutoff = lightSettings.outerCutoff;

		const hue = (i / lightSettings.count) * 360;
		const color = hslToRgb(hue, 70, 60);
		light.color.r = color.r;
		light.color.g = color.g;
		light.color.b = color.b;

		scene.lightManager.addSpotLight(light);
		lightGroup.lights.push(light);
	}

	spotLightGroups.push(lightGroup);
}

function updateCircularSpotLights(scene) {
	// 기존 그룹의 centerX 위치들을 저장
	const centerPositions = spotLightGroups.map(group => group.centerX);

	// 모든 기존 라이트 제거
	spotLightGroups.forEach(group => {
		group.lights.forEach(light => {
			scene.lightManager.removeSpotLight(light);
		});
	});

	// 그룹 초기화
	spotLightGroups = [];

	// 기존 위치에 새로운 라이트 생성
	centerPositions.forEach(xPos => {
		createCircularSpotLights(scene, xPos);
	});
}

function updateSpotLightPositions() {
	spotLightGroups.forEach(group => {
		// 그룹의 속성도 현재 설정으로 업데이트
		group.positionRadius = lightSettings.positionRadius;
		group.focusRadius = lightSettings.focusRadius;
		group.height = lightSettings.height;
		group.count = lightSettings.count;

		group.lights.forEach((light, i) => {
			const angle = (i / group.lights.length) * Math.PI * 2;

			// 라이트 위치 업데이트
			const x = group.centerX + Math.cos(angle) * lightSettings.positionRadius;
			const z = Math.sin(angle) * lightSettings.positionRadius;

			light.x = x;
			light.y = lightSettings.height;
			light.z = z;

			// 라이트가 바라볼 타겟 위치 업데이트
			const lookAtAngle = angle + Math.PI; // 반대 방향
			const targetX = group.centerX + Math.cos(lookAtAngle) * lightSettings.focusRadius;
			const targetY = 0;
			const targetZ = Math.sin(lookAtAngle) * lightSettings.focusRadius;

			// lookAt 메서드 사용
			light.lookAt(targetX, targetY, targetZ);
		});
	});
}

function hslToRgb(h, s, l) {
	h = h / 360;
	s = s / 100;
	l = l / 100;

	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

const createSkybox = (redGPUContext) => {
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg",
		"../../../assets/skybox/nx.jpg",
		"../../../assets/skybox/py.jpg",
		"../../../assets/skybox/ny.jpg",
		"../../../assets/skybox/pz.jpg",
		"../../../assets/skybox/nz.jpg",
	];

	const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
	const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
	return skybox;
};

const renderTestPane = async (redGPUContext, scene, view) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const skyboxSettings = {
		enabled: false
	};

	const skyboxFolder = pane.addFolder({
		title: 'Skybox(iblTexture)',
		expanded: true
	});

	skyboxFolder.addBinding(skyboxSettings, 'enabled', {
		label: 'Enable Skybox'
	}).on('change', (event) => {
		if (event.value) {
			view.skybox = createSkybox(redGPUContext);
		} else {
			view.skybox = null;
		}
	});

	const lightFolder = pane.addFolder({
		title: 'Spot Lights',
		expanded: true
	});

	lightFolder.addBinding(lightSettings, 'intensity', {
		label: 'Intensity',
		min: 0.1,
		max: 3.0,
		step: 0.1
	}).on('change', () => {
		scene.lightManager.spotLights.forEach(light => {
			light.intensity = lightSettings.intensity;
		});
	});

	lightFolder.addBinding(lightSettings, 'radius', {
		label: 'Light Radius',
		min: 1.0,
		max: 10.0,
		step: 0.1
	}).on('change', () => {
		scene.lightManager.spotLights.forEach(light => {
			light.radius = lightSettings.radius;
		});
	});

	lightFolder.addBinding(lightSettings, 'count', {
		label: 'Light Count',
		min: 2,
		max: 12,
		step: 1
	}).on('change', () => {
		updateCircularSpotLights(scene);
	});

	lightFolder.addBinding(lightSettings, 'positionRadius', {
		label: 'Position Radius',
		min: 0.5,
		max: 5.0,
		step: 0.1
	}).on('change', () => {
		updateSpotLightPositions();
	});

	lightFolder.addBinding(lightSettings, 'focusRadius', {
		label: 'Focus Radius',
		min: 0.0,
		max: 2.0,
		step: 0.1
	}).on('change', () => {
		updateSpotLightPositions();
	});

	lightFolder.addBinding(lightSettings, 'height', {
		label: 'Light Height',
		min: 1.0,
		max: 8.0,
		step: 0.1
	}).on('change', () => {
		updateSpotLightPositions();
	});

	lightFolder.addBinding(lightSettings, 'innerCutoff', {
		label: 'Inner Cutoff',
		min: 1,
		max: 5,
		step:  0.01
	}).on('change', () => {
		scene.lightManager.spotLights.forEach(light => {
			light.innerCutoff = lightSettings.innerCutoff;
		});
	});

	lightFolder.addBinding(lightSettings, 'outerCutoff', {
		label: 'Outer Cutoff',
		min: 1,
		max: 10,
		step: 0.01
	}).on('change', () => {
		scene.lightManager.spotLights.forEach(light => {
			light.outerCutoff = lightSettings.outerCutoff;
		});
	});
};
