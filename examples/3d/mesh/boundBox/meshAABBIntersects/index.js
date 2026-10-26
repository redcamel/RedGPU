import * as RedGPU from "../../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Mesh AABB Intersects 예제
 * [EN] Mesh AABB Intersects example
 *
 * [KO] boundingAABB.intersects()로 두 메시 간 AABB(Axis-Aligned Bounding Box) 충돌을 실시간으로 감지합니다.
 * [EN] Detects AABB (Axis-Aligned Bounding Box) collision between two meshes in real-time via boundingAABB.intersects().
 */

const COLOR_FIXED = '#4CAF50';
const COLOR_MOVING = '#2196F3';
const COLOR_HIT = '#FF5722';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const fixedMesh = createTestMesh(redGPUContext, scene, 3, COLOR_FIXED, -2, 'Fixed Mesh', 2.5);
        const movingMesh = createTestMesh(redGPUContext, scene, 2, COLOR_MOVING, 2, 'Moving Mesh', 2.0);

        const statusLabel = new RedGPU.Display.TextField3D(redGPUContext, 'No Intersection');
        statusLabel.setPosition(0, 5, 0);
        statusLabel.fontSize = 48;
        statusLabel.worldSize = 1.3;
        scene.addChild(statusLabel);

        let wasIntersecting = false;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            movingMesh.rotationX += 0.3;
            movingMesh.rotationY += 0.3;
            movingMesh.rotationZ += 0.3;
            movingMesh.x = Math.sin(time * 0.001) * 5;
            movingMesh.z = Math.cos(time * 0.001) * 3;

            // [KO] 월드 공간 AABB 간 교차 판정 (상태가 바뀔 때만 시각 피드백 갱신)
            // [EN] Test world-space AABB intersection (update visual feedback only on state change)
            const isIntersecting = fixedMesh.boundingAABB.intersects(movingMesh.boundingAABB);
            if (isIntersecting !== wasIntersecting) {
                wasIntersecting = isIntersecting;
                statusLabel.text = isIntersecting ? 'INTERSECTION DETECTED!' : 'No Intersection';
                statusLabel.color = isIntersecting ? COLOR_HIT : '#FFFFFF';
                fixedMesh.material.color.setColorByHEX(isIntersecting ? COLOR_HIT : COLOR_FIXED);
                movingMesh.material.color.setColorByHEX(isIntersecting ? COLOR_HIT : COLOR_MOVING);
            }
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createTestMesh = (redGPUContext, scene, size, color, x, text, labelY) => {
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, size, size, size),
        new RedGPU.Material.ColorMaterial(redGPUContext, color)
    );
    mesh.setPosition(x, 0, 0);
    mesh.enableDebugger = true;
    mesh.drawDebugger.debugMode = 'AABB';
    scene.addChild(mesh);

    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.setPosition(0, labelY, 0);
    label.color = color;
    label.fontSize = 14;
    label.worldSize = 0.7;
    mesh.addChild(label);

    return mesh;
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
