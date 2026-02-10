import * as RedGPU from "../../../../dist/index.js?t=1770698056099";
import {
    loadingProgressInfoHandler
} from '../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1770698056099'

/**
 * [KO] Metal Rough Spheres (No Textures) 예제
 * [EN] Metal Rough Spheres (No Textures) example
 *
 * [KO] 텍스처가 없는 Metal Rough Spheres GLTF 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the Metal Rough Spheres GLTF model without textures.
 */

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
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MetalRoughSpheresNoTextures/glTF-Binary/MetalRoughSpheresNoTextures.glb';
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


/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.Display.View3D} view
 * @param {string} url
 */
const loadGLTF = async (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            view.camera.fitMeshToScreenCenter(mesh, view)
            view.camera.distance *= 0.75
        },
        loadingProgressInfoHandler
    );
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770698056099');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../../exampleHelper/createExample/panes/index.js?t=1770698056099');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};