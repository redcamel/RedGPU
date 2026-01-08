import * as RedGPU from "../../../../../dist/index.js?t=1767864574385";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {

		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 10

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true
		redGPUContext.addView(view);

		const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
		view.ibl = ibl;
		view.skybox = newSkybox;

		{
			let i = redGPUContext.detector.isMobile ? 200 : 500
			while (i--) {
				loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf');
				// ;loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb')

			}
		}
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
		};
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
		scene.addChild(mesh)
		if (num !== 0) {
			mesh.x = Math.random() * 30 - 15
			mesh.z = Math.random() * 30 - 15
		}
		num++
		pane?.refresh()
	});
}

let pane
const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767864574385');
	const {setDebugButtons} = await import('../../../../exampleHelper/createExample/panes/index.js?t=1767864574385');
	setDebugButtons(redGPUContext);
	pane = new Pane();

	const moreNum = redGPUContext.detector.isMobile ? 10 : 50
	pane.addButton({
		title: `Add ${moreNum} CesiumMan`,
	}).on('click', () => {
		let i = moreNum
		while (i--) {
			loadGLTF(targetView, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',);
		}
	})

	pane.addBinding(targetView.scene.children, 'length', {
		disabled: true,
		label: `Count CesiumMan`,
		step: 1
	})
};
