import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let pointLightGroups = [];

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

			createCircularPointLights(scene, xPosition)
		}
	)
}

function createCircularPointLights(scene, centerX, circleRadius = 1.5, lightCount = 4, height = 1) {
	const intensity = 1;

	const lightGroup = {
		lights: [],
		centerX: centerX,
		circleRadius: circleRadius,
		height: height,
		count: lightCount
	};

	for (let i = 0; i < lightCount; i++) {
		const light = new RedGPU.Light.PointLight('#fff', intensity);
		light.intensity = intensity;

		const angle = (i / lightCount) * Math.PI * 2;

		const x = centerX + Math.cos(angle) * circleRadius;
		const z = Math.sin(angle) * circleRadius;
		const y = height;

		light.x = x;
		light.y = y;
		light.z = z;
		light.radius = 1.5;
		light.innerCutoff = 8;
		light.outerCutoff = 13;

		const hue = (i / lightCount) * 360;
		const color = hslToRgb(hue, 70, 60);
		light.color.r = color.r;
		light.color.g = color.g;
		light.color.b = color.b;

		scene.lightManager.addPointLight(light);
		lightGroup.lights.push(light);
	}

	pointLightGroups.push(lightGroup);
}

function updateCircularPointLights(scene, lightCount, circleRadius, height) {
	// 모든 기존 라이트 제거
	pointLightGroups.forEach(group => {
		group.lights.forEach(light => {
			scene.lightManager.removePointLight(light);
		});
	});

	// 그룹 초기화
	pointLightGroups = [];

	// 새로운 라이트 생성 (각 GLTF 모델마다)
	const positions = [-2, 2]; // DamagedHelmet과 Corset의 x 위치
	positions.forEach(xPos => {
		createCircularPointLights(scene, xPos, circleRadius, lightCount, height);
	});
}

function updateLightPositions(circleRadius, height) {
	pointLightGroups.forEach(group => {
		group.lights.forEach((light, i) => {
			const angle = (i / group.lights.length) * Math.PI * 2;
			const x = group.centerX + Math.cos(angle) * circleRadius;
			const z = Math.sin(angle) * circleRadius;

			light.x = x;
			light.y = height;
			light.z = z;
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

	// Point Light Settings
	const lightSettings = {
		radius: 1.5,
		count: 4,
		circleRadius: 1.5,
		height: 1
	};

	const lightFolder = pane.addFolder({
		title: 'Point Lights',
		expanded: true
	});

	lightFolder.addBinding(lightSettings, 'radius', {
		label: 'Light Radius',
		min: 0.1,
		max: 2.0,
		step: 0.01
	}).on('change', () => {
		scene.lightManager.pointLights.forEach(light => {
			light.radius = lightSettings.radius;
		});
	});

	lightFolder.addBinding(lightSettings, 'count', {
		label: 'Light Count',
		min: 3,
		max: 24,
		step: 1
	}).on('change', () => {
		updateCircularPointLights(scene, lightSettings.count, lightSettings.circleRadius, lightSettings.height);
	});

	lightFolder.addBinding(lightSettings, 'circleRadius', {
		label: 'Circle Radius',
		min: 0.5,
		max: 5.0,
		step: 0.1
	}).on('change', () => {
		updateLightPositions(lightSettings.circleRadius, lightSettings.height);
	});

	lightFolder.addBinding(lightSettings, 'height', {
		label: 'Light Height',
		min: -2.0,
		max: 5.0,
		step: 0.1
	}).on('change', () => {
		updateLightPositions(lightSettings.circleRadius, lightSettings.height);
	});
};
