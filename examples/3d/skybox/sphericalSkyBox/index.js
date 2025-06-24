import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0
		controller.pan = 85

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);

		view.skybox = createSphericalSkyBox(redGPUContext);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSphericalSkyBox = (redGPUContext) => {
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg",
		"../../../assets/skybox/nx.jpg",
		"../../../assets/skybox/py.jpg",
		"../../../assets/skybox/ny.jpg",
		"../../../assets/skybox/pz.jpg",
		"../../../assets/skybox/nz.jpg",
	];
	const texture = new RedGPU.Resource.CubeTexture(
		redGPUContext,
		skyboxImagePaths
	);

	const hdrTexture = new RedGPU.Resource.HDRTexture(
		redGPUContext,
		'../../../assets/skybox/sphericalSkyBox.hdr'
	);
	console.log('hdrTexture',hdrTexture)
	createDebug("../../../assets/skybox/sphericalSkyBox.jpg")

	const skyBox = new RedGPU.Display.SkyBox(redGPUContext, texture);
	return skyBox;
};

const createDebug = (skyboxImagePath) => {
	const previewContainer = document.createElement("div");
	previewContainer.style.position = "absolute";
	previewContainer.style.left = "10px";
	previewContainer.style.top = "100px";
	previewContainer.style.zIndex = "1000";
	previewContainer.style.display = "flex";
	previewContainer.style.flexDirection = "column";
	previewContainer.style.backgroundColor = "rgba(0, 0, 0, 0.16)";
	previewContainer.style.padding = "4px";
	previewContainer.style.borderRadius = "8px";
	document.body.appendChild(previewContainer);

	const img = document.createElement("img");
	img.src = skyboxImagePath;
	img.alt = skyboxImagePath;
	img.style.maxHeight = "100px";
	img.style.borderRadius = "8px";
	previewContainer.appendChild(img);
}
