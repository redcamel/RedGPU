import * as RedGPU from "../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] Mesh Hierarchy 예제
 * [EN] Mesh Hierarchy example
 *
 * [KO] 메시 간 부모-자식 계층 구조와 변환(위치·회전·크기) 상속을 시연합니다.
 * [EN] Demonstrates parent-child mesh hierarchy and transform (position, rotation, scale) inheritance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const parentMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),
            new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))
        );
        scene.addChild(parentMesh);

        // [KO] 자식 메시를 부모에 추가 - 자식의 위치는 부모의 로컬 좌표계 기준이며 부모의 변환을 상속
        // [EN] Add child mesh to parent - child position is in parent's local space and inherits parent transforms
        const childMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );
        childMesh.setPosition(3, 3, 0);
        parentMesh.addChild(childMesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, parentMesh, childMesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, parentMesh, childMesh) => {
    const addTransformControls = (folder, mesh) => {
        const positionFolder = folder.addFolder({title: 'Position'});
        positionFolder.addBinding(mesh, 'x', {min: -10, max: 10, step: 0.1});
        positionFolder.addBinding(mesh, 'y', {min: -10, max: 10, step: 0.1});
        positionFolder.addBinding(mesh, 'z', {min: -10, max: 10, step: 0.1});

        const rotationFolder = folder.addFolder({title: 'Rotation'});
        rotationFolder.addBinding(mesh, 'rotationX', {min: 0, max: 360, step: 0.1});
        rotationFolder.addBinding(mesh, 'rotationY', {min: 0, max: 360, step: 0.1});
        rotationFolder.addBinding(mesh, 'rotationZ', {min: 0, max: 360, step: 0.1});

        const scaleFolder = folder.addFolder({title: 'Scale'});
        scaleFolder.addBinding(mesh, 'scaleX', {min: 0.1, max: 5, step: 0.1});
        scaleFolder.addBinding(mesh, 'scaleY', {min: 0.1, max: 5, step: 0.1});
        scaleFolder.addBinding(mesh, 'scaleZ', {min: 0.1, max: 5, step: 0.1});
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            addTransformControls(pane.addFolder({title: 'Parent Mesh', expanded: true}), parentMesh);
            addTransformControls(pane.addFolder({title: 'Child Mesh', expanded: true}), childMesh);
        }
    });
};
