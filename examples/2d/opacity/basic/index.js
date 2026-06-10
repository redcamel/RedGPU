import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

/**
 * [KO] Opacity 예제
 * [EN] Opacity example
 *
 * [KO] 2D 객체의 투명도(opacity)를 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to control the opacity of 2D objects.
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

        // 3. [KO] 부모 및 자식 객체들 생성
        // [EN] Create parent and child objects
        const parentSprite = createParentSprite2D(redGPUContext, scene);
        parentSprite.x = redGPUContext.screenRectObject.width / 2;
        parentSprite.y = view.screenRectObject.height / 2;
        const childSprite = createChildSprite2D(redGPUContext, parentSprite);
        const childTextField = createChildTextField2D(redGPUContext, parentSprite);
        const childSpriteSheet = createChildSpriteSheet2D(redGPUContext, parentSprite);

        // 4. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            parentSprite.x = width / 2;
            parentSprite.y = height / 2;
        };

        // 5. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, parentSprite, [childSprite, childTextField, childSpriteSheet]);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 부모 Sprite2D를 생성합니다.
 * [EN] Creates a parent Sprite2D.
 */
const createParentSprite2D = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(100, 100);
    scene.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 85;
    sprite2D.addChild(title);

    return sprite2D;
};

/**
 * [KO] 자식 Sprite2D를 생성합니다.
 * [EN] Creates a child Sprite2D.
 */
const createChildSprite2D = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(75);
    sprite2D.x = 150;
    sprite2D.y = 150;
    parent.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 72;
    sprite2D.addChild(title);
    return sprite2D;
};

/**
 * [KO] 자식 SpriteSheet2D를 생성합니다.
 * [EN] Creates a child SpriteSheet2D.
 */
const createChildSpriteSheet2D = (redGPUContext, parent) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const sprite2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
    sprite2D.x = -150;
    sprite2D.y = 150;
    parent.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `SpriteSheet2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 120;
    sprite2D.addChild(title);
    return sprite2D;
};

/**
 * [KO] 자식 TextField2D를 생성합니다.
 * [EN] Creates a child TextField2D.
 */
const createChildTextField2D = (redGPUContext, parent) => {
    const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
    textField2D.x = 0;
    textField2D.y = -150;
    textField2D.text = `TextField2D<br/>Opacity ${textField2D.opacity}<br/>combinedOpacity ${textField2D.getCombinedOpacity()}`;
    parent.addChild(textField2D);
    return textField2D;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, parent, children) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const updateText = (obj) => {
                if (obj instanceof RedGPU.Display.TextField2D) {
                    obj.text = `TextField2D<br/>Opacity ${obj.opacity.toFixed(2)}<br/>combinedOpacity ${obj.getCombinedOpacity().toFixed(2)}`;
                } else {
                    const title = obj.children?.find(c => c instanceof RedGPU.Display.TextField2D);
                    if (title) {
                        title.text = `${obj.constructor.name}<br/>Opacity ${obj.opacity.toFixed(2)}<br/>combinedOpacity ${obj.getCombinedOpacity().toFixed(2)}`;
                    }
                }
            };

            const parentFolder = pane.addFolder({title: 'Parent Sprite2D'});
            parentFolder.addBinding(parent, 'opacity', {min: 0, max: 1, step: 0.01}).on('change', () => {
                updateText(parent);
                children.forEach(updateText);
            });

            children.forEach((child) => {
                const childFolder = pane.addFolder({title: `Child ${child.constructor.name}`});
                childFolder.addBinding(child, 'opacity', {min: 0, max: 1, step: 0.01}).on('change', () => {
                    updateText(child);
                });
            });
        }
    });
};
