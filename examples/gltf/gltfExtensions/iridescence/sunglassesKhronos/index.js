import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 3
		controller.speedDistance = 0.1
		controller.tilt = 15
		controller.pan = 45

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb');

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, view);
	},
	(failReason) => {
		console.error('RedGPU initialization failed:', failReason);
		const errorDiv = document.createElement('div');
		errorDiv.innerHTML = failReason;
		document.body.appendChild(errorDiv);
	}
);

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view;
	new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
		const mesh = result.resultMesh
		mesh.setScale(10)
		mesh.y = -0.25
		scene.addChild(mesh)
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createIblHelper, setDebugButtons} = await import('../../../../exampleHelper/createExample/panes/index.js');
	setDebugButtons(redGPUContext);
	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
