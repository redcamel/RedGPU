import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const hdrImages = [
	{name: '2K - the sky is on fire', path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'},
	{name: '2K - furstenstein', path: '../../../assets/hdr/2k/furstenstein_2k.hdr'},
	{name: '4K - the sky is on fire', path: '../../../assets/hdr/4k/the_sky_is_on_fire_4k.hdr'},
	{name: '4K - furstenstein', path: '../../../assets/hdr/4k/furstenstein_4k.hdr'},
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
		const herTexture = new RedGPU.Resource.HDRTexture(view.redGPUContext, hdrImages[0].path,()=>{
			renderTestPane(view);
		});
		view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, herTexture);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});


	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSkybox = (view, src) => {
	const herTexture = new RedGPU.Resource.HDRTexture(view.redGPUContext, src);
	view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, herTexture);
};
const renderTestPane = async (view) => {
	const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js" );
	const pane = new Pane();
	const {createFieldOfView} = await import( "../../../exampleHelper/createExample/panes/index.js" );
	createFieldOfView(pane, view.camera);

	let currentTexture = view.skybox._material.skyboxTexture;
	let exposureBinding = null;

	const settings = {
		hdrImage: hdrImages[0].path,
		exposure: view.skybox._material.skyboxTexture.exposure
	};

	// HDR 이미지 선택
	pane.addBinding(settings, 'hdrImage', {
		options: hdrImages.reduce((acc, item) => {
			acc[item.name] = item.path;
			return acc;
		}, {})
	}).on("change", (ev) => {
		const hdrTexture = new RedGPU.Resource.HDRTexture(view.redGPUContext, ev.value, (loadedTexture) => {
			currentTexture = loadedTexture;
			/* HDR 이미지별 권장 노출값으로 자동 설정 */
			settings.exposure = loadedTexture.recommendedExposure || 1.0;
			/* UI 갱신 */
			if (exposureBinding) {
				exposureBinding.max = settings.exposure * 2
				exposureBinding.refresh();
			}
		});
		view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, hdrTexture);
	});

	// Exposure 슬라이더
	exposureBinding = pane.addBinding(settings, 'exposure', {
		min: 0.01,
		max: settings.exposure * 2,
		step: 0.01
	}).on("change", (ev) => {
		if (currentTexture) {
			currentTexture.exposure = ev.value;
		}
	});
}
