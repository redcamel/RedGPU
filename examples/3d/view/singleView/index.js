import * as RedGPU from "../../../../dist/index.js?t=1769586895088";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const addMeshesToScene = (scene, count = 500) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
            const material = new RedGPU.Material.ColorMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769586895088');
    const {
        setRedGPUTest_pane,
        setViewListTest,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769586895088");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
    setViewListTest(pane, redGPUContext.viewList, true);
};
