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

	const hdrTexture = new RedGPU.Resource.HDRTexture(
		redGPUContext,
		// '../../../assets/hdr/sphericalSkyBox.hdr'
		// '../../../assets/hdr/Cannon_Exterior.hdr'
		// '../../../assets/hdr/field.hdr'
		// '../../../assets/hdr/neutral.37290948.hdr'
		'../../../assets/hdr/pisa.hdr'
		,
		true,
		() => {
			const ibl = new RedGPU.Resource.IBL(redGPUContext, hdrTexture.gpuCubeTexture);
			const material = new RedGPU.Material.BitmapMaterial(redGPUContext, hdrTexture); // Red material / 빨간색 재질
			const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1); // Box geometry / 박스 형태 지오메트리
			const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			view.scene.addChild(childMesh);
			view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture)
			view.ibl = ibl
			renderTestPane(redGPUContext, view, ibl,view.skybox);
			loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF/Corset.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF/SheenChair.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionRoughnessTest/glTF/TransmissionRoughnessTest.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CommercialRefrigerator/glTF/CommercialRefrigerator.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF/TransmissionTest.gltf',);
			loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonAttenuation/glTF/DragonAttenuation.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareTransmission/glTF/CompareTransmission.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF/MosquitoInAmber.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF/ClearcoatWicker.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearCoatTest/glTF/ClearCoatTest.gltf',);
		}
	);
	console.log('hdrTexture', hdrTexture)

};

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
			mesh.y = -1
			if (url.includes('Corset')) mesh.setScale(50)
			if (url.includes('ClearcoatWicker')) mesh.setScale(3)
			if (url.includes('TransmissionTest')) mesh.setScale(5)
			if (url.includes('MosquitoInAmber')) mesh.setScale(10)
			if (url.includes('SheenChair')) mesh.setScale(10)
			if (url.includes('CommercialRefrigerator')) mesh.setScale(10)
		}
	)
}

const renderTestPane = async (redGPUContext, view, ibl,skybox) => {

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
	const testData = {
		useIbl: true,
		useSkyBox:true
	}
	pane.addBinding(testData, 'useSkyBox').on("change", (ev) => {
		if (ev.value) view.skybox = skybox
		else view.skybox = null
	});
	pane.addBinding(testData, 'useIbl').on("change", (ev) => {
		if (ev.value) view.ibl = ibl
		else view.ibl = null
	});
};
