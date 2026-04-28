import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] SkyAtmosphere & SkyLight Decoupling Test 예제
 * [EN] SkyAtmosphere & SkyLight Decoupling Test example
 *
 * [KO] 시각적 대기 효과(SkyAtmosphere)와 조명 요소(SkyLight)를 분리하여 제어하는 물리 기반 대기 산란 예제입니다.
 * [EN] A physically based atmospheric scattering example that independently controls visual atmospheric effects (SkyAtmosphere) and lighting elements (SkyLight).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 1. 디렉셔널 라이트 (태양 광원)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 0;
        directionalLight.lux = 100000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 2. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 3. 모델 로드
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF-Binary/TransmissionTest.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF-Binary/ClearcoatWicker.glb');
        loadGLTF(view,  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF-Binary/GlassHurricaneCandleHolder.glb');

        const renderer = new RedGPU.Renderer(redGPUContext);
        // redGPUContext.antialiasingManager.useMSAA = true;
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere, directionalLight);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
        const mesh = scene.addChild(v['resultMesh']);
        if (url.includes('Corset')) { mesh.setScale(40); mesh.z = 2; mesh.y = -2; }
        if (url.includes('ClearcoatWicker')) { mesh.setScale(3); mesh.x = -6; mesh.y = -1.5; }
        if (url.includes('TransmissionTest')) { mesh.setScale(5); }
        if (url.includes('MosquitoInAmber')) { mesh.setScale(20); mesh.x = 8; }
        if (url.includes('GlassHurricaneCandleHolder')) { mesh.setScale(12); mesh.x = 5; mesh.y = -2 }
    });
}

const renderTestPane = async (targetView, skyAtmosphere, sunSource) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere & SkyLight Control', expanded: true});

    const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);

    // -------------------------------------------------------------------------
    // 1. Sun (Directional Light)
    // -------------------------------------------------------------------------
    const f_sun = pane.addFolder({title: 'Sun (Direct Light Source)', expanded: true});
    f_sun.addBinding(sunSource, 'elevation', {min: -90, max: 90, step: 0.0001, label: 'Elevation'});
    f_sun.addBinding(sunSource, 'azimuth', {min: -360, max: 360, step: 0.0001, label: 'Azimuth'});
    f_sun.addBinding(sunSource, 'lux', {min: 0, max: 150000, step: 1, label: 'Illuminance (Lux)'});

    // -------------------------------------------------------------------------
    // 2. SkyAtmosphere (Visuals & Simulation)
    // -------------------------------------------------------------------------
    const f_atmo = pane.addFolder({title: 'SkyAtmosphere (Visuals)', expanded: true});
    f_atmo.addBinding(skyAtmosphere, 'visualIntensity', {min: 0, max: 10, step: 0.01, label: 'Visual Intensity (Sky)'});
    f_atmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'Sun Visual Size'});
    f_atmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'Sun Limb Darkening'});

    // Scattering Details
    const f_scattering = f_atmo.addFolder({title: 'Atmospheric Physics', expanded: false});
    
    // Rayleigh
    const f_rayleigh = f_scattering.addFolder({title: 'Rayleigh', expanded: true});
    const rayleighState = { color: { r: skyAtmosphere.rayleighScattering[0], g: skyAtmosphere.rayleighScattering[1], b: skyAtmosphere.rayleighScattering[2] } };
    f_rayleigh.addBinding(rayleighState, 'color', {color: {type: 'float'}, label: 'Scattering Coeff'}).on('change', (ev) => {
        skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 20, step: 0.1, label: 'Scale Height (km)'});

    // Mie
    const f_mie = f_scattering.addFolder({title: 'Mie', expanded: true});
    const mieScatState = { color: { r: skyAtmosphere.mieScattering[0], g: skyAtmosphere.mieScattering[1], b: skyAtmosphere.mieScattering[2] } };
    f_mie.addBinding(mieScatState, 'color', {color: {type: 'float'}, label: 'Scattering Coeff'}).on('change', (ev) => {
        skyAtmosphere.mieScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 20, step: 0.1, label: 'Scale Height (km)'});

    // Planet
    const f_planet = f_scattering.addFolder({title: 'Planet & Ground', expanded: true});
    f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1, label: 'Ground Radius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'Atmo Height (km)'});
    const groundState = { albedo: { r: skyAtmosphere.groundAlbedo[0], g: skyAtmosphere.groundAlbedo[1], b: skyAtmosphere.groundAlbedo[2] } };
    f_planet.addBinding(groundState, 'albedo', {color: {type: 'float'}, label: 'Ground Albedo'}).on('change', (ev) => {
        skyAtmosphere.groundAlbedo = [ev.value.r, ev.value.g, ev.value.b];
    });

    // -------------------------------------------------------------------------
    // 3. SkyLight (Indirect/IBL Lighting)
    // -------------------------------------------------------------------------
    const skyLight = skyAtmosphere.skyLight;
    const f_skylight = pane.addFolder({title: 'SkyLight (Indirect Light)', expanded: true});
    f_skylight.addBinding(skyLight, 'intensityMultiplier', {min: 0, max: 10, step: 0.01, label: 'IBL Intensity Multiplier'});
    f_skylight.addBinding(skyLight, 'luminance', {min: 0, max: 50000, step: 1, label: 'Base Luminance (Nit)'});
    
    f_skylight.addButton({title: 'Force Update IBL'}).on('click', () => {
        skyLight.dirty = true;
    });

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable SkyAtmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
