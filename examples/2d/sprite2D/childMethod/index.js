import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.Camera2D();
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		createInitialObjects(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			const radius = 250;
			const numChildren = view.scene.children.length;

			const centerX = view.screenRectObject.width / 2;
			const centerY = view.screenRectObject.height / 2;

			view.scene.children.forEach((sprite2D, index) => {
				const angle = (index / numChildren) * Math.PI * 2;
				const endX = centerX + Math.cos(angle) * radius;
				const endY = centerY + Math.sin(angle) * radius;

				sprite2D.setPosition(
					sprite2D.x + (endX - sprite2D.x) * 0.3,
					sprite2D.y + (endY - sprite2D.y) * 0.3
				);

				if (sprite2D.getChildAt(0).text !== `Child ${index}`) {
					sprite2D.getChildAt(0).text = `Child ${index}`;
				}
			});
		};
		renderer.start(redGPUContext, render);

		createPaneUI(redGPUContext, scene);
	}
);

const createInitialObjects = (redGPUContext, scene) => {
	for (let i = 0; i < 6; i++) {
		addChildObject(redGPUContext, scene, '#ffffff');
	}
};

const createPaneUI = async (redGPUContext, scene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717');
	const pane = new Pane();
	const {
		setDebugButtons,
		setRedGPUTest_pane
	} = await import("../../../exampleHelper/createExample/panes/index.js?t=1768301050717");
	setDebugButtons(RedGPU, redGPUContext);
	pane.addButton({title: 'Add Child'}).on('click', () => {
		addChildObject(redGPUContext, scene);
	});

	pane.addButton({title: 'Add Child at Index 2'}).on('click', () => {
		const color = '#fff';
		const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, color));
		sprite2D.width = 25;
		sprite2D.height = 25;

		const textField2D = new RedGPU.Display.TextField2D(redGPUContext);

		textField2D.fontSize = 16;
		textField2D.text = `Inserted Child`;
		textField2D.color = color;
		textField2D.x = 0;
		textField2D.y = 30;
		sprite2D.addChild(textField2D);
		scene.addChildAt(sprite2D, 2);
		console.log('Added a new child at index 2');
	});

	pane.addButton({title: 'Get Child at Index 1'}).on('click', () => {
		const child = scene.getChildAt(1);
		const color = getRandomHexColor();
		child.material.color.setColorByHEX(color);
		child.getChildAt(0).color = color;
		console.log('Child at index 1:', child ? child.text : 'No child found');
	});

	pane.addButton({title: 'Get Index of Child 0'}).on('click', () => {
		const firstChild = scene.getChildAt(0);
		if (firstChild) {
			const index = scene.getChildIndex(firstChild);
			const color = getRandomHexColor();
			scene.getChildAt(index).material.color.setColorByHEX(color);
			scene.getChildAt(index).getChildAt(0).color = color;
			console.log(`Index of first child: ${index}`);
		}
	});

	pane.addButton({title: 'Set Index of Child 0 to 4'}).on('click', () => {
		if (scene.numChildren > 4) {
			const firstChild = scene.getChildAt(0);
			if (firstChild) {
				scene.setChildIndex(firstChild, 4);
				console.log('Moved child 0 to index 4');
			}
		}
	});

	pane.addButton({title: 'Swap Children at 0 and 1'}).on('click', () => {
		scene.swapChildrenAt(0, 1);
		console.log('Swapped children at indices 0 and 1');
	});

	pane.addButton({title: 'Swap First & Last Child'}).on('click', () => {
		const numChildren = scene.numChildren;
		if (numChildren > 1) {
			const firstChild = scene.getChildAt(0);
			const lastChild = scene.getChildAt(numChildren - 1);
			if (firstChild && lastChild) {
				scene.swapChildren(firstChild, lastChild);
				console.log('Swapped first and last child');
			}
		}
	});

	pane.addButton({title: 'Remove Child at Index 1'}).on('click', () => {
		scene.removeChildAt(1);
		console.log('Removed child at index 1');
	});

	pane.addButton({title: 'Remove All Children'}).on('click', () => {
		scene.removeAllChildren();
		console.log('All children removed');
	});
};

const getRandomHexColor = () => {
	return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

const addChildObject = (redGPUContext, scene, color = getRandomHexColor()) => {
	const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, color));
	sprite2D.width = 25;
	sprite2D.height = 25;

	const textField2D = new RedGPU.Display.TextField2D(redGPUContext);

	textField2D.fontSize = 16;
	textField2D.text = `Child ${scene.numChildren}`;
	textField2D.color = color;
	textField2D.x = 0;
	textField2D.y = 30;
	sprite2D.addChild(textField2D);
	scene.addChild(sprite2D);

	console.log(`Child added with color "${textField2D.color}"! Total: ${scene.numChildren}`);
};
