import * as RedGPU from "../../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] Mesh Child Method 예제
 * [EN] Mesh Child Method example
 *
 * [KO] Mesh의 자식 객체 관리 기능(추가, 검색, 순서 변경, 삭제 등)을 시연합니다.
 * [EN] Demonstrates child object management features (add, get, swap, remove, etc.) of Mesh.
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

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 초기 자식 객체 생성
        // [EN] Create Initial Children
        createInitialMeshes(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = () => {
            const radius = 5;
            const numChildren = view.scene.children.length;

            // [KO] 자식들을 원형으로 배치하는 애니메이션
            // [EN] Animate children in a circular layout
            view.scene.children.forEach((mesh, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = Math.cos(angle) * radius;
                const endZ = Math.sin(angle) * radius;

                mesh.setPosition(
                    mesh.x + (endX - mesh.x) * 0.1,
                    mesh.y + (0 - mesh.y) * 0.1,
                    mesh.z + (endZ - mesh.z) * 0.1
                );

                if (mesh.text !== `Child ${index}`) {
                    mesh.text = `Child ${index}`;
                }
            });
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, scene);
    }
);

/**
 * [KO] 초기 메시들을 생성합니다.
 * [EN] Creates initial meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createInitialMeshes = (redGPUContext, scene) => {
    for (let i = 0; i < 6; i++) {
        addChildMesh(redGPUContext, scene, '#ffffff');
    }
};

/**
 * [KO] 자식 관리를 위한 GUI 패널을 구성합니다.
 * [EN] Configures GUI panel for child management.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 자식 추가
            // [EN] Add Child
            pane.addButton({title: 'Add Child'}).on('click', () => {
                addChildMesh(redGPUContext, scene);
            });

            // [KO] 특정 인덱스에 추가
            // [EN] Add Child at Specific Index
            pane.addButton({title: 'Add Child at Index 2'}).on('click', () => {
                const newChild = new RedGPU.Display.TextField3D(redGPUContext);
                newChild.useBillboard = true;
                newChild.fontSize = 32;
                newChild.text = 'Inserted Child';
                newChild.color = '#ff0000';
                newChild.setPosition(0, 0, 0);
                scene.addChildAt(newChild, 2);
            });

            // [KO] 인덱스로 객체 가져오기
            // [EN] Get Child by Index
            pane.addButton({title: 'Get Child at Index 1'}).on('click', () => {
                const child = scene.getChildAt(1);
                if (child) {
                    child.color = getRandomHexColor();
                }
            });

            // [KO] 객체 인덱스 확인
            // [EN] Get Child Index
            pane.addButton({title: 'Get Index of Child 0'}).on('click', () => {
                const firstChild = scene.getChildAt(0);
                if (firstChild) {
                    const index = scene.getChildIndex(firstChild);
                    scene.getChildAt(index).color = getRandomHexColor();
                }
            });

            // [KO] 객체 인덱스 변경
            // [EN] Change Child Index
            pane.addButton({title: 'Set Index of Child 0 to 4'}).on('click', () => {
                if (scene.numChildren > 4) {
                    const firstChild = scene.getChildAt(0);
                    if (firstChild) {
                        scene.setChildIndex(firstChild, 4);
                    }
                }
            });

            // [KO] 인덱스로 위치 교체
            // [EN] Swap Children at Indices
            pane.addButton({title: 'Swap Children at 0 and 1'}).on('click', () => {
                scene.swapChildrenAt(0, 1);
            });

            // [KO] 객체로 위치 교체
            // [EN] Swap Specific Children
            pane.addButton({title: 'Swap First & Last Child'}).on('click', () => {
                const numChildren = scene.numChildren;
                if (numChildren > 1) {
                    const firstChild = scene.getChildAt(0);
                    const lastChild = scene.getChildAt(numChildren - 1);
                    if (firstChild && lastChild) {
                        scene.swapChildren(firstChild, lastChild);
                    }
                }
            });

            // [KO] 자식 삭제
            // [EN] Remove Child
            pane.addButton({title: 'Remove Child at Index 1'}).on('click', () => {
                scene.removeChildAt(1);
            });

            // [KO] 모든 자식 삭제
            // [EN] Remove All Children
            pane.addButton({title: 'Remove All Children'}).on('click', () => {
                scene.removeAllChildren();
            });
        }
    });
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 * @returns {string}
 */
const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * [KO] 자식 메시를 생성하여 추가합니다.
 * [EN] Creates and adds a child mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {string} [color]
 */
const addChildMesh = (redGPUContext, scene, color = getRandomHexColor()) => {
    const mesh = new RedGPU.Display.TextField3D(redGPUContext);
    mesh.useBillboard = true;
    mesh.fontSize = 32;
    mesh.text = `Child ${scene.numChildren}`;
    mesh.color = color;
    mesh.setPosition(0, 0, 0);
    scene.addChild(mesh);
};
