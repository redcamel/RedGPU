import * as RedGPU from "../../../../dist/index.js?t=1783496184998";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783496184998";

/**
 * [KO] Mesh Pivot 예제
 * [EN] Mesh Pivot example
 *
 * [KO] 메시의 피벗 포인트를 변경하여 회전 및 크기 조절의 중심축을 변경하는 방법을 시연합니다.
 * [EN] Demonstrates changing the pivot point of a mesh to alter the axis of rotation and scaling.
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
        controller.distance = 20;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 계층 구조 및 피벗 시각화 객체 생성
        // [EN] Create Hierarchy and Pivot Visualizers
        const parentMesh = createParentMesh(redGPUContext, scene);
        const childMesh = createChildMesh(redGPUContext, parentMesh);

        // [KO] 피벗 위치를 시각적으로 보여줄 작은 구체 생성
        // [EN] Create small spheres to visually show pivot positions
        const parentPivotMarker = createPivotVisualizer(redGPUContext, parentMesh);
        const childPivotMarker = createPivotVisualizer(redGPUContext, childMesh);

        const animationConfig = {
            parentEnabled: true,
            childEnabled: true,
            speed: 0.5
        };

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = () => {
            // [KO] 부모 애니메이션
            // [EN] Parent animation
            if (animationConfig.parentEnabled) {
                parentMesh.rotationX += animationConfig.speed;
                parentMesh.rotationY += animationConfig.speed;
                parentMesh.rotationZ += animationConfig.speed;
            }

            // [KO] 자식 애니메이션
            // [EN] Child animation
            if (animationConfig.childEnabled) {
                childMesh.rotationX += animationConfig.speed * 2;
                childMesh.rotationY += animationConfig.speed * 2;
                childMesh.rotationZ += animationConfig.speed * 2;
            }

            // [KO] 마커 위치를 현재 피벗 설정값에 동기화
            // [EN] Sync markers with current pivot values
            parentPivotMarker.setPosition(parentMesh.pivotX, parentMesh.pivotY, parentMesh.pivotZ);
            childPivotMarker.setPosition(childMesh.pivotX, childMesh.pivotY, childMesh.pivotZ);
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, parentMesh, childMesh, animationConfig);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 부모 메시를 생성합니다.
 * [EN] Creates a parent mesh.
 * @returns {RedGPU.Display.Mesh}
 */
const createParentMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg")
    );
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    return mesh;
};

/**
 * [KO] 자식 메시를 생성합니다.
 * [EN] Creates a child mesh.
 * @returns {RedGPU.Display.Mesh}
 */
const createChildMesh = (redGPUContext, parentMesh) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#ff0000");
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.setPosition(3, 3, 0);
    parentMesh.addChild(mesh);
    return mesh;
};

/**
 * [KO] 피벗 시각화 마커를 생성합니다.
 * [EN] Creates a pivot visualization marker.
 * @returns {RedGPU.Display.Mesh}
 */
const createPivotVisualizer = (redGPUContext, targetMesh) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00ff00");
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.1, 8, 8);
    const marker = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    
    // [KO] 마커가 항상 보이도록 설정
    // [EN] Make marker always visible
    marker.depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;
    targetMesh.addChild(marker);
    return marker;
};

/**
 * [KO] 피벗 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for pivot control.
 */
const renderTestPane = (redGPUContext, parentMesh, childMesh, animationConfig) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const addPivotControls = (folder, mesh, animKey) => {
                folder.addBinding(animationConfig, animKey, {label: 'Animate'});
                folder.addBinding(mesh, "pivotX", {min: -2, max: 2, step: 0.1});
                folder.addBinding(mesh, "pivotY", {min: -2, max: 2, step: 0.1});
                folder.addBinding(mesh, "pivotZ", {min: -2, max: 2, step: 0.1});
            };

            const pFolder = pane.addFolder({title: "Parent Pivot", expanded: true});
            addPivotControls(pFolder, parentMesh, 'parentEnabled');

            const cFolder = pane.addFolder({title: "Child Pivot", expanded: true});
            addPivotControls(cFolder, childMesh, 'childEnabled');
        }
    });
};
