import * as RedGPU from "../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] Multi View 예제
 * [EN] Multi View example
 *
 * [KO] 여러 개의 뷰(View2D)를 분할하여 구성하고, 각각 다른 씬(Scene)을 렌더링하는 방법을 보여줍니다.
 * [EN] Demonstrates how to divide the screen into multiple views (View2D) and render different scenes in each.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        view.setSize('50%', '100%');
        redGPUContext.addView(view);

        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View2D(redGPUContext, scene2);
        view2.setSize('50%', '100%');
        view2.x = '50%';
        scene2.useBackgroundColor = true;
        scene2.backgroundColor.setColorByHEX('#471010');
        redGPUContext.addView(view2);

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = view.screenRectObject.width / 2;
        sprite2D.y = view.screenRectObject.height / 2;
        scene.addChild(sprite2D);

        const sprite2D_2 = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D_2.setSize(100, 100);
        sprite2D_2.x = view2.screenRectObject.width / 2;
        sprite2D_2.y = view2.screenRectObject.height / 2;
        scene2.addChild(sprite2D_2);

        /**
         * [KO] 뷰 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the view size changes.
         */
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        /**
         * [KO] 뷰 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the view size changes.
         */
        view2.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D_2.x = width / 2;
            sprite2D_2.y = height / 2;
        };

        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            sprite2D.rotation += 1;
            sprite2D_2.setScale(Math.sin(time / 500) + Math.PI);
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        viewList: true
    });
};