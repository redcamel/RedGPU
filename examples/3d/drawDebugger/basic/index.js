import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

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
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.minDistance = 3;
        controller.maxDistance = 50;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 다양한 조명 생성 및 디버거 활성화
        // [EN] Create Various Lights and Enable Debuggers
        
        // [KO] 방향성 조명 (Directional Light)
        // [EN] Directional Light
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.color.setColorByRGB(255, 255, 220);
        directionalLight.lux = 1000;
        directionalLight.direction = [-0.4, -1, -0.3];
        directionalLight.enableDebugger = true;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 점 조명 (Point Light)
        // [EN] Point Light
        const pointLight = new RedGPU.Light.PointLight();
        pointLight.color.setColorByRGB(255, 120, 120);
        pointLight.lumen = 500000;
        pointLight.radius = 8.0;
        pointLight.setPosition(-6, 4, 2);
        pointLight.enableDebugger = true;
        scene.lightManager.addPointLight(pointLight);

        // [KO] 스포트 조명 (Spot Light)
        // [EN] Spot Light
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

        // 4. [KO] 테스트용 메시 및 계층 구조 생성
        // [EN] Create Test Meshes and Hierarchy
        
        // [KO] 중앙 구체 (부모 객체)
        // [EN] Center Sphere (Parent object)
        const centerSphere = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 32, 32),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff')
        );
        centerSphere.enableDebugger = true;
        centerSphere.setPosition(0, 0, 0);
        scene.addChild(centerSphere);

        // [KO] 회전하는 박스 (자식 객체)
        // [EN] Rotating Box (Child object)
        const rotatingBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 0.8, 0.8, 0.8),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ffff88')
        );
        rotatingBox.enableDebugger = true;
        rotatingBox.setPosition(2.5, 1.5, 0);
        centerSphere.addChild(rotatingBox);

        // [KO] 주변 박스 군집
        // [EN] Surrounding Box Swarm
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

        // [KO] 바닥 메시 (Ground)
        // [EN] Ground Mesh
        const ground = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Ground(redGPUContext, 16, 16),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#dddddd')
        );
        ground.enableDebugger = true;
        ground.setPosition(0, -1.5, 0);
        scene.addChild(ground);

        // 5. [KO] 렌더러 생성 및 애니메이션 루프 시작
        // [EN] Create Renderer and Start Animation Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            rotatingBox.rotationX += 0.02;
            rotatingBox.rotationY += 0.015;
            rotatingBox.rotationZ += 0.01;

            centerSphere.rotationY += 0.005;

            testBoxes.forEach((box, index) => {
                box.rotationY += 0.01 * (index + 1);
            });
        };
        renderer.start(redGPUContext, render);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, view);

    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = (redGPUContext, targetView) => {
    // [KO] IBL 및 스카이박스 설정
    // [EN] Setup IBL and SkyBox
    const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 8000);
    targetView.ibl = ibl;
    targetView.skybox = skybox;

    const TEST_DATA = {
        volumeType: 'OBB'
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 전역 디버그 볼륨 타입 설정
            // [EN] Global Debug Volume Type Setting
            pane.addBinding(TEST_DATA, 'volumeType', {
                label: 'Mesh Volume Type',
                options: {
                    'OBB': 'OBB',
                    'AABB': 'AABB',
                    'BOTH': 'BOTH'
                }
            }).on('change', (evt) => {
                /**
                 * [KO] 재귀적으로 모든 메시의 디버그 모드를 업데이트합니다.
                 * [EN] Recursively updates the debug mode of all meshes.
                 */
                const updateDebugMode = (object, mode) => {
                    if (object.drawDebugger && object.enableDebugger) {
                        object.drawDebugger.debugMode = mode;
                    }
                    if (object.children) {
                        object.children.forEach(child => updateDebugMode(child, mode));
                    }
                };
                updateDebugMode(targetView.scene, evt.value);
            });

            // [KO] 조명별 상세 제어 패널 추가
            // [EN] Add detailed control panels for each light
            setDirectionalLightPanel(pane, targetView)
            setPointLightPanel(pane, targetView)
            setSpotLightPanel(pane, targetView)
        }
    });
};

/**
 * [KO] 스포트 조명 제어 패널을 생성합니다.
 * [EN] Creates Spot Light control panel.
 */
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

    lightFolder.addBinding(lightConfig, "color", { picker: "inline", view: "color", expanded: false }).on("change", (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};

/**
 * [KO] 점 조명 제어 패널을 생성합니다.
 * [EN] Creates Point Light control panel.
 */
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

    lightFolder.addBinding(lightConfig, "color", { picker: "inline", view: "color", expanded: false }).on("change", (ev) => {
        const {r, g, b} = ev.value;
        light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
    });

    lightFolder.addBinding(light, 'enableDebugger');
};

/**
 * [KO] 방향성 조명 제어 패널을 생성합니다.
 * [EN] Creates Directional Light control panel.
 */
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

    lightFolder.addBinding(lightConfig, "color", {picker: "inline", view: "color", expanded: false})
        .on("change", (ev) => {
            const {r, g, b} = ev.value;
            light.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
        });

    lightFolder.addBinding(light, 'enableDebugger');
}
