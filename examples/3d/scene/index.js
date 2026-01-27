import * as RedGPU from "../../../dist/index.js?t=1769513175662";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // 매 프레임 로직
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769513175662');
    const {
        setRedGPUTest_pane,
        setViewListTest,
        setSceneListTest,
        setDebugButtons
    } = await import("../../exampleHelper/createExample/panes/index.js?t=1769513175662");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
    setViewListTest(pane, redGPUContext.viewList, false);
    setSceneListTest(pane, redGPUContext.viewList.flatMap(v => v.scene), true);
};
