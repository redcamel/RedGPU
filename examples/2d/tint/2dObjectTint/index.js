import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] 2D Object Tint 예제
 * [EN] 2D Object Tint example
 *
 * [KO] 다양한 2D 객체(Sprite2D, SpriteSheet2D, TextField2D)에 틴트 색상을 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply tint colors to various 2D objects (Sprite2D, SpriteSheet2D, TextField2D).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );

        const sprite2D_color = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#cf8989'));
        sprite2D_color.setSize(200, 200);
        sprite2D_color.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(sprite2D_color);

        const sprite2D_bitmap = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base));
        sprite2D_bitmap.setSize(200, 200);
        sprite2D_bitmap.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(sprite2D_bitmap);

        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
        const spriteSheet2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
        spriteSheet2D.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(spriteSheet2D);

        const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
        textField2D.text = 'RedGPU';
        textField2D.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(textField2D);

        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;

            const gap = 220;
            const totalChildren = scene.children.length;
            const rowWidth = (totalChildren - 1) * gap;
            const startX = (width - rowWidth) / 2;
            const startY = height / 2;

            scene.children.forEach((child, index) => {
                child.x = startX + index * gap;
                child.y = startY;
            });
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        renderTestPane(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            // base.rotation += 1;
        };
        renderer.start(redGPUContext, render);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext);
    const firstChild = scene.children[0];
    const defaultTint = firstChild ? firstChild.material.tint : {r: 255, g: 255, b: 255, a: 1};
    const tintSettings = {
        tintR: defaultTint.r,
        tintG: defaultTint.g,
        tintB: defaultTint.b,
        tintA: defaultTint.a,
        tint: {r: defaultTint.r, g: defaultTint.g, b: defaultTint.b, a: defaultTint.a},
        useTint: firstChild ? firstChild.material.useTint : true,
        tintBlendMode: firstChild ? RedGPU.Material.TINT_BLEND_MODE[firstChild.material.tintBlendMode] : 0,
    };

    pane.addBinding(tintSettings, 'useTint', {label: 'Use Tint'}).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.useTint = ev.value;
        });
    });

    pane.addBinding(tintSettings, 'tintBlendMode', {
        label: 'Tint Mode',
        options: RedGPU.Material.TINT_BLEND_MODE,
    }).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.tintBlendMode = ev.value;
        });
    });

    pane.addBinding(tintSettings, 'tintR', {label: 'Tint R', min: 0, max: 255, step: 1}).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.tint.r = ev.value;
        });
    });
    pane.addBinding(tintSettings, 'tintG', {label: 'Tint G', min: 0, max: 255, step: 1}).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.tint.g = ev.value;
        });
    });
    pane.addBinding(tintSettings, 'tintB', {label: 'Tint B', min: 0, max: 255, step: 1}).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.tint.b = ev.value;
        });
    });
    pane.addBinding(tintSettings, 'tintA', {label: 'Tint A (Alpha)', min: 0, max: 1, step: 0.01}).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            sprite.material.tint.a = ev.value;
        });
    });

    pane.addBinding(tintSettings, 'tint', {
        picker: 'inline',
        view: 'color',
        expanded: true,
    }).on('change', (ev) => {
        scene.children.forEach((sprite) => {
            const r = Math.floor(ev.value.r);
            const g = Math.floor(ev.value.g);
            const b = Math.floor(ev.value.b);
            const a = ev.value.a;
            sprite.material.tint.setColorByRGBA(r, g, b, a);
        });
    });
};