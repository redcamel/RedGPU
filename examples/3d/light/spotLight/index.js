import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] SpotLight 예제 (Lighting Studio)
 * [EN] SpotLight Example (Lighting Studio)
 *
 * [KO] 촘촘하게 배치된 구체 그리드를 통해 SpotLight의 원뿔 형태 빛과 감쇄 효과를 시연합니다.
 * [EN] Demonstrates the cone of light and attenuation effect of SpotLight through a dense grid of spheres.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 50;
        controller.tilt = -35;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 스포트라이트 및 스튜디오 구체 그리드 구성
        // [EN] Configure SpotLight and studio sphere grid
        const light = createSpotLight(scene);
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

const createSpotLight = (scene) => {
    const light = new RedGPU.Light.SpotLight('#ffffff', 100000);
    light.setPosition(0, 20, 0);
    light.lookAt(0, 0, 0);
    light.radius = 35;
    light.innerCutoff = 15;
    light.outerCutoff = 45;
    light.enableDebugger = true;
    scene.lightManager.addSpotLight(light);
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

            const folder = pane.addFolder({title: 'SpotLight Control', expanded: true});

            folder.addBinding(config, 'color', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            folder.addBinding(light, 'lumen', {min: 0, max: 200000, step: 100});
            folder.addBinding(light, 'radius', {min: 0, max: 200, step: 1});
            folder.addBinding(light, 'enableDebugger');

            const coneFolder = folder.addFolder({title: 'Cone Settings', expanded: true});
            coneFolder.addBinding(light, 'innerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.innerCutoff > light.outerCutoff) light.outerCutoff = light.innerCutoff;
                pane.refresh();
            });
            coneFolder.addBinding(light, 'outerCutoff', {min: 0, max: 90, step: 0.1}).on('change', () => {
                if (light.outerCutoff < light.innerCutoff) light.innerCutoff = light.outerCutoff;
                pane.refresh();
            });

            const transformFolder = folder.addFolder({title: 'Transform', expanded: true});
            transformFolder.addBinding(light, 'x', {min: -100, max: 100, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'y', {min: -20, max: 60, step: 0.1}).on('change', () => pane.refresh());
            transformFolder.addBinding(light, 'z', {min: -100, max: 100, step: 0.1}).on('change', () => pane.refresh());

            const dirFolder = folder.addFolder({title: 'Direction Vector', expanded: false});
            dirFolder.addBinding(light, 'directionX', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionY', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
            dirFolder.addBinding(light, 'directionZ', {min: -1, max: 1, step: 0.01}).on('change', () => pane.refresh());
        }
    });
};
