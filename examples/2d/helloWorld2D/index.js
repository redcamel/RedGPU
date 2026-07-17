import * as RedGPU from "../../../dist/index.js?t=1784264152422";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1784264152422";

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
        // 1. [KO] Scene 생성
        // [EN] Create Scene
        const scene = new RedGPU.Display.Scene();

        // 2. [KO] 2D View 생성 및 등록
        // [KO] View2D는 CSS 픽셀 단위의 좌표계를 제공합니다.
        // [EN] Create and register 2D View
        // [EN] View2D provides a coordinate system based on CSS pixels.
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] 텍스처 및 재질 생성
        // [EN] Create texture and material
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // 4. [KO] Sprite2D 생성 및 설정
        // [EN] Create and configure Sprite2D
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);

        // 5. [KO] 초기 위치 설정 (화면 중앙)
        // [KO] view.screenRectObject를 통해 현재 뷰의 CSS 픽셀 크기를 가져옵니다.
        // [EN] Set initial position (center of screen)
        // [EN] Get the current view's CSS pixel size via view.screenRectObject.
        const {screenRectObject} = view;
        sprite2D.x = screenRectObject.width / 2;
        sprite2D.y = screenRectObject.height / 2;
        scene.addChild(sprite2D);

        // 6. [KO] 리사이즈 이벤트 처리
        // [KO] 화면 크기 변경 시 Sprite2D의 위치를 중앙으로 유지합니다.
        // [EN] Handle resize event
        // [EN] Maintain Sprite2D position at the center during screen size changes.
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        // 7. [KO] 렌더러 시작 및 루프 정의
        // [EN] Start renderer and define loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            sprite2D.rotation += 1;
        });

        // 8. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        redGPUContext: true
    });
};
