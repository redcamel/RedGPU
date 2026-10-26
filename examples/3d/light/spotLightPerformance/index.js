import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] SpotLight Performance(Clustered) 예제
 * [EN] SpotLight Performance(Clustered) example
 *
 * [KO] 32x32 그리드 배치를 통해 최대 1,024개의 스포트라이트가 바닥과 오브젝트에 만드는 조명 효과와 퍼포먼스를 시연합니다.
 * [EN] Demonstrates the lighting effects and performance of up to 1,024 spot lights on the floor and objects through a 32x32 grid arrangement.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 70;
        controller.tilt = -45;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 32x32 그리드 형태의 스포트라이트(총 1,024개) 및 바닥/구체 그리드 구성
        // [EN] Create 32x32 grid of SpotLights (total 1,024) and ground/sphere grid
        const gridSize = 32;
        const spacing = 15;
        const {lights, initialPositions} = createSpotLightGrid(scene, gridSize, spacing);

        createGround(redGPUContext, scene, 600);
        createMatchingMeshGrid(redGPUContext, scene, gridSize, spacing);

        const state = {
            autoAnimate: true,
            spotLightCount: lights.length
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (state.autoAnimate) {
                animateLights(lights, initialPositions, state.spotLightCount, time);
            }
        });

        renderTestPane(redGPUContext, scene, lights, state);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createGround = (redGPUContext, scene, size) => {
    const material = new RedGPU.Material.PBRMaterial(redGPUContext);
    material.baseColorFactor = [0.2, 0.2, 0.2, 1.0];
    material.roughnessFactor = 0.4;
    material.metallicFactor = 0.2;

    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Plane(redGPUContext, size, size),
        material
    );
    ground.rotationX = -90;
    ground.y = -2;
    scene.addChild(ground);
};

const createSpotLightGrid = (scene, size, spacing) => {
    const lights = [];
    const initialPositions = [];
    const halfSize = ((size - 1) * spacing) / 2;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const light = new RedGPU.Light.SpotLight();

            light.color.setColorByRGB(
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)
            );
            light.lumen = 30000;
            light.radius = 28;
            light.innerCutoff = 15;
            light.outerCutoff = 25;

            const x = col * spacing - halfSize;
            const z = row * spacing - halfSize;
            const y = 15;
            light.setPosition(x, y, z);
            light.lookAt(x, 0, z);

            initialPositions.push([x, y, z]);
            scene.lightManager.addSpotLight(light);
            lights.push(light);
        }
    }
    return {lights, initialPositions};
};

const createMatchingMeshGrid = (redGPUContext, scene, size, spacing) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 3.5, 16, 16, 16);
    const halfSize = ((size - 1) * spacing) / 2;

    const materialPool = [];
    for (let i = 0; i < 50; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [0.8, 0.8, 0.8, 1.0];
        material.roughnessFactor = 0.2;
        material.metallicFactor = 0.5;
        materialPool.push(material);
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const mesh = new RedGPU.Display.Mesh(
                redGPUContext,
                geometry,
                materialPool[(row * size + col) % materialPool.length]
            );

            mesh.setPosition(
                col * spacing - halfSize,
                0,
                row * spacing - halfSize
            );
            scene.addChild(mesh);
        }
    }
};

const animateLights = (lights, initialPositions, activeCount, time) => {
    const t = time * 0.001;

    for (let i = 0; i < activeCount; i++) {
        const light = lights[i];
        const pos = initialPositions[i];

        const offsetX = Math.sin(t + i * 0.1) * 5;
        const offsetZ = Math.cos(t + i * 0.1) * 5;

        light.lookAt(pos[0] + offsetX, 0, pos[2] + offsetZ);
    }
};

const renderTestPane = (redGPUContext, scene, lights, state) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'SpotLight Performance', expanded: true});
            folder.addBinding(state, 'autoAnimate');
            folder.addBinding(state, 'spotLightCount', {
                min: 0,
                max: scene.lightManager.limitClusterLightCount,
                step: 1
            }).on('change', (ev) => {
                scene.lightManager.removeAllSpotLight();
                for (let i = 0; i < ev.value; i++) {
                    scene.lightManager.addSpotLight(lights[i]);
                }
            });
            folder.addBinding(scene, 'numChildren', {readonly: true});
        }
    });
};
