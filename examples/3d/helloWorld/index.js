import * as RedGPU from "../../../dist/index.js?t=1770713934910";

/**
 * [KO] Hello World 3D 예제
 * [EN] Hello World 3D example
 *
 * [KO] 가장 기본적인 RedGPU 3D 씬 구성 방법을 보여줍니다.
 * [EN] Demonstrates the most basic way to set up a RedGPU 3D scene.
 */

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

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic to be executed every frame
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (redGPUContext, view) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const {
        setRedGPUTest_pane,
        setDebugButtons
    } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, true);
};
