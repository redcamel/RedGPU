import * as RedGPU from "../../../../../dist/index.js?t=1768401228425";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        controller.distance = 15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const {mesh1, mesh2, intersectionLabel} = createIntersectionTest(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {

            mesh2.rotationX += 0.3
            mesh2.rotationY += 0.3
            mesh2.rotationZ += 0.3
            mesh2.x = Math.sin(time * 0.001) * 5;
            mesh2.z = Math.cos(time * 0.001) * 3;
            checkAABBIntersection(mesh1, mesh2, intersectionLabel);
        };
        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext, view);

    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        document.body.innerHTML = `<div>오류: ${failReason}</div>`;
    }
);
const renderTestPane = async (redGPUContext, view) => {
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1768401228425");
    setDebugButtons(RedGPU, redGPUContext);

};

function createIntersectionTest(redGPUContext, scene) {
    const material1 = new RedGPU.Material.ColorMaterial(redGPUContext, '#4CAF50');
    const geometry1 = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const mesh1 = new RedGPU.Display.Mesh(redGPUContext, geometry1, material1);
    mesh1.setPosition(-2, 0, 0);
    mesh1.enableDebugger = true;
    mesh1.drawDebugger.debugMode = 'AABB';
    scene.addChild(mesh1);

    const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#2196F3');
    const geometry2 = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh2 = new RedGPU.Display.Mesh(redGPUContext, geometry2, material2);
    mesh2.setPosition(2, 0, 0);
    mesh2.enableDebugger = true;
    mesh2.drawDebugger.debugMode = 'AABB';
    scene.addChild(mesh2);

    const intersectionLabel = new RedGPU.Display.TextField3D(redGPUContext, 'No Intersection');
    intersectionLabel.useBillboard = true;
    intersectionLabel.setPosition(0, 4, 0);
    intersectionLabel.fontSize = 32;
    scene.addChild(intersectionLabel);

    const label1 = new RedGPU.Display.TextField3D(redGPUContext, 'Fixed Mesh');
    label1.useBillboard = true;
    label1.setPosition(0, 2.5, 0);
    label1.color = '#4CAF50';
    mesh1.addChild(label1);

    const label2 = new RedGPU.Display.TextField3D(redGPUContext, 'Moving Mesh');
    label2.useBillboard = true;
    label2.setPosition(0, 2.5, 0);
    label2.color = '#2196F3';
    mesh2.addChild(label2);

    return {mesh1, mesh2, intersectionLabel};
}

function checkAABBIntersection(mesh1, mesh2, label) {
    const aabb1 = mesh1.boundingAABB;
    const aabb2 = mesh2.boundingAABB;

    if (!aabb1 || !aabb2) {
        label.text = 'AABB Calculation Failed';
        label.color = '#FFAA00';
        return;
    }

    const isIntersecting = aabb1.intersects(aabb2);

    if (isIntersecting) {
        label.text = 'INTERSECTION DETECTED!';
        label.color = '#FF5722';
        mesh1.material.color.setColorByHEX('#FF5722');
        mesh2.material.color.setColorByHEX('#FF5722');
    } else {
        label.text = 'No Intersection';
        label.color = '#FFFFFF';
        mesh1.material.color.setColorByHEX('#4CAF50');
        mesh2.material.color.setColorByHEX('#2196F3');
    }
}
