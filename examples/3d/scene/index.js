import * as RedGPU from "../../../dist/index.js?t=1781136546834";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1781136546834";

/**
 * [KO] Scene 예제
 * [EN] Scene example
 *
 * [KO] 씬(Scene)의 배경색 설정 등 기본적인 씬 구성 방법을 보여줍니다.
 * [EN] Demonstrates basic scene configuration, such as setting the background color of a scene.
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

        // [KO] 씬 생성
        // [EN] Create scene
        const scene = new RedGPU.Display.Scene();

        // [KO] 배경색 사용 설정 및 색상 지정
        // [EN] Enable background color and specify the color
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        // [KO] 뷰 생성 및 설정 (생성한 씬과 컨트롤러 연결)
        // [EN] Create and setup view (Link the created scene and controller)
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        
        // [KO] 디버그용 축 및 그리드 활성화
        // [EN] Enable axis and grid for debugging
        view.axis = true;
        view.grid = true;
        
        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

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
        // [KO] 초기화 실패 시 에러 처리 (콘솔 출력 및 화면 메시지 표시)
        // [EN] Error handling on initialization failure (Console output and screen message display)
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
 * [KO] RedGPU 컨텍스트 
 * [EN] RedGPU Context
 */
const renderTestPane =  (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        scene: true
    });
};
