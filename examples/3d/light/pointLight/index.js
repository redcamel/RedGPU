import * as RedGPU from "../../../../dist/index.js?t=1769497870527";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 25;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        const light = createPointLight(scene);
        const mesh = createSampleMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPaneWithLightControl(redGPUContext, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPointLight = (scene) => {
    const intensity = 1;
    const light = new RedGPU.Light.PointLight('#fff', intensity);
    light.intensity = intensity;
    light.x = 4;
    light.y = 4;
    light.radius = 10;
    light.enableDebugger = true;
    scene.lightManager.addPointLight(light);

    return light;
};

const createSampleMeshes = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../assets/UV_Grid_Sm.jpg'
    );

    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 32);
    const gridSize = 4;
    const spacing = 5;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const x = col * spacing - ((gridSize - 1) * spacing) / 2;
            const z = row * spacing - ((gridSize - 1) * spacing) / 2;
            const y = 0;

            mesh.setPosition(x, y, z);
            scene.addChild(mesh);
        }
    }
};

const renderTestPaneWithLightControl = async (redGPUContext, light) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769497870527');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769497870527");
    setDebugButtons(RedGPU, redGPUContext);
    const lightConfig = {
        x: light.position[0],
        y: light.position[1],
        z: light.position[2],
        radius: light.radius,
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    const lightFolder = pane.addFolder({title: 'Point Light', expanded: true});
    lightFolder.addBinding(lightConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.x = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.y = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.z = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
        light.intensity = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'radius', {min: 0, max: 20, step: 0.1}).on('change', (evt) => {
        light.radius = evt.value;
    });
    lightFolder.addBinding(light, 'enableDebugger');
    lightFolder
        .addBinding(lightConfig, 'color', {picker: 'inline', view: 'color', expanded: true})
        .on('change', (evt) => {
            const {r, g, b} = evt.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });
};
