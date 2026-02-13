import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 초기 카메라 위치 조정 (지평선을 바라보도록)
        controller.tilt = -10;
        controller.distance = 100;
        
        view.axis = true;
        redGPUContext.addView(view);
        
        // SkyAtmosphere 생성 및 물리적 초기값 설정
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 5; // 노을 시점
        skyAtmosphere.exposure = 1.5; 
        view.skyAtmosphere = skyAtmosphere;

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({ title: 'Sky Atmosphere Controls' });
    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    // 1. Presets
    const f_presets = pane.addFolder({ title: 'Presets' });
    const applyPreset = (el, az, exp) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        skyAtmosphere.exposure = exp;
        pane.refresh();
    };
    f_presets.addButton({ title: 'Noon (정오)' }).on('click', () => applyPreset(90, 0, 1.0));
    f_presets.addButton({ title: 'Sunset (노을)' }).on('click', () => applyPreset(2, 0, 1.5));
    f_presets.addButton({ title: 'Twilight (황혼)' }).on('click', () => applyPreset(-5, 0, 2.5));
    f_presets.addButton({ title: 'Midnight (심야)' }).on('click', () => applyPreset(-20, 0, 0.5));

    // 2. Sun & Exposure
    const f_sun = pane.addFolder({ title: 'Sun & Light' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, step: 0.1 });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, step: 0.1 });
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100 });
    f_sun.addBinding(skyAtmosphere, 'sunSize', { min: 0.01, max: 5 });
    f_sun.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10 });

    // 3. Atmosphere Physics
    const f_phys = pane.addFolder({ title: 'Atmosphere Physics', expanded: false });
    f_phys.addBinding(skyAtmosphere, 'earthRadius', { min: 100, max: 10000, label: 'Earth Radius (km)' });
    f_phys.addBinding(skyAtmosphere, 'atmosphereHeight', { min: 1, max: 200, label: 'Atmo Height (km)' });
    
    // Rayleigh
    const f_rayleigh = f_phys.addFolder({ title: 'Rayleigh' });
    const rayleighProxy = {
        get color() { return { r: skyAtmosphere.rayleighScattering[0], g: skyAtmosphere.rayleighScattering[1], b: skyAtmosphere.rayleighScattering[2] }; },
        set color(v) { skyAtmosphere.rayleighScattering = [v.r, v.g, v.b]; }
    };
    f_rayleigh.addBinding(rayleighProxy, 'color', { label: 'Scattering', color: { type: 'float' } });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighScaleHeight', { min: 0.1, max: 50 });

    // Mie
    const f_mie = f_phys.addFolder({ title: 'Mie' });
    f_mie.addBinding(skyAtmosphere, 'mieScattering', { min: 0, max: 0.1 });
    f_mie.addBinding(skyAtmosphere, 'mieExtinction', { min: 0, max: 0.1 });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', { min: 0, max: 0.999, label: 'Anisotropy (g)' });
    f_mie.addBinding(skyAtmosphere, 'mieScaleHeight', { min: 0.1, max: 20 });

    // Ozone
    const f_ozone = f_phys.addFolder({ title: 'Ozone Layer' });
    const ozoneProxy = {
        get color() { return { r: skyAtmosphere.ozoneAbsorption[0], g: skyAtmosphere.ozoneAbsorption[1], b: skyAtmosphere.ozoneAbsorption[2] }; },
        set color(v) { skyAtmosphere.ozoneAbsorption = [v.r, v.g, v.b]; }
    };
    f_ozone.addBinding(ozoneProxy, 'color', { label: 'Absorption', color: { type: 'float' } });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerCenter', { min: 0, max: 100 });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerWidth', { min: 1, max: 50 });

    // 4. Artistic Controls (The most important for visual)
    const f_art = pane.addFolder({ title: 'Artistic Controls (Visual Tuning)', expanded: true });
    f_art.addBinding(skyAtmosphere, 'horizonHaze', { min: 0, max: 5 });
    f_art.addBinding(skyAtmosphere, 'multiScatteringAmbient', { min: 0, max: 1, label: 'GI Strength' });
    
    const f_ground = f_art.addFolder({ title: 'Ground & Aerial Perspective' });
    const albedoProxy = {
        get color() { return { r: skyAtmosphere.groundAlbedo[0], g: skyAtmosphere.groundAlbedo[1], b: skyAtmosphere.groundAlbedo[2] }; },
        set color(v) { skyAtmosphere.groundAlbedo = [v.r, v.g, v.b]; }
    };
    f_ground.addBinding(albedoProxy, 'color', { label: 'Ground Color', color: { type: 'float' } });
    f_ground.addBinding(skyAtmosphere, 'groundAmbient', { min: 0, max: 2 });
    f_ground.addBinding(skyAtmosphere, 'groundShininess', { min: 1, max: 2048 });
    f_ground.addBinding(skyAtmosphere, 'groundSpecular', { min: 0, max: 20 });

    const f_halo = f_art.addFolder({ title: 'Sun Halo (Bloom)' });
    f_halo.addBinding(skyAtmosphere, 'mieGlow', { min: 0, max: 0.999, label: 'Outer Halo' });
    f_halo.addBinding(skyAtmosphere, 'mieHalo', { min: 0, max: 0.999, label: 'Inner Halo' });

    const f_fog = f_art.addFolder({ title: 'Height Fog' });
    f_fog.addBinding(skyAtmosphere, 'heightFogDensity', { min: 0, max: 2, step: 0.0001 });
    f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', { min: 0.001, max: 1, step: 0.0001 });
};
