import * as RedGPU from "../../../../dist/index.js?t=1781133866175";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781133866175";

/**
 * [KO] Tint Basic 예제
 * [EN] Tint Basic example
 *
 * [KO] Sprite2D에 틴트를 적용하는 기본적인 방법을 보여줍니다.
 * [EN] Demonstrates the basic method of applying tint to a Sprite2D.
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

        // 3. [KO] 텍스처 및 재질 생성
        // [EN] Create texture and material
        const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material_base = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);

        // 4. [KO] 부모 Sprite2D 생성 및 틴트 적용
        // [EN] Create parent Sprite2D and apply tint
        const base = new RedGPU.Display.Sprite2D(redGPUContext, material_base);
        base.setSize(200, 200);
        base.material.tint.setColorByRGBA(255, 128, 0, 1);
        scene.addChild(base);

        // 5. [KO] 자식 Sprite2D 생성
        // [EN] Create child Sprite2D
        const material_subChild = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);
        const subChild = new RedGPU.Display.Sprite2D(redGPUContext, material_subChild);
        subChild.setSize(100, 100);
        subChild.setPosition(150, 150);
        base.addChild(subChild);

        // 6. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            base.x = width / 2;
            base.y = height / 2;
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

        // 7. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 8. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, base);
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
const renderTestPane = (redGPUContext, sprite) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Material Tint Test'});
            const targetTint = sprite.material.tint;
            const tintSettings = {
                tintR: targetTint.r,
                tintG: targetTint.g,
                tintB: targetTint.b,
                tintA: targetTint.a,
                tint: {r: targetTint.r, g: targetTint.g, b: targetTint.b, a: targetTint.a},
                useTint: sprite.material.useTint,
                tintBlendMode: RedGPU.Material.TINT_BLEND_MODE[sprite.material.tintBlendMode],
            };

            const refresh = () => {
                tintSettings.tintR = targetTint.r;
                tintSettings.tintG = targetTint.g;
                tintSettings.tintB = targetTint.b;
                tintSettings.tintA = targetTint.a;
                tintSettings.tint.r = targetTint.r;
                tintSettings.tint.g = targetTint.g;
                tintSettings.tint.b = targetTint.b;
                tintSettings.tint.a = targetTint.a;
                pane.refresh();
            };

            folder.addBinding(tintSettings, 'useTint', {label: 'Use Tint'}).on('change', (ev) => {
                sprite.material.useTint = ev.value;
            });

            folder.addBinding(tintSettings, 'tintBlendMode', {
                label: 'tintBlendMode',
                options: RedGPU.Material.TINT_BLEND_MODE,
            }).on('change', (ev) => {
                sprite.material.tintBlendMode = ev.value;
                refresh();
            });

            folder.addBinding(tintSettings, 'tintR', {label: 'Tint R', min: 0, max: 255, step: 1}).on('change', (ev) => {
                sprite.material.tint.r = ev.value;
                refresh();
            });
            folder.addBinding(tintSettings, 'tintG', {label: 'Tint G', min: 0, max: 255, step: 1}).on('change', (ev) => {
                sprite.material.tint.g = ev.value;
                refresh();
            });
            folder.addBinding(tintSettings, 'tintB', {label: 'Tint B', min: 0, max: 255, step: 1}).on('change', (ev) => {
                sprite.material.tint.b = ev.value;
                refresh();
            });
            folder.addBinding(tintSettings, 'tintA', {
                label: 'Tint A (Alpha)',
                min: 0,
                max: 1,
                step: 0.01
            }).on('change', (ev) => {
                sprite.material.tint.a = ev.value;
                refresh();
            });
            folder.addBinding(tintSettings, 'tint', {
                picker: 'inline',
                view: 'color',
                expanded: true,
            }).on('change', (ev) => {
                const r = Math.floor(ev.value.r);
                const g = Math.floor(ev.value.g);
                const b = Math.floor(ev.value.b);
                const a = ev.value.a;
                sprite.material.tint.setColorByRGBA(r, g, b, a);
                refresh();
            });
        }
    });
};
