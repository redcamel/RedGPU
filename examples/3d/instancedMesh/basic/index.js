import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const texture = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/UV_Grid_Sm.jpg'
		);
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

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

		createTest(redGPUContext, scene, material);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// Logic for every frame goes here
			// 매 프레임마다 실행될 로직 추가
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
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(context);

	const instanceCount = 10000;
	const mesh = new RedGPU.Display.InstancingMesh(
		context,
		instanceCount,
		new RedGPU.Primitive.Plane(context),
		material
	);

	mesh.primitiveState.cullMode = 'none';

	scene.addChild(mesh);

	const initializeInstances = () => {
		for (let i = 0; i < mesh.instanceCount; i++) {
			if (!mesh.instanceChildren[i]?.inited) {
				mesh.instanceChildren[i].setPosition(
					Math.random() * 300 - 150,
					Math.random() * 300 - 150,
					Math.random() * 300 - 150
				);
				mesh.instanceChildren[i].setRotation(
					Math.random() * 360,
					Math.random() * 360,
					Math.random() * 360
				);
				// mesh.instanceChildren[i].opacity = Math.random();
			}
		}
	};

	initializeInstances();

	const pane = new Pane();
	pane.addBinding(mesh, 'instanceCount', {min: 100, max: 100000, step: 1})
		.on('change', initializeInstances);
}
