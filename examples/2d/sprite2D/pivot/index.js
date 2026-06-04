import * as RedGPU from "../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] Sprite2D Pivot 예제
 * [EN] Sprite2D Pivot example
 *
 * [KO] Sprite2D의 피벗(기준점)을 변경하여 회전 및 크기 조절의 기준을 변경하는 방법을 보여줍니다.
 * [EN] Demonstrates how to change the pivot (reference point) of a Sprite2D to alter the center of rotation and scaling.
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

        // 3. [KO] 부모 및 자식 Sprite2D 생성
        // [EN] Create parent and child Sprite2D
        const parentSprite2D = createParentSprite2D(redGPUContext, scene);
        parentSprite2D.setPosition(view.screenRectObject.width / 2, view.screenRectObject.height / 2);
        const childSprite2D = createChildSprite2D(redGPUContext, parentSprite2D);

        // 4. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            parentSprite2D.x = width / 2;
            parentSprite2D.y = height / 2;
        };


        // 5. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 6. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, parentSprite2D, childSprite2D);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 부모 Sprite2D를 생성하고 피벗 포인트를 시각화합니다.
 * [EN] Creates a parent Sprite2D and visualizes the pivot point.
 */
const createParentSprite2D = (redGPUContext, scene) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(100, 100);
    sprite2D.x = redGPUContext.screenRectObject.width / 2;
    sprite2D.y = redGPUContext.screenRectObject.height / 2;
    scene.addChild(sprite2D);

    const pivotPoint = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff'));
    pivotPoint.setSize(10, 10);
    sprite2D.addChild(pivotPoint);
    return sprite2D;
};

/**
 * [KO] 자식 Sprite2D를 생성하고 피벗 포인트를 시각화합니다.
 * [EN] Creates a child Sprite2D and visualizes the pivot point.
 */
const createChildSprite2D = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(50, 50);
    sprite2D.x = 100;
    sprite2D.y = 100;
    parent.addChild(sprite2D);

    const pivotPoint = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff'));
    pivotPoint.setSize(10, 10);
    sprite2D.addChild(pivotPoint);
    return sprite2D;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, parent, child) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const maxW = redGPUContext.screenRectObject.width;
            const maxH = redGPUContext.screenRectObject.height;

            const parentFolder = pane.addFolder({title: 'Parent Sprite2D', expanded: true});
            parentFolder.addBinding(parent, 'pivotX', {min: -50, max: 50, step: 0.1}).on('change', (evt) => {
                parent.pivotX = evt.value;
                parent.getChildAt(0).x = parent.pivotX;
            });
            parentFolder.addBinding(parent, 'pivotY', {min: -50, max: 50, step: 0.1}).on('change', (evt) => {
                parent.pivotY = evt.value;
                parent.getChildAt(0).y = parent.pivotY;
            });
            parentFolder.addBinding(parent, 'x', {
                min: 0,
                max: maxW,
                step: 0.1
            }).on('change', (evt) => parent.x = evt.value);
            parentFolder.addBinding(parent, 'y', {
                min: 0,
                max: maxH,
                step: 0.1
            }).on('change', (evt) => parent.y = evt.value);
            parentFolder.addBinding(parent, 'width', {
                min: 0,
                max: parent.width * 2,
                step: 0.1
            }).on('change', (evt) => parent.width = evt.value);
            parentFolder.addBinding(parent, 'height', {
                min: 0,
                max: parent.height * 2,
                step: 0.1
            }).on('change', (evt) => parent.height = evt.value);
            parentFolder.addBinding(parent, 'rotation', {
                min: 0,
                max: 360,
                step: 0.01
            }).on('change', (evt) => parent.rotation = evt.value);
            parentFolder.addBinding(parent, 'scaleX', {
                min: 0,
                max: 5,
                step: 0.1
            }).on('change', (evt) => parent.scaleX = evt.value);
            parentFolder.addBinding(parent, 'scaleY', {
                min: 0,
                max: 5,
                step: 0.1
            }).on('change', (evt) => parent.scaleY = evt.value);

            const childFolder = pane.addFolder({title: 'Child Sprite2D', expanded: true});
            childFolder.addBinding(child, 'pivotX', {min: -50, max: 50, step: 0.1}).on('change', (evt) => {
                child.pivotX = evt.value;
                child.getChildAt(0).x = child.pivotX;
            });
            childFolder.addBinding(child, 'pivotY', {min: -50, max: 50, step: 0.1}).on('change', (evt) => {
                child.pivotY = evt.value;
                child.getChildAt(0).y = child.pivotY;
            });
            childFolder.addBinding(child, 'x', {
                min: -100,
                max: 100,
                step: 0.1
            }).on('change', (evt) => child.x = evt.value);
            childFolder.addBinding(child, 'y', {
                min: -100,
                max: 100,
                step: 0.1
            }).on('change', (evt) => child.y = evt.value);
            childFolder.addBinding(child, 'width', {
                min: 0,
                max: child.width * 2,
                step: 0.1
            }).on('change', (evt) => child.width = evt.value);
            childFolder.addBinding(child, 'height', {
                min: 0,
                max: child.height * 2,
                step: 0.1
            }).on('change', (evt) => child.height = evt.value);
            childFolder.addBinding(child, 'rotation', {
                min: 0,
                max: 360,
                step: 0.01
            }).on('change', (evt) => child.rotation = evt.value);
            childFolder.addBinding(child, 'scaleX', {
                min: 0,
                max: 5,
                step: 0.1
            }).on('change', (evt) => child.scaleX = evt.value);
            childFolder.addBinding(child, 'scaleY', {
                min: 0,
                max: 5,
                step: 0.1
            }).on('change', (evt) => child.scaleY = evt.value);
        }
    });
};
