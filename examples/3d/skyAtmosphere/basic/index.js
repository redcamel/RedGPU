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
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(view, skyAtmosphere);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane();
    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    // [전용 테스트 패널] SkyAtmosphere 물리 파라미터 제어
    const f_presets = pane.addFolder({ title: 'Presets' });
    f_presets.addButton({ title: 'Noon (정오)' }).on('click', () => {
        skyAtmosphere.sunElevation = 90;
        skyAtmosphere.sunAzimuth = 0;
        skyAtmosphere.exposure = 1.0;
        pane.refresh();
    });
    f_presets.addButton({ title: 'Sunset (노을)' }).on('click', () => {
        skyAtmosphere.sunElevation = 2;
        skyAtmosphere.sunAzimuth = 0;
        skyAtmosphere.exposure = 1.5;
        pane.refresh();
    });

    const f_sun = pane.addFolder({ title: 'Sun & Exposure' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, label: 'Sun Elevation' });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, label: 'Sun Azimuth' });
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100, label: 'Sun Intensity' });
    f_sun.addBinding(skyAtmosphere, 'sunSize', { min: 0.01, max: 10, label: 'Sun Size' });
    f_sun.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10, label: 'Exposure' });

    const f_atm = pane.addFolder({ title: 'Atmosphere Physics' });
    f_atm.addBinding(skyAtmosphere, 'earthRadius', { min: 100, max: 10000, label: 'Earth Radius (km)' });
    f_atm.addBinding(skyAtmosphere, 'atmosphereHeight', { min: 1, max: 200, label: 'Atmosphere Height (km)' });
    f_atm.addBinding(skyAtmosphere, 'mieAnisotropy', { min: 0, max: 0.999, label: 'Mie Anisotropy' });
    f_atm.addBinding(skyAtmosphere, 'multiScatAmbient', { min: 0, max: 1, label: 'Multi-Scat Ambient' });

    const f_scattering = pane.addFolder({ title: 'Scattering & Absorption', expanded: false });
    f_scattering.addBinding(skyAtmosphere, 'mieScattering', { min: 0, max: 0.1, label: 'Mie Scattering' });
    f_scattering.addBinding(skyAtmosphere, 'mieExtinction', { min: 0, max: 0.1, label: 'Mie Extinction' });
    f_scattering.addBinding(skyAtmosphere, 'rayleighScaleHeight', { min: 0.1, max: 50, label: 'Rayleigh Scale Height' });
    f_scattering.addBinding(skyAtmosphere, 'mieScaleHeight', { min: 0.1, max: 20, label: 'Mie Scale Height' });

    const f_ozone = pane.addFolder({ title: 'Ozone Layer', expanded: false });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerCenter', { min: 0, max: 100, label: 'Ozone Center (km)' });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerWidth', { min: 1, max: 50, label: 'Ozone Width (km)' });
};
