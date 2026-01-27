import * as RedGPU from "../../../dist/index.js?t=1769513175662";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = view.screenRectObject.width / 2;
        sprite2D.y = view.screenRectObject.height / 2;
        scene.addChild(sprite2D);

        view.onResize = (width, height) => {
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            sprite2D.rotation += 1;
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769513175662');
    const {setRedGPUTest_pane} = await import("../../exampleHelper/createExample/panes/index.js?t=1769513175662");
    const {setDebugButtons} = await import('../../exampleHelper/createExample/panes/index.js?t=1769513175662');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, true);
};
