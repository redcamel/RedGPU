/**
 * [KO] Sprite3D 비교 예제 (World Size vs Pixel Size)
 * [EN] Sprite3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (pixelSize) modes.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js";

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

		// [KO] 공용 재질 생성
		// [EN] Create shared material
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png');
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

		// 1. [KO] 월드 사이즈 모드 (World Size)
		// 1. [EN] World Size Mode
		const spriteWorld = new RedGPU.Display.Sprite3D(redGPUContext, material);
		spriteWorld.x = -3;
		spriteWorld.y = 1;
		spriteWorld.worldSize = 1.5;
		scene.addChild(spriteWorld);

		// 2. [KO] 픽셀 사이즈 모드 (Pixel Size)
		// 2. [EN] Pixel Size Mode
		const spritePixel = new RedGPU.Display.Sprite3D(redGPUContext, material);
		spritePixel.x = 3;
		spritePixel.y = 1;
		spritePixel.usePixelSize = true;
		spritePixel.pixelSize = 100;
		scene.addChild(spritePixel);

		// [KO] 옵션 설명 라벨 (TextField3D)
		// [EN] Option description labels (TextField3D)
		const createLabel = (text, x, y) => {
			const label = new RedGPU.Display.TextField3D(redGPUContext, text);
			label.x = x;
			label.y = y;
			label.color = '#ffffff';
			label.fontSize = 16;
			label.background = '#ff3333';
			label.padding = 8;
			label.useBillboard = true;
			scene.addChild(label);
		};

		createLabel('World Size', -3, 2.5);
		createLabel('Pixel Size', 3, 2.5);

		// [KO] 렌더러 시작
		// [EN] Start renderer
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] GUI 설정
		// [EN] Setup GUI
		renderTestPane(redGPUContext, spriteWorld, spritePixel);
	}
);

const renderTestPane = async (redGPUContext, spriteWorld, spritePixel) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");

	setDebugButtons(RedGPU, redGPUContext);
	const pane = new Pane();

	// World Size Sprite Folder
	const fWorld = pane.addFolder({title: 'World Size Sprite', expanded: true});
	fWorld.addBinding(spriteWorld, 'worldSize', {min: 0.1, max: 5, step: 0.1});
	fWorld.addBinding(spriteWorld, 'useBillboard');

	// Pixel Size Sprite Folder
	const fPixel = pane.addFolder({title: 'Pixel Size Sprite', expanded: true});
	fPixel.addBinding(spritePixel, 'usePixelSize');
	fPixel.addBinding(spritePixel, 'pixelSize', {min: 10, max: 512, step: 1});
	fPixel.addBinding(spritePixel, 'useBillboard');

	const refresh = () => {
		pane.refresh();
		requestAnimationFrame(refresh);
	};
	refresh();
};
