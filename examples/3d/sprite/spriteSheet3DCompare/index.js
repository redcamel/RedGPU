import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext,
            '../../../assets/spriteSheet/spriteSheet.png',
            5, 3, 15, 0, true, 24
        );

        // [KO] 월드 사이즈 모드 (왼쪽): 애니메이션이 재생되며 거리에 따라 크기가 변함
        // [EN] World Size Mode (Left): Animation plays and size changes with distance
        const worldSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        worldSprite.worldSize = 2.0;
        worldSprite.x = -5;
        scene.addChild(worldSprite);

        // [KO] 기준점: 일반 3D 메쉬 (중앙)
        // [EN] Reference: Standard 3D Mesh (Center)
        const refBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
        );
        refBox.setScale(2);
        scene.addChild(refBox);

        // [KO] 픽셀 사이즈 모드 (오른쪽): 애니메이션이 재생되며 화면상 크기가 고정됨
        // [EN] Pixel Size Mode (Right): Animation plays and size remains fixed on screen
        const pixelSprite = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        pixelSprite.usePixelSize = true;
        pixelSprite.pixelSize = 128;
        pixelSprite.x = 5;
        scene.addChild(pixelSprite);

        createComparisonLabels(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, worldSprite, pixelSprite);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function createComparisonLabels(redGPUContext, scene) {
    const createLabel = (text, subText, x, color) => {
        const group = new RedGPU.Display.Group3D();

        const mainLabel = new RedGPU.Display.TextField3D(redGPUContext, text);
        mainLabel.color = '#ffffff';
        mainLabel.fontSize = 24;
        mainLabel.background = color;
        mainLabel.padding = 10;

        const subLabel = new RedGPU.Display.TextField3D(redGPUContext, subText);
        subLabel.y = -1.2;
        subLabel.color = '#cccccc';
        subLabel.fontSize = 16;

        group.setPosition(x, 3.5, 0);
        group.addChild(mainLabel);
        group.addChild(subLabel);
        scene.addChild(group);
    };

    createLabel('World Size', 'Animated 3D Sprite', -5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, '#666666');
    createLabel('Pixel Size', 'Animated UI Sprite', 5, '#ff3333');
}

const renderTestPane = (redGPUContext, worldSprite, pixelSprite) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(worldSprite, 'worldSize', {min: 0.1, max: 10, step: 0.1});
            fWorld.addBinding(worldSprite, 'useBillboard');

            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(pixelSprite, 'pixelSize', {min: 16, max: 512, step: 1});
            fPixel.addBinding(pixelSprite, 'useBillboard');
        }
    });
};
