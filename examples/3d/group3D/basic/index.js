import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Group3D Basic 예제
 * [EN] Group3D Basic example
 *
 * [KO] Group3D로 3D 객체를 묶고, 계층 구조(Group3D → Mesh → Mesh)를 따라 변환이 전파되는 과정을 시연합니다.
 * [EN] Demonstrates grouping 3D objects with Group3D and transform propagation through the hierarchy (Group3D → Mesh → Mesh).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff');
        scene.lightManager.addDirectionalLight(light);

        // [KO] Group3D: 지오메트리·재질 없이 자식들의 변환만 묶어서 전파하는 컨테이너
        // [EN] Group3D: a container without geometry/material that only groups and propagates transforms to children
        const rootGroup = new RedGPU.Display.Group3D();
        scene.addChild(rootGroup);

        const parentMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        parentMaterial.baseColorFactor = [0.2, 0.6, 1.0, 1.0];
        const parentMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), parentMaterial);
        rootGroup.addChild(parentMesh);

        const childMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        childMaterial.baseColorFactor = [1.0, 0.4, 0.4, 1.0];
        const childMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext, 0.5, 0.5, 0.5), childMaterial);
        childMesh.setPosition(1.5, 1.5, 0);
        parentMesh.addChild(childMesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, rootGroup, parentMesh, childMesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, rootGroup, parentMesh, childMesh) => {
    const addTransformControls = (folder, target) => {
        const positionFolder = folder.addFolder({title: 'Position'});
        positionFolder.addBinding(target, 'x', {min: -5, max: 5, step: 0.1});
        positionFolder.addBinding(target, 'y', {min: -5, max: 5, step: 0.1});
        positionFolder.addBinding(target, 'z', {min: -5, max: 5, step: 0.1});

        const rotationFolder = folder.addFolder({title: 'Rotation'});
        rotationFolder.addBinding(target, 'rotationX', {min: 0, max: 360, step: 1});
        rotationFolder.addBinding(target, 'rotationY', {min: 0, max: 360, step: 1});
        rotationFolder.addBinding(target, 'rotationZ', {min: 0, max: 360, step: 1});

        const scaleFolder = folder.addFolder({title: 'Scale'});
        scaleFolder.addBinding(target, 'scaleX', {min: 0.1, max: 3, step: 0.1});
        scaleFolder.addBinding(target, 'scaleY', {min: 0.1, max: 3, step: 0.1});
        scaleFolder.addBinding(target, 'scaleZ', {min: 0.1, max: 3, step: 0.1});
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            addTransformControls(pane.addFolder({title: 'Root Group3D', expanded: true}), rootGroup);
            addTransformControls(pane.addFolder({title: 'Parent Mesh', expanded: true}), parentMesh);
            addTransformControls(pane.addFolder({title: 'Child Mesh', expanded: true}), childMesh);
        }
    });
};
