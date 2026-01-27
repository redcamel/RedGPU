import * as RedGPU from "../../../../dist/index.js?t=1769498863678";

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

        renderTestPaneWithLightControl(redGPUContext, mesh, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createDirectionalLight = (scene) => {
    const direction = [-1, -1, -1];
    const light = new RedGPU.Light.DirectionalLight(direction, '#fff');
    light.enableDebugger = true;
    scene.lightManager.addDirectionalLight(light);
    return light;
};

const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 32);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

const renderTestPaneWithLightControl = async (redGPUContext, mesh, light) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769498863678');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769498863678");
    setDebugButtons(RedGPU, redGPUContext);
    const lightConfig = {
        directionX: light.direction[0],
        directionY: light.direction[1],
        directionZ: light.direction[2],
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
        enableDebugger: light.enableDebugger
    };

    const lightFolder = pane.addFolder({title: 'Directional Light', expanded: true});
    lightFolder.addBinding(lightConfig, 'directionX', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [evt.value, lightConfig.directionY, lightConfig.directionZ];
    });
    lightFolder.addBinding(lightConfig, 'directionY', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [lightConfig.directionX, evt.value, lightConfig.directionZ];
    });
    lightFolder.addBinding(lightConfig, 'directionZ', {min: -3, max: 3, step: 0.01}).on('change', (evt) => {
        light.direction = [lightConfig.directionX, lightConfig.directionY, evt.value];
    });
    lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 2, step: 0.01}).on('change', (evt) => {
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
    const config = {
        x: mesh.x,
        y: mesh.y,
        z: mesh.z,
        scaleX: mesh.scaleX,
        scaleY: mesh.scaleY,
        scaleZ: mesh.scaleZ,
        rotationX: mesh.rotationX,
        rotationY: mesh.rotationY,
        rotationZ: mesh.rotationZ
    };

    const positionFolder = pane.addFolder({title: 'Mesh Position', expanded: true});
    positionFolder.addBinding(config, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(evt.value, config.y, config.z);
    });
    positionFolder.addBinding(config, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(config.x, evt.value, config.z);
    });
    positionFolder.addBinding(config, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(config.x, config.y, evt.value);
    });

};
