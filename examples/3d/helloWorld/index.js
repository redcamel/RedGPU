import * as RedGPU from "../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 매 프레임 로직
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
	const { setRedGPUTest_pane, setAntialiasing_pane } = await import("../../exampleHelper/createExample/panes/index.js");

	const pane = new Pane();
	setAntialiasing_pane(pane, redGPUContext, true);
	setRedGPUTest_pane(pane, redGPUContext, true);
};