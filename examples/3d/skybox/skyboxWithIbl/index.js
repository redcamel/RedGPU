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
	const newIbl = new RedGPU.Resource.IBL(view.redGPUContext, src);
	const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, newIbl.environmentTexture);

	view.skybox = newSkybox;
};

const renderTestPane = async (view) => {
	const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js" );
	const pane = new Pane();
	const {createFieldOfView} = await import( "../../../exampleHelper/createExample/panes/index.js" );
	createFieldOfView(pane, view.camera)

	const settings = {
		hdrImage: hdrImages[0].path,
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
