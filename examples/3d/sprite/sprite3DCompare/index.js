import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        // [KO] 월드 사이즈 모드 (왼쪽): 실제 3D 오브젝트처럼 거리에 따라 크기가 변함
        // [EN] World Size Mode (Left): Size changes with distance like an actual 3D object
        const spriteWorld = new RedGPU.Display.Sprite3D(redGPUContext, material);
        spriteWorld.worldSize = 2.0;
        spriteWorld.x = -5;
        scene.addChild(spriteWorld);

        // [KO] 기준점: 일반 3D 메쉬 (중앙)
        // [EN] Reference: Standard 3D Mesh (Center)
        const refBox = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
        );
        refBox.setScale(2);
        scene.addChild(refBox);

        // [KO] 픽셀 사이즈 모드 (오른쪽): 거리에 상관없이 화면상 크기가 고정됨
        // [EN] Pixel Size Mode (Right): Fixed size on screen regardless of distance
        const spritePixel = new RedGPU.Display.Sprite3D(redGPUContext, material);
        spritePixel.usePixelSize = true;
        spritePixel.pixelSize = 128;
        spritePixel.x = 5;
        scene.addChild(spritePixel);

        createComparisonLabels(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, spriteWorld, spritePixel);
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

    createLabel('World Size', 'Actual 3D Object', -5, '#3333ff');
    createLabel('Standard Mesh', 'Reference Box', 0, '#666666');
    createLabel('Pixel Size', 'UI / Icon / Label', 5, '#ff3333');
}

const renderTestPane = (redGPUContext, spriteWorld, spritePixel) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(spriteWorld, 'worldSize', {min: 0.1, max: 10, step: 0.1});
            fWorld.addBinding(spriteWorld, 'useBillboard');

            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(spritePixel, 'pixelSize', {min: 16, max: 512, step: 1});
            fPixel.addBinding(spritePixel, 'useBillboard');
        }
    });
};
