import {hdrImages} from './index.js';

const createIblHelper = (pane, view, RedGPU,option={}) => {
	const folder = pane.addFolder({title: 'Lighting', expanded: true});

	const settings = {
		hdrImage: hdrImages[0].path,
		useLight: true,
		useIBL: true,
		...option
	};

	const createIBL = (view, src) => {
		const pathSegments = window.location.pathname.split('/');
		const examplesIndex = pathSegments.indexOf('examples');
		const currentDepth = pathSegments.length - examplesIndex - 2; // examples 이후의 깊이
		const relativePath = '../'.repeat(currentDepth) + src;
		const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath);
		const skybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
		view.ibl = ibl;
		view.skybox = skybox;
	};

	const handleLightToggle = (enabled) => {
		if (enabled) {
			const directionalLight = new RedGPU.Light.DirectionalLight();
			view.scene.lightManager.addDirectionalLight(directionalLight);
		} else {
			view.scene.lightManager.removeAllDirectionalLight();
		}
	};

	const handleIBLToggle = (enabled) => {
		if (enabled) {
			createIBL(view, settings.hdrImage);
			hdrImageControl.disabled = false;
		} else {
			view.ibl = null;
			view.skybox = null;
			hdrImageControl.disabled = true;
		}
	};

	const handleHDRImageChange = (imagePath) => {
		createIBL(view, imagePath);
	};

	const hdrImageOptions = hdrImages.reduce((acc, item) => {
		acc[item.name] = item.path;
		return acc;
	}, {});

	folder.addBinding(settings, 'useLight').on('change', (ev) => {
		handleLightToggle(ev.value);
	});

	folder.addBinding(settings, 'useIBL').on('change', (ev) => {
		handleIBLToggle(ev.value);
	});

	const hdrImageControl = folder.addBinding(settings, 'hdrImage', {
		options: hdrImageOptions
	}).on('change', (ev) => {
		handleHDRImageChange(ev.value);
	});
	if(settings.useIBL) createIBL(view, hdrImages[0].path);
	if(settings.useLight) handleLightToggle(settings.useLight);

};

export default createIblHelper;
