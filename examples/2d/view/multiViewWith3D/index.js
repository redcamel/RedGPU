import * as RedGPU from "../../../../dist/index.js?t=1769512737237";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller3D = new RedGPU.Camera.OrbitController(redGPUContext);

        const sceneFor3D = new RedGPU.Display.Scene();
        const viewFor3D = new RedGPU.Display.View3D(redGPUContext, sceneFor3D, controller3D);
        viewFor3D.grid = true;
        viewFor3D.axis = true;
        redGPUContext.addView(viewFor3D);

        const sceneFor2D = new RedGPU.Display.Scene();
        const viewFor2D = new RedGPU.Display.View2D(redGPUContext, sceneFor2D);
        viewFor2D.setSize("100%", 200);
        sceneFor2D.useBackgroundColor = true;
        sceneFor2D.backgroundColor.setColorByHEX("#471010");
        sceneFor2D.backgroundColor.a = 0.5;
        redGPUContext.addView(viewFor2D);

        const texture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = viewFor2D.screenRectObject.width / 2;
        sprite2D.y = viewFor2D.screenRectObject.height / 2;
        sceneFor2D.addChild(sprite2D);

        viewFor2D.onResize = (width, height) => {
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        const onResizeRedGPUContext = () => {
            viewFor2D.y = redGPUContext.screenRectObject.height - 200;
        };
        redGPUContext.onResize = onResizeRedGPUContext;
        onResizeRedGPUContext();

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            sprite2D.rotation += 1;
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512737237");
    const {
        setDebugButtons,
        setRedGPUTest_pane,
        setViewListTest
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512737237");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
    setViewListTest(pane, redGPUContext.viewList, true, true);
};
