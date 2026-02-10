/**
 * [KO] SpriteSheet3D 비교 예제 (World Size vs Pixel Size)
 * [EN] SpriteSheet3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (pixelSize) modes.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 20;
    controller.tilt = -15;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // [KO] 스프라이트 시트 정보 생성
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        '../../../assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );

    // 1. [KO] 월드 사이즈 모드 (왼쪽) - 실제 3D 오브젝트처럼 동작
    const worldSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    worldSprite.worldSize = 2.0;
    worldSprite.x = -5;
    worldSprite.play();
    scene.addChild(worldSprite);

    // 2. [KO] 기준점: 일반 3D 메쉬 (중앙) - 비교를 위한 표준 객체
    const refBox = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext), 
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    refBox.setScale(2, 2, 2);
    scene.addChild(refBox);

    // 3. [KO] 픽셀 사이즈 모드 (오른쪽) - UI나 아이콘처럼 동작
    const pixelSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    pixelSprite.usePixelSize = true;
    pixelSprite.pixelSize = 128;
    pixelSprite.x = 5;
    pixelSprite.play();
    scene.addChild(pixelSprite);

    // [KO] 설명 레이블 추가
    const createLabel = (text, subText, x, y, color) => {
        const group = new RedGPU.Display.Group3D();
        
        const label = new RedGPU.Display.TextField3D(redGPUContext, text);
        label.color = '#ffffff';
        label.fontSize = 24;
        label.background = color;
        label.padding = 10;
        label.useBillboard = true;
        
        const subLabel = new RedGPU.Display.TextField3D(redGPUContext, subText);
        subLabel.y = -1.2;
        subLabel.color = '#cccccc';
        subLabel.fontSize = 16;
        subLabel.useBillboard = true;

        group.x = x;
        group.y = y;
        group.addChild(label);
        group.addChild(subLabel);
        scene.addChild(group);
    };

    createLabel('World Size', 'Actual 3D Object', -5, 3.5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, 3.5, '#666666');
    createLabel('Pixel Size', 'UI / Icon / Label', 5, 3.5, '#ff3333');

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);

    renderTestPane(redGPUContext, worldSprite, pixelSprite);
}, (failReason) => {
    console.error('Initialization failed:', failReason);
});

const renderTestPane = async (redGPUContext, worldSprite, pixelSprite) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    // World Mode Control
    const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
    fWorld.addBinding(worldSprite, 'worldSize', {min: 0.1, max: 10, step: 0.1, label: 'Size (Units)'});
    fWorld.addBinding(worldSprite, 'useBillboard');

    // Pixel Mode Control
    const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
    fPixel.addBinding(pixelSprite, 'pixelSize', {min: 16, max: 512, step: 1, label: 'Size (Pixels)'});
    fPixel.addBinding(pixelSprite, 'useBillboard');

    // Instruction for User (Single Textarea-style Guide)
    const fInfo = pane.addFolder({title: 'Usage Guide', expanded: true});
    const guide = {
        content: '• Zoom: Mouse Wheel / Pinch\n• World Mode: Size by distance\n(Like 3D objects)\n• Pixel Mode: Fixed pixel size\n(Like UI/Labels)'
    };
    fInfo.addBinding(guide, 'content', {
        readonly: true,
        label: null,
        multiline: true,
        rows: 6
    });

    const refresh = () => {
        pane.refresh();
        requestAnimationFrame(refresh);
    };
    refresh();
};