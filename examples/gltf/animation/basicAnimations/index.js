import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const glbUrls = [
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedCube/glTF/AnimatedCube.gltf',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedMorphCube/glTF-Binary/AnimatedMorphCube.glb',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedTriangle/glTF/AnimatedTriangle.gltf',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxAnimated/glTF-Binary/BoxAnimated.glb',
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

function loadGLTFGrid(view, urls, gridSize = 5, spacing = 5) {
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
			mesh.y = 0;
			mesh.z = z;
		});
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createIblHelper, setDebugViewButton} = await import('../../../exampleHelper/createExample/panes/index.js');
	setDebugViewButton(redGPUContext);
	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
