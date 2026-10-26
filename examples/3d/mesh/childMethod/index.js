import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Child Method 예제
 * [EN] Child Method example
 *
 * [KO] 컨테이너의 자식 관리 API(addChild, addChildAt, getChildAt, getChildIndex, setChildIndex, swapChildren, swapChildrenAt, removeChildAt, removeAllChildren)를 시연합니다.
 * [EN] Demonstrates container child management APIs (addChild, addChildAt, getChildAt, getChildIndex, setChildIndex, swapChildren, swapChildrenAt, removeChildAt, removeAllChildren).
 */

const LAYOUT_RADIUS = 5;
const LAYOUT_EASING = 0.1;

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

        for (let i = 0; i < 6; i++) {
            scene.addChild(createChild(redGPUContext, '#ffffff'));
        }
        relabelChildren(scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 자식 인덱스 순서대로 원형 배치 - 인덱스가 바뀌면 위치가 부드럽게 이동
            // [EN] Arrange children in a circle by index - positions ease when indices change
            const children = scene.children;
            const numChildren = children.length;
            for (let i = 0; i < numChildren; i++) {
                const child = children[i];
                const angle = (i / numChildren) * Math.PI * 2;
                child.setPosition(
                    child.x + (Math.cos(angle) * LAYOUT_RADIUS - child.x) * LAYOUT_EASING,
                    child.y - child.y * LAYOUT_EASING,
                    child.z + (Math.sin(angle) * LAYOUT_RADIUS - child.z) * LAYOUT_EASING
                );
            }
        });

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const getRandomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

const createChild = (redGPUContext, color = getRandomHexColor()) => {
    const child = new RedGPU.Display.TextField3D(redGPUContext);
    child.useBillboard = true;
    child.fontSize = 32;
    child.color = color;
    return child;
};

const relabelChildren = (scene) => {
    const children = scene.children;
    for (let i = 0; i < children.length; i++) {
        children[i].text = `Child ${i}`;
    }
};

const renderTestPane = (redGPUContext, scene) => {
    // [KO] 자식 순서를 변경하는 API 호출 후 라벨을 현재 인덱스로 갱신
    // [EN] Refresh labels to current indices after APIs that change child order
    const addOrderButton = (pane, title, action) => {
        pane.addButton({title}).on('click', () => {
            action();
            relabelChildren(scene);
        });
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            addOrderButton(pane, 'addChild', () => {
                scene.addChild(createChild(redGPUContext));
            });
            addOrderButton(pane, 'addChildAt(child, 2)', () => {
                scene.addChildAt(createChild(redGPUContext, '#ff0000'), 2);
            });

            pane.addButton({title: 'getChildAt(1)'}).on('click', () => {
                const child = scene.getChildAt(1);
                if (child) child.color = getRandomHexColor();
            });
            pane.addButton({title: 'getChildIndex(child0)'}).on('click', () => {
                const firstChild = scene.getChildAt(0);
                if (firstChild) scene.getChildAt(scene.getChildIndex(firstChild)).color = getRandomHexColor();
            });

            addOrderButton(pane, 'setChildIndex(child0, 4)', () => {
                const firstChild = scene.getChildAt(0);
                if (firstChild && scene.numChildren > 4) scene.setChildIndex(firstChild, 4);
            });
            addOrderButton(pane, 'swapChildrenAt(0, 1)', () => {
                scene.swapChildrenAt(0, 1);
            });
            addOrderButton(pane, 'swapChildren(first, last)', () => {
                const numChildren = scene.numChildren;
                if (numChildren > 1) scene.swapChildren(scene.getChildAt(0), scene.getChildAt(numChildren - 1));
            });
            addOrderButton(pane, 'removeChildAt(1)', () => {
                scene.removeChildAt(1);
            });
            addOrderButton(pane, 'removeAllChildren()', () => {
                scene.removeAllChildren();
            });
        }
    });
};
