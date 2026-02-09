import * as RedGPU from "../../../../dist/index.js?t=1770634235177";

/**
 * [KO] Multi View 예제
 * [EN] Multi View example
 *
 * [KO] 하나의 캔버스에 여러 개의 뷰를 배치하고 관리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to arrange and manage multiple views on a single canvas.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 첫 번째 뷰 설정
        // [EN] Setup first view
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 두 번째 뷰 설정
        // [EN] Setup second view
        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);
        view2.grid = true;
        redGPUContext.addView(view2);

        // [KO] 세 번째 뷰 설정 (움직이는 작은 뷰)
        // [EN] Setup third view (small moving view)
        const controller3 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene3 = new RedGPU.Display.Scene();
        const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);
        view3.axis = true;
        view3.grid = true;
        redGPUContext.addView(view3);

        // [KO] 각 뷰의 레이아웃 설정
        // [EN] Set layout for each view
        view.width = '50%';
        view2.width = '50%';
        view3.width = '10%';
        view3.height = '10%';
        view.x = '0%';
        view2.x = '50%';

        /**
         * [KO] 씬에 무작위 메시를 추가합니다.
         * [EN] Adds random meshes to the scene.
         * @param {RedGPU.Display.Scene} scene - [KO] 대상 씬 [EN] Target scene
         * @param {number} count - [KO] 메시 개수 [EN] Mesh count
         */
        const addMeshesToScene = (scene, count = 200) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
            const material = new RedGPU.Material.ColorMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setScale(Math.random() * 3 + 1);
                mesh.setPosition(
                    Math.random() * 300 - 150,
                    Math.random() * 300 - 150,
                    Math.random() * 300 - 150
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene);
        addMeshesToScene(scene2);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // [KO] 세 번째 뷰를 화면 중앙에서 회전시킴
            // [EN] Rotate the third view around the center of the screen
            view3.x = `${Math.sin(time / 1000) * 25 + 50}%`;
            view3.y = `${Math.cos(time / 1000) * 25 + 50}%`;
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770634235177');
    const {
        setViewListTest,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770634235177");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setViewListTest(pane, redGPUContext.viewList, true);
};