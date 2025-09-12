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

		{
			let i = 200
			while(i--){
				// setTimeout(()=>{
				// 	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb');
				// 	loadGLTF(view, 'https://redcamel.github.io/RedGL2/asset/glTF/breakDance/scene.gltf');
				// 	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb');
				// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SimpleMorph/glTF/SimpleMorph.gltf');

				// },1 * i)
			}
		}
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
		mesh.x = Math.random() * 10 - 5
		mesh.z = Math.random() * 10- 5
		if(url.includes('breakDance')){

			mesh.setScale(0.001)
		}
		scene.addChild(mesh)
		if(num===0){
			console.log(result)
		}
		num++
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
	const {createIblHelper, setDebugButtons} = await import('../../../exampleHelper/createExample/panes/index.js');
	setDebugButtons(redGPUContext);
	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
