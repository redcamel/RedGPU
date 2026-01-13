import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);
		redGPUContext.backgroundColor.setColorByRGB(255, 132, 255);

		const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/blendTest/blendTest_base.png'
		);
		const texture_blendTest_shape = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/blendTest/blendTest_shape.png'
		);
		const {
			base_origin,
			shape_origin
		} = createSourceView(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape);
		const bottomGroup = createResults(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape);
		const material_base = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);
		const base = new RedGPU.Display.Sprite2D(redGPUContext, material_base);
		base.setSize(200, 200);
		base.x = view.screenRectObject.width / 2;
		base.y = view.screenRectObject.height / 2;
		scene.addChild(base);
		const material_shape = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_shape);
		const shape = new RedGPU.Display.Sprite2D(redGPUContext, material_shape);
		shape.setSize(200, 200);
		shape.x = view.screenRectObject.width / 2;
		shape.y = view.screenRectObject.height / 2;
		scene.addChild(shape);

		redGPUContext.onResize = () => {
			const {width, height} = redGPUContext.screenRectObject;
			base.x = width / 2;
			base.y = 200;
			shape.x = width / 2;
			shape.y = 200;

			base_origin.x = width / 2 - 210;
			shape_origin.x = width / 2 + 210;
			base_origin.y = 200;
			shape_origin.y = 200;

			{
				const spacingX = 150;
				const spacingY = 156;
				const numColumns = Math.floor(width / spacingX);
				const numRows = Math.ceil(bottomGroup.children.length / numColumns);

				bottomGroup.setPosition(Math.floor(width / 2), height - 200, 0);

				bottomGroup.children.forEach((item, index) => {
					const t0 = item;

					const row = Math.floor(index / numColumns);
					const col = index % numColumns;

					const itemsInRow = Math.min(bottomGroup.children.length - row * numColumns, numColumns);

					const startX = -((itemsInRow - 1) * spacingX) / 2;

					const startY = ((numRows - 1) * spacingY) / 2 - 50;

					t0.x = Math.floor(startX + col * spacingX);
					t0.y = Math.floor(startY - row * spacingY);
					t0.z = 0;
				});
			}
		};
		redGPUContext.onResize();

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// base.rotation += 1;
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, base, shape);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function createResults(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape) {

	const rootGroup = new RedGPU.Display.Group3D();
	scene.addChild(rootGroup);
	Object.entries(RedGPU.Material.BLEND_MODE).map(([key, value]) => {
		const subGroup = new RedGPU.Display.Group3D();
		rootGroup.addChild(subGroup);
		const material_base_origin = new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			texture_blendTest_base
		);
		const material_shape_origin = new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			texture_blendTest_shape
		);
		const base_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_base_origin);
		base_origin.setSize(128, 128);
		subGroup.addChild(base_origin);

		const shape_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_shape_origin);
		shape_origin.setSize(128, 128);
		shape_origin.blendMode = value;
		subGroup.addChild(shape_origin);

		const title = new RedGPU.Display.TextField2D(redGPUContext);
		title.text = key;
		title.fontSize = 12;
		title.setPosition(0, 78);
		base_origin.addChild(title);

	});
	return rootGroup;

}

function createSourceView(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape) {
	const material_base_origin = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		texture_blendTest_base
	);
	const material_shape_origin = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		texture_blendTest_shape
	);
	const base_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_base_origin);
	base_origin.primitiveState.cullMode = 'none';
	base_origin.setSize(128, 128);
	scene.addChild(base_origin);

	const shape_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_shape_origin);
	shape_origin.setSize(128, 128);
	shape_origin.primitiveState.cullMode = 'none';
	scene.addChild(shape_origin);

	const baseTitle = new RedGPU.Display.TextField2D(redGPUContext);
	baseTitle.text = 'Base Origin';
	baseTitle.fontFamily = 'SUIT Variable';
	baseTitle.fontSize = 12;
	baseTitle.setPosition(0, 78);
	base_origin.addChild(baseTitle);

	const shapeTitle = new RedGPU.Display.TextField2D(redGPUContext);
	shapeTitle.text = 'Shape Origin';
	shapeTitle.fontSize = 12;
	shapeTitle.fontFamily = 'SUIT Variable';
	shapeTitle.setPosition(0, 78);
	shape_origin.addChild(shapeTitle);
	return {
		base_origin,
		shape_origin,
	};
}

const renderTestPane = async (redGPUContext, base, shape) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717');
	const {
		setRedGPUTest_pane,
		setDebugButtons
	} = await import("../../../exampleHelper/createExample/panes/index.js?t=1768301050717");
	setDebugButtons(RedGPU, redGPUContext);
	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, false);
	const tintSettings = {
		blendMode: RedGPU.Material.BLEND_MODE[shape.blendMode],
	};
	console.log('shape', shape, shape.blendMode);
	const setBlendModeTest = () => {
		const folder = pane.addFolder({title: '2D Object BlendMode'});

		folder.addBinding(tintSettings, 'blendMode', {
			label: 'Blend Mode',
			options: RedGPU.Material.BLEND_MODE,
		}).on('change', (ev) => {
			const selectedKey = Object.keys(RedGPU.Material.BLEND_MODE).find(
				(key) => RedGPU.Material.BLEND_MODE[key] === ev.value
			);
			console.log(`Selected Blend Mode: ${selectedKey}`);

			shape.blendMode = ev.value;
		});
	};
	setBlendModeTest();
};
