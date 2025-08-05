import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.speedDistance = 0.3;
		controller.distance = 20;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		view.axis = true;
		redGPUContext.addView(view);

		const parentMesh = createParentMesh(redGPUContext, scene);
		const childMesh = createChildMesh(redGPUContext, parentMesh);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 로직
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, parentMesh, childMesh);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createParentMesh = (redGPUContext, scene) => {
	const material = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
	);
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
	const parentMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	parentMesh.setPosition(0, 0, 0);
	scene.addChild(parentMesh);

	return parentMesh;
};

const createChildMesh = (redGPUContext, parentMesh) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
	const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	childMesh.setPosition(3, 3, 0);
	parentMesh.addChild(childMesh);

	return childMesh;
};

const renderTestPane = async (redGPUContext, parentMesh, childMesh) => {

	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setDebugViewButton} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugViewButton(redGPUContext)
	const pane = new Pane();

	const parentConfig = {
		x: parentMesh.x,
		y: parentMesh.y,
		z: parentMesh.z,
		rotationX: parentMesh.rotationX,
		rotationY: parentMesh.rotationY,
		rotationZ: parentMesh.rotationZ,
		scaleX: parentMesh.scaleX,
		scaleY: parentMesh.scaleY,
		scaleZ: parentMesh.scaleZ,
	};

	const childConfig = {
		x: childMesh.x,
		y: childMesh.y,
		z: childMesh.z,
		rotationX: childMesh.rotationX,
		rotationY: childMesh.rotationY,
		rotationZ: childMesh.rotationZ,
		scaleX: childMesh.scaleX,
		scaleY: childMesh.scaleY,
		scaleZ: childMesh.scaleZ,
	};

	const createMeshControls = (folder, config, mesh) => {
		folder.addBinding(config, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
			mesh.setPosition(evt.value, config.y, config.z);
		});
		folder.addBinding(config, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
			mesh.setPosition(config.x, evt.value, config.z);
		});
		folder.addBinding(config, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
			mesh.setPosition(config.x, config.y, evt.value);
		});
		folder.addBinding(config, 'rotationX', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
			mesh.setRotation(evt.value, config.rotationY, config.rotationZ);
		});
		folder.addBinding(config, 'rotationY', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
			mesh.setRotation(config.rotationX, evt.value, config.rotationZ);
		});
		folder.addBinding(config, 'rotationZ', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
			mesh.setRotation(config.rotationX, config.rotationY, evt.value);
		});
		folder.addBinding(config, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
			mesh.setScale(evt.value, config.scaleY, config.scaleZ);
		});
		folder.addBinding(config, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
			mesh.setScale(config.scaleX, evt.value, config.scaleZ);
		});
		folder.addBinding(config, 'scaleZ', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
			mesh.setScale(config.scaleX, config.scaleY, evt.value);
		});
	};

	const parentFolder = pane.addFolder({title: 'Parent Mesh', expanded: true});
	createMeshControls(parentFolder, parentConfig, parentMesh);

	const childFolder = pane.addFolder({title: 'Child Mesh', expanded: true});
	createMeshControls(childFolder, childConfig, childMesh);
};
