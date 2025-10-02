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
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.tilt = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// 초기 HDR 텍스처 생성
		const initialTexture = new RedGPU.Resource.HDRTexture(
			redGPUContext,
			hdrImages[0].path,
			() => createTestPane(view)
		);
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, initialTexture);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		document.body.innerHTML = `<div>Error: ${failReason}</div>`;
	}
);

const createTestPane = async (view) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const {createFieldOfView, setDebugButtons} = await import( "../../../exampleHelper/createExample/panes/index.js" );
	setDebugButtons(view.redGPUContext);
	const pane = new Pane();
	createFieldOfView(pane, view.camera);

	const settings = {
		hdrImage: hdrImages[0].path,
		exposure: view.skybox.exposure,
		blur: 0,
		opacity: 1,
	};

	// HDR 이미지 선택 옵션 생성
	const hdrOptions = hdrImages.reduce((acc, item) => {
		acc[item.name] = item.path;
		return acc;
	}, {});

	// HDR 이미지 선택
	pane.addBinding(settings, 'hdrImage', {
		options: hdrOptions
	}).on("change", (ev) => {
		const newTexture = new RedGPU.Resource.HDRTexture(
			view.redGPUContext,
			ev.value,
			(loadedTexture) => {
				// 권장 노출값으로 자동 설정
				settings.exposure = loadedTexture.recommendedExposure || 1.0;
				exposureBinding.max = settings.exposure * 2;
				exposureBinding.refresh();
			}
		);
		view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, newTexture);
	});
	pane.addBinding(settings, 'blur', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.blur = ev.value;
	})
	pane.addBinding(settings, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.opacity = ev.value;
	})
	// Exposure 슬라이더
	const exposureBinding = pane.addBinding(settings, 'exposure', {
		min: 0.01,
		max: settings.exposure * 2,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.exposure = ev.value;
		view.skybox.blur = settings.blur
		view.skybox.opacity = settings.opacity
	});
};
