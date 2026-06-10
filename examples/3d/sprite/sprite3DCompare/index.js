import * as RedGPU from "../../../../dist/index.js?t=1781133866175";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781133866175";

/**
 * [KO] Sprite3D 비교 예제 (World Size vs Pixel Size)
 * [EN] Sprite3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 모드의 시각적 차이점을 비교 시연합니다.
 * [EN] Compares and demonstrates the visual differences between World Size (worldSize) and fixed Pixel Size (pixelSize) modes.
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

        // [KO] 공용 재질 및 텍스처 생성
        // [EN] Create shared material and texture
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // 3. [KO] 비교 테스트를 위한 객체 배치
        // [EN] Arrange objects for comparison test

        // [KO] A. 월드 사이즈 모드 (왼쪽): 실제 3D 오브젝트처럼 거리에 따라 크기가 변함
        // [EN] A. World Size Mode (Left): Size changes with distance like an actual 3D object
        const spriteWorld = new RedGPU.Display.Sprite3D(redGPUContext, material);
        spriteWorld.worldSize = 2.0;
        spriteWorld.x = -5;
        scene.addChild(spriteWorld);

        // [KO] B. 기준점: 일반 3D 메쉬 (중앙): 비교를 위한 표준 박스 객체
        // [EN] B. Reference: Standard 3D Mesh (Center): Standard box object for comparison
        const refBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
        );
        refBox.setScale(2);
        scene.addChild(refBox);

        // [KO] C. 픽셀 사이즈 모드 (오른쪽): UI나 아이콘처럼 거리에 상관없이 화면상 크기가 고정됨
        // [EN] C. Pixel Size Mode (Right): Fixed size on screen regardless of distance, like UI or icons
        const spritePixel = new RedGPU.Display.Sprite3D(redGPUContext, material);
        spritePixel.usePixelSize = true;
        spritePixel.pixelSize = 128;
        spritePixel.x = 5;
        scene.addChild(spritePixel);

        // 4. [KO] 설명 라벨 추가 유틸리티 실행
        // [EN] Run utility to add descriptive labels
        createComparisonLabels(redGPUContext, scene);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, spriteWorld, spritePixel);
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

    createLabel('World Size', 'Actual 3D Object', -5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, '#666666');
    createLabel('Pixel Size', 'UI / Icon / Label', 5, '#ff3333');
}

/**
 * [KO] 실시간 비교 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time comparison control.
 */
const renderTestPane = (redGPUContext, spriteWorld, spritePixel) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 왼쪽: 월드 사이즈 모드 설정
            // [EN] Left: World Size Mode Settings
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(spriteWorld, 'worldSize', {min: 0.1, max: 10, step: 0.1, label: 'Size (Units)'});
            fWorld.addBinding(spriteWorld, 'useBillboard', { label: 'Use Billboard' });

            // [KO] 오른쪽: 픽셀 사이즈 모드 설정
            // [EN] Right: Pixel Size Mode Settings
            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(spritePixel, 'pixelSize', {min: 16, max: 512, step: 1, label: 'Size (Pixels)'});
            fPixel.addBinding(spritePixel, 'useBillboard', { label: 'Use Billboard' });

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
