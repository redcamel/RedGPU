import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 8;
		controller.speedDistance = 0.1;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const glbUrls = [
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
			// 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb',
			'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb'
		];

		createSampleMesh(redGPUContext, scene);

		loadGLTFGrid(view, glbUrls);

		setTimeout(() => {
			const glbUrls = [
				// 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb',
				// 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb',
				// 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF/CesiumMilkTruck.gltf',
				// 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb'
			];

			loadGLTFGrid(view, glbUrls);
		},2000)
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
const createSampleMesh = (redGPUContext, scene) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	scene.addChild(mesh);
	mesh.z = -20

	return mesh;
};

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

			// if(url.includes('CesiumMilkTruck')){
			// 	mesh.z = -100
			// }
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
