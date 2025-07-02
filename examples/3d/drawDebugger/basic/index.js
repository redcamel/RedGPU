import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		// view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);


		const mesh = new RedGPU.Display.Mesh(redGPUContext,new RedGPU.Primitive.Sphere(redGPUContext), new RedGPU.Material.ColorMaterial(redGPUContext))
		mesh.enableDebugger = true;
		scene.addChild(mesh)
		mesh.setScale(2,1)

		const mesh2 = new RedGPU.Display.Mesh(redGPUContext,new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.ColorMaterial(redGPUContext,'#fff000'))
		mesh.addChild(mesh2)
		mesh2.enableDebugger = true;
		mesh2.setPosition(2,2)


		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 매 프레임 로직

			mesh.rotationX +=.1
			mesh.rotationY +=.1
			mesh.rotationZ +=.1

			// mesh.setPosition(Math.sin(time/1000),Math.cos(time/1000),Math.sin(time/1000))


			mesh2.rotationX +=.1
			mesh2.rotationY +=.1
			mesh2.rotationZ +=.1
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext);
	},
	(failReason) => {
		console.error('초기화 실패:', failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const renderTestPane = async (redGPUContext) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const pane = new Pane();
};
