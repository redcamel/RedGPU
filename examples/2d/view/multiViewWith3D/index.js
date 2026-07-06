import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

/**
 * [KO] Multi View with 3D 예제
 * [EN] Multi View with 3D example
 *
 * [KO] 3D 뷰와 2D 뷰를 함께 사용하여 3D 장면 위에 2D UI를 오버레이하는 방법을 보여줍니다.
 * [EN] Demonstrates how to overlay a 2D UI on top of a 3D scene by using both a 3D view and a 2D view together.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 3D Scene 및 View 생성
        // [EN] Create 3D Scene and View
        const controller3D = new RedGPU.Camera.OrbitController(redGPUContext);
        const sceneFor3D = new RedGPU.Display.Scene();
        const viewFor3D = new RedGPU.Display.View3D(redGPUContext, sceneFor3D, controller3D);
        viewFor3D.grid = true;
        viewFor3D.axis = true;
        redGPUContext.addView(viewFor3D);

        // 2. [KO] 2D Scene 및 View 생성 (UI 오버레이용)
        // [EN] Create 2D Scene and View (for UI overlay)
        const sceneFor2D = new RedGPU.Display.Scene();
        const viewFor2D = new RedGPU.Display.View2D(redGPUContext, sceneFor2D);
        viewFor2D.setSize("100%", 200);
        sceneFor2D.useBackgroundColor = true;
        sceneFor2D.backgroundColor.setColorByHEX("#471010");
        sceneFor2D.backgroundColor.a = 0.5;
        redGPUContext.addView(viewFor2D);

        // 3. [KO] 텍스처 및 재질 생성
        // [EN] Create texture and material
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // 4. [KO] 2D Scene에 Sprite2D 추가 및 위치 설정
        // [EN] Add Sprite2D to the 2D Scene and set position
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = viewFor2D.screenRectObject.width / 2;
        sprite2D.y = viewFor2D.screenRectObject.height / 2;
        sceneFor2D.addChild(sprite2D);

        // 5. [KO] 리사이즈 이벤트 설정 (반응형 배치)
        // [EN] Setup resize events (Responsive layout)
        viewFor2D.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite2D.x = width / 2;
            sprite2D.y = height / 2;
        };

        const onResizeRedGPUContext = (resizeEvent) => {
            const screenRect = resizeEvent ? resizeEvent.screenRectObject : redGPUContext.screenRectObject;
            viewFor2D.y = screenRect.height - 250;
        };
        redGPUContext.onResize = onResizeRedGPUContext;
        onResizeRedGPUContext();

        // 6. [KO] 렌더러 시작 및 애니메이션 루프 정의
        // [EN] Start renderer and define animation loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            sprite2D.rotation += 1;
        };
        renderer.start(redGPUContext, render);

        // 7. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error("Initialization failed:", failReason);
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
