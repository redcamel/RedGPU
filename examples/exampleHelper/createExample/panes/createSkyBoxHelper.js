const createSkyBoxHelper = (pane, view) => {
     const skybox = pane.addFolder({title: 'SkyBox', expanded: true});
	const settings = {
		blur: 0,
		opacity: 1,
	};
	skybox.addBinding(settings, 'blur', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.blur = ev.value;
	})
	skybox.addBinding(settings, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.opacity = ev.value;
	})
};

export default createSkyBoxHelper;
