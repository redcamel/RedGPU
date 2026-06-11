import * as RedGPU from "../../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Mesh OBB Intersects 예제
 * [EN] Mesh OBB Intersects example
 *
 * [KO] 두 메시 간의 OBB(Oriented Bounding Box) 충돌 감지를 시연합니다.
 * [EN] Demonstrates OBB (Oriented Bounding Box) collision detection between two meshes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정 [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        controller.distance = 15;

        // 2. [KO] 씬 및 뷰 구성 [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 충돌 테스트용 객체 생성 [EN] Create Objects for Collision Test
        const {mesh1, mesh2, intersectionLabel} = createIntersectionTest(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작 [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 애니메이션 로직 [EN] Animation logic
            mesh2.rotationX += 0.2;
            mesh2.rotationY += 0.2;
            mesh2.rotationZ += 0.2;
            mesh2.x = Math.sin(time * 0.001) * 5;
            mesh2.z = Math.cos(time * 0.001) * 3;

            // [KO] 실시간 OBB 충돌 체크 [EN] Real-time OBB collision check
            checkOBBIntersection(mesh1, mesh2, intersectionLabel);
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링 [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        document.body.innerHTML = `<div>Error: ${failReason}</div>`;
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};

/**
 * [KO] OBB 교차 테스트를 위한 객체들을 생성하고 배치합니다.
 * [EN] Creates and places objects for OBB intersection testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Object} {mesh1, mesh2, intersectionLabel}
 */
function createIntersectionTest(redGPUContext, scene) {
    // [KO] 메시 1 (고정) [EN] Mesh 1 (Fixed)
    const material1 = new RedGPU.Material.ColorMaterial(redGPUContext, '#4CAF50');
    const geometry1 = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const mesh1 = new RedGPU.Display.Mesh(redGPUContext, geometry1, material1);
    mesh1.setPosition(-2, 0, 0);
    mesh1.enableDebugger = true;
    mesh1.drawDebugger.debugMode = 'OBB';
    scene.addChild(mesh1);

    // [KO] 메시 2 (이동 및 회전) [EN] Mesh 2 (Moving & Rotating)
    const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#2196F3');
    const geometry2 = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh2 = new RedGPU.Display.Mesh(redGPUContext, geometry2, material2);
    mesh2.setPosition(2, 0, 0);
    mesh2.enableDebugger = true;
    mesh2.drawDebugger.debugMode = 'OBB';
    scene.addChild(mesh2);

    // [KO] 상태 표시용 라벨 [EN] Status Display Label
    const intersectionLabel = new RedGPU.Display.TextField3D(redGPUContext, 'No Intersection');
    intersectionLabel.setPosition(0, 5, 0);
    intersectionLabel.fontSize = 48;
    intersectionLabel.worldSize = 1.3;
    scene.addChild(intersectionLabel);

    // [KO] 개별 객체 라벨 [EN] Individual Object Labels
    const label1 = new RedGPU.Display.TextField3D(redGPUContext, 'Fixed Mesh');
    label1.setPosition(0, 2.5, 0);
    label1.color = '#4CAF50';
    label1.fontSize = 14;
    label1.worldSize = 0.7;
    mesh1.addChild(label1);

    const label2 = new RedGPU.Display.TextField3D(redGPUContext, 'Moving Mesh');
    label2.setPosition(0, 2.0, 0);
    label2.color = '#2196F3';
    label2.fontSize = 14;
    label2.worldSize = 0.7;
    mesh2.addChild(label2);

    return {mesh1, mesh2, intersectionLabel};
}

/**
 * [KO] 두 메시의 OBB 교차 여부를 실시간으로 체크하고 시각화합니다.
 * [EN] Real-time check and visualization of OBB intersection between two meshes.
 * @param {RedGPU.Display.Mesh} mesh1
 * @param {RedGPU.Display.Mesh} mesh2
 * @param {RedGPU.Display.TextField3D} label
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
