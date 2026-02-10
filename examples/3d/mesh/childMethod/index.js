import * as RedGPU from "../../../../dist/index.js?t=1770699661827";

/**
 * [KO] Mesh Child Method 예제
 * [EN] Mesh Child Method example
 *
 * [KO] Mesh의 자식 객체 관리 기능(추가, 검색, 이동, 삭제)을 보여줍니다.
 * [EN] Demonstrates child object management features (add, get, move, remove) of Mesh.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        createInitialMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            const radius = 5;
            const numChildren = view.scene.children.length;

            view.scene.children.forEach((mesh, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = Math.cos(angle) * radius;
                const endZ = Math.sin(angle) * radius;

                mesh.setPosition(
                    mesh.x + (endX - mesh.x) * 0.3,
                    mesh.y + (0 - mesh.y) * 0.3,
                    mesh.z + (endZ - mesh.z) * 0.3
                );

                if (mesh.text !== `Child ${index}`) {
                    mesh.text = `Child ${index}`;
                }
            });
        };
        renderer.start(redGPUContext, render);

        createPaneUI(redGPUContext, scene);
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
 * [KO] 테스트용 UI 패널을 생성합니다.
 * [EN] Creates a UI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createPaneUI = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    pane.addButton({title: 'Add Child'}).on('click', () => {
        addChildMesh(redGPUContext, scene);
    });

    pane.addButton({title: 'Add Child at Index 2'}).on('click', () => {
        const newChild = new RedGPU.Display.TextField3D(redGPUContext);
        newChild.useBillboard = true;
        newChild.fontSize = 32;
        newChild.text = 'Inserted Child';
        newChild.color = '#ff0000';
        newChild.setPosition(0, 0, 0);
        scene.addChildAt(newChild, 2);
        console.log('Added a new child at index 2');
    });

    pane.addButton({title: 'Get Child at Index 1'}).on('click', () => {
        const child = scene.getChildAt(1);
        if (child) {
            child.color = getRandomHexColor();
            console.log('Child at index 1:', child.text);
        } else {
            console.log('No child found at index 1');
        }
    });

    pane.addButton({title: 'Get Index of Child 0'}).on('click', () => {
        const firstChild = scene.getChildAt(0);
        if (firstChild) {
            const index = scene.getChildIndex(firstChild);
            scene.getChildAt(index).color = getRandomHexColor();
            console.log(`Index of first child: ${index}`);
        }
    });

    pane.addButton({title: 'Set Index of Child 0 to 4'}).on('click', () => {
        if (scene.numChildren > 4) {
            const firstChild = scene.getChildAt(0);
            if (firstChild) {
                scene.setChildIndex(firstChild, 4);
                console.log('Moved child 0 to index 4');
            }
        }
    });

    pane.addButton({title: 'Swap Children at 0 and 1'}).on('click', () => {
        scene.swapChildrenAt(0, 1);
        console.log('Swapped children at indices 0 and 1');
    });

    pane.addButton({title: 'Swap First & Last Child'}).on('click', () => {
        const numChildren = scene.numChildren;
        if (numChildren > 1) {
            const firstChild = scene.getChildAt(0);
            const lastChild = scene.getChildAt(numChildren - 1);
            if (firstChild && lastChild) {
                scene.swapChildren(firstChild, lastChild);
                console.log('Swapped first and last child');
            }
        }
    });

    pane.addButton({title: 'Remove Child at Index 1'}).on('click', () => {
        scene.removeChildAt(1);
        console.log('Removed child at index 1');
    });

    pane.addButton({title: 'Remove All Children'}).on('click', () => {
        scene.removeAllChildren();
        console.log('All children removed');
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

    console.log(`Child added with color "${mesh.color}"! Total: ${scene.numChildren}`);
};