import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

/**
 * [KO] TextField3D 비교 예제 (World Size vs Pixel Size)
 * [EN] TextField3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] TextField3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(usePixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (usePixelSize) modes for TextField3D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 비교 테스트를 위한 텍스트 객체 배치
        // [EN] Arrange text objects for comparison test

        // [KO] A. 월드 사이즈 모드 (왼쪽): 실제 3D 오브젝트처럼 거리에 따라 크기가 변함
        // [EN] A. World Size Mode (Left): Size changes with distance like an actual 3D object
        const textWorld = new RedGPU.Display.TextField3D(redGPUContext, "World Size Mode");
        textWorld.x = -3;
        textWorld.y = 1;
        textWorld.worldSize = 1.5;
        textWorld.background = 'rgba(255, 0, 0, 0.8)';
        textWorld.padding = 10;
        textWorld.useBillboard = true;
        scene.addChild(textWorld);

        // [KO] B. 픽셀 사이즈 모드 (오른쪽): UI나 아이콘처럼 거리에 상관없이 화면상 크기가 고정됨
        // [EN] B. Pixel Size Mode (Right): Fixed size on screen regardless of distance, like UI or icons
        const textPixel = new RedGPU.Display.TextField3D(redGPUContext, "Pixel Size Mode");
        textPixel.x = 3;
        textPixel.y = 1;
        textPixel.usePixelSize = true;
        textPixel.background = 'rgba(0, 102, 255, 0.8)';
        textPixel.padding = 10;
        textPixel.useBillboard = true;
        scene.addChild(textPixel);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, textWorld, textPixel);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 실시간 비교 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time comparison control.
 */
const renderTestPane = (redGPUContext, textWorld, textPixel) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 월드 사이즈 텍스트 필드 설정
            // [EN] World Size TextField Settings
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(textWorld, 'text', { label: 'Text' });
            fWorld.addBinding(textWorld, 'worldSize', {min: 0.1, max: 5, step: 0.1, label: 'Size (Units)'});
            fWorld.addBinding(textWorld, 'useBillboard', { label: 'Use Billboard' });

            // [KO] 픽셀 사이즈 텍스트 필드 설정
            // [EN] Pixel Size TextField Settings
            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(textPixel, 'text', { label: 'Text' });
            fPixel.addBinding(textPixel, 'usePixelSize', { label: 'Use Pixel Size' });
            fPixel.addBinding(textPixel, 'useBillboard', { label: 'Use Billboard' });
        }
    });
};
