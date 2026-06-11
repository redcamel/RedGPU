import * as RedGPU from "../../../../../dist/index.js?t=1781144235516";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781144235516";

/**
 * [KO] Mesh Bounding Box 예제
 * [EN] Mesh Bounding Box example
 *
 * [KO] 메시의 바운딩 박스(AABB, OBB)를 시각화하고 계층 구조에서의 결합 바운딩 박스를 보여줍니다.
 * [EN] Visualizes mesh bounding boxes (AABB, OBB) and demonstrates combined bounding boxes in hierarchies.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        controller.distance = 15;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 테스트용 객체 생성
        // [EN] Create Test Objects

        // [KO] 결합 바운딩 박스 테스트 (COMBINED_AABB)
        // [EN] Combined bounding box test (COMBINED_AABB)
        createCombinedBoundingTest(redGPUContext, scene, 4);

        // [KO] 단일 바운딩 박스 테스트 (OBB, AABB, BOTH)
        // [EN] Single bounding box tests (OBB, AABB, BOTH)
        createBoundingTestRow(redGPUContext, scene, -4);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = () => {
            // [KO] 모든 메시를 회전시켜 바운딩 박스의 변화를 확인
            // [EN] Rotate all meshes to observe bounding box changes
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

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
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
 * [KO] OBB, AABB, BOTH 모드별 단일 바운딩 박스 테스트 행을 생성합니다.
 * [EN] Creates a row of single bounding box tests for OBB, AABB, and BOTH modes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {number} zOffset
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

        // [KO] 속성 라벨 생성
        // [EN] Create Property Label
        const label = new RedGPU.Display.TextField3D(redGPUContext, config.label);
        label.setPosition(config.x, 2.0, zOffset);
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });
}

/**
 * [KO] 계층 구조(부모-자식)를 가진 객체의 통합 바운딩 박스 테스트를 생성합니다.
 * [EN] Creates a combined bounding box test for objects with hierarchy (parent-child).
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {number} zOffset
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

    // [KO] 통합 라벨 생성
    // [EN] Create Combined Label
    const label = new RedGPU.Display.TextField3D(redGPUContext, 'combinedBoundingAABB');
    label.setPosition(0, -2.5, zOffset);
    label.fontSize = 32;
    label.worldSize = 1.0;
    scene.addChild(label);
}

/**
 * [KO] 테스트용 기본 박스 메시를 생성합니다.
 * [EN] Creates a basic box mesh for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
function createSampleMesh(redGPUContext, scene) {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#dfa9e6');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    return mesh;
}
