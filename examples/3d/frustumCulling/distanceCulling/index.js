import * as RedGPU from "../../../../dist/index.js?t=1784264152422";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264152422";

/**
 * [KO] Distance Culling 예제
 * [EN] Distance Culling example
 *
 * [KO] 카메라와의 거리에 따라 객체를 렌더링에서 제외하는 Distance Culling 기능을 시연합니다.
 * [EN] Demonstrates the Distance Culling feature, which excludes objects from rendering based on their distance from the camera.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        controller.distance = 10;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        
        // [KO] Distance Culling 활성화 및 거리 설정
        // [EN] Enable Distance Culling and set distance
        view.useDistanceCulling = true
        view.distanceCulling = 75
        
        redGPUContext.addView(view);

        // 3. [KO] 테스트용 메시 군집 생성
        // [EN] Create Test Mesh Swarm
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
 * [KO] 수많은 테스트 메시들을 생성하여 씬에 배치합니다.
 * [EN] Creates numerous test meshes and places them in the scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<RedGPU.Display.Mesh>}
 */
const createTestMeshes = (redGPUContext, scene) => {
    // [KO] 성능 최적화를 위해 지오메트리와 공통 재질을 미리 생성하여 공유
    // [EN] Pre-create and share geometry and common materials for performance optimization
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const materialDefault = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );

    // [KO] 거리별 구분을 위한 색상 재질들
    // [EN] Color materials for distance-based differentiation
    const materialNear = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const materialMid = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');
    const materialFar = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');

    const meshes = [];
    const gridSize = 15;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            let material = materialDefault;
            const distFromOrigin = Math.sqrt(x * x + z * z);
            
            if (distFromOrigin < 3) material = materialNear;
            else if (distFromOrigin < 8) material = materialMid;
            else if (distFromOrigin < 12) material = materialFar;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            mesh.setPosition(x * 5, 0, z * 5);
            mesh.setRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            
            scene.addChild(mesh);
            meshes.push(mesh);
        }
    }

    return meshes;
};

/**
 * [KO] 실시간 컬링 제어 및 통계 표시를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time culling control and statistics display.
 */
const renderTestPane = (redGPUContext, meshes, view) => {
    const config = {
        enableDistanceCulling: view.useDistanceCulling,
        cullingDistance: view.distanceCulling,
        showBoundingBoxes: false,
        drawCalls: meshes.length,
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 컬링 설정
            // [EN] Culling Settings
            const cullingFolder = pane.addFolder({title: 'Distance Culling', expanded: true});
            cullingFolder.addBinding(config, 'enableDistanceCulling', {
                label: 'Enabled'
            }).on('change', (evt) => {
                view.useDistanceCulling = evt.value;
            });
            cullingFolder.addBinding(config, 'cullingDistance', {
                min: 5, max: 200, step: 1,
                label: 'Culling Distance'
            }).on('change', (evt) => {
                view.distanceCulling = evt.value;
            });
            cullingFolder.addBinding(config, 'showBoundingBoxes', {
                label: 'Show BoundingBoxes'
            }).on('change', (evt) => {
                meshes.forEach(mesh => {
                    mesh.enableDebugger = evt.value;
                });
            });

            // [KO] 렌더링 통계
            // [EN] Rendering Statistics
            const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
            statsFolder.addBinding(view.renderViewStateData.renderResults, 'numDrawCalls', {
                readonly: true,
                interval: 100,
                label: 'Current DrawCalls'
            });

            // [KO] 카메라 유틸리티
            // [EN] Camera Utilities
            const utilsFolder = pane.addFolder({title: 'Utils', expanded: true});
            utilsFolder.addButton({title: 'Reset Camera'}).on('click', () => {
                view.camera.distance = 50;
                view.camera.tilt = 0;
                view.camera.pan = 0;
                pane.refresh();
            });

            utilsFolder.addButton({title: 'Move Close'}).on('click', () => {
                view.camera.distance = 20;
                pane.refresh();
            });

            utilsFolder.addButton({title: 'Move Far'}).on('click', () => {
                view.camera.distance = 100;
                pane.refresh();
            });
        }
    });
};
