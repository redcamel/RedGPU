import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Group2D 예제
 * [EN] Group2D example
 *
 * [KO] Group2D를 사용하여 2D 객체들을 그룹화하고 계층 구조를 관리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to group 2D objects and manage hierarchy using Group2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        const rootGroup = createRootGroup(redGPUContext, scene);
        const parentSprite2D = createParentSprite2D(redGPUContext, rootGroup);
        const childSprite2D = createChildSprite2D(redGPUContext, parentSprite2D);

        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            rootGroup.x = width / 2;
            rootGroup.y = height / 2;
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, rootGroup, parentSprite2D, childSprite2D);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 루트 그룹을 생성합니다.
 * [EN] Creates the root group.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Group2D}
 */
const createRootGroup = (redGPUContext, scene) => {
    const group = new RedGPU.Display.Group2D();
    group.x = redGPUContext.screenRectObject.width / 2;
    group.y = redGPUContext.screenRectObject.height / 2;
    scene.addChild(group);

    return group;
};

/**
 * [KO] 부모 Sprite2D를 생성하여 그룹에 추가합니다.
 * [EN] Creates a parent Sprite2D and adds it to the group.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Group2D} rootGroup
 * @returns {RedGPU.Display.Sprite2D}
 */
const createParentSprite2D = (redGPUContext, rootGroup) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(100, 100);
    sprite2D.x = 0;
    sprite2D.y = 0;
    rootGroup.addChild(sprite2D);

    return sprite2D;
};

/**
 * [KO] 자식 Sprite2D를 생성하여 부모에 추가합니다.
 * [EN] Creates a child Sprite2D and adds it to the parent.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Sprite2D} parent
 * @returns {RedGPU.Display.Sprite2D}
 */
const createChildSprite2D = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(100, 100);
    sprite2D.x = 100;
    sprite2D.y = 100;
    parent.addChild(sprite2D);

    return sprite2D;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Group2D} rootGroup
 * @param {RedGPU.Display.Sprite2D} parent
 * @param {RedGPU.Display.Sprite2D} child
 */
const renderTestPane = async (redGPUContext, rootGroup, parent, child) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext);
    const maxW = redGPUContext.screenRectObject.width;
    const maxH = redGPUContext.screenRectObject.height;

    const rootConfig = {
        x: rootGroup.x,
        y: rootGroup.y,
        rotation: rootGroup.rotation,
        scaleX: rootGroup.scaleX,
        scaleY: rootGroup.scaleY,
    };

    const parentConfig = {
        x: parent.x,
        y: parent.y,
        width: parent.width,
        height: parent.height,
        rotation: parent.rotation,
        scaleX: parent.scaleX,
        scaleY: parent.scaleY,
    };

    const childConfig = {
        x: child.x,
        y: child.y,
        width: child.width,
        height: child.height,
        rotation: child.rotation,
        scaleX: child.scaleX,
        scaleY: child.scaleY,
    };

    const rootFolder = pane.addFolder({title: 'Root Group2D', expanded: true});
    rootFolder.addBinding(rootConfig, 'x', {
        min: 0,
        max: maxW,
        step: 0.1,
    }).on('change', (evt) => (rootGroup.x = evt.value));
    rootFolder.addBinding(rootConfig, 'y', {
        min: 0,
        max: maxH,
        step: 0.1,
    }).on('change', (evt) => (rootGroup.y = evt.value));
    rootFolder.addBinding(rootConfig, 'rotation', {
        min: 0,
        max: 360,
        step: 0.01,
    }).on('change', (evt) => (rootGroup.rotation = evt.value));
    rootFolder.addBinding(rootConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (rootGroup.scaleX = evt.value));
    rootFolder.addBinding(rootConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (rootGroup.scaleY = evt.value));

    const parentFolder = pane.addFolder({title: 'Parent Sprite2D', expanded: true});
    parentFolder.addBinding(parentConfig, 'x', {
        min: -100,
        max: 100,
        step: 0.1,
    }).on('change', (evt) => (parent.x = evt.value));
    parentFolder.addBinding(parentConfig, 'y', {
        min: -100,
        max: 100,
        step: 0.1,
    }).on('change', (evt) => (parent.y = evt.value));
    parentFolder.addBinding(parentConfig, 'width', {
        min: 0,
        max: parentConfig.width * 2,
        step: 0.1,
    }).on('change', (evt) => (parent.width = evt.value));
    parentFolder.addBinding(parentConfig, 'height', {
        min: 0,
        max: parentConfig.height * 2,
        step: 0.1,
    }).on('change', (evt) => (parent.height = evt.value));
    parentFolder.addBinding(parentConfig, 'rotation', {
        min: 0,
        max: 360,
        step: 0.01,
    }).on('change', (evt) => (parent.rotation = evt.value));
    parentFolder.addBinding(parentConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (parent.scaleX = evt.value));
    parentFolder.addBinding(parentConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (parent.scaleY = evt.value));

    const childFolder = pane.addFolder({title: 'Child Sprite2D', expanded: true});
    childFolder.addBinding(childConfig, 'x', {
        min: -100,
        max: 100,
        step: 0.1,
    }).on('change', (evt) => (child.x = evt.value));
    childFolder.addBinding(childConfig, 'y', {
        min: -100,
        max: 100,
        step: 0.1,
    }).on('change', (evt) => (child.y = evt.value));
    childFolder.addBinding(childConfig, 'width', {
        min: 0,
        max: childConfig.width * 2,
        step: 0.1,
    }).on('change', (evt) => (child.width = evt.value));
    childFolder.addBinding(childConfig, 'height', {
        min: 0,
        max: childConfig.height * 2,
        step: 0.1,
    }).on('change', (evt) => (child.height = evt.value));
    childFolder.addBinding(childConfig, 'rotation', {
        min: 0,
        max: 360,
        step: 0.01,
    }).on('change', (evt) => (child.rotation = evt.value));
    childFolder.addBinding(childConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (child.scaleX = evt.value));
    childFolder.addBinding(childConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1,
    }).on('change', (evt) => (child.scaleY = evt.value));
};