import * as RedGPU from "../../../../dist/index.js?t=1783323470979";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323470979";

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
        // 1. [KO] Scene 생성
        // [EN] Create Scene
        const scene = new RedGPU.Display.Scene();

        // 2. [KO] 2D View 생성 및 등록
        // [EN] Create and register 2D View
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] 텍스처 생성
        // [EN] Create texture
        const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

        // 4. [KO] Sprite2D (ColorMaterial) 생성 및 틴트 적용
        // [EN] Create Sprite2D (ColorMaterial) and apply tint
        const sprite2D_color = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#cf8989'));
        sprite2D_color.setSize(200, 200);
        sprite2D_color.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(sprite2D_color);

        // 5. [KO] Sprite2D (BitmapMaterial) 생성 및 틴트 적용
        // [EN] Create Sprite2D (BitmapMaterial) and apply tint
        const sprite2D_bitmap = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base));
        sprite2D_bitmap.setSize(200, 200);
        sprite2D_bitmap.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(sprite2D_bitmap);

        // 6. [KO] SpriteSheet2D 생성 및 틴트 적용
        // [EN] Create SpriteSheet2D and apply tint
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
        const spriteSheet2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
        spriteSheet2D.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(spriteSheet2D);

        // 7. [KO] TextField2D 생성 및 틴트 적용
        // [EN] Create TextField2D and apply tint
        const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
        textField2D.text = 'RedGPU';
        textField2D.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(textField2D);

        // 8. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
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

        // 9. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 10. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
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
        }
    });
};
