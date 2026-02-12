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
    f_presets.addButton({ title: 'Dawn (새벽)' }).on('click', () => {
        skyAtmosphere.sunElevation = -2;
        skyAtmosphere.sunAzimuth = 0;
        skyAtmosphere.exposure = 2.0;
        pane.refresh();
    });

    const f_sun = pane.addFolder({ title: 'Sun & Exposure' });
    f_sun.addBinding(skyAtmosphere, 'sunElevation', { min: -90, max: 90, step: 0.001, label: 'Sun Elevation' });
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', { min: -360, max: 360, step: 0.001, label: 'Sun Azimuth' });
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', { min: 0, max: 100, step: 0.001, label: 'Sun Intensity' });
    f_sun.addBinding(skyAtmosphere, 'sunSize', { min: 0.01, max: 10, step: 0.001, label: 'Sun Size' });
    f_sun.addBinding(skyAtmosphere, 'exposure', { min: 0, max: 10, step: 0.001, label: 'Exposure' });

    const f_atm = pane.addFolder({ title: 'Atmosphere Physics' });
    f_atm.addBinding(skyAtmosphere, 'earthRadius', { min: 100, max: 10000, step: 1, label: 'Earth Radius (km)' });
    f_atm.addBinding(skyAtmosphere, 'atmosphereHeight', { min: 1, max: 200, step: 0.1, label: 'Atmosphere Height (km)' });
    f_atm.addBinding(skyAtmosphere, 'multiScatteringAmbient', { min: 0, max: 1, step: 0.001, label: 'Multi-Scat Ambient' });

    const f_fog = pane.addFolder({ title: 'Height Fog (Artistic)', expanded: false });
    f_fog.addBinding(skyAtmosphere, 'heightFogDensity', { min: 0, max: 2, step: 0.0001, label: 'Density' });
    f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', { min: 0.001, max: 1, step: 0.0001, label: 'Falloff' });

    const f_rayleigh = pane.addFolder({ title: 'Rayleigh Scattering', expanded: false });
    // Rayleigh 산란은 배열이므로 프록시 객체를 통해 제어
    const rayleighProxy = {
        get r() { return skyAtmosphere.rayleighScattering[0]; },
        set r(v) { skyAtmosphere.rayleighScattering = [v, skyAtmosphere.rayleighScattering[1], skyAtmosphere.rayleighScattering[2]]; },
        get g() { return skyAtmosphere.rayleighScattering[1]; },
        set g(v) { skyAtmosphere.rayleighScattering = [skyAtmosphere.rayleighScattering[0], v, skyAtmosphere.rayleighScattering[2]]; },
        get b() { return skyAtmosphere.rayleighScattering[2]; },
        set b(v) { skyAtmosphere.rayleighScattering = [skyAtmosphere.rayleighScattering[0], skyAtmosphere.rayleighScattering[1], v]; }
    };
    f_rayleigh.addBinding(rayleighProxy, 'r', { min: 0, max: 0.1, step: 0.0001, label: 'Scattering R' });
    f_rayleigh.addBinding(rayleighProxy, 'g', { min: 0, max: 0.1, step: 0.0001, label: 'Scattering G' });
    f_rayleigh.addBinding(rayleighProxy, 'b', { min: 0, max: 0.1, step: 0.0001, label: 'Scattering B' });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighScaleHeight', { min: 0.1, max: 50, step: 0.01, label: 'Scale Height' });

    const f_mie = pane.addFolder({ title: 'Mie Scattering', expanded: false });
    f_mie.addBinding(skyAtmosphere, 'mieScattering', { min: 0, max: 0.1, step: 0.0001, label: 'Scattering' });
    f_mie.addBinding(skyAtmosphere, 'mieExtinction', { min: 0, max: 0.1, step: 0.0001, label: 'Extinction' });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', { min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)' });
    f_mie.addBinding(skyAtmosphere, 'mieScaleHeight', { min: 0.1, max: 20, step: 0.01, label: 'Scale Height' });

    const f_ozone = pane.addFolder({ title: 'Ozone Layer', expanded: false });
    // Ozone 흡수 계수 프록시
    const ozoneProxy = {
        get r() { return skyAtmosphere.ozoneAbsorption[0]; },
        set r(v) { skyAtmosphere.ozoneAbsorption = [v, skyAtmosphere.ozoneAbsorption[1], skyAtmosphere.ozoneAbsorption[2]]; },
        get g() { return skyAtmosphere.ozoneAbsorption[1]; },
        set g(v) { skyAtmosphere.ozoneAbsorption = [skyAtmosphere.ozoneAbsorption[0], v, skyAtmosphere.ozoneAbsorption[2]]; },
        get b() { return skyAtmosphere.ozoneAbsorption[2]; },
        set b(v) { skyAtmosphere.ozoneAbsorption = [skyAtmosphere.ozoneAbsorption[0], skyAtmosphere.ozoneAbsorption[1], v]; }
    };
    f_ozone.addBinding(ozoneProxy, 'r', { min: 0, max: 0.01, step: 0.00001, label: 'Absorption R' });
    f_ozone.addBinding(ozoneProxy, 'g', { min: 0, max: 0.01, step: 0.00001, label: 'Absorption G' });
    f_ozone.addBinding(ozoneProxy, 'b', { min: 0, max: 0.01, step: 0.00001, label: 'Absorption B' });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerCenter', { min: 0, max: 100, step: 0.1, label: 'Layer Center (km)' });
    f_ozone.addBinding(skyAtmosphere, 'ozoneLayerWidth', { min: 1, max: 50, step: 0.1, label: 'Layer Width (km)' });
};
