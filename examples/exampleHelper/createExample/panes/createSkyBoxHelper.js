const createSkyBoxHelper = (pane, view) => {
    const skybox = pane.addFolder({title: 'SkyBox', expanded: true});
    const settings = {
        blur: 0,
        opacity: 1,
        intensity: 1.0,
    };
    skybox.addBinding(settings, 'blur', {
        min: 0,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.blur = ev.value;
    })
    skybox.addBinding(settings, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.opacity = ev.value;
    })
    skybox.addBinding(settings, 'intensity', {
        min: 0,
        max: 10,
        step: 0.01,
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.intensity = ev.value;
    })
    // skybox.addBinding(view.toneMappingManager, 'exposure', {
    // 	min: 0,
    // 	max: 5,
    // 	step: 0.01
    // })
    // skybox.addBinding(view.toneMappingManager, 'contrast', {
    // 	min: 0,
    // 	max: 2,
    // 	step: 0.01
    // })
    // skybox.addBinding(view.toneMappingManager, 'brightness', {
    // 	min: -1,
    // 	max: 1,
    // 	step: 0.01
    // })

};

export default createSkyBoxHelper;
