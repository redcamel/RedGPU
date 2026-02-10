import * as RedGPU from "../../../../dist/index.js?t=1770698056099";

/**
 * [KO] Spot Light 예제
 * [EN] Spot Light example
 *
 * [KO] Spot Light의 사용법과 속성 제어 방법을 보여줍니다.
 * [EN] Demonstrates the usage and property control of Spot Light.
 */

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
        view.skybox = createSkybox(redGPUContext);
        redGPUContext.addView(view);

        const light = createSpotLight(scene);
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

/**
 * [KO] 스카이박스를 생성합니다.
 * [EN] Creates a skybox.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @returns {RedGPU.Display.SkyBox}
 */
const createSkybox = (redGPUContext) => {
    const skyboxImagePaths = [
        "../../../assets/skybox/px.jpg",
        "../../../assets/skybox/nx.jpg",
        "../../../assets/skybox/py.jpg",
        "../../../assets/skybox/ny.jpg",
        "../../../assets/skybox/pz.jpg",
        "../../../assets/skybox/nz.jpg",
    ];

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
    return skybox;
};

/**
 * [KO] Spot Light를 생성합니다.
 * [EN] Creates a Spot Light.
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Light.SpotLight}
 */
const createSpotLight = (scene) => {
    const intensity = 2;
    const light = new RedGPU.Light.SpotLight('#fff', intensity);
    light.intensity = intensity;
    light.x = 4;
    light.y = 8;
    light.radius = 10;
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);

    return light;
};

/**
 * [KO] 샘플 메시들을 생성합니다.
 * [EN] Creates sample meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleMeshes = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../assets/UV_Grid_Sm.jpg'
    );

    const plane = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    plane.setScale(200);
    plane.y = -0.01;
    scene.addChild(plane);

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

/**
 * [KO] 조명 제어용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for light control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Light.SpotLight} light
 */
const renderTestPaneWithLightControl = async (redGPUContext, light) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770698056099');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770698056099");
    setDebugButtons(RedGPU, redGPUContext);
    const lightConfig = {
        x: light.position[0],
        y: light.position[1],
        z: light.position[2],
        directionX: light.directionX,
        directionY: light.directionY,
        directionZ: light.directionZ,
        radius: light.radius,
        innerCutoff: light.innerCutoff,
        outerCutoff: light.outerCutoff,
        intensity: light.intensity,
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    const lightFolder = pane.addFolder({title: 'Spot Light', expanded: true});
    lightFolder.addBinding(lightConfig, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.x = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.y = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        light.z = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'directionX', {min: -1, max: 1, step: 0.1}).on('change', (evt) => {
        light.directionX = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'directionY', {min: -1, max: 1, step: 0.1}).on('change', (evt) => {
        light.directionY = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'directionZ', {min: -1, max: 1, step: 0.1}).on('change', (evt) => {
        light.directionZ = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'intensity', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
        light.intensity = evt.value;
    });
    lightFolder.addBinding(lightConfig, 'radius', {min: 0, max: 20, step: 0.1}).on('change', (evt) => {
        light.radius = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'innerCutoff', {min: 0, max: 60, step: 0.1}).on('change', (evt) => {
        light.innerCutoff = evt.value;
    });

    lightFolder.addBinding(lightConfig, 'outerCutoff', {min: 0, max: 60, step: 0.1}).on('change', (evt) => {
        light.outerCutoff = evt.value;
    });
    lightFolder.addBinding(light, 'enableDebugger');
    lightFolder
        .addBinding(lightConfig, 'color', {picker: 'inline', view: 'color', expanded: true})
        .on('change', (evt) => {
            const {r, g, b} = evt.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });
};