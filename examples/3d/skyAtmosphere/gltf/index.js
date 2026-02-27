import * as RedGPU from "../../../../dist/index.js";

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
        skyAtmosphere.exposure = 1.5;
        skyAtmosphere.horizonHaze = 0.8;

        // IBL 초기화
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // View 속성에 직접 설정
        view.skyAtmosphere = skyAtmosphere;
        view.ibl = ibl;
        view.skybox = skybox;

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
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
    const pane = new Pane({title: 'SkyAtmosphere glTF Verifier', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    // 0. General Controls
    const state = {
        enabled: true,
        useIBL: true,
        useSkyBox: true
    };
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
    // [KO] Enable Atmosphere 바로 아래에 useGround 배치
    // [EN] Place useGround directly under Enable Atmosphere
    pane.addBinding(skyAtmosphere, 'useGround', {label: 'Use Ground'});
    pane.addBinding(skyAtmosphere, 'showGround', {label: 'Show Ground'});
    pane.addBinding(state, 'useIBL', {label: 'Use IBL (Reflection)'}).on('change', (v) => {
        targetView.ibl = v.value ? ibl : null;
    });
    pane.addBinding(state, 'useSkyBox', {label: 'Use SkyBox (Background)'}).on('change', (v) => {
        targetView.skybox = v.value ? skybox : null;
    });

    // 1. Cinematic Presets
    const f_presets = pane.addFolder({title: '1. Cinematic Presets', expanded: false});
    const apply = (el, az, exp, intensity) => {
        skyAtmosphere.sunElevation = el;
        skyAtmosphere.sunAzimuth = az;
        skyAtmosphere.exposure = exp;
        skyAtmosphere.sunIntensity = intensity;
        pane.refresh();
    };
    f_presets.addButton({title: 'High Noon'}).on('click', () => apply(90, 0, 1.0, 22.0));
    f_presets.addButton({title: 'Golden Sunset'}).on('click', () => apply(3.5, 0, 1.8, 22.0));
    f_presets.addButton({title: 'Eerie Twilight'}).on('click', () => apply(-4, 0, 4.0, 10.0));

    // 2. Sun & Exposure
    const f_sun = pane.addFolder({title: '2. Sun & Exposure'});
    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.0001, label: 'Elevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.0001, label: 'Azimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 100, step: 0.001, label: 'Intensity'});
    f_sun.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.0001, label: 'Sun Size'});
    f_sun.addBinding(skyAtmosphere, 'exposure', {min: 0, max: 10, step: 0.001, label: 'Exposure'});
};
