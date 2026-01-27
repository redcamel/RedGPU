import * as RedGPU from "../../../../dist/index.js?t=1769495390300";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);
        view2.grid = true;
        redGPUContext.addView(view2);

        const controller3 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene3 = new RedGPU.Display.Scene();
        const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);
        view3.axis = true;
        view3.grid = true;
        redGPUContext.addView(view3);

        view.width = '50%';
        view2.width = '50%';
        view3.width = '10%';
        view3.height = '10%';
        view.x = '0%';
        view2.x = '50%';

        const addMeshesToScene = (scene, count = 200) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
            const material = new RedGPU.Material.ColorMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setScale(Math.random() * 3 + 1);
                mesh.setPosition(
                    Math.random() * 300 - 150,
                    Math.random() * 300 - 150,
                    Math.random() * 300 - 150
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene);
        addMeshesToScene(scene2);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            view3.x = `${Math.sin(time / 1000) * 25 + 50}%`;
            view3.y = `${Math.cos(time / 1000) * 25 + 50}%`;
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769495390300');
    const {
        setRedGPUTest_pane,
        setViewListTest,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769495390300");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
    setViewListTest(pane, redGPUContext.viewList, true);
};
