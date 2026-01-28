import * as RedGPU from "../../../../dist/index.js?t=1769587130347";

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

        redGPUContext.onResize = () => {
            const {width, height} = redGPUContext.screenRectObject;

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
        redGPUContext.onResize();

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

const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769587130347');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769587130347");
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
