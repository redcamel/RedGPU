import * as RedGPU from "../../../../../dist/index.js?t=1770637396475";

/**
 * [KO] Mesh OBB Intersects 예제
 * [EN] Mesh OBB Intersects example
 *
 * [KO] 두 메시 간의 OBB(Oriented Bounding Box) 충돌 감지를 보여줍니다.
 * [EN] Demonstrates OBB (Oriented Bounding Box) collision detection between two meshes.
 */

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
            mesh2.rotationX += 0.2;
            mesh2.rotationY += 0.2;
            mesh2.rotationZ += 0.2;
            mesh2.x = Math.sin(time * 0.001) * 5;
            mesh2.z = Math.cos(time * 0.001) * 3;
            checkOBBIntersection(mesh1, mesh2, intersectionLabel);
        };
        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        document.body.innerHTML = `<div>오류: ${failReason}</div>`;
    }
);

/**
 * [KO] 테스트용 버튼 패널을 초기화합니다.
 * [EN] Initializes the test button pane.
 */
const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770637396475");
    setDebugButtons(RedGPU, redGPUContext);
};

/**
 * [KO] OBB 교차 테스트를 위한 객체들을 생성하고 배치합니다.
 * [EN] Creates and places objects for OBB intersection testing.
 * 
 * @returns {Object} {mesh1, mesh2, intersectionLabel}
 */
function createIntersectionTest(redGPUContext, scene) {
    // 메시 1 (고정)
    const material1 = new RedGPU.Material.ColorMaterial(redGPUContext, '#4CAF50');
    const geometry1 = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const mesh1 = new RedGPU.Display.Mesh(redGPUContext, geometry1, material1);
    mesh1.setPosition(-2, 0, 0);
    mesh1.enableDebugger = true;
    mesh1.drawDebugger.debugMode = 'OBB';
    scene.addChild(mesh1);

    // 메시 2 (이동 및 회전)
    const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#2196F3');
    const geometry2 = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh2 = new RedGPU.Display.Mesh(redGPUContext, geometry2, material2);
    mesh2.setPosition(2, 0, 0);
    mesh2.enableDebugger = true;
    mesh2.drawDebugger.debugMode = 'OBB';
    scene.addChild(mesh2);

    // 메인 상태 타이틀 (y: 5.0)
    const intersectionLabel = new RedGPU.Display.TextField3D(redGPUContext, 'No Intersection');
    intersectionLabel.setPosition(0, 5, 0);
    intersectionLabel.fontSize = 48;
    intersectionLabel.worldSize = 1.3;
    scene.addChild(intersectionLabel);

    // 개별 객체 라벨 (14px / 0.7)
    const label1 = new RedGPU.Display.TextField3D(redGPUContext, 'Fixed Mesh');
    label1.setPosition(0, 2.5, 0); // H=3 -> y=1.5+1.0
    label1.color = '#4CAF50';
    label1.fontSize = 14;
    label1.worldSize = 0.7;
    mesh1.addChild(label1);

    const label2 = new RedGPU.Display.TextField3D(redGPUContext, 'Moving Mesh');
    label2.setPosition(0, 2.0, 0); // H=2 -> y=1.0+1.0
    label2.color = '#2196F3';
    label2.fontSize = 14;
    label2.worldSize = 0.7;
    mesh2.addChild(label2);

    return {mesh1, mesh2, intersectionLabel};
}

/**
 * [KO] 두 메시의 OBB 교차 여부를 실시간으로 체크하고 시각화합니다.
 * [EN] Real-time check and visualization of OBB intersection between two meshes.
 */
function checkOBBIntersection(mesh1, mesh2, label) {
    const obb1 = mesh1.boundingOBB;
    const obb2 = mesh2.boundingOBB;

    if (!obb1 || !obb2) {
        label.text = 'OBB Calculation Failed';
        label.color = '#FFAA00';
        return;
    }

    const isIntersecting = obb1.intersects(obb2);

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
