import * as RedGPU from "../../../../dist/index.js?t=1781131404967";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781131404967";

/**
 * [KO] SpriteSheet3D 비교 예제 (World Size vs Pixel Size)
 * [EN] SpriteSheet3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] 스프라이트 시트 애니메이션이 적용된 객체들의 월드 단위 크기와 고정 픽셀 크기 모드를 비교 시연합니다.
 * [EN] Compares and demonstrates World Size and fixed Pixel Size modes for objects with sprite sheet animation.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas, 
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = -15;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 스프라이트 시트 정보 생성
        // [EN] Create SpriteSheet Info
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext,
            '../../../assets/spriteSheet/spriteSheet.png',
            5, 3, 15, 0, true, 24
        );

        // 3. [KO] 비교 테스트를 위한 객체 배치
        // [EN] Arrange objects for comparison test

        // [KO] A. 월드 사이즈 모드 (왼쪽): 애니메이션이 재생되며 거리에 따라 크기가 변함
        // [EN] A. World Size Mode (Left): Animation plays and size changes with distance
        const worldSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        worldSprite.worldSize = 2.0;
        worldSprite.x = -5;
        worldSprite.play();
        scene.addChild(worldSprite);

        // [KO] B. 기준점: 일반 3D 메쉬 (중앙): 비교를 위한 표준 박스 객체
        // [EN] B. Reference: Standard 3D Mesh (Center): Standard box object for comparison
        const refBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
        );
        refBox.setScale(2);
        scene.addChild(refBox);

        // [KO] C. 픽셀 사이즈 모드 (오른쪽): 애니메이션이 재생되며 화면상 크기가 고정됨
        // [EN] C. Pixel Size Mode (Right): Animation plays and size remains fixed on screen
        const pixelSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        pixelSprite.usePixelSize = true;
        pixelSprite.pixelSize = 128;
        pixelSprite.x = 5;
        pixelSprite.play();
        scene.addChild(pixelSprite);

        // 4. [KO] 설명 라벨 추가 유틸리티 실행
        // [EN] Run utility to add descriptive labels
        createComparisonLabels(redGPUContext, scene);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, worldSprite, pixelSprite);
    }, 
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 각 객체의 특성을 설명하는 3D 라벨들을 생성합니다.
 * [EN] Creates 3D labels explaining the characteristics of each object.
 */
function createComparisonLabels(redGPUContext, scene) {
    const createLabel = (text, subText, x, color) => {
        const group = new RedGPU.Display.Group3D();

        const mainLabel = new RedGPU.Display.TextField3D(redGPUContext, text);
        mainLabel.color = '#ffffff';
        mainLabel.fontSize = 24;
        mainLabel.background = color;
        mainLabel.padding = 10;
        mainLabel.useBillboard = true;

        const subLabel = new RedGPU.Display.TextField3D(redGPUContext, subText);
        subLabel.y = -1.2;
        subLabel.color = '#cccccc';
        subLabel.fontSize = 16;
        subLabel.useBillboard = true;

        group.setPosition(x, 3.5, 0);
        group.addChild(mainLabel);
        group.addChild(subLabel);
        scene.addChild(group);
    };

    createLabel('World Size', 'Animated 3D Sprite', -5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, '#666666');
    createLabel('Pixel Size', 'Animated UI Sprite', 5, '#ff3333');
}

/**
 * [KO] 실시간 비교 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time comparison control.
 */
const renderTestPane = (redGPUContext, worldSprite, pixelSprite) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 왼쪽: 월드 사이즈 모드 설정
            // [EN] Left: World Size Mode Settings
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(worldSprite, 'worldSize', {min: 0.1, max: 10, step: 0.1, label: 'Size (Units)'});
            fWorld.addBinding(worldSprite, 'useBillboard', { label: 'Use Billboard' });

            // [KO] 오른쪽: 픽셀 사이즈 모드 설정
            // [EN] Right: Pixel Size Mode Settings
            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(pixelSprite, 'pixelSize', {min: 16, max: 512, step: 1, label: 'Size (Pixels)'});
            fPixel.addBinding(pixelSprite, 'useBillboard', { label: 'Use Billboard' });

            // [KO] 도움말 가이드
            // [EN] Usage Guide
            const fInfo = pane.addFolder({title: 'Usage Guide', expanded: true});
            const guide = {
                content: '• Zoom: Mouse Wheel / Pinch\n\n• World Mode: Size by distance\n(Like 3D objects)\n\n• Pixel Mode: Fixed pixel size\n(Like UI/Labels)'
            };
            fInfo.addBinding(guide, 'content', {
                readonly: true,
                label: null,
                multiline: true,
                rows: 6
            });
        }
    });
};
