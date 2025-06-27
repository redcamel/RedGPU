import * as RedGPU from "../../../../dist";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const hdrImages = [
	{name: 'the sky is on fire', path: '../../../assets/hdr/4k/the_sky_is_on_fire_4k.hdr'},
	{name: 'furstenstein', path: '../../../assets/hdr/4k/furstenstein.hdr'},
	{name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr'},
	{name: 'field', path: '../../../assets/hdr/field.hdr'},
	{name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr'},
	{name: 'pisa', path: '../../../assets/hdr/pisa.hdr'},
];

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);
		createIBL(view, hdrImages[0].path);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});

		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf');
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF/TransmissionTest.gltf');
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF/GlassHurricaneCandleHolder.gltf');
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF/MosquitoInAmber.gltf');
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF/ClearcoatWicker.gltf');
		loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF/Corset.gltf');

		renderTestPane(view);
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createIBL = (view, src) => {
	const ibl = new RedGPU.Resource.IBL(view.redGPUContext, src);
	const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
	view.ibl = ibl;
	view.skybox = newSkybox;
};

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view;

	let mesh;
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh']);

			// 모델별 스케일 및 위치 설정
			if (url.includes('Corset')) {
				mesh.setScale(40);
				mesh.z = 2;
				mesh.y = -2;
			}
			if (url.includes('ClearcoatWicker')) {
				mesh.setScale(3);
				mesh.x = -6;
				mesh.y = -1.5;
			}
			if (url.includes('TransmissionTest')) {
				mesh.setScale(5);
			}
			if (url.includes('MosquitoInAmber')) {
				mesh.setScale(20);
				mesh.x = 7;
			}
			if (url.includes('SheenChair')) {
				mesh.setScale(10);
			}
			if (url.includes('CommercialRefrigerator')) {
				mesh.setScale(10);
			}
			if (url.includes('GlassHurricaneCandleHolder')) {
				mesh.setScale(10);
				mesh.x = 4;
				mesh.y = -1.5;
				mesh.z = 0.5;
			}
			if (url.includes('DragonAttenuation')) {
				mesh.z = 2;
			}
			if (url.includes('SpecularTest')) {
				mesh.setScale(10);
				mesh.z = 2;
			}
		}
	);
}

const renderTestPane = async (view) => {
	const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js" );
	const pane = new Pane();
	const {createFieldOfView} = await import( "../../../exampleHelper/createExample/panes/index.js" );
	createFieldOfView(pane, view.camera)

	const settings = {
		hdrImage: hdrImages[0].path
	};

	pane.addBinding(settings, 'hdrImage', {
		options: hdrImages.reduce((acc, item) => {
			acc[item.name] = item.path;
			return acc;
		}, {})
	}).on("change", (ev) => {
		createIBL(view, ev.value);
	});
};
