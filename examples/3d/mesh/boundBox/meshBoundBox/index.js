import * as RedGPU from "../../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Mesh Bounding Box 예제
 * [EN] Mesh Bounding Box example
 *
 * [KO] drawDebugger.debugMode로 메시의 바운딩 박스(OBB, AABB, BOTH)와 계층 구조의 결합 바운딩 박스(COMBINED_AABB)를 시각화합니다.
 * [EN] Visualizes mesh bounding boxes (OBB, AABB, BOTH) and hierarchy-combined bounds (COMBINED_AABB) via drawDebugger.debugMode.
 */

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

        const {parentMesh, childMesh} = createCombinedBoundingTest(redGPUContext, scene, 4);
        const rowMeshes = createBoundingTestRow(redGPUContext, scene, -4);
        const rotatingMeshes = [parentMesh, ...rowMeshes];

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 회전에 따라 OBB는 메시와 함께 회전하고, AABB는 축 정렬을 유지한 채 크기가 변함
            // [EN] As meshes rotate, OBB rotates with the mesh while AABB stays axis-aligned and resizes
            for (let i = 0, len = rotatingMeshes.length; i < len; i++) {
                const mesh = rotatingMeshes[i];
                mesh.rotationX += 0.2;
                mesh.rotationY += 0.2;
                mesh.rotationZ += 0.2;
            }
            childMesh.rotationX += 1;
            childMesh.rotationY += 1;
            childMesh.rotationZ += 1;
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

const createSampleMesh = (redGPUContext, color = '#dfa9e6') => new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
    new RedGPU.Material.ColorMaterial(redGPUContext, color)
);

const createLabel = (redGPUContext, scene, text, x, y, z, fontSize, worldSize) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.setPosition(x, y, z);
    label.fontSize = fontSize;
    label.worldSize = worldSize;
    scene.addChild(label);
};

const createBoundingTestRow = (redGPUContext, scene, zOffset) => {
    const GAP = 4.5;

    // [KO] 단일 메시 바운딩 박스 디버그 모드 비교 (OBB / AABB / BOTH)
    // [EN] Compare single-mesh bounding box debug modes (OBB / AABB / BOTH)
    const items = [
        {x: -GAP, debugMode: 'OBB', text: 'BoundingOBB'},
        {x: 0, debugMode: 'AABB', text: 'BoundingAABB'},
        {x: GAP, debugMode: 'BOTH', text: 'BOTH'},
    ];

    return items.map(({x, debugMode, text}) => {
        const mesh = createSampleMesh(redGPUContext);
        mesh.setPosition(x, 0, zOffset);
        mesh.enableDebugger = true;
        mesh.drawDebugger.debugMode = debugMode;
        scene.addChild(mesh);

        createLabel(redGPUContext, scene, text, x, 2.0, zOffset, 14, 0.7);
        return mesh;
    });
};

const createCombinedBoundingTest = (redGPUContext, scene, zOffset) => {
    const parentMesh = createSampleMesh(redGPUContext);
    parentMesh.setPosition(0, 0, zOffset);
    scene.addChild(parentMesh);

    const childMesh = createSampleMesh(redGPUContext, '#ff0000');
    childMesh.x = 2.5;
    childMesh.setScale(0.5);
    parentMesh.addChild(childMesh);

    // [KO] COMBINED_AABB: 부모와 모든 자식을 감싸는 통합 AABB 표시
    // [EN] COMBINED_AABB: shows a single AABB enclosing the parent and all of its children
    parentMesh.enableDebugger = true;
    parentMesh.drawDebugger.debugMode = 'COMBINED_AABB';

    createLabel(redGPUContext, scene, 'combinedBoundingAABB', 0, -2.5, zOffset, 32, 1.0);
    return {parentMesh, childMesh};
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
