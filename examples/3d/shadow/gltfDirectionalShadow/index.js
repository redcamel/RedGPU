import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		controller.distance = 15;
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();


		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);


		addGround(redGPUContext, scene);
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf', -1, 1);
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF/BrainStem.gltf', 1, 0);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			redGPUContext.viewList.forEach(view => {
				const { scene } = view;
				let i = scene.numChildren;
				while (i--) {
					if (i === 0) continue;
					let testObj = scene.children[i];
					testObj.rotationY += 0.5;
				}
			});
		});

		renderTestPane(redGPUContext, view);
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(redGPUContext, scene, url, xPosition, yPosition) {
	let mesh;
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh']);
			mesh.x = xPosition;
			mesh.y = yPosition;
			mesh.setCastShadowRecursively(true);
			mesh.setReceiveShadowRecursively(true);
		}
	);
}


const addGround = (redGPUContext, scene) => {
	const plane = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Plane(redGPUContext),
		new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
	);
	plane.setScale(200);
	plane.rotationX = 90;
	plane.receiveShadow = true;
	scene.addChild(plane);
};

const renderTestPane = async (redGPUContext, targetView) => {
	const { Pane } = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");

	const {createIblHelper} = await import('../../../exampleHelper/createExample/panes/index.js');

	const pane = new Pane();
	const { shadowManager } = targetView.scene;
	const { directionalShadowManager } = shadowManager;

	createIblHelper(pane, targetView, RedGPU);
	pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
		min: 128,
		max: 2048,
		step: 1
	}).on("change", (ev) => {
		directionalShadowManager.shadowDepthTextureSize = ev.value;
	});

};
