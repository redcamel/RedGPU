import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 8;
		controller.speedDistance = 0.1;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const glbUrls = [
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
		];

		loadGLTFGrid(view, glbUrls);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});

		renderTestPane(redGPUContext, view);
	},
	(failReason) => {
		console.error('RedGPU initialization failed:', failReason);
		const errorDiv = document.createElement('div');
		errorDiv.innerHTML = failReason;
		document.body.appendChild(errorDiv);
	}
);

function loadGLTFGrid(view, urls, gridSize = 3, spacing = 3) {
	const {redGPUContext, scene} = view;

	const totalCols = Math.min(gridSize, urls.length);
	const totalRows = Math.ceil(urls.length / gridSize);
	const totalWidth = (totalCols - 1) * spacing;
	const totalDepth = (totalRows - 1) * spacing;

	urls.forEach((url, index) => {
		new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
			const mesh = result.resultMesh;
			scene.addChild(mesh);

			const row = Math.floor(index / gridSize);
			const col = index % gridSize;
			const x = col * spacing - totalWidth / 2;
			const z = row * spacing - totalDepth / 2;

			mesh.x = x;
			mesh.y = -0.5;
			mesh.z = z;
		});
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createIblHelper, setDebugButtons} = await import('../../../exampleHelper/createExample/panes/index.js');
	setDebugButtons(redGPUContext);
	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
