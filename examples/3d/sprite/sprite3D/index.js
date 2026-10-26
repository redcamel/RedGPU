import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Sprite3D 예제
 * [EN] Sprite3D example
 *
 * [KO] 3D 공간에서 Sprite3D의 사용법과 빌보드(Billboard), 픽셀 사이즈 모드 등의 기능을 시연합니다.
 * [EN] Demonstrates the usage of Sprite3D in 3D space, including features like billboard and pixel size modes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 머티리얼 및 Sprite3D 생성
        // [EN] Create materials and Sprite3D instances
        const materialGrid = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        );
        const materialH = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')
        );
        const materialV = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/v_test.jpg')
        );

        const mainSprite = new RedGPU.Display.Sprite3D(redGPUContext, materialGrid);
        scene.addChild(mainSprite);

        // [KO] 가로/세로 비율 테스트용 스프라이트 배치
        // [EN] Arrange sprites for aspect ratio testing
        const spriteH = new RedGPU.Display.Sprite3D(redGPUContext, materialH);
        spriteH.x = -2.5;
        scene.addChild(spriteH);

        const spriteV = new RedGPU.Display.Sprite3D(redGPUContext, materialV);
        spriteV.x = 2.5;
        scene.addChild(spriteV);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const spriteCount = 10;
        const circleRadius = 6;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const instance = new RedGPU.Display.Sprite3D(redGPUContext, materialGrid);
            instance.x = Math.cos(angle) * circleRadius;
            instance.z = Math.sin(angle) * circleRadius;
            scene.addChild(instance);
        }

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Sprite3D', expanded: true});
            const firstSprite = scene.children[0];

            const updateAllSprites = (key, value) => {
                scene.children.forEach(child => {
                    if (child instanceof RedGPU.Display.Sprite3D) {
                        child[key] = value;
                    }
                });
            };

            folder.addBinding(firstSprite, 'useBillboard').on('change', (evt) => {
                updateAllSprites('useBillboard', evt.value);
            });

            folder.addBinding(firstSprite, 'usePixelSize').on('change', (evt) => {
                updateAllSprites('usePixelSize', evt.value);
                updateUIState();
            });

            const pixelSizeBinding = folder.addBinding(firstSprite, 'pixelSize', {
                min: 1, max: 1024, step: 1
            }).on('change', (evt) => {
                updateAllSprites('pixelSize', evt.value);
            });

            const worldSizeBinding = folder.addBinding(firstSprite, 'worldSize', {
                min: 0.1, max: 10, step: 0.1
            }).on('change', (evt) => {
                updateAllSprites('worldSize', evt.value);
            });

            const updateUIState = () => {
                const isPixel = firstSprite.usePixelSize;
                pixelSizeBinding.disabled = !isPixel;
                worldSizeBinding.disabled = isPixel;
                pixelSizeBinding.refresh();
                worldSizeBinding.refresh();
            };

            updateUIState();
        }
    });
};
