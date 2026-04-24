import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] SkyAtmosphere Test 예제
 * [EN] SkyAtmosphere Test example
 *
 * [KO] SkyAtmosphere 시스템과 PBR 재질의 실시간 동기화를 테스트하는 예제입니다.
 * [EN] Example testing real-time synchronization between SkyAtmosphere system and PBR materials.
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

        // 1. 디렉셔널 라이트 먼저 추가 (SkyAtmosphere가 자동 감지)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.enableDebugger = true;
        directionalLight.elevation = 80;
        directionalLight.azimuth = 0;
        directionalLight.lux = 100000; // 물리적 단위 (Lux)
        scene.lightManager.addDirectionalLight(directionalLight);

        // 2. SkyAtmosphere 초기화 (자동으로 directionalLight를 태양 광원으로 사용)
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 3. 모델 로드
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF-Binary/TransmissionTest.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF-Binary/ClearcoatWicker.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF-Binary/Corset.glb');
        loadGLTF(view,  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF-Binary/GlassHurricaneCandleHolder.glb');

        const renderer = new RedGPU.Renderer(redGPUContext);
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
    const pane = new Pane({title: 'SkyAtmosphere Test', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    const {
        createPerspectiveCameraTest
    } = await import("../../../exampleHelper/createExample/helperPanes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createPerspectiveCameraTest(pane, targetView);

    // 1. Sun Configuration
    const f_sun = pane.addFolder({title: 'Sun Configuration (via Light)', expanded: true});
    f_sun.addBinding(sunSource, 'elevation', {min: -90, max: 90, step: 0.0001, label: 'Sun Elevation'});
    f_sun.addBinding(sunSource, 'azimuth', {min: -360, max: 360, step: 0.0001, label: 'Sun Azimuth'});
    f_sun.addBinding(sunSource, 'lux', {min: 0, max: 150000, step: 1, label: 'Sun Illuminance (Lux)'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'Sun Visual Size'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 1, step: 0.01, label: 'Sun Limb Darkening'});

    // 2. Camera & Exposure
    const f_camera_extra = pane.addFolder({title: 'ToneMapping & Exposure Extra', expanded: true});
    f_camera_extra.addBinding(targetView.postEffectManager.autoExposure, 'exposureCompensation', {min: -10, max: 10, step: 0.1, label: 'Exposure Compensation'});
    f_camera_extra.addBinding(targetView.postEffectManager.autoExposure, 'targetLuminance', {min: 0.01, max: 1.0, step: 0.01, label: 'Target Luminance'});

    // 3. Planet & Ground
    const f_planet = pane.addFolder({title: 'Planet & Ground', expanded: false});
    f_planet.addBinding(skyAtmosphere, 'groundRadius', {min: 1000, max: 10000, step: 1, label: 'Ground Radius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'Atmosphere Height (km)'});
    
    const groundState = { albedo: { r: skyAtmosphere.groundAlbedo[0], g: skyAtmosphere.groundAlbedo[1], b: skyAtmosphere.groundAlbedo[2] } };
    f_planet.addBinding(groundState, 'albedo', {color: {type: 'float'}, label: 'Ground Albedo'}).on('change', (ev) => {
        skyAtmosphere.groundAlbedo = [ev.value.r, ev.value.g, ev.value.b];
    });

    // 4. Scattering (Rayleigh & Mie)
    const f_scattering = pane.addFolder({title: 'Atmospheric Scattering', expanded: false});
    
    // Rayleigh
    const f_rayleigh = f_scattering.addFolder({title: 'Rayleigh', expanded: true});
    const rayleighState = { scat: { r: skyAtmosphere.rayleighScattering[0], g: skyAtmosphere.rayleighScattering[1], b: skyAtmosphere.rayleighScattering[2] } };
    f_rayleigh.addBinding(rayleighState, 'scat', {color: {type: 'float'}, label: 'Scattering Coeff'}).on('change', (ev) => {
        skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 20, step: 0.1, label: 'Scale Height (km)'});

    // Mie
    const f_mie = f_scattering.addFolder({title: 'Mie', expanded: true});
    const mieScatState = { scat: { r: skyAtmosphere.mieScattering[0], g: skyAtmosphere.mieScattering[1], b: skyAtmosphere.mieScattering[2] } };
    f_mie.addBinding(mieScatState, 'scat', {color: {type: 'float'}, label: 'Scattering Coeff'}).on('change', (ev) => {
        skyAtmosphere.mieScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    const mieAbsState = { abs: { r: skyAtmosphere.mieAbsorption[0], g: skyAtmosphere.mieAbsorption[1], b: skyAtmosphere.mieAbsorption[2] } };
    f_mie.addBinding(mieAbsState, 'abs', {color: {type: 'float'}, label: 'Absorption Coeff'}).on('change', (ev) => {
        skyAtmosphere.mieAbsorption = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'Anisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 20, step: 0.1, label: 'Scale Height (km)'});

    // 5. Absorption (Ozone)
    const f_absorption = pane.addFolder({title: 'Absorption (Ozone Layer)', expanded: false});
    const absorptionState = { coeff: { r: skyAtmosphere.absorptionCoefficient[0], g: skyAtmosphere.absorptionCoefficient[1], b: skyAtmosphere.absorptionCoefficient[2] } };
    f_absorption.addBinding(absorptionState, 'coeff', {color: {type: 'float'}, label: 'Absorption Coeff'}).on('change', (ev) => {
        skyAtmosphere.absorptionCoefficient = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_absorption.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1, label: 'Layer Altitude (km)'});
    f_absorption.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1, label: 'Layer Width (km)'});

    // 6. Artistic Controls
    const f_artistic = pane.addFolder({title: 'Artistic Controls', expanded: true});
    const luminanceState = { tint: { r: skyAtmosphere.skyLuminanceFactor[0], g: skyAtmosphere.skyLuminanceFactor[1], b: skyAtmosphere.skyLuminanceFactor[2] } };
    f_artistic.addBinding(luminanceState, 'tint', {color: {type: 'float'}, label: 'Sky Luminance Tint'}).on('change', (ev) => {
        skyAtmosphere.skyLuminanceFactor = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_artistic.addBinding(skyAtmosphere, 'multiScatteringFactor', {min: 0, max: 10, step: 0.01, label: 'Multi-Scattering'});
    f_artistic.addBinding(skyAtmosphere, 'transmittanceMinLightElevationAngle', {min: -90, max: 90, step: 0.1, label: 'Min Light Elevation'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'AP Distance Scale'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveStartDepth', {min: 0, max: 100, step: 0.1, label: 'AP Start Depth (km)'});

    // 7. Global ToneMapping
    const f_tonemapping = pane.addFolder({title: 'ToneMapping (Global)', expanded: false});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'mode', {
        options: {
            LINEAR: RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR,
            KHRONOS_PBR_NEUTRAL: RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL,
            ACES_FILMIC_NARKOWICZ: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ,
            ACES_FILMIC_HILL: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL,
        },
        label: 'ToneMapping Mode'
    });
    f_tonemapping.addBinding(targetView.toneMappingManager, 'contrast', {min: 0, max: 2, step: 0.01, label: 'Contrast'});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'brightness', {min: -1, max: 1, step: 0.01, label: 'Brightness'});

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable SkyAtmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
