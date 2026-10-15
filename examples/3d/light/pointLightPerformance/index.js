import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] PointLight Performance(Clustered) 예제
 * [EN] PointLight Performance(Clustered) example
 *
 * [KO] Clustered Forward Shading을 사용하여 최대 1,024개의 실시간 점광원을 효율적으로 렌더링하는 성능을 시연합니다.
 * [EN] Demonstrates the performance of efficiently rendering up to 1,024 real-time point lights using Clustered Forward Shading.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 60;
        controller.tilt = -25;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 다수의 포인트 라이트(최대 1,024개) 및 메시 군집(5,000개) 생성
        // [EN] Create multiple PointLights (max 1,024) and mesh swarm (5,000 instances)
        const maxLightCount = scene.lightManager.limitClusterLightCount;
        const {lights, initialPositions} = createPointLights(scene, maxLightCount);
        createOptimizedMeshSwarm(redGPUContext, scene, 5000);

        const state = {
            autoAnimate: true,
            pointLightCount: maxLightCount
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (state.autoAnimate) {
                animateLights(lights, initialPositions, state.pointLightCount, time);
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

const createPointLights = (scene, count) => {
    const lights = [];
    const initialPositions = [];
    const range = 80;

    for (let i = 0; i < count; i++) {
        const light = new RedGPU.Light.PointLight();

        light.color.setColorByRGB(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );
        light.lumen = Math.random() * 5000 + 2000;
        light.radius = Math.random() * 10 + 6;

        const x = Math.random() * range - range / 2;
        const y = Math.random() * range - range / 2;
        const z = Math.random() * range - range / 2;
        light.setPosition(x, y, z);

        initialPositions.push([x, y, z]);
        scene.lightManager.addPointLight(light);
        lights.push(light);
    }
    return {lights, initialPositions};
};

const createOptimizedMeshSwarm = (redGPUContext, scene, count) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 16, 16, 16);

    const materialPool = [];
    for (let i = 0; i < 50; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [0.8, 0.8, 0.8, 1.0];
        material.roughnessFactor = 0.2;
        material.metallicFactor = 0.5;
        materialPool.push(material);
    }

    const range = 100;
    for (let i = 0; i < count; i++) {
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext,
            geometry,
            materialPool[i % materialPool.length]
        );

        mesh.setPosition(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );
        mesh.rotationX = Math.random() * 360;
        mesh.rotationY = Math.random() * 360;
        mesh.rotationZ = Math.random() * 360;

        scene.addChild(mesh);
    }
};

const animateLights = (lights, initialPositions, activeCount, time) => {
    const t = time * 0.0005;

    for (let i = 0; i < activeCount; i++) {
        const light = lights[i];
        const pos = initialPositions[i];

        light.x = pos[0] + Math.sin(t + i) * 15;
        light.y = pos[1] + Math.cos(t + i * 0.5) * 15;
        light.z = pos[2] + Math.sin(t * 0.8 + i) * 15;
    }
};

const renderTestPane = (redGPUContext, scene, lights, state) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PointLight Performance', expanded: true});
            folder.addBinding(state, 'autoAnimate');
            folder.addBinding(state, 'pointLightCount', {
                min: 0,
                max: scene.lightManager.limitClusterLightCount,
                step: 1
            }).on('change', (ev) => {
                scene.lightManager.removeAllPointLight();
                for (let i = 0; i < ev.value; i++) {
                    scene.lightManager.addPointLight(lights[i]);
                }
            });
            folder.addBinding(scene, 'numChildren', {readonly: true});
        }
    });
};
