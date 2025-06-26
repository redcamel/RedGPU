import * as RedGPU from "../../../../dist";

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
		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		directionalLightTest.color.r = 255
		directionalLightTest.color.g = 0
		directionalLightTest.color.b = 0
		directionalLightTest.intensity = 1

		scene.lightManager.addDirectionalLight(directionalLightTest)
		redGPUContext.addView(view);

		createSphericalSkyBox(view);

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

const createSphericalSkyBox = async (view) => {
	const {redGPUContext} = view;
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg", // Positive X
		"../../../assets/skybox/nx.jpg", // Negative X
		"../../../assets/skybox/py.jpg", // Positive Y
		"../../../assets/skybox/ny.jpg", // Negative Y
		"../../../assets/skybox/pz.jpg", // Positive Z
		"../../../assets/skybox/nz.jpg", // Negative Z
	];

	const cubeTexture = new RedGPU.Resource.CubeTexture(
		redGPUContext,
		skyboxImagePaths
	);
	// const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/ibl001.hdr');
	const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/4k/furstenstein.hdr');

	view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture)
	// view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
	view.ibl = ibl
	renderTestPane(redGPUContext, view, ibl, view.skybox);
	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf',);

	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF/TransmissionTest.gltf',);
	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF/GlassHurricaneCandleHolder.gltf',);

	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF/MosquitoInAmber.gltf',);
	loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF/ClearcoatWicker.gltf',);

};

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])

			if (url.includes('Corset')) mesh.setScale(50)
			if (url.includes('ClearcoatWicker')) mesh.setScale(3), mesh.x = -6, mesh.y = -1.5
			if (url.includes('TransmissionTest')) mesh.setScale(5)
			if (url.includes('MosquitoInAmber')) mesh.setScale(20), mesh.x = 7
			if (url.includes('SheenChair')) mesh.setScale(10)
			if (url.includes('CommercialRefrigerator')) mesh.setScale(10)
			if (url.includes('GlassHurricaneCandleHolder')) mesh.setScale(10), mesh.x = 4, mesh.y = -1.5, mesh.z = 0.5
		}
	)
}

const renderTestPane = async (redGPUContext, view, ibl, skybox) => {

	const {Pane} = await import(
		"https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js"
		);

	const pane = new Pane();
	const {camera} = view.camera
	console.log('camera', camera)
	pane.addBinding(camera, 'fieldOfView', {
		min: 12,
		max: 100,
		step: 0.1
	}).on("change", (ev) => {

	});

	const hdrImages = [
		{name: 'furstenstein', path: '../../../assets/hdr/4k/furstenstein.hdr'},
		{name: 'the sky is on fire', path: '../../../assets/hdr/4k/the_sky_is_on_fire_4k.hdr'},
		{name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr'},
		{name: 'field', path: '../../../assets/hdr/field.hdr'},
		{name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr'},
		{name: 'pisa', path: '../../../assets/hdr/pisa.hdr'},
	];

	const settings = {
		useSkyBox: true,
		hdrImage: hdrImages[0].path
	};

	pane.addBinding(settings, 'useSkyBox').on("change", (ev) => {
		view.skybox = ev.value ? skybox : null;
	});

	pane.addBinding(settings, 'hdrImage', {
		options: hdrImages.reduce((acc, item) => {
			acc[item.name] = item.path;
			return acc;
		}, {})
	}).on("change", (ev) => {
		const newIbl = new RedGPU.Resource.IBL(redGPUContext, ev.value);
		view.ibl = newIbl;
		if (settings.useSkyBox) {
			const newSkybox = new RedGPU.Display.SkyBox(redGPUContext, newIbl.environmentTexture);
			view.skybox = newSkybox;
		}
	});
}
