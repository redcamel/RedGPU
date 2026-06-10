import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781131404967";
import * as RedGPU from "../../../../dist/index.js?t=1781131404967";
/**
 * [KO] Normal Tangent Test 예제
 * [EN] Normal Tangent Test example
 *
 * [KO] Normal Tangent Test GLTF 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the Normal Tangent Test GLTF model.
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
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/NormalTangentTest/glTF-Binary/NormalTangentTest.glb';
        loadGLTF(view, MODEL_URL);

        // Start renderer
        const renderer = new RedGPU.Renderer();
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
const loadGLTF = (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view)

        },
        RedGPUExampleHelper.loadingProgressInfoHandler
    );
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};
