import * as RedGPU from "../../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Skybox With IBL 예제
 * [EN] Skybox With IBL example
 *
 * [KO] IBL(Image Based Lighting)을 사용하여 스카이박스를 생성하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a skybox using IBL (Image Based Lighting).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (view) => {
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910" );
    const pane = new Pane();
    const {
        createFieldOfView,
        createIblHelper,
        setDebugButtons
    } = await import( "../../../../exampleHelper/createExample/panes/index.js?t=1770713934910" );
    setDebugButtons(RedGPU, view.redGPUContext);
    createFieldOfView(pane, view.camera);
    createIblHelper(pane, view, RedGPU);
};