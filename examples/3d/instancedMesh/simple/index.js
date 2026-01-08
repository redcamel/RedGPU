import * as RedGPU from "../../../../dist/index.js?t=1767864574385";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.speedDistance = 10;
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const light = new RedGPU.Light.DirectionalLight()
		scene.lightManager.addDirectionalLight(light)

		const texture = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/UV_Grid_Sm.jpg'
		);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		material.diffuseTexture = texture;

		const skyboxTexture = new RedGPU.Resource.CubeTexture(
			redGPUContext,
			[
				"../../../assets/skybox/px.jpg", // Positive X
				"../../../assets/skybox/nx.jpg", // Negative X
				"../../../assets/skybox/py.jpg", // Positive Y
				"../../../assets/skybox/ny.jpg", // Negative Y
				"../../../assets/skybox/pz.jpg", // Positive Z
				"../../../assets/skybox/nz.jpg", // Negative Z
			]
		);
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, skyboxTexture);
		view.grid = true

		createTest(redGPUContext, scene, material);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// Logic for every frame goes here
			// 매 프레임마다 실행될 로직 추가
			if (scene.children[0]) {
				// scene.children[0].rotationY += 0.001;
			}
		};
		renderer.start(redGPUContext, render);

	},
	(failReason) => {
		// Show the error if initialization fails
		// 초기화 실패 시 에러 표시
		console.error('초기화 실패:', failReason);

		// Create an element for the error message
		// 에러 메시지 표시용 요소 생성
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;

		// Append the error message to the document body
		// 문서 본문에 에러 메시지 추가
		document.body.appendChild(errorMessage);
	}
);

async function createTest(context, scene, material) {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767864574385');

	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767864574385");
	setDebugButtons(context);

	const maxInstanceCount = context.detector.isMobile ? 100000 : RedGPU.Display.InstancingMesh.getLimitSize();
	const instanceCount = context.detector.isMobile ? 20000 : 200000;
	const mesh = new RedGPU.Display.InstancingMesh(
		context,
		maxInstanceCount,
		instanceCount,
		new RedGPU.Primitive.Plane(context),
		material
	);

	// mesh.primitiveState.cullMode = 'none';

	scene.addChild(mesh);

	const initializeInstances = () => {
		for (let i = 0; i < mesh.instanceCount; i++) {
			if (mesh.instanceChildren[i].x === 0) {
				mesh.instanceChildren[i].setPosition(
					Math.random() * 900 - 450,
					Math.random() * 900 - 450,
					Math.random() * 900 - 450
				);
				mesh.instanceChildren[i].setScale(Math.random() * 2 + 1);
				mesh.instanceChildren[i].setRotation(
					Math.random() * 360,
					Math.random() * 360,
					Math.random() * 360
				);
			}

			// mesh.instanceChildren[i].opacity = Math.random();

		}
	};

	initializeInstances();

	const pane = new Pane();
	pane.addBinding(mesh, 'instanceCount', {min: 100, max: maxInstanceCount, step: 1})
		.on('change', initializeInstances);
	pane.addBinding({maxInstanceCount: maxInstanceCount}, 'maxInstanceCount', {
		readonly: true,
		format: (v) => `${Math.floor(v).toLocaleString()}`
	});
}
