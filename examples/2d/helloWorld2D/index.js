import * as RedGPU from "../../../dist/index.js?t=1770713934910";

/**
 * [KO] Hello World 2D 예제
 * [EN] Hello World 2D example
 *
 * [KO] RedGPU 2D 씬의 기본적인 구성과 Sprite2D 생성 방법을 보여줍니다.
 * [EN] Demonstrates the basic setup of a RedGPU 2D scene and how to create a Sprite2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        /**
         * [KO] Scene 생성
         * [EN] Create Scene
         */
        const scene = new RedGPU.Display.Scene();

        /**
         * [KO] View 생성 및 등록
         * [EN] Create and register View
         */
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        /**
         * [KO] 텍스처 및 재질 생성
         * [EN] Create texture and material
         */
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        /**
         * [KO] Sprite2D 생성
         * [EN] Create Sprite2D
         */
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);

        /**
         * [KO] 초기 위치 설정 (화면 중앙)
         * [KO] screenRectObject: CSS 픽셀 단위의 화면 크기 정보
         * [EN] Set initial position (center of screen)
         * [EN] screenRectObject: Screen size information in CSS pixels
         */
        const {screenRectObject} = view;
        sprite2D.x = screenRectObject.width / 2;
        sprite2D.y = screenRectObject.height / 2;
        scene.addChild(sprite2D);

        /**
         * [KO] 리사이즈 이벤트 설정
         * [KO] 반응형 레이아웃 처리를 위해 onResize 콜백을 사용합니다.
         * [KO] resizeEvent.screenRect: CSS 픽셀 단위의 화면 크기 정보 (UI 배치용)
         * [EN] Set resize event
         * [EN] Use onResize callback for responsive layout handling.
         * [EN] resizeEvent.screenRect: Screen size information in CSS pixels (for UI layout)
         */
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        /**
         * [KO] 렌더러 생성 및 루프 시작
         * [EN] Create renderer and start loop
         */
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            sprite2D.rotation += 1;
        };
        renderer.start(redGPUContext, render);

        /**
         * [KO] 테스트용 UI 생성
         * [EN] Create test UI
         */
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        /**
         * [KO] 초기화 실패 시 처리
         * [EN] Handle initialization failure
         */
        console.error('Initialization failed:', failReason);
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const {setRedGPUTest_pane} = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    const {setDebugButtons} = await import('../../exampleHelper/createExample/panes/index.js?t=1770713934910');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, true);
};