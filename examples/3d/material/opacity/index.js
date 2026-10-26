import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Material Opacity 예제
 * [EN] Material Opacity Example
 *
 * [KO] 다양한 3D 객체(Sprite3D, TextField3D, SpriteSheet3D)의 머티리얼 투명도(opacity)를 개별 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to individually control material opacity across various 3D objects (Sprite3D, TextField3D, SpriteSheet3D).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const createLabel = (redGPUContext, y = 1) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext);
    label.y = y;
    label.fontSize = '36px';
    label.worldSize = 0.5;
    return label;
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 각기 다른 머티리얼/디스플레이 타입의 3D 객체를 생성하고 투명도 제어 대상 구성
        // [EN] Create 3D objects with different material/display types to demonstrate opacity control
        const bitmapMaterial = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        );
        const bitmapSprite = new RedGPU.Display.Sprite3D(redGPUContext, bitmapMaterial);
        bitmapSprite.y = 4;
        bitmapSprite.addChild(createLabel(redGPUContext));
        scene.addChild(bitmapSprite);

        const colorMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
        const colorSprite = new RedGPU.Display.Sprite3D(redGPUContext, colorMaterial);
        colorSprite.y = 1.5;
        colorSprite.addChild(createLabel(redGPUContext));
        scene.addChild(colorSprite);

        const textField = createLabel(redGPUContext, -0.5);
        scene.addChild(textField);

        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext,
            '../../../assets/spriteSheet/spriteSheet.png',
            5, 3, 15, 0, true, 24
        );
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        spriteSheet.y = -3;
        spriteSheet.addChild(createLabel(redGPUContext));
        scene.addChild(spriteSheet);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, [
            {name: 'BitmapMaterial', target: bitmapSprite, label: bitmapSprite.getChildAt(0)},
            {name: 'ColorMaterial', target: colorSprite, label: colorSprite.getChildAt(0)},
            {name: 'TextField3D', target: textField, label: textField},
            {name: 'SpriteSheet3D', target: spriteSheet, label: spriteSheet.getChildAt(0)},
        ]);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, items) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            items.forEach(({name, target, label}) => {
                const updateLabel = () => {
                    label.text = `${name} material.opacity: ${target.material.opacity.toFixed(2)}`;
                };

                const folder = pane.addFolder({title: `${name} Material`, expanded: true});
                folder.addBinding(target.material, 'opacity', {
                    min: 0,
                    max: 1,
                    step: 0.01
                }).on('change', updateLabel);

                updateLabel();
            });
        }
    });
};
