import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

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

        view.onResize = (width, height) => {
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        view2.onResize = (width, height) => {
            sprite2D_2.x = width / 2;
            sprite2D_2.y = height / 2;
        };

        const renderer = new RedGPU.Renderer(redGPUContext);
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

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {
        setDebugButtons,
        setRedGPUTest_pane,
        setViewListTest
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
    setViewListTest(pane, redGPUContext.viewList, true, true);
};
