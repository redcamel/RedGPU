import * as RedGPU from "../../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781141623471";

/**
 * [KO] Single View 예제
 * [EN] Single View example
 *
 * [KO] 가장 기본적인 형태인 단일 뷰 구성 방법을 보여줍니다.
 * [EN] Demonstrates the most basic way to set up a single view.
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
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        
        // [KO] 디버그 헬퍼 활성화 (축 및 그리드)
        // [EN] Enable debug helpers (axis and grid)
        view.axis = true;
        view.grid = true;
        
        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        /**
         * [KO] 씬에 무작위 메시를 추가하는 헬퍼 함수입니다.
         * [EN] Helper function to add random meshes to the scene.
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

        // [KO] 씬에 객체 추가
        // [EN] Add objects to scene
        addMeshesToScene(scene, 1000);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 작성
            // [EN] Write logic to be executed every frame
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
