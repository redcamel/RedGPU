import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

/**
 * [KO] Multi View 예제
 * [EN] Multi View example
 *
 * [KO] 하나의 캔버스에 여러 개의 뷰를 배치하고 관리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to arrange and manage multiple views on a single canvas.
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 첫 번째 뷰 설정 (메인 뷰 - 왼쪽)
        // [EN] Setup first view (Main view - Left)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 두 번째 뷰 설정 (메인 뷰 - 오른쪽)
        // [EN] Setup second view (Main view - Right)
        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);
        view2.axis = true;
        view2.grid = true;
        redGPUContext.addView(view2);

        // [KO] 세 번째 뷰 설정 (중앙에서 움직이는 작은 뷰)
        // [EN] Setup third view (Small moving view in center)
        const controller3 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene3 = new RedGPU.Display.Scene();
        const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);
        view3.axis = true;
        view3.grid = true;
        redGPUContext.addView(view3);

        // [KO] 각 뷰의 레이아웃 설정 (비율 단위 사용 가능)
        // [EN] Set layout for each view (Percentage units supported)
        view.width = '50%';
        view2.width = '50%';
        view3.width = '10%';
        view3.height = '10%';
        view.x = '0%';
        view2.x = '50%';

        /**
         * [KO] 씬에 무작위 메시를 추가하는 헬퍼 함수입니다.
         * [EN] Helper function to add random meshes to the scene.
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

        // [KO] 각 씬에 객체 추가
        // [EN] Add objects to each scene
        addMeshesToScene(scene);
        addMeshesToScene(scene2);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 세 번째 뷰를 화면 중앙에서 회전시킴
            // [EN] Rotate the third view around the center of the screen
            view3.x = `${Math.sin(time / 1000) * 25 + 50}%`;
            view3.y = `${Math.cos(time / 1000) * 25 + 50}%`;
        };

        renderer.start(redGPUContext, render);
        
        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        viewList: true,
    });
};
