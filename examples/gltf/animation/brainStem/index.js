import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {

		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 10
		controller.speedDistance = 0.1
		controller.tilt = 0

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb');
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

let num = 0

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view;
	new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
		const mesh = result.resultMesh
		mesh.y = -0.75
		if (num) {
			mesh.x = Math.random() * 10 - 5
			mesh.z = Math.random() * 10 - 5
		}
		num++
		scene.addChild(mesh)

		// let i = 10
		// while(i--){
		// 	let clonedMesh = mesh.clone()
		// 	clonedMesh.x = Math.random() * 10 - 5
		// 	clonedMesh.z = Math.random() * 10 - 5
		// 	scene.addChild(clonedMesh)
		// }
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createIblHelper, setDebugViewButton} = await import('../../../exampleHelper/createExample/panes/index.js');
	setDebugViewButton(redGPUContext);
	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
