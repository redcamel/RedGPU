import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

/**
 * [KO] Multi View 예제
 * [EN] Multi View example
 *
 * [KO] 여러 개의 뷰(View2D)를 분할하여 구성하고, 각각 다른 씬(Scene)을 렌더링하는 방법을 보여줍니다.
 * [EN] Demonstrates how to divide the screen into multiple views (View2D) and render different scenes in each.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 첫 번째 Scene 및 View 생성 (좌측 50% 배치)
        // [EN] Create first Scene and View (Positioned at left 50%)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        view.setSize('50%', '100%');
        redGPUContext.addView(view);

        // 2. [KO] 두 번째 Scene 및 View 생성 (우측 50% 배치, 배경색 적용)
        // [EN] Create second Scene and View (Positioned at right 50%, with background color)
        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View2D(redGPUContext, scene2);
        view2.setSize('50%', '100%');
        view2.x = '50%';
        scene2.useBackgroundColor = true;
        scene2.backgroundColor.setColorByHEX('#471010');
        redGPUContext.addView(view2);

        // 3. [KO] 공유 텍스처 및 재질 생성
        // [EN] Create shared texture and material
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // 4. [KO] 첫 번째 Scene에 Sprite2D 추가 및 위치 설정
        // [EN] Add Sprite2D to the first Scene and set position
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = view.screenRectObject.width / 2;
        sprite2D.y = view.screenRectObject.height / 2;
        scene.addChild(sprite2D);

        // 5. [KO] 두 번째 Scene에 Sprite2D 추가 및 위치 설정
        // [EN] Add Sprite2D to the second Scene and set position
        const sprite2D_2 = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D_2.setSize(100, 100);
        sprite2D_2.x = view2.screenRectObject.width / 2;
        sprite2D_2.y = view2.screenRectObject.height / 2;
        scene2.addChild(sprite2D_2);

        // 6. [KO] 각 뷰의 리사이즈 이벤트 설정 (중앙 정렬 유지)
        // [EN] Setup resize events for each view (Maintain center alignment)
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        view2.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D_2.x = width / 2;
            sprite2D_2.y = height / 2;
        };

        // 7. [KO] 렌더러 시작 및 애니메이션 루프 정의
        // [EN] Start renderer and define animation loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            sprite2D.rotation += 1;
            sprite2D_2.setScale(Math.sin(time / 500) + Math.PI);
        };
        renderer.start(redGPUContext, render);

        // 8. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        viewList: true
    });
};