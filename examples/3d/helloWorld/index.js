import * as RedGPU from "../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Hello RedGPU 예제
 * [EN] Hello RedGPU example
 *
 * [KO] RedGPU의 기본 초기화 방법과 초기화 성공 시 제공되는 RedGPUContext의 기본 옵션을 테스트합니다.
 * [EN] Demonstrates the basic initialization of RedGPU and tests the default options of RedGPUContext provided upon initialization.
 */

// [KO] 캔버스 생성 및 DOM 추가
// [EN] Create canvas and append to DOM
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성
        // [EN] Create camera controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] 씬 및 3D 뷰 생성
        // [EN] Create scene and 3D view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 축 및 그리드 표시 활성화
        // [EN] Enable axis and grid display
        view.axis = true;
        view.grid = true;

        // [KO] 컨텍스트에 뷰 등록
        // [EN] Register view to context
        redGPUContext.addView(view);

        // [KO] 렌더러 생성 및 렌더링 루프 시작
        // [EN] Create renderer and start rendering loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        // [KO] 테스트 패널(GUI) 생성
        // [EN] Create test panel (GUI)
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 출력
        // [EN] Output error if initialization fails
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI 패널을 구성합니다.
 * [EN] Configures the GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        redGPUContext: true
    });
};
