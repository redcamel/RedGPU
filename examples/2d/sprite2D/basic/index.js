import * as RedGPU from "../../../../dist/index.js?t=1783323470979";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323470979";

/**
 * [KO] Sprite2D 기본 예제
 * [EN] Sprite2D Basic Example
 *
 * [KO] Sprite2D의 기본적인 생성과 설정 방법을 보여줍니다.
 * [EN] Demonstrates the basic creation and configuration of Sprite2D.
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
        // [EN] Create and register 2D View
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] 텍스처 및 재질 생성
        // [EN] Create texture and material
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // 4. [KO] Sprite2D 생성 및 설정
        // [EN] Create and configure Sprite2D
        const sprite = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite.setSize(200, 200);
        scene.addChild(sprite);

        // 5. [KO] 초기 위치 설정 (화면 중앙)
        // [EN] Set initial position (center of screen)
        const {screenRectObject} = view;
        sprite.x = screenRectObject.width / 2;
        sprite.y = screenRectObject.height / 2;

        // 6. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        view.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            sprite.x = width / 2;
            sprite.y = height / 2;
        };

        // 7. [KO] 렌더러 시작 및 애니메이션 루프
        // [EN] Start renderer and animation loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            sprite.rotation += 1;
        });

        // 8. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, sprite);
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
const renderTestPane = (redGPUContext, sprite) => {
    new RedGPUExampleHelper(redGPUContext, {
        redGPUContext: true,
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Sprite2D'});
            folder.addBinding(sprite, 'x');
            folder.addBinding(sprite, 'y');
            folder.addBinding(sprite, 'scaleX');
            folder.addBinding(sprite, 'scaleY');
            folder.addBinding(sprite, 'rotation');
            folder.addBinding(sprite, 'opacity', {min: 0, max: 1});
        }
    });
};
