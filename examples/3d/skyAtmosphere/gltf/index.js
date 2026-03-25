import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 5;
        skyAtmosphere.sunAzimuth = 0;

        // IBL 초기화
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;
        view.ibl = ibl;
        view.skybox = skybox;
        view.toneMappingManager.exposure = 1.5;

        // 2. 카메라 설정
        view.rawCamera.nearClipping = 1;
        view.rawCamera.farClipping = 2000000;
        controller.pan = -90; 
        controller.tilt = -10;
        controller.distance = 1500;
        controller.speedDistance = 100;

        // 이동 제한
        controller.minTilt = -88;
        controller.maxTilt = 0;
        controller.minDistance = 10;
        controller.maxDistance = 1000000;

        redGPUContext.addView(view);

        // 3. 테스트 환경 구성
        const FIXED_Y = 100;
        const GRID_X = 5;
        const GRID_Z = 50;
        const STEP_X = 1000;
        const STEP_Z = 2000;

        const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
        
        for (let i = 0; i < GRID_X; i++) {
            for (let j = 0; j < GRID_Z; j++) {
                new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                        let helmet = result.resultMesh;
                        helmet.x = j * STEP_Z;
                        helmet.z = (i - Math.floor(GRID_X / 2)) * STEP_X;
                        helmet.y = FIXED_Y;
                        helmet.scaleX = helmet.scaleY = helmet.scaleZ = 150;
                        scene.addChild(helmet);
                    }
                );
            }
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere, ibl, skybox);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView, skyAtmosphere, ibl, skybox) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere glTF', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.rawCamera);

    const f_sun = pane.addFolder({title: 'Sun Configuration', expanded: true});
    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.0001, label: 'sunElevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.0001, label: 'sunAzimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 200000, step: 1, label: 'sunIntensity (Lux)'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01, label: 'sunSize'});
    f_sun.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01, label: 'sunLimbDarkening'});

    const f_camera = pane.addFolder({title: 'Camera Exposure', expanded: false});
    f_camera.addBinding(targetView.rawCamera, 'exposureCompensation', {min: -10, max: 10, step: 0.1, label: 'Exposure Bias'});
    f_camera.addBinding(targetView.rawCamera, 'aperture', {min: 1.0, max: 32.0, step: 0.1, label: 'Aperture (f-stop)'});
    f_camera.addBinding(targetView.rawCamera, 'shutterSpeed', {min: 1/4000, max: 1, step: 0.0001, label: 'Shutter Speed (s)'});
    f_camera.addBinding(targetView.rawCamera, 'iso', {min: 50, max: 3200, step: 1, label: 'ISO'});

    const f_planet = pane.addFolder({title: 'Planet', expanded: false});
    f_planet.addBinding(skyAtmosphere, 'bottomRadius', {min: 1000, max: 10000, step: 1, label: 'bottomRadius (km)'});
    f_planet.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1, label: 'atmosphereHeight (km)'});
    f_planet.addBinding(skyAtmosphere, 'seaLevel', {min: -10, max: 10, step: 0.01, label: 'seaLevel (km)'});
    f_planet.addBinding(skyAtmosphere, 'cameraHeight', {readonly: true, interval: 100, label: 'cameraHeight (km)'});
    f_planet.addBinding(skyAtmosphere, 'groundAmbient', {min: 0, max: 10, step: 0.01, label: 'groundAmbient'});
    
    const groundState = {
        albedo: {
            r: skyAtmosphere.groundAlbedo[0],
            g: skyAtmosphere.groundAlbedo[1],
            b: skyAtmosphere.groundAlbedo[2]
        }
    };
    f_planet.addBinding(groundState, 'albedo', {color: {type: 'float'}, label: 'groundAlbedo'}).on('change', (ev) => {
        skyAtmosphere.groundAlbedo = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_planet.addBinding(skyAtmosphere, 'showGround', {label: 'showGround'});
    f_planet.addBinding(skyAtmosphere, 'useGround', {label: 'useGround (physics)'});

    const f_rayleigh = pane.addFolder({title: 'Rayleigh', expanded: false});
    const rayleighState = {
        scat: {
            r: skyAtmosphere.rayleighScattering[0],
            g: skyAtmosphere.rayleighScattering[1],
            b: skyAtmosphere.rayleighScattering[2]
        }
    };
    f_rayleigh.addBinding(rayleighState, 'scat', {color: {type: 'float'}, label: 'rayleighScattering'}).on('change', (ev) => {
        skyAtmosphere.rayleighScattering = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_rayleigh.addBinding(skyAtmosphere, 'rayleighExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'rayleighExponentialDistribution (km)'});

    const f_mie = pane.addFolder({title: 'Mie', expanded: false});
    f_mie.addBinding(skyAtmosphere, 'mieScattering', {min: 0, max: 1.0, step: 0.0001, label: 'mieScattering'});
    f_mie.addBinding(skyAtmosphere, 'mieAbsorption', {min: 0, max: 1.0, step: 0.0001, label: 'mieAbsorption'});
    f_mie.addBinding(skyAtmosphere, 'mieAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'mieAnisotropy (g)'});
    f_mie.addBinding(skyAtmosphere, 'mieExponentialDistribution', {min: 0.1, max: 100, step: 0.1, label: 'mieExponentialDistribution (km)'});
    f_mie.addBinding(skyAtmosphere, 'mieGlow', {min: 0, max: 0.999, step: 0.01, label: 'mieGlow'});
    f_mie.addBinding(skyAtmosphere, 'mieHalo', {min: 0, max: 0.999, step: 0.001, label: 'mieHalo (g)'});

    const f_absorption = pane.addFolder({title: 'Absorption (Ozone)', expanded: false});
    const absorptionState = {
        coeff: {
            r: skyAtmosphere.absorptionCoefficient[0],
            g: skyAtmosphere.absorptionCoefficient[1],
            b: skyAtmosphere.absorptionCoefficient[2]
        }
    };
    f_absorption.addBinding(absorptionState, 'coeff', {color: {type: 'float'}, label: 'absorptionCoefficient'}).on('change', (ev) => {
        skyAtmosphere.absorptionCoefficient = [ev.value.r, ev.value.g, ev.value.b];
    });
    f_absorption.addBinding(skyAtmosphere, 'absorptionTipAltitude', {min: 0, max: 100, step: 0.1, label: 'absorptionTipAltitude (km)'});
    f_absorption.addBinding(skyAtmosphere, 'absorptionTentWidth', {min: 1, max: 50, step: 0.1, label: 'absorptionTentWidth (km)'});

    const f_artistic = pane.addFolder({title: 'Artistic Controls', expanded: true});
    f_artistic.addBinding(skyAtmosphere, 'skyLuminanceFactor', {min: 0, max: 100, step: 0.1, label: 'skyLuminanceFactor'});
    f_artistic.addBinding(skyAtmosphere, 'aerialPerspectiveDistanceScale', {min: 1, max: 1000, step: 1, label: 'aerialPerspectiveDistanceScale (km)'});

    const f_fog = pane.addFolder({title: 'Height Fog', expanded: false});
    f_fog.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 10, step: 0.001, label: 'heightFogDensity'});
    f_fog.addBinding(skyAtmosphere, 'heightFogFalloff', {min: 0.001, max: 10, step: 0.001, label: 'heightFogFalloff'});
    f_fog.addBinding(skyAtmosphere, 'heightFogAnisotropy', {min: 0, max: 0.999, step: 0.001, label: 'heightFogAnisotropy (g)'});

    const f_tonemapping = pane.addFolder({title: 'ToneMapping (Global)', expanded: false});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'mode', {
        options: {
            LINEAR: RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR,
            KHRONOS_PBR_NEUTRAL: RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL,
            ACES_FILMIC_NARKOWICZ: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ,
            ACES_FILMIC_HILL: RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL,
        },
        label: 'mode'
    });
    f_tonemapping.addBinding(targetView.toneMappingManager, 'exposure', {min: 0, max: 10, step: 0.01, label: 'exposure'});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'contrast', {min: 0, max: 2, step: 0.01, label: 'contrast'});
    f_tonemapping.addBinding(targetView.toneMappingManager, 'brightness', {min: -1, max: 1, step: 0.01, label: 'brightness'});

    const state = {
        enabled: true,
        useIBL: true,
        useSkyBox: true
    };
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
    pane.addBinding(state, 'useIBL', {label: 'Use IBL (Reflection)'}).on('change', (v) => {
        targetView.ibl = v.value ? ibl : null;
    });
    pane.addBinding(state, 'useSkyBox', {label: 'Use SkyBox (Background)'}).on('change', (v) => {
        targetView.skybox = v.value ? skybox : null;
    });
};
