import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Single View 예제
 * [EN] Single View example
 *
 * [KO] 가장 기본적인 형태인 단일 뷰 구성 방법을 보여줍니다.
 * [EN] Demonstrates the most basic way to set up a single view.
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

        /**
         * [KO] 씬에 무작위 메시를 추가합니다.
         * [EN] Adds random meshes to the scene.
         * @param {RedGPU.Display.Scene} scene - [KO] 대상 씬 [EN] Target scene
         * @param {number} count - [KO] 메시 개수 [EN] Mesh count
         */
        const addMeshesToScene = (scene, count = 500) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
            const material = new RedGPU.Material.ColorMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const {
        setViewListTest,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setViewListTest(pane, redGPUContext.viewList, true);
};