import {hdrImages} from  './index.js';


const createIblHelper = (pane,view,RedGPU) => {
console.log(hdrImages)
	const folder = pane.addFolder({title:'lighting', expends:true})
	const settings = {
		hdrImage: hdrImages[0].path,
		useLight: false,
		useIBL: true,
	};

	const createIBL = (view, src) => {
		const ibl = new RedGPU.Resource.IBL(view.redGPUContext, src);
		const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
		view.ibl = ibl;
		view.skybox = newSkybox;
	};
	folder.addBinding(settings, 'useLight').on("change", (ev) => {
		if (ev.value) {
			const directionalLightTest = new RedGPU.Light.DirectionalLight()
			view.scene.lightManager.addDirectionalLight(directionalLightTest)
		} else {
			view.scene.lightManager.removeAllDirectionalLight()
		}
	})
	folder.addBinding(settings, 'useIBL').on("change", (ev) => {
		if (ev.value) {
			createIBL(view, settings.hdrImage);
			controllimages.disabled = false;
		} else {
			view.ibl = null
			controllimages.disabled = true
		}
	})
	const controllimages = folder.addBinding(settings, 'hdrImage', {
		options: hdrImages.reduce((acc, item) => {
			acc[item.name] = item.path;
			return acc;
		}, {})
	}).on("change", (ev) => {
		createIBL(view, ev.value);
	});
	createIBL(view,hdrImages[0].path)
}

export default createIblHelper
