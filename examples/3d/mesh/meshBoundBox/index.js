import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		view.axis = true;
		redGPUContext.addView(view);

		const mesh0 = createSampleMesh(redGPUContext, scene);
		const mesh1 = createSampleMesh(redGPUContext, scene);
		const mesh2 = createSampleMesh(redGPUContext, scene);

		const label0 = new RedGPU.Display.TextField3D(redGPUContext,'OBB')
		const label1 = new RedGPU.Display.TextField3D(redGPUContext,'AABB')
		const label2 = new RedGPU.Display.TextField3D(redGPUContext,'BOTH')

		label0.useBillboard = true
		label0.setPosition(-4,-1,2.5)

		label1.useBillboard = true
		label1.setPosition(0,-1,2.5)

		label2.useBillboard = true
		label2.setPosition(4,-1,2.5)

		scene.addChild(label0)
		scene.addChild(label1)
		scene.addChild(label2)



		mesh0.x = -4
		mesh1.x = 0
		mesh2.x = 4

		mesh0.enableDebugger = true
		mesh0.drawDebugger.debugMode = 'OBB'

		mesh1.enableDebugger = true
		mesh1.drawDebugger.debugMode = 'AABB'

		mesh2.enableDebugger = true
		mesh2.drawDebugger.debugMode = 'BOTH'

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
				scene.children.forEach(v => {
					v.rotationX +=0.2
					v.rotationY +=0.2
					v.rotationZ +=0.2
				})
		};
		renderer.start(redGPUContext, render);

	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSampleMesh = (redGPUContext, scene) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext,'#dfa9e6');

	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	scene.addChild(mesh);

	return mesh;
};
