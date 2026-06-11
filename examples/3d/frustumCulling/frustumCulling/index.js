import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Frustum Culling 예제
 * [EN] Frustum Culling example
 *
 * [KO] 카메라의 가시 범위(Frustum) 외부에 있는 객체를 렌더링에서 자동으로 제외하는 기능을 시연합니다.
 * [EN] Demonstrates the Frustum Culling feature, which automatically excludes objects outside the camera's view frustum from rendering.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        controller.distance = 20;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 대규모 메시 군집 생성
        // [EN] Create Large Mesh Swarm
        const meshes = createTestMeshes(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, meshes, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트를 위해 격자 형태로 수많은 메시를 생성합니다.
 * [EN] Creates numerous meshes in a grid pattern for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<RedGPU.Display.Mesh>}
 */
const createTestMeshes = (redGPUContext, scene) => {
    // [KO] 지오메트리와 기본 재질을 공유하여 생성 효율성 증대
    // [EN] Share geometry and base material to increase creation efficiency
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const materialDefault = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );

    const meshes = [];
    const gridSize = 30;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, materialDefault);

            mesh.setPosition(x * 15, 0, z * 15);
            mesh.setScale(2);

            // [KO] 중심점(0, 0)에 있는 객체는 빨간색으로 표시
            // [EN] Highlight the center object (0, 0) in red
            if (x === 0 && z === 0) {
                mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
            }

            mesh.setRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            scene.addChild(mesh);
            meshes.push(mesh);
        }
    }

    return meshes;
};

/**
 * [KO] 프러스텀 컬링 확인 및 통계 표시를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for checking frustum culling and displaying statistics.
 */
const renderTestPane = (redGPUContext, meshes, view) => {
    const config = {
        showBoundingBoxes: false,
        drawCalls: meshes.length,
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 컬링 시각화 설정
            // [EN] Culling Visualization Settings
            const cullingFolder = pane.addFolder({title: 'Frustum Culling', expanded: true});
            cullingFolder.addBinding(config, 'showBoundingBoxes', {
                label: 'Show BoundingBoxes'
            }).on('change', (evt) => {
                meshes.forEach(mesh => {
                    mesh.enableDebugger = evt.value;
                });
            });

            // [KO] 렌더링 통계 (컬링 결과 확인)
            // [EN] Rendering Statistics (Verify culling results)
            const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
            const drawCallsBinding = statsFolder.addBinding(config, 'drawCalls', {
                readonly: true,
                label: 'Active DrawCalls'
            });

            // [KO] 매 프레임 실제 그려지는 드로우콜 수를 모니터링
            // [EN] Monitor the actual number of draw calls per frame
            const updateStats = () => {
                config.drawCalls = view.renderViewStateData.renderResults.numDrawCalls;
                drawCallsBinding.refresh();
                requestAnimationFrame(updateStats);
            };
            updateStats();

            // [KO] 시점 조작 유틸리티
            // [EN] View Manipulation Utilities
            const utilsFolder = pane.addFolder({title: 'Utils', expanded: true});
            utilsFolder.addButton({title: 'Reset Camera'}).on('click', () => {
                view.camera.distance = 20;
                view.camera.tilt = 0;
                view.camera.pan = 0;
                pane.refresh();
            });

            utilsFolder.addButton({title: 'Move to Corner (Low Angle)'}).on('click', () => {
                view.camera.distance = 15;
                view.camera.pan = 45;
                view.camera.tilt = -30;
                pane.refresh();
            });

            utilsFolder.addButton({title: 'Move Out (High Angle)'}).on('click', () => {
                view.camera.distance = 300;
                view.camera.pan = 45;
                view.camera.tilt = -30;
                pane.refresh();
            });
        }
    });
};
