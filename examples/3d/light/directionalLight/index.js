import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Directional Light 예제
 * [EN] Directional Light example
 *
 * [KO] Directional Light의 사용법과 속성 제어 방법을 보여줍니다.
 * [EN] Demonstrates the usage and property control of Directional Light.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        const light = createDirectionalLight(scene);
        const mesh = createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPaneWithLightControl(redGPUContext, mesh, light, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] Directional Light를 생성합니다.
 * [EN] Creates a Directional Light.
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Light.DirectionalLight}
 */
const createDirectionalLight = (scene) => {
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#fff');
    light.intensity = 50000; // 초기값 50,000 Lux
    light.enableDebugger = true;
    scene.lightManager.addDirectionalLight(light);
    return light;
};

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 32);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 조명 및 카메라 제어용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for light and camera control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 * @param {RedGPU.Light.DirectionalLight} light
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPaneWithLightControl = async (redGPUContext, mesh, light, view) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);

    const camera = view.rawCamera;

    const lightConfig = {
        directionX: light.direction[0],
        directionY: light.direction[1],
        directionZ: light.direction[2],
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
        enableDebugger: light.enableDebugger
    };

    const lightFolder = pane.addFolder({title: 'Directional Light (Lux)', expanded: true});
    lightFolder.addBinding(lightConfig, 'directionX', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [evt.value, lightConfig.directionY, lightConfig.directionZ];
    });
    lightFolder.addBinding(lightConfig, 'directionY', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [lightConfig.directionX, evt.value, lightConfig.directionZ];
    });
    lightFolder.addBinding(lightConfig, 'directionZ', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [lightConfig.directionX, lightConfig.directionY, evt.value];
    });
    lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 150000, step: 100}).on('change', (evt) => {
        light.intensity = evt.value;
    });
    lightFolder.addBinding(lightConfig, "color", {picker: "inline", view: "color", expanded: true})
        .on("change", (ev) => {
            const {r, g, b} = ev.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });
    lightFolder.addBinding(lightConfig, 'enableDebugger').on('change', (evt) => {
        light.enableDebugger = evt.value;
    });

    const cameraConfig = {
        aperture: camera.aperture,
        shutterSpeed: 1 / camera.shutterSpeed, // Display as denominator (e.g., 125 for 1/125s)
        iso: camera.iso,
        ev100: camera.ev100,
        exposure: camera.exposure,
        useAutoExposure: view.postEffectManager.useAutoExposure
    };

    const cameraFolder = pane.addFolder({title: 'Physical Camera & Exposure', expanded: true});
    cameraFolder.addBinding(cameraConfig, 'useAutoExposure').on('change', (evt) => {
        view.postEffectManager.useAutoExposure = evt.value;
    });
    cameraFolder.addBinding(cameraConfig, 'aperture', {min: 1.0, max: 32.0, step: 0.1}).on('change', (evt) => {
        camera.aperture = evt.value;
        cameraConfig.ev100 = camera.ev100;
        cameraConfig.exposure = camera.exposure;
        pane.refresh();
    });
    cameraFolder.addBinding(cameraConfig, 'shutterSpeed', {min: 1, max: 4000, step: 1}).on('change', (evt) => {
        camera.shutterSpeed = 1 / evt.value;
        cameraConfig.ev100 = camera.ev100;
        cameraConfig.exposure = camera.exposure;
        pane.refresh();
    });
    cameraFolder.addBinding(cameraConfig, 'iso', {min: 100, max: 3200, step: 100}).on('change', (evt) => {
        camera.iso = evt.value;
        cameraConfig.ev100 = camera.ev100;
        cameraConfig.exposure = camera.exposure;
        pane.refresh();
    });
    cameraFolder.addBinding(cameraConfig, 'ev100', {readonly: true, format: (v) => v.toFixed(2)});
    cameraFolder.addBinding(cameraConfig, 'exposure', {readonly: true, format: (v) => v.toExponential(4)});

    const meshConfig = {
        x: mesh.x,
        y: mesh.y,
        z: mesh.z,
    };

    const positionFolder = pane.addFolder({title: 'Mesh Position', expanded: false});
    positionFolder.addBinding(meshConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(evt.value, meshConfig.y, meshConfig.z);
    });
    positionFolder.addBinding(meshConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(meshConfig.x, evt.value, meshConfig.z);
    });
    positionFolder.addBinding(meshConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(meshConfig.x, meshConfig.y, evt.value);
    });

};
