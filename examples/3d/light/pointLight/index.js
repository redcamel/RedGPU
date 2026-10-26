import * as RedGPU from "../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] PointLight 예제 (Lighting Studio)
 * [EN] PointLight Example (Lighting Studio)
 *
 * [KO] 촘촘하게 배치된 구체 그리드를 통해 PointLight의 거리 감쇄 효과를 시연합니다.
 * [EN] Demonstrates the distance attenuation effect of PointLight through a dense grid of spheres.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 50;
        controller.tilt = -35;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 포인트 라이트 및 스튜디오 구체 그리드 구성
        // [EN] Configure PointLight and studio sphere grid
        const light = createPointLight(scene);
        createStudioEnvironment(redGPUContext, scene);
        createMaterialGrid(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, light);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPointLight = (scene) => {
    const light = new RedGPU.Light.PointLight('#ffffff', 50000);
    light.setPosition(0, 10, 0);
    light.radius = 40;
    light.enableDebugger = true;
    scene.lightManager.addPointLight(light);
    return light;
};

const createStudioEnvironment = (redGPUContext, scene) => {
    const studioMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    studioMaterial.baseColorFactor = [0.1, 0.1, 0.1, 1.0];
    studioMaterial.roughnessFactor = 0.5;
    const floor = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Plane(redGPUContext, 200, 200), studioMaterial);
    floor.rotationX = -90;
    floor.y = -2;
    scene.addChild(floor);
};

const createMaterialGrid = (redGPUContext, scene) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 16, 16, 16);
    const matNonMetal = new RedGPU.Material.PBRMaterial(redGPUContext);
    matNonMetal.baseColorFactor = [1.0, 0.2, 0.2, 1.0];
    matNonMetal.metallicFactor = 0.0;
    matNonMetal.roughnessFactor = 0.4;

    const matMetal = new RedGPU.Material.PBRMaterial(redGPUContext);
    matMetal.baseColorFactor = [1.0, 1.0, 1.0, 1.0];
    matMetal.metallicFactor = 1.0;
    matMetal.roughnessFactor = 0.2;

    const size = 20;
    const spacing = 4.5;
    for (let x = 0; x < size; x++) {
        for (let z = 0; z < size; z++) {
            const isMetal = (x + z) % 2 === 0;
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, isMetal ? matMetal : matNonMetal);
            mesh.x = (x - (size - 1) / 2) * spacing;
            mesh.z = (z - (size - 1) / 2) * spacing;
            scene.addChild(mesh);
        }
    }
};

const renderTestPane = (redGPUContext, light) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const config = {
                color: {r: light.color.r, g: light.color.g, b: light.color.b}
            };

            const folder = pane.addFolder({title: 'PointLight Control', expanded: true});

            folder.addBinding(config, 'color', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            folder.addBinding(light, 'lumen', {min: 0, max: 200000, step: 100});
            folder.addBinding(light, 'radius', {min: 0, max: 200, step: 1});
            folder.addBinding(light, 'enableDebugger');

            const transformFolder = folder.addFolder({title: 'Transform', expanded: true});
            transformFolder.addBinding(light, 'x', {min: -60, max: 60, step: 0.1});
            transformFolder.addBinding(light, 'y', {min: -10, max: 60, step: 0.1});
            transformFolder.addBinding(light, 'z', {min: -60, max: 60, step: 0.1});
        }
    });
};
