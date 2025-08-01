import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 7.5;
		controller.speedDistance = 0.1;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		createSampleTextField3D(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, scene);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSampleTextField3D = async (redGPUContext, scene) => {
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
		const total = array.length;
		const radius = 3;

		const angle = (index / total) * Math.PI * 2;
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;

		const textField = new RedGPU.Display.TextField3D(redGPUContext);
		textField.x = x;
		textField.y = y;
		textField.useBillboard = true;
		textField.useBillboardPerspective = false;
		textField.text = `Hello ${eventName} Event!`;
		textField.background = 'blue';
		textField.color = 'white';
		textField.fontSize = 16;
		textField.padding = 10;
		textField.borderRadius = 10;
		textField.primitiveState.cullMode = 'none';

		scene.addChild(textField);
		textField.addListener(eventName, (e) => {
			console.log(`Event: ${eventName}`, e);
			e.target.background = getRandomHexValue();
		});
	});
};

function getRandomHexValue() {
	var result = '';
	var characters = '0123456789ABCDEF';
	for (var i = 0; i < 6; i++) {
		result += characters[Math.floor(Math.random() * 16)];
	}
	return `#${result}`;
}

const renderTestPane = async (redGPUContext, scene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();
	const TextField3DFolder = pane.addFolder({title: 'TextField3D', expanded: true});
	const controls = {
		useBillboardPerspective: scene.children[0].useBillboardPerspective,
		useBillboard: scene.children[0].useBillboard,
	};

	TextField3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboardPerspective = evt.value;
		});
	});

	TextField3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboard = evt.value;
		});
	});
};
