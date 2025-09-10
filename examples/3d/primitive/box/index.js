import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0;
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		createPrimitive(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			// 매 프레임 로직
		});

		renderTestPane(redGPUContext);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createPrimitive = (redGPUContext, scene) => {
	const boxMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
		),
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
	};

	const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 2, 2, 2);

	const boxes = [
		{material: boxMaterials.solid, position: [0, 0, 0]},
		{material: boxMaterials.wireframe, position: [-2, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
		{material: boxMaterials.point, position: [2, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	boxes.forEach(({material, position, topology}) => {
		const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, material);

		if (topology) {
			box.primitiveState.topology = topology;
		}

		box.setPosition(...position);
		scene.addChild(box);

		const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
		topologyName.setPosition(position[0], 1.25, position[2]);
		topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
		topologyName.color = '#ffffff';
		topologyName.useBillboard = true;
		topologyName.useBillboardPerspective = true;
		scene.addChild(topologyName);
	});

	const titleText = new RedGPU.Display.TextField3D(redGPUContext);
	titleText.setPosition(0, -1.5, 0);
	titleText.text = 'Customizable Box Primitive';
	titleText.color = '#ffffff';
	titleText.fontSize = 36;
	titleText.fontWeight = 500;
	titleText.useBillboard = true;
	titleText.useBillboardPerspective = true;
	scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(redGPUContext)
	const pane = new Pane();

	const config = {
		width: 1,
		height: 1,
		depth: 1,
		segmentX: 2,
		segmentY: 2,
		segmentZ: 2,
	};

	const updateBoxGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children;
		const newGeometry = new RedGPU.Primitive.Box(
			redGPUContext,
			config.width,
			config.height,
			config.depth,
			config.segmentX,
			config.segmentY,
			config.segmentZ
		);

		meshList.forEach((mesh) => {
			if (!(mesh instanceof RedGPU.Display.TextField3D)) {
				mesh.geometry = newGeometry;
			}
		});
	};

	const addBinding = (folder, property, params) => {
		folder.addBinding(config, property, params).on('change', (v) => {
			config[property] = v.value;
			updateBoxGeometry();
		});
	};

	const boxFolder = pane.addFolder({title: 'Box Dimensions', expanded: true});
	addBinding(boxFolder, 'width', {min: 0.1, max: 5, step: 0.1});
	addBinding(boxFolder, 'height', {min: 0.1, max: 5, step: 0.1});
	addBinding(boxFolder, 'depth', {min: 0.1, max: 5, step: 0.1});
	addBinding(boxFolder, 'segmentX', {min: 1, max: 15, step: 1});
	addBinding(boxFolder, 'segmentY', {min: 1, max: 15, step: 1});
	addBinding(boxFolder, 'segmentZ', {min: 1, max: 15, step: 1});
};
