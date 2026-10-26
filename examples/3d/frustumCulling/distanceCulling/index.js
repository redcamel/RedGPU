import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Distance Culling 예제
 * [EN] Distance Culling example
 *
 * [KO] 카메라와의 거리에 따라 객체를 렌더링에서 제외하는 Distance Culling 기능과 드로우콜 최적화 효과를 시연합니다.
 * [EN] Demonstrates Distance Culling, which excludes objects from rendering based on their distance from the camera.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 1;
        controller.distance = 35;
        controller.tilt = -35;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;

        // [KO] 거리 기반 컬링 활성화 및 임계 거리 설정
        // [EN] Enable distance culling and set threshold distance
        view.useDistanceCulling = true;
        view.distanceCulling = 60;
        redGPUContext.addView(view);

        // [KO] 거리별 색상 구분이 적용된 테스트 메시 군집 생성
        // [EN] Create a grid of test meshes with distance-based color coding
        const meshes = createTestMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, meshes, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createTestMeshes = (redGPUContext, scene) => {
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const materialDefault = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const materialNear = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff3333');
    const materialMid = new RedGPU.Material.ColorMaterial(redGPUContext, '#33ff33');
    const materialFar = new RedGPU.Material.ColorMaterial(redGPUContext, '#3366ff');

    const meshes = [];
    const gridSize = 15;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const distFromOrigin = Math.sqrt(x * x + z * z);
            let material = materialDefault;
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

const renderTestPane = (redGPUContext, meshes, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const cullingFolder = pane.addFolder({title: 'Distance Culling', expanded: true});

            const distanceCullingBinding = cullingFolder.addBinding(view, 'distanceCulling', {
                min: 10,
                max: 150,
                step: 1
            });

            cullingFolder.addBinding(view, 'useDistanceCulling').on('change', (evt) => {
                distanceCullingBinding.disabled = !evt.value;
            });

            cullingFolder.addBinding(meshes[0], 'enableDebugger').on('change', (evt) => {
                meshes.forEach((mesh) => {
                    mesh.enableDebugger = evt.value;
                });
            });

            distanceCullingBinding.disabled = !view.useDistanceCulling;

            const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
            statsFolder.addBinding(view.renderViewStateData.renderResults, 'num3DObjects', {
                readonly: true,
                interval: 100
            });
            statsFolder.addBinding(view.renderViewStateData.renderResults, 'numDrawCalls', {
                readonly: true,
                interval: 100
            });

            const cameraFolder = pane.addFolder({title: 'Camera Presets', expanded: true});
            cameraFolder.addButton({title: 'Reset Camera'}).on('click', () => {
                view.camera.distance = 35;
                view.camera.tilt = -35;
                view.camera.pan = 0;
                pane.refresh();
            });
            cameraFolder.addButton({title: 'Move Close'}).on('click', () => {
                view.camera.distance = 15;
                pane.refresh();
            });
            cameraFolder.addButton({title: 'Move Far'}).on('click', () => {
                view.camera.distance = 90;
                pane.refresh();
            });
        }
    });
};
