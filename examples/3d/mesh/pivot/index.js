import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Mesh Pivot 예제
 * [EN] Mesh Pivot example
 *
 * [KO] 피벗(pivotX/Y/Z)으로 메시의 회전 중심을 변경하고, 부모-자식 계층에서의 동작을 시연합니다.
 * [EN] Demonstrates changing a mesh's rotation center via pivot (pivotX/Y/Z) within a parent-child hierarchy.
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

        const childMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
        );
        childMesh.setPosition(3, 3, 0);
        parentMesh.addChild(childMesh);

        const parentPivotMarker = createPivotMarker(redGPUContext, parentMesh);
        const childPivotMarker = createPivotMarker(redGPUContext, childMesh);

        const animationConfig = {
            isParentRotating: true,
            isChildRotating: true,
            rotationSpeed: 0.5
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const rotationSpeed = animationConfig.rotationSpeed;
            if (animationConfig.isParentRotating) {
                parentMesh.rotationX += rotationSpeed;
                parentMesh.rotationY += rotationSpeed;
                parentMesh.rotationZ += rotationSpeed;
            }
            if (animationConfig.isChildRotating) {
                childMesh.rotationX += rotationSpeed * 2;
                childMesh.rotationY += rotationSpeed * 2;
                childMesh.rotationZ += rotationSpeed * 2;
            }

            // [KO] 마커를 현재 피벗 위치에 동기화하여 회전 중심을 시각화
            // [EN] Sync markers to the current pivot to visualize the rotation center
            parentPivotMarker.setPosition(parentMesh.pivotX, parentMesh.pivotY, parentMesh.pivotZ);
            childPivotMarker.setPosition(childMesh.pivotX, childMesh.pivotY, childMesh.pivotZ);
        });

        renderTestPane(redGPUContext, parentMesh, childMesh, animationConfig);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPivotMarker = (redGPUContext, targetMesh) => {
    const marker = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.1, 8, 8),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00')
    );
    marker.depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;
    targetMesh.addChild(marker);
    return marker;
};

const renderTestPane = (redGPUContext, parentMesh, childMesh, animationConfig) => {
    const addPivotControls = (folder, mesh, rotatingKey) => {
        folder.addBinding(animationConfig, rotatingKey);
        folder.addBinding(mesh, 'pivotX', {min: -2, max: 2, step: 0.1});
        folder.addBinding(mesh, 'pivotY', {min: -2, max: 2, step: 0.1});
        folder.addBinding(mesh, 'pivotZ', {min: -2, max: 2, step: 0.1});
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            addPivotControls(pane.addFolder({title: 'Parent Pivot', expanded: true}), parentMesh, 'isParentRotating');
            addPivotControls(pane.addFolder({title: 'Child Pivot', expanded: true}), childMesh, 'isChildRotating');
        }
    });
};
