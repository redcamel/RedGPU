/**
 * [KO] Sprite3D 비교 예제 (World Size vs Pixel Size)
 * [EN] Sprite3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (pixelSize) modes.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1770698056099";

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

    // [KO] 공용 재질 및 텍스처 생성
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 1. [KO] 월드 사이즈 모드 (왼쪽)
    const spriteWorld = new RedGPU.Display.Sprite3D(redGPUContext, material);
    spriteWorld.worldSize = 2.0;
    spriteWorld.x = -5;
    scene.addChild(spriteWorld);

    // 2. [KO] 기준점: 일반 3D 메쉬 (중앙)
    const refBox = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Box(redGPUContext), 
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    refBox.setScale(2, 2, 2);
    scene.addChild(refBox);

    // 3. [KO] 픽셀 사이즈 모드 (오른쪽)
    const spritePixel = new RedGPU.Display.Sprite3D(redGPUContext, material);
    spritePixel.usePixelSize = true;
    spritePixel.pixelSize = 128;
    spritePixel.x = 5;
    scene.addChild(spritePixel);

    // [KO] 설명 레이블 추가 유틸리티
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
        group.x = x; group.y = y;
        group.addChild(label); group.addChild(subLabel);
        scene.addChild(group);
    };

    createLabel('World Size', 'Actual 3D Object', -5, 3.5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, 3.5, '#666666');
    createLabel('Pixel Size', 'UI / Icon / Label', 5, 3.5, '#ff3333');

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);

    renderTestPane(redGPUContext, spriteWorld, spritePixel);
}, (failReason) => {
    console.error('Initialization failed:', failReason);
});

const renderTestPane = async (redGPUContext, spriteWorld, spritePixel) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770698056099');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770698056099");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
    fWorld.addBinding(spriteWorld, 'worldSize', {min: 0.1, max: 10, step: 0.1, label: 'Size (Units)'});
    fWorld.addBinding(spriteWorld, 'useBillboard');

    const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
    fPixel.addBinding(spritePixel, 'pixelSize', {min: 16, max: 512, step: 1, label: 'Size (Pixels)'});
    fPixel.addBinding(spritePixel, 'useBillboard');

    const fInfo = pane.addFolder({title: 'Usage Guide', expanded: true});
    const guide = {
        content: '• Zoom: Mouse Wheel / Pinch\n\n• World Mode: Size by distance\n(Like 3D objects)\n\n• Pixel Mode: Fixed pixel size\n(Like UI/Labels)'
    };
    fInfo.addBinding(guide, 'content', {
        readonly: true, label: null, multiline: true, rows: 6
    });

    const refresh = () => { pane.refresh(); requestAnimationFrame(refresh); };
    refresh();
};