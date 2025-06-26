import * as RedGPU from "../../../../dist";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0;
		controller.pan = 85;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);


		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/4k/furstenstein.hdr');
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);



		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});
		setupDebugPanel(redGPUContext, view, ibl, view.skybox);
	},
	(failReason) => {
		console.error("초기화 실패:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);



const setupDebugPanel = async (redGPUContext, view, ibl, skybox) => {
	const { Pane } = await import(
		"https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js"
		);

	const pane = new Pane();

	const { camera } = view.camera;
	pane.addBinding(camera, 'fieldOfView', {
		min: 12,
		max: 100,
		step: 0.1
	});

	const hdrImages = [
		{ name: 'furstenstein', path: '../../../assets/hdr/4k/furstenstein.hdr' },
		{ name: 'the sky is on fire', path: '../../../assets/hdr/4k/the_sky_is_on_fire_4k.hdr' },
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
		if (settings.useSkyBox) {
			const newIbl = new RedGPU.Resource.IBL(redGPUContext, ev.value);
			const newSkybox = new RedGPU.Display.SkyBox(redGPUContext, newIbl.environmentTexture);
			view.skybox = newSkybox;
		}
	});
};
