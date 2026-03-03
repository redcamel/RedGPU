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

        // 1. SkyAtmosphere 초기화
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 80;
        skyAtmosphere.sunAzimuth = 0;
        view.skyAtmosphere = skyAtmosphere;


        // 4. 모델 로드
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF-Binary/TransmissionTest.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF-Binary/ClearcoatWicker.glb');
        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF-Binary/Corset.glb');

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(view, skyAtmosphere);
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
        if (url.includes('MosquitoInAmber')) { mesh.setScale(20); mesh.x = 7; }
    });
}

const renderTestPane = async (targetView, skyAtmosphere) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane({title: 'SkyAtmosphere Test', expanded: true});

    const {
        createFieldOfView,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);

    const f_sun = pane.addFolder({title: 'Sun & Exposure', expanded: true});
    
    // [KO] 태양 위치 조절용 2D 피커 추가
    // [EN] Add 2D picker for sun position control
    const sunPosState = { pos: { x: skyAtmosphere.sunAzimuth, y: skyAtmosphere.sunElevation } };
    f_sun.addBinding(sunPosState, 'pos', {
        x: { min: -180, max: 180, step: 0.1 },
        y: { min: -90, max: 90, step: 0.1 },
        label: 'Sun Position (Az, El)'
    }).on('change', (ev) => {
        skyAtmosphere.sunAzimuth = ev.value.x;
        skyAtmosphere.sunElevation = ev.value.y;
    });

    f_sun.addBinding(skyAtmosphere, 'sunElevation', {min: -90, max: 90, step: 0.01, label: 'Elevation'});
    f_sun.addBinding(skyAtmosphere, 'sunAzimuth', {min: -360, max: 360, step: 0.01, label: 'Azimuth'});
    f_sun.addBinding(skyAtmosphere, 'sunIntensity', {min: 0, max: 100, step: 0.1, label: 'Intensity'});
    f_sun.addBinding(skyAtmosphere, 'exposure', {min: 0, max: 10, step: 0.1, label: 'Exposure'});

    const f_atmos = pane.addFolder({title: 'Atmosphere', expanded: false});
    f_atmos.addBinding(skyAtmosphere, 'horizonHaze', {min: 0, max: 10, step: 0.01, label: 'Horizon Haze'});
    f_atmos.addBinding(skyAtmosphere, 'heightFogDensity', {min: 0, max: 1, step: 0.001, label: 'Fog Density'});

    const state = {enabled: true};
    pane.addBinding(state, 'enabled', {label: 'Enable Atmosphere'}).on('change', (v) => {
        targetView.skyAtmosphere = v.value ? skyAtmosphere : null;
    });
};
