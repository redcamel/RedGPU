import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.tilt = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);
		view.skybox = createSkybox(redGPUContext);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});

		renderTestPane(view);
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSkybox = (redGPUContext) => {
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg",
		"../../../assets/skybox/nx.jpg",
		"../../../assets/skybox/py.jpg",
		"../../../assets/skybox/ny.jpg",
		"../../../assets/skybox/pz.jpg",
		"../../../assets/skybox/nz.jpg",
	];

	createImagePreview(skyboxImagePaths);

	const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
	return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

const renderTestPane = async (view) => {
	const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717" );
	const pane = new Pane();
	const {
		createFieldOfView,
		setDebugButtons
	} = await import( "../../../exampleHelper/createExample/panes/index.js?t=1768301050717" );
	setDebugButtons(RedGPU,view.redGPUContext);
	createFieldOfView(pane, view.camera)
	const TEST_DATA = {
		blur: 0,
		opacity: 1,
	}
	pane.addBinding(TEST_DATA, 'blur', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.blur = ev.value;
	})
	pane.addBinding(TEST_DATA, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.opacity = ev.value;
	})
};

const createImagePreview = (imagePaths) => {
	const container = document.createElement("div");

	Object.assign(container.style, {
		position: "absolute",
		left: "10px",
		top: "100px",
		zIndex: "1000",
		display: "flex",
		flexDirection: "column",
		backgroundColor: "rgba(0, 0, 0, 0.16)",
		gap: "8px",
		padding: "4px",
		borderRadius: "8px"
	});

	document.body.appendChild(container);

	imagePaths.forEach((path) => {
		const img = document.createElement("img");
		img.src = path;
		img.alt = path;

		Object.assign(img.style, {
			maxWidth: "100px",
			maxHeight: "100px",
			borderRadius: "8px"
		});

		container.appendChild(img);
	});
};
