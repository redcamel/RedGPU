import * as RedGPU from "../../../../../dist/index.js?t=1770625511985";

/**
 * [KO] Mesh Bounding Box 예제
 * [EN] Mesh Bounding Box example
 *
 * [KO] 메시의 바운딩 박스(AABB, OBB)를 시각화하는 방법을 보여줍니다.
 * [EN] Demonstrates how to visualize mesh bounding boxes (AABB, OBB).
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

        // [KO] 결합 바운딩 박스 테스트 (Combined) - 앞으로 배치
        // [EN] Combined bounding box test - Placed in front
        createCombinedBoundingTest(redGPUContext, scene, 4);

        // [KO] 단일 바운딩 박스 테스트 (OBB, AABB, BOTH) - 뒤로 배치
        // [EN] Single bounding box tests - Placed in back
        createBoundingTestRow(redGPUContext, scene, -4);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            scene.children.forEach(child => {
                if (child instanceof RedGPU.Display.Mesh && !(child instanceof RedGPU.Display.TextField3D)) {
                    child.rotationX += 0.2;
                    child.rotationY += 0.2;
                    child.rotationZ += 0.2;

                    const firstChild = child.getChildAt?.(0);
                    if (firstChild) {
                        firstChild.rotationX += 1;
                        firstChild.rotationY += 1;
                        firstChild.rotationZ += 1;
                    }
                }
            });
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
 * [KO] 테스트 패널 버튼을 설정합니다.
 * [EN] Sets up test pane buttons.
 */
const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770625511985");
    setDebugButtons(RedGPU, redGPUContext);
};

/**
 * [KO] OBB, AABB, BOTH 모드별 단일 바운딩 박스 테스트 행을 생성합니다.
 * [EN] Creates a row of single bounding box tests for OBB, AABB, and BOTH modes.
 */
function createBoundingTestRow(redGPUContext, scene, zOffset) {
    const gap = 4.5;
    const configs = [
        {x: -gap, mode: 'OBB', label: 'BoundingOBB'},
        {x: 0, mode: 'AABB', label: 'BoundingAABB'},
        {x: gap, mode: 'BOTH', label: 'BOTH'}
    ];

    configs.forEach(config => {
        const mesh = createSampleMesh(redGPUContext, scene);
        mesh.setPosition(config.x, 0, zOffset);
        mesh.enableDebugger = true;
        mesh.drawDebugger.debugMode = config.mode;

        // 속성 라벨 (14px / 0.7)
        const label = new RedGPU.Display.TextField3D(redGPUContext, config.label);
        label.setPosition(config.x, 2.0, zOffset); // H=2 -> y=1.0+1.0
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });
}

/**
 * [KO] 계층 구조(부모-자식)를 가진 객체의 통합 바운딩 박스 테스트를 생성합니다.
 * [EN] Creates a combined bounding box test for objects with hierarchy (parent-child).
 */
function createCombinedBoundingTest(redGPUContext, scene, zOffset) {
    const parentMesh = createSampleMesh(redGPUContext, scene);
    parentMesh.setPosition(0, 0, zOffset);

    const childMesh = createSampleMesh(redGPUContext, scene);
    childMesh.x = 2.5;
    childMesh.setScale(0.5);
    childMesh.material.color.setColorByHEX('#ff0000');
    parentMesh.addChild(childMesh);

    parentMesh.enableDebugger = true;
    parentMesh.drawDebugger.debugMode = 'COMBINED_AABB';

    // 통합 라벨 (32px / 1.0)
    const label = new RedGPU.Display.TextField3D(redGPUContext, 'combinedBoundingAABB');
    label.setPosition(0, -2.5, zOffset); // 하단 배치
    label.fontSize = 32;
    label.worldSize = 1.0;
    scene.addChild(label);
}

/**
 * [KO] 테스트용 기본 박스 메시를 생성합니다.
 * [EN] Creates a basic box mesh for testing.
 */
function createSampleMesh(redGPUContext, scene) {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#dfa9e6');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    return mesh;
}
