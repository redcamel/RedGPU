import * as RedGPU from "../../../dist/index.js?t=1770637396475";

/**
 * [KO] Scene 예제
 * [EN] Scene example
 *
 * [KO] 씬(Scene)의 배경색 설정 등 기본적인 씬 구성 방법을 보여줍니다.
 * [EN] Demonstrates basic scene configuration, such as setting the background color of a scene.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        // [KO] 배경색 사용 설정 및 색상 지정
        // [EN] Enable background color and specify the color
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770637396475');
    const {
        setRedGPUTest_pane,
        setViewListTest,
        setSceneListTest,
        setDebugButtons
    } = await import("../../exampleHelper/createExample/panes/index.js?t=1770637396475");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setSceneListTest(pane, redGPUContext.viewList.flatMap(v => v.scene), true);
};
