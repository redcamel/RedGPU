import * as RedGPU from "../../../../../dist/index.js?t=1770699661827";

/**
 * [KO] Compare Clearcoat 예제
 * [EN] Compare Clearcoat example
 *
 * [KO] GLTF Compare Clearcoat 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Compare Clearcoat model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareClearcoat/glTF-Binary/CompareClearcoat.glb');

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

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.Display.View3D} view
 * @param {string} url
 */
function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        scene.addChild(mesh)
        view.camera.fitMeshToScreenCenter(mesh, view)
    });
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../../../exampleHelper/createExample/panes/index.js?t=1770699661827');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};