import * as RedGPU from "../../../../dist/index.js?t=1769497870527";
import {
    loadingProgressInfoHandler
} from '../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1769497870527'

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Setup camera or controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // Load GLTF model
        const MODEL_URL = 'https://redcamel.github.io/RedGL-Examples-test/asset/glTF/tokyo/scene.gltf'
        loadGLTF(view, MODEL_URL);

        // Start renderer
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            // Add additional per-frame logic here if needed
        });

        // Configure test panel
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);


const loadGLTF = async (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            view.camera.fitMeshToScreenCenter(mesh, view)

        },
        loadingProgressInfoHandler
    );
}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769497870527');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../../exampleHelper/createExample/panes/index.js?t=1769497870527');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};

