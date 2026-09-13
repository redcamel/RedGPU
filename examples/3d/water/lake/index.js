import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] WaterBodyLake & SingleLayerWaterMaterial Step 0 예제
 * [EN] WaterBodyLake & SingleLayerWaterMaterial Step 0 Example
 *
 * [KO] 가장 단순한 수준(MVP)의 정적 반투명 수면 평면 렌더링 및 수위/투명도 제어를 검증합니다.
 * [EN] Verifies the simplest level (MVP) static translucent water plane rendering and water level/opacity control.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (수면 위/아래를 자유롭게 탐색)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 25;
        controller.tilt = 30;
        controller.pan = 45;
        controller.speedDistance = 0.2;

        // 2. 씬 및 뷰3D 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 조명 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.x = 20;
        directionalLight.y = 30;
        directionalLight.z = 20;
        directionalLight.intensity = 1.2;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. 물밑 환경 및 수면 관통 오브젝트 구성 (반투명 수면 투과 검증용)
        const underwaterObjects = createUnderwaterEnvironment(redGPUContext, scene);

        // 5. WaterBodyLake 호수 수체 생성 (Step 0: 단색 반투명 평면)
        const lake = new RedGPU.Display.Water.WaterBodyLake(
            redGPUContext,
            30, // 가로 너비 (waterWidth)
            30, // 세로 길이 (waterHeight)
            1,
            1
        );
        lake.waterLevel = 0.5; // 수위 높이
        scene.addChild(lake);

        // 6. 렌더러 생성 및 렌더 루프 가동
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // 물밑 오브젝트 천천히 회전 (동적 시각 검증)
            const count = underwaterObjects.length;
            for (let i = 0; i < count; i++) {
                underwaterObjects[i].rotationY += 0.5;
            }
        };
        renderer.start(redGPUContext, render);

        // 7. 실시간 튜닝 GUI 패널
        renderTestPane(redGPUContext, lake);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 수면 아래 및 수면을 관통하는 테스트 지형/오브젝트들을 생성합니다.
 * [EN] Creates test terrain/objects beneath and piercing through the water surface.
 */
function createUnderwaterEnvironment(redGPUContext, scene) {
    const objects = [];

    // 바닥 지반 (Lake Basin Bottom)
    const basinMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#2a3b2a');
    const basinGeometry = new RedGPU.Primitive.Box(redGPUContext, 32, 2, 32);
    const basinMesh = new RedGPU.Display.Mesh(redGPUContext, basinGeometry, basinMaterial);
    basinMesh.y = -2;
    scene.addChild(basinMesh);

    // 수면을 관통하여 솟아오른 바위/기둥들 (Piercing Rocks & Pillars)
    const colors = ['#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#f1c40f', '#1abc9c'];
    const positions = [
        [-6, 0, -6],
        [6, 0.5, -4],
        [-4, 1.2, 5],
        [5, -0.2, 6],
        [0, 0.8, 0],
        [-8, -0.5, 2]
    ];

    for (let i = 0; i < positions.length; i++) {
        const [x, y, z] = positions[i];
        const mat = new RedGPU.Material.ColorMaterial(redGPUContext, colors[i % colors.length]);
        const geom = (i % 2 === 0)
            ? new RedGPU.Primitive.Box(redGPUContext, 2.5, 4, 2.5)
            : new RedGPU.Primitive.Sphere(redGPUContext, 1.8, 16, 16);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geom, mat);
        mesh.x = x;
        mesh.y = y;
        mesh.z = z;
        scene.addChild(mesh);
        objects.push(mesh);
    }

    return objects;
}

/**
 * [KO] WaterBodyLake 실시간 속성 제어를 위한 Tweakpane GUI를 구성합니다.
 * [EN] Configures Tweakpane GUI for real-time control of WaterBodyLake properties.
 */
function renderTestPane(redGPUContext, lake) {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const waterFolder = pane.addFolder({title: 'WaterBodyLake (Step 0)', expanded: true});

            // 호수 수위 (Water Level / Y 좌표)
            waterFolder.addBinding(lake, 'waterLevel', {
                min: -3,
                max: 4,
                step: 0.05,
                label: 'Water Level (Y)'
            });

            // 수면 투명도 (Opacity)
            waterFolder.addBinding(lake.waterMaterial, 'opacity', {
                min: 0.0,
                max: 1.0,
                step: 0.02,
                label: 'Opacity'
            });

            // 수면 컬러 (Color Picker)
            const colorParams = {
                color: {
                    r: lake.waterMaterial.color.r,
                    g: lake.waterMaterial.color.g,
                    b: lake.waterMaterial.color.b
                }
            };

            waterFolder.addBinding(colorParams, 'color', {
                view: 'color',
                label: 'Water Color'
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            // 빠른 수면 프리셋 버튼
            const presetFolder = waterFolder.addFolder({title: 'Color Presets', expanded: false});
            presetFolder.addButton({title: 'Calm Alpine Lake (#1a5b8c)'}).on('click', () => {
                lake.waterMaterial.color.setColorByHEX('#1a5b8c');
                lake.waterMaterial.opacity = 0.65;
                pane.refresh();
            });
            presetFolder.addButton({title: 'Tropical Emerald Lagoon (#16a085)'}).on('click', () => {
                lake.waterMaterial.color.setColorByHEX('#16a085');
                lake.waterMaterial.opacity = 0.55;
                pane.refresh();
            });
            presetFolder.addButton({title: 'Deep Mystic Blue (#0d2040)'}).on('click', () => {
                lake.waterMaterial.color.setColorByHEX('#0d2040');
                lake.waterMaterial.opacity = 0.85;
                pane.refresh();
            });

            // 렌더 상태 폴더
            const renderStateFolder = pane.addFolder({title: 'Render States', expanded: false});
            renderStateFolder.addBinding(lake.depthStencilState, 'depthWriteEnabled', {
                label: 'Depth Write'
            });
        }
    });
}
