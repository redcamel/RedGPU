import * as RedGPU from "../../../../dist/index.js?t=1781136546834";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781136546834";

/**
 * [KO] Sprite2D Child Method 예제
 * [EN] Sprite2D Child Method example
 *
 * [KO] Sprite2D의 자식 객체 관리 기능(추가, 검색, 이동, 삭제)을 보여줍니다.
 * [EN] Demonstrates child object management features (add, get, move, remove) of Sprite2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] Scene 생성
        // [EN] Create Scene
        const scene = new RedGPU.Display.Scene();

        // 2. [KO] 2D View 생성 및 등록
        // [EN] Create and register 2D View
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] 초기 객체들 생성
        // [EN] Create initial objects
        for (let i = 0; i < 6; i++) {
            addChildObject(redGPUContext, scene, '#ffffff');
        }

        // 4. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        view.onResize = (resizeEvent) => {
            // 정보 업데이트 등 필요 시 작성
        };

        // 5. [KO] 렌더러 시작 및 애니메이션 루프
        // [EN] Start renderer and animation loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const {width, height} = view.screenRectObject;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 250;
            const numChildren = scene.children.length;

            scene.children.forEach((sprite2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                sprite2D.x += (endX - sprite2D.x) * 0.3;
                sprite2D.y += (endY - sprite2D.y) * 0.3;

                const label = sprite2D.getChildAt(0);
                if (label && label.text !== `Child ${index}`) {
                    label.text = `Child ${index}`;
                }
            });
        });

        // 6. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 자식 객체를 생성하여 추가합니다.
 * [EN] Creates and adds a child object.
 */
const addChildObject = (redGPUContext, scene, color = getRandomHexColor()) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, color);
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(25, 25);

    const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
    textField2D.fontSize = 16;
    textField2D.text = `Child ${scene.numChildren}`;
    textField2D.color = color;
    textField2D.y = 30;

    sprite2D.addChild(textField2D);
    scene.addChild(sprite2D);
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 */
const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            pane.addButton({title: 'Add Child'}).on('click', () => {
                addChildObject(redGPUContext, scene);
            });

            pane.addButton({title: 'Add Child at Index 2'}).on('click', () => {
                const color = '#fff';
                const material = new RedGPU.Material.ColorMaterial(redGPUContext, color);
                const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
                sprite2D.setSize(25, 25);

                const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
                textField2D.fontSize = 16;
                textField2D.text = `Inserted Child`;
                textField2D.color = color;
                textField2D.y = 30;

                sprite2D.addChild(textField2D);
                scene.addChildAt(sprite2D, 2);
            });

            pane.addButton({title: 'Get Child at Index 1'}).on('click', () => {
                const child = scene.getChildAt(1);
                if (child) {
                    const color = getRandomHexColor();
                    child.material.color.setColorByHEX(color);
                    child.getChildAt(0).color = color;
                }
            });

            pane.addButton({title: 'Swap Children at 0 and 1'}).on('click', () => {
                if (scene.numChildren > 1) {
                    scene.swapChildrenAt(0, 1);
                }
            });

            pane.addButton({title: 'Remove Child at Index 1'}).on('click', () => {
                if (scene.numChildren > 1) {
                    scene.removeChildAt(1);
                }
            });

            pane.addButton({title: 'Remove All Children'}).on('click', () => {
                scene.removeAllChildren();
            });
        }
    });
};
