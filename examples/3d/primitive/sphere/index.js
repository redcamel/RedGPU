import * as RedGPU from "../../../../dist/index.js?t=1767864574385";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.tilt = 0;
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		createSpherePrimitive(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
			// 매 프레임 로직
		});

		renderTestPane(redGPUContext);
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSpherePrimitive = (redGPUContext, scene) => {
	const sphereMaterials = {
		solid: new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
		),
		wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
		point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
	};

	const gap = 3;
	const sphereProperties = [
		{material: sphereMaterials.solid, position: [0, 0, 0]},
		{
			material: sphereMaterials.wireframe,
			position: [-gap, 0, 0],
			topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
		},
		{material: sphereMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
	];

	const defaultOptions = {
		radius: 1,
		widthSegments: 16,
		heightSegments: 16,
		phiStart: 0,
		phiLength: Math.PI * 2,
		thetaStart: 0,
		thetaLength: Math.PI,
		uvSize: 1,
	};

	sphereProperties.forEach(({material, position, topology}) => {
		const sphere = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Sphere(
				redGPUContext,
				defaultOptions.radius,
				defaultOptions.widthSegments,
				defaultOptions.heightSegments,
				defaultOptions.phiStart,
				defaultOptions.phiLength,
				defaultOptions.thetaStart,
				defaultOptions.thetaLength,
				defaultOptions.uvSize
			),
			material
		);

		if (topology) {
			sphere.primitiveState.topology = topology;
		}

		sphere.setPosition(...position);
		scene.addChild(sphere);

		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.setPosition(position[0], 2, position[2]);
		label.text = topology || 'Solid';
		label.color = '#ffffff';
		label.fontSize = 26;
		label.useBillboard = true;
		label.useBillboardPerspective = true;
		scene.addChild(label);
	});

	const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
	descriptionLabel.text = 'Customizable Sphere Primitive';
	descriptionLabel.color = '#ffffff';
	descriptionLabel.fontSize = 36;
	descriptionLabel.setPosition(0, -2.5, 0);
	descriptionLabel.useBillboard = true;
	descriptionLabel.useBillboardPerspective = true;
	scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767864574385");
	const pane = new Pane();
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767864574385");
	setDebugButtons(redGPUContext)
	const config = {
		radius: 1,
		widthSegments: 16,
		heightSegments: 16,
		phiStart: 0,
		phiLength: Math.PI * 2,
		thetaStart: 0,
		thetaLength: Math.PI,
		uvSize: 1,
	};

	const updateSphereGeometry = () => {
		const meshList = redGPUContext.viewList[0].scene.children.filter(child => !(child instanceof RedGPU.Display.TextField3D));

		const newGeometry = new RedGPU.Primitive.Sphere(
			redGPUContext,
			config.radius,
			config.widthSegments,
			config.heightSegments,
			config.phiStart,
			config.phiLength,
			config.thetaStart,
			config.thetaLength,
			config.uvSize
		);

		meshList.forEach(mesh => mesh.geometry = newGeometry);
	};

	const addBinding = (folder, property, params) => {
		folder.addBinding(config, property, params).on('change', (v) => {
			config[property] = v.value;
			updateSphereGeometry();
		});
	};

	const sphereFolder = pane.addFolder({title: 'Sphere Properties', expanded: true});
	addBinding(sphereFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
	addBinding(sphereFolder, 'widthSegments', {min: 3, max: 64, step: 1});
	addBinding(sphereFolder, 'heightSegments', {min: 3, max: 64, step: 1});
	addBinding(sphereFolder, 'phiStart', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(sphereFolder, 'phiLength', {min: 0, max: Math.PI * 2, step: 0.1});
	addBinding(sphereFolder, 'thetaStart', {min: 0, max: Math.PI, step: 0.1});
	addBinding(sphereFolder, 'thetaLength', {min: 0, max: Math.PI, step: 0.1});
	addBinding(sphereFolder, 'uvSize', {min: 0.1, max: 5, step: 0.1});
};
