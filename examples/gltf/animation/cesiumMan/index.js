import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 8;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const glbUrls = [
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
        ];

        loadGLTFGrid(view, glbUrls);
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);
const {loadingProgressInfoHandler} = await import('../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1768301050717');

function loadGLTFGrid(view, urls, gridSize = 3, spacing = 3) {
    const {redGPUContext, scene} = view;

    const totalCols = Math.min(gridSize, urls.length);
    const totalRows = Math.ceil(urls.length / gridSize);
    const totalWidth = (totalCols - 1) * spacing;
    const totalDepth = (totalRows - 1) * spacing;

    const container = new RedGPU.Display.Mesh(view.redGPUContext)
    view.scene.addChild(container)

    let loadedNum = 0
    urls.forEach((url, index) => {
        new RedGPU.GLTFLoader(
            redGPUContext,
            url,
            (result) => {
                loadedNum++
                const mesh = result.resultMesh;
                container.addChild(mesh);

                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const x = col * spacing - totalWidth / 2;
                const z = row * spacing - totalDepth / 2;

                mesh.x = x;
                mesh.y = -0.5;
                mesh.z = z;

                if (loadedNum === urls.length) {
                    view.camera.fitMeshToScreenCenter(container, view)
                }
            },
            loadingProgressInfoHandler
        );
    });

}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../../exampleHelper/createExample/panes/index.js?t=1768301050717');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};
