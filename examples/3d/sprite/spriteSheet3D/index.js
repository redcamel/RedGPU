import * as RedGPU from "../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] SpriteSheet3D 예제
 * [EN] SpriteSheet3D example
 *
 * [KO] 3D 공간에서 SpriteSheet3D의 사용법과 애니메이션 제어, 빌보드 및 픽셀 사이즈 기능을 시연합니다.
 * [EN] Demonstrates the usage of SpriteSheet3D in 3D space, including animation control, billboard, and pixel size features.
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

        // [KO] 스프라이트 시트 정보 및 SpriteSheet3D 생성
        // [EN] Create SpriteSheetInfo and SpriteSheet3D instances
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext,
            '../../../assets/spriteSheet/spriteSheet.png',
            5, 3, 15, 0, true, 24
        );

        const mainSpriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        scene.addChild(mainSpriteSheet);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const spriteCount = 10;
        const circleRadius = 5;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const instance = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
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
            const folder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});
            const target = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);

            const updateAll = (key, value) => {
                scene.children.forEach(c => {
                    if (c instanceof RedGPU.Display.SpriteSheet3D) {
                        if (key === 'play') c.play();
                        else if (key === 'pause') c.pause();
                        else if (key === 'stop') c.stop();
                        else c[key] = value;
                    }
                });
            };

            folder.addBinding(target, 'useBillboard').on('change', (evt) => {
                updateAll('useBillboard', evt.value);
            });

            folder.addBinding(target, 'usePixelSize').on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUIState();
            });

            const pixelSizeBinding = folder.addBinding(target, 'pixelSize', {
                min: 1, max: 1024, step: 1
            }).on('change', (evt) => {
                updateAll('pixelSize', evt.value);
            });

            const worldSizeBinding = folder.addBinding(target, 'worldSize', {
                min: 0.1, max: 10, step: 0.1
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            folder.addBlade({view: 'separator'});

            folder.addBinding(target, 'loop').on('change', (evt) => updateAll('loop', evt.value));
            folder.addBinding(target, 'frameRate', {
                min: 0, max: 60, step: 1
            }).on('change', (evt) => updateAll('frameRate', evt.value));

            const btnFolder = folder.addFolder({title: 'Actions'});
            ['Play', 'Pause', 'Stop'].forEach(title => {
                btnFolder.addButton({title}).on('click', () => updateAll(title.toLowerCase()));
            });

            const monitor = pane.addFolder({title: 'Status Monitoring', expanded: true});
            ['state', 'currentIndex', 'totalFrame', 'segmentW', 'segmentH'].forEach(key => {
                monitor.addBinding(target, key, {readonly: true});
            });

            const updateUIState = () => {
                const isPixel = target.usePixelSize;
                pixelSizeBinding.disabled = !isPixel;
                worldSizeBinding.disabled = isPixel;
                pixelSizeBinding.refresh();
                worldSizeBinding.refresh();
            };

            updateUIState();
        }
    });
};
