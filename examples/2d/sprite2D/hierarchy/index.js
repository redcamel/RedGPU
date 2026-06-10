import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

/**
 * [KO] Sprite2D Hierarchy 예제
 * [EN] Sprite2D Hierarchy example
 *
 * [KO] Sprite2D 간의 부모-자식 계층 구조와 변환 상속을 보여줍니다.
 * [EN] Demonstrates parent-child hierarchy and transformation inheritance between Sprite2D objects.
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

        // 3. [KO] 부모 Sprite2D 생성
        // [EN] Create parent Sprite2D
        const parentSprite = createParentSprite2D(redGPUContext, scene);
        parentSprite.setPosition(view.screenRectObject.width / 2, view.screenRectObject.height / 2);

        // 4. [KO] 자식 Sprite2D 생성
        // [EN] Create child Sprite2D
        const childSprite = createChildSprite2D(redGPUContext, parentSprite);

        // 5. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            parentSprite.x = width / 2;
            parentSprite.y = height / 2;
        };

        // 6. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, parentSprite, childSprite);
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
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    const size = redGPUContext.detector.isMobile ? 100 : 200;
    sprite2D.setSize(size, size);
    scene.addChild(sprite2D);

    return sprite2D;
};

/**
 * [KO] 자식 Sprite2D를 생성합니다.
 * [EN] Creates a child Sprite2D.
 */
const createChildSprite2D = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    const size = 100
    sprite2D.setSize(size, size);
    sprite2D.setPosition(parent.width / 2 + size / 2, parent.height / 2 + size / 2);
    parent.addChild(sprite2D);

    return sprite2D;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, parent, child) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const parentFolder = pane.addFolder({title: 'Parent Sprite2D'});
            parentFolder.addBinding(parent, 'x', {min: 0, max: 1000, step: 0.1});
            parentFolder.addBinding(parent, 'y', {min: 0, max: 1000, step: 0.1});
            parentFolder.addBinding(parent, 'width', {min: 0, max: 500, step: 0.1});
            parentFolder.addBinding(parent, 'height', {min: 0, max: 500, step: 0.1});
            parentFolder.addBinding(parent, 'rotation', {min: 0, max: 360, step: 0.01});
            parentFolder.addBinding(parent, 'scaleX', {min: 0, max: 5, step: 0.1});
            parentFolder.addBinding(parent, 'scaleY', {min: 0, max: 5, step: 0.1});
            parentFolder.addBinding(parent, 'opacity', {min: 0, max: 1, step: 0.01});

            const childFolder = pane.addFolder({title: 'Child Sprite2D'});
            childFolder.addBinding(child, 'x', {min: -200, max: 200, step: 0.1});
            childFolder.addBinding(child, 'y', {min: -200, max: 200, step: 0.1});
            childFolder.addBinding(child, 'width', {min: 0, max: 500, step: 0.1});
            childFolder.addBinding(child, 'height', {min: 0, max: 500, step: 0.1});
            childFolder.addBinding(child, 'rotation', {min: 0, max: 360, step: 0.01});
            childFolder.addBinding(child, 'scaleX', {min: 0, max: 5, step: 0.1});
            childFolder.addBinding(child, 'scaleY', {min: 0, max: 5, step: 0.1});
            childFolder.addBinding(child, 'opacity', {min: 0, max: 1, step: 0.01});
        }
    });
};
