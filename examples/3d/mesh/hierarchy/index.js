import * as RedGPU from "../../../../dist/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783322366074";

/**
 * [KO] Mesh Hierarchy 예제
 * [EN] Mesh Hierarchy example
 *
 * [KO] 메시 간의 부모-자식 계층 구조와 그에 따른 변환(위치, 회전, 크기) 상속을 시연합니다.
 * [EN] Demonstrates parent-child hierarchy and transformation inheritance (position, rotation, scale) between meshes.
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

        // 3. [KO] 계층 구조 객체 생성
        // [EN] Create Hierarchical Objects
        const parentMesh = createParentMesh(redGPUContext, scene);
        const childMesh = createChildMesh(redGPUContext, parentMesh);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = () => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, parentMesh, childMesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 부모 메시를 생성합니다.
 * [EN] Creates a parent mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createParentMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const parentMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    parentMesh.setPosition(0, 0, 0);
    scene.addChild(parentMesh);

    return parentMesh;
};

/**
 * [KO] 자식 메시를 생성하여 부모에 추가합니다.
 * [EN] Creates a child mesh and adds it to the parent.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} parentMesh
 * @returns {RedGPU.Display.Mesh}
 */
const createChildMesh = (redGPUContext, parentMesh) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
    const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    // [KO] 부모의 로컬 좌표계를 기준으로 위치 설정
    // [EN] Set position relative to parent's local coordinate system
    childMesh.setPosition(3, 3, 0);
    parentMesh.addChild(childMesh);

    return childMesh;
};

/**
 * [KO] 부모와 자식의 개별 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for individual control of parent and child.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} parentMesh
 * @param {RedGPU.Display.Mesh} childMesh
 */
const renderTestPane = (redGPUContext, parentMesh, childMesh) => {
    const parentConfig = {
        x: parentMesh.x, y: parentMesh.y, z: parentMesh.z,
        rotationX: parentMesh.rotationX, rotationY: parentMesh.rotationY, rotationZ: parentMesh.rotationZ,
        scaleX: parentMesh.scaleX, scaleY: parentMesh.scaleY, scaleZ: parentMesh.scaleZ,
    };

    const childConfig = {
        x: childMesh.x, y: childMesh.y, z: childMesh.z,
        rotationX: childMesh.rotationX, rotationY: childMesh.rotationY, rotationZ: childMesh.rotationZ,
        scaleX: childMesh.scaleX, scaleY: childMesh.scaleY, scaleZ: childMesh.scaleZ,
    };

    /**
     * [KO] 메시 제어 항목을 생성합니다.
     * [EN] Creates mesh control items.
     */
    const createMeshControls = (folder, config, mesh) => {
        // [KO] 위치
        // [EN] Position
        const pos = folder.addFolder({title: 'Position'});
        ['x', 'y', 'z'].forEach(axis => {
            pos.addBinding(config, axis, {min: -10, max: 10, step: 0.1}).on('change', () => mesh.setPosition(config.x, config.y, config.z));
        });

        // [KO] 회전
        // [EN] Rotation
        const rot = folder.addFolder({title: 'Rotation'});
        ['rotationX', 'rotationY', 'rotationZ'].forEach(axis => {
            rot.addBinding(config, axis, {min: 0, max: 360, step: 0.1}).on('change', () => mesh.setRotation(config.rotationX, config.rotationY, config.rotationZ));
        });

        // [KO] 크기
        // [EN] Scale
        const sca = folder.addFolder({title: 'Scale'});
        ['scaleX', 'scaleY', 'scaleZ'].forEach(axis => {
            sca.addBinding(config, axis, {min: 0.1, max: 5, step: 0.1}).on('change', () => mesh.setScale(config.scaleX, config.scaleY, config.scaleZ));
        });
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const pFolder = pane.addFolder({title: 'Parent Mesh', expanded: true});
            createMeshControls(pFolder, parentConfig, parentMesh);

            const cFolder = pane.addFolder({title: 'Child Mesh', expanded: true});
            createMeshControls(cFolder, childConfig, childMesh);
        }
    });
};
