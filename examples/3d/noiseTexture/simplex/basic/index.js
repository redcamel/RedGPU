import * as RedGPU from "../../../../../dist/index.js?t=1769512410570";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 55;
        controller.speedDistance = 2;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 2;
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(0, 0, 0);
        scene.addChild(mesh);

        const testData = {useAnimation: true};
        renderTestPane(redGPUContext, material.diffuseTexture, testData);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            if (testData.useAnimation) {
                if (material.diffuseTexture) material.diffuseTexture.time = time;
            }
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "18px";
        errorMessage.style.padding = "20px";
        document.body.appendChild(errorMessage);
    }
);
const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512410570');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1769512410570");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    setSeparator(pane, "Presets");

    pane.addButton({title: '🏔️ Mountains'}).on('click', () => {
        targetNoiseTexture.frequency = 4.0;
        targetNoiseTexture.amplitude = 1.5;
        targetNoiseTexture.octaves = 6;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 42;
        pane.refresh();
    });

    pane.addButton({title: '🌊 Waves'}).on('click', () => {
        targetNoiseTexture.frequency = 8.0;
        targetNoiseTexture.amplitude = 0.8;
        targetNoiseTexture.octaves = 3;
        targetNoiseTexture.persistence = 0.4;
        targetNoiseTexture.lacunarity = 2.5;
        targetNoiseTexture.seed = 123;
        pane.refresh();
    });

    pane.addButton({title: '🌋 Crater'}).on('click', () => {
        targetNoiseTexture.frequency = 2.0;
        targetNoiseTexture.amplitude = 2.0;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.8;
        targetNoiseTexture.lacunarity = 1.8;
        targetNoiseTexture.seed = 999;
        pane.refresh();
    });

    pane.addButton({title: '👴 Wrinkles'}).on('click', () => {
        targetNoiseTexture.frequency = 12.0;
        targetNoiseTexture.amplitude = 0.6;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.7;
        targetNoiseTexture.lacunarity = 2.2;
        targetNoiseTexture.seed = 666;
        pane.refresh();
    });

    pane.addButton({title: '🪨 Cobblestone'}).on('click', () => {
        targetNoiseTexture.frequency = 15.0;
        targetNoiseTexture.amplitude = 1.0;
        targetNoiseTexture.octaves = 2;
        targetNoiseTexture.persistence = 0.3;
        targetNoiseTexture.lacunarity = 3.0;
        targetNoiseTexture.seed = 777;
        pane.refresh();
    });

    pane.addButton({title: '🏜️ Dunes'}).on('click', () => {
        targetNoiseTexture.frequency = 3.0;
        targetNoiseTexture.amplitude = 1.2;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 1.5;
        targetNoiseTexture.seed = 333;
        pane.refresh();
    });

    pane.addButton({title: '🪸 Coral'}).on('click', () => {
        targetNoiseTexture.frequency = 20.0;
        targetNoiseTexture.amplitude = 0.7;
        targetNoiseTexture.octaves = 7;
        targetNoiseTexture.persistence = 0.8;
        targetNoiseTexture.lacunarity = 2.8;
        targetNoiseTexture.seed = 555;
        pane.refresh();
    });

    pane.addButton({title: '🌳 Bark'}).on('click', () => {
        targetNoiseTexture.frequency = 6.0;
        targetNoiseTexture.amplitude = 1.3;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 2.1;
        targetNoiseTexture.seed = 888;
        pane.refresh();
    });

    setSeparator(pane, "Parameters");

    pane.addBinding(targetNoiseTexture, 'frequency', {
        min: 0,
        max: 30,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'amplitude', {
        min: 0,
        max: 10,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'octaves', {
        min: 1,
        max: 8,
        step: 1
    });

    pane.addBinding(targetNoiseTexture, 'persistence', {
        min: 0,
        max: 1,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'lacunarity', {
        min: 0,
        max: 10,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'seed', {
        min: 0,
        max: 1000,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'noiseDimension', {
        options: RedGPU.Resource.NOISE_DIMENSION
    });

    const animation = pane.addFolder({title: 'Animation', expanded: true});
    animation.addBinding(testData, 'useAnimation');
    animation.addBinding(targetNoiseTexture, 'animationSpeed', {
        min: 0,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationX', {
        min: -1,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationY', {
        min: -1,
        max: 1,
        step: 0.001
    });
};
