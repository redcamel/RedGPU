import * as RedGPU from "../../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781141623471";

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
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 머티리얼 및 스프라이트 생성
        // [EN] Create Materials and Sprites
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

        // [KO] 중앙 메인 스프라이트 생성
        // [EN] Create center main sprite
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
            const x = Math.cos(angle) * circleRadius;
            const z = Math.sin(angle) * circleRadius;

            const instance = new RedGPU.Display.Sprite3D(redGPUContext, materialGrid);
            instance.x = x;
            instance.z = z;
            scene.addChild(instance);
        }

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Sprite3D Control', expanded: true});

            const firstSprite = scene.children[0];

            /**
             * [KO] 모든 Sprite3D 인스턴스의 속성을 일괄 업데이트합니다.
             * [EN] Batch updates properties of all Sprite3D instances.
             */
            const updateAllSprites = (key, value) => {
                scene.children.forEach(child => {
                    if (child instanceof RedGPU.Display.Sprite3D) {
                        child[key] = value;
                    }
                });
            };

            // [KO] 빌보드 설정 (카메라를 항상 바라보게 함)
            // [EN] Billboard Setting (Always face the camera)
            folder.addBinding(firstSprite, 'useBillboard', {
                label: 'Use Billboard'
            }).on('change', (evt) => {
                updateAllSprites('useBillboard', evt.value);
                updateUIState();
            });

            // [KO] 픽셀 사이즈 모드 사용 여부
            // [EN] Use Pixel Size Mode
            const usePixelSizeBinding = folder.addBinding(firstSprite, 'usePixelSize', {
                label: 'Use Pixel Size'
            }).on('change', (evt) => {
                updateAllSprites('usePixelSize', evt.value);
                updateUIState();
            });

            // [KO] 픽셀 단위 크기 (화면 해상도 기준)
            // [EN] Size in Pixels (Based on screen resolution)
            const pixelSizeBinding = folder.addBinding(firstSprite, 'pixelSize', {
                min: 1, max: 1024, step: 1,
                label: 'Pixel Size'
            }).on('change', (evt) => {
                updateAllSprites('pixelSize', evt.value);
            });

            // [KO] 월드 단위 크기 (3D 공간 좌표 기준)
            // [EN] Size in World Units (Based on 3D space coordinates)
            const worldSizeBinding = folder.addBinding(firstSprite, 'worldSize', {
                min: 0.1, max: 10, step: 0.1,
                label: 'World Size'
            }).on('change', (evt) => {
                updateAllSprites('worldSize', evt.value);
            });

            /**
             * [KO] 설정 상태에 따라 GUI 요소의 활성화 여부를 업데이트합니다.
             * [EN] Updates the enabled state of GUI elements based on settings.
             */
            const updateUIState = () => {
                const isBillboard = firstSprite.useBillboard;
                const isPixel = firstSprite.usePixelSize;

                usePixelSizeBinding.disabled = !isBillboard;
                pixelSizeBinding.disabled = !isBillboard || !isPixel;
                worldSizeBinding.disabled = isBillboard && isPixel;
            };

            updateUIState();
        }
    });
};
