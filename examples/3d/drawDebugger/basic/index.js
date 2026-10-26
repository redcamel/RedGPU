import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Draw Debugger 예제
 * [EN] Draw Debugger example
 *
 * [KO] RedGPU의 디버깅 도구를 사용하여 광원(Light), 메시(Mesh), 경계 상자(Volume) 등을 시각화하고 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to visualize and control lights, meshes, and volumes using RedGPU's debugging tools.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.minDistance = 3;
        controller.maxDistance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 8000);

        // [KO] 조명(Directional, Point, Spot) 생성 및 디버거 활성화
        // [EN] Create lights (Directional, Point, Spot) and enable debuggers
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.color.setColorByRGB(255, 255, 220);
        directionalLight.lux = 1000;
        directionalLight.direction = [-0.4, -1, -0.3];
        directionalLight.enableDebugger = true;
        scene.lightManager.addDirectionalLight(directionalLight);

        const pointLight = new RedGPU.Light.PointLight();
        pointLight.color.setColorByRGB(255, 120, 120);
        pointLight.lumen = 500000;
        pointLight.radius = 8.0;
        pointLight.setPosition(-6, 4, 2);
        pointLight.enableDebugger = true;
        scene.lightManager.addPointLight(pointLight);

        const spotLight = new RedGPU.Light.SpotLight();
        spotLight.color.setColorByRGB(120, 160, 255);
        spotLight.lumen = 500000;
        spotLight.radius = 15.0;
        spotLight.setPosition(6, 5, 1);
        spotLight.direction = [-0.8, -0.7, -0.3];
        spotLight.innerCutoff = 10.0;
        spotLight.outerCutoff = 18.0;
        spotLight.enableDebugger = true;
        scene.lightManager.addSpotLight(spotLight);

        // [KO] 메시 계층 구조 생성 및 바운딩 볼륨 디버거 활성화
        // [EN] Create mesh hierarchy and enable bounding volume debuggers
        const centerSphere = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 32, 32),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff')
        );
        centerSphere.enableDebugger = true;
        scene.addChild(centerSphere);

        const rotatingBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 0.8, 0.8, 0.8),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffff88')
        );
        rotatingBox.enableDebugger = true;
        rotatingBox.setPosition(2.5, 1.5, 0);
        centerSphere.addChild(rotatingBox);

        const testBoxes = [];
        const boxConfigs = [
            [-2.5, 0, -2.5, '#ff8888'],
            [2.5, 0, -2.5, '#88ff88'],
            [-2.5, 0, 2.5, '#8888ff'],
            [2.5, 0, 2.5, '#ffaa88']
        ];

        boxConfigs.forEach(([x, y, z, color]) => {
            const box = new RedGPU.Display.Mesh(
                redGPUContext,
                new RedGPU.Primitive.Box(redGPUContext, 0.8, 1.2, 0.8),
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
            );
            box.enableDebugger = true;
            box.setPosition(x, y, z);
            scene.addChild(box);
            testBoxes.push(box);
        });

        const ground = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Ground(redGPUContext, 16, 16),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#dddddd')
        );
        ground.enableDebugger = true;
        ground.setPosition(0, -1.5, 0);
        scene.addChild(ground);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            rotatingBox.rotationX += 0.02;
            rotatingBox.rotationY += 0.015;
            rotatingBox.rotationZ += 0.01;

            centerSphere.rotationY += 0.005;

            testBoxes.forEach((box, index) => {
                box.rotationY += 0.01 * (index + 1);
            });
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, targetView) => {
    const TEST_DATA = {
        debugMode: 'OBB'
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            pane.addBinding(TEST_DATA, 'debugMode', {
                options: {
                    OBB: 'OBB',
                    AABB: 'AABB',
                    BOTH: 'BOTH'
                }
            }).on('change', (evt) => {
                const updateDebugMode = (object, mode) => {
                    if (object.drawDebugger && object.enableDebugger) {
                        object.drawDebugger.debugMode = mode;
                    }
                    if (object.children) {
                        object.children.forEach((child) => updateDebugMode(child, mode));
                    }
                };
                updateDebugMode(targetView.scene, evt.value);
            });

            setDirectionalLightPanel(pane, targetView);
            setPointLightPanel(pane, targetView);
            setSpotLightPanel(pane, targetView);
        }
    });
};

const setSpotLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.spotLights[0];
    const lightFolder = pane.addFolder({title: 'Spot Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    const positionFolder = lightFolder.addFolder({title: 'Position', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis) => {
        positionFolder.addBinding(light, axis.toLowerCase(), { min: -15, max: 15, step: 0.1 });
    });

    const directionFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis) => {
        directionFolder.addBinding(light, `direction${axis}`, { min: -1, max: 1, step: 0.01 });
    });

    lightFolder.addBinding(light, 'radius', { min: 0.1, max: 20, step: 0.1 });
    lightFolder.addBinding(light, 'lumen', { min: 0, max: 1000000, step: 100 });
    lightFolder.addBinding(light, 'innerCutoff', { min: 0, max: 90, step: 0.5 });
    lightFolder.addBinding(light, 'outerCutoff', { min: 0, max: 90, step: 0.5 });

    lightFolder.addBinding(lightConfig, 'color', {
        picker: 'inline',
        view: 'color',
        expanded: false
    }).on('change', (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};

const setPointLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.pointLights[0];
    const lightFolder = pane.addFolder({title: 'Point Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    ['X', 'Y', 'Z'].forEach((axis) => {
        lightFolder.addBinding(light, axis.toLowerCase(), { min: -15, max: 15, step: 0.01 });
    });

    lightFolder.addBinding(light, 'radius', { min: 0.1, max: 20, step: 0.01 });
    lightFolder.addBinding(light, 'lumen', { min: 0, max: 1000000, step: 100 });

    lightFolder.addBinding(lightConfig, 'color', {
        picker: 'inline',
        view: 'color',
        expanded: false
    }).on('change', (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};

const setDirectionalLightPanel = (pane, targetView) => {
    const light = targetView.scene.lightManager.directionalLights[0];
    const lightFolder = pane.addFolder({title: 'Directional Light', expanded: true});
    const lightConfig = {
        color: {r: light.color.r, g: light.color.g, b: light.color.b},
    };

    const directionFolder = lightFolder.addFolder({title: 'Direction', expanded: true});
    ['X', 'Y', 'Z'].forEach((axis) => {
        directionFolder.addBinding(light, `direction${axis}`, { min: -3, max: 3, step: 0.01 });
    });

    lightFolder.addBinding(light, 'lux', { min: 0, max: 100000, step: 100 });

    lightFolder.addBinding(lightConfig, 'color', {
        picker: 'inline',
        view: 'color',
        expanded: false
    }).on('change', (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};
