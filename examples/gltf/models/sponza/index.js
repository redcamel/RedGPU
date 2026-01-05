import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);

        controller.z= 1.0
        controller.x= 2
        controller.y= 2
        controller.tilt = 15
        controller.pan = 110

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf');

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        scene.addChild(mesh)
    });
}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {createIblHelper, setDebugButtons} = await import('../../../exampleHelper/createExample/panes/index.js');
    setDebugButtons(redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};
