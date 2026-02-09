/**
 * [KO] TextField3D 비교 예제 (World Size vs Pixel Size)
 * [EN] TextField3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] TextField3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(usePixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (usePixelSize) modes for TextField3D.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 12;

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// 1. [KO] 월드 사이즈 모드 (World Size)
		// 1. [EN] World Size Mode
		const textWorld = new RedGPU.Display.TextField3D(redGPUContext, "World Size Mode");
		textWorld.x = -3;
		textWorld.y = 1;
		textWorld.worldSize = 1.5;
		textWorld.background = 'rgba(255, 0, 0, 0.8)';
		textWorld.padding = 10;
		textWorld.useBillboard = true;
		scene.addChild(textWorld);

		// 2. [KO] 픽셀 사이즈 모드 (Pixel Size)
		// 2. [EN] Pixel Size Mode
		const textPixel = new RedGPU.Display.TextField3D(redGPUContext, "Pixel Size Mode");
		textPixel.x = 3;
		textPixel.y = 1;
		textPixel.usePixelSize = true;
		textPixel.background = 'rgba(0, 102, 255, 0.8)';
		textPixel.padding = 10;
		textPixel.useBillboard = true;
		scene.addChild(textPixel);

		// [KO] 렌더러 시작
		// [EN] Start renderer
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] GUI 설정
		// [EN] Setup GUI
		renderTestPane(redGPUContext, textWorld, textPixel);
	}
);

const renderTestPane = async (redGPUContext, textWorld, textPixel) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985');
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770625511985");

	setDebugButtons(RedGPU, redGPUContext);
	const pane = new Pane();

	// World Size TextField Folder
	const fWorld = pane.addFolder({title: 'World Size TextField', expanded: true});
	fWorld.addBinding(textWorld, 'text');
	fWorld.addBinding(textWorld, 'worldSize', {min: 0.1, max: 5, step: 0.1});
	fWorld.addBinding(textWorld, 'useBillboard');

	// Pixel Size TextField Folder
	const fPixel = pane.addFolder({title: 'Pixel Size TextField', expanded: true});
	fPixel.addBinding(textPixel, 'text');
	fPixel.addBinding(textPixel, 'usePixelSize');
	fPixel.addBinding(textPixel, 'useBillboard');

	const refresh = () => {
		pane.refresh();
		requestAnimationFrame(refresh);
	};
	refresh();
};