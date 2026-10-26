import * as RedGPU from "../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] Frustum Culling 예제
 * [EN] Frustum Culling example
 *
 * [KO] 카메라의 절두체(Frustum) 외부에 있는 객체를 렌더링에서 제외하는 Frustum Culling 기능과 드로우콜 최적화 효과를 시연합니다.
 * [EN] Demonstrates Frustum Culling, which excludes objects outside the camera's view frustum from rendering to optimize draw calls.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 2;
        controller.distance = 20;
        controller.tilt = -25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 그리드 격자(-50 ~ +50)에 맞춘 테스트 메시 군집 생성
        // [EN] Create a grid-aligned mesh array (-50 to +50) for frustum culling verification
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
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
    const materialDefault = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const materialCenter = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

    const meshes = [];
    const gridCount = 15;
    const spacing = 5;

    for (let x = -gridCount; x <= gridCount; x++) {
        for (let z = -gridCount; z <= gridCount; z++) {
            const material = (x === 0 && z === 0) ? materialCenter : materialDefault;
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            mesh.setPosition(x * spacing, 0, z * spacing);
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
            const cullingFolder = pane.addFolder({title: 'Frustum Culling', expanded: true});
            cullingFolder.addBinding(view, 'useFrustumCulling');
            cullingFolder.addBinding(view.rawCamera, 'fieldOfView', {min: 20, max: 120, step: 1});
            cullingFolder.addBinding(meshes[0], 'enableDebugger').on('change', (evt) => {
                meshes.forEach((mesh) => {
                    mesh.enableDebugger = evt.value;
                });
            });

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
                view.camera.distance = 20;
                view.camera.tilt = -25;
                view.camera.pan = 0;
                view.rawCamera.fieldOfView = 60;
                pane.refresh();
            });
            cameraFolder.addButton({title: 'Close View (Low Angle)'}).on('click', () => {
                view.camera.distance = 10;
                view.camera.pan = 45;
                view.camera.tilt = -15;
                pane.refresh();
            });
            cameraFolder.addButton({title: 'Wide View (High Angle)'}).on('click', () => {
                view.camera.distance = 80;
                view.camera.pan = 45;
                view.camera.tilt = -45;
                pane.refresh();
            });
        }
    });
};
