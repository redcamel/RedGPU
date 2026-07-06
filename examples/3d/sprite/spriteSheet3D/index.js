import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

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

        // 3. [KO] 스프라이트 시트 정보 생성
        // [EN] Create SpriteSheet Info
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
            redGPUContext, 
            '../../../assets/spriteSheet/spriteSheet.png', 
            5, 3, 15, 0, true, 24
        );

        // [KO] 메인 스프라이트 시트 인스턴스 생성 및 설정
        // [EN] Create and configure main SpriteSheet3D instance
        const mainSpriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        mainSpriteSheet.worldSize = 1.0;
        scene.addChild(mainSpriteSheet);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const spriteCount = 10;
        const circleRadius = 5;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * circleRadius;
            const z = Math.sin(angle) * circleRadius;

            const instance = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
            instance.worldSize = 1.0;
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
 * [KO] 실시간 애니메이션 제어 및 속성 수정을 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time animation control and property modification.
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'SpriteSheet3D Control', expanded: true});

            // [KO] 첫 번째 인스턴스를 대표 타겟으로 설정
            // [EN] Set the first instance as the representative target
            const target = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);
            
            /**
             * [KO] 모든 SpriteSheet3D 인스턴스의 속성을 일괄 업데이트하거나 액션을 수행합니다.
             * [EN] Batch updates properties or performs actions for all SpriteSheet3D instances.
             */
            const updateAll = (key, value) => {
                scene.children.forEach(c => {
                    if (c instanceof RedGPU.Display.SpriteSheet3D) {
                        if (key === 'play') c.play();
                        else if (key === 'pause') c.pause();
                        else if (key === 'stop') c.stop();
                        else {
                            c[key] = value;
                        }
                    }
                });
            };

            // [KO] 빌보드 및 크기 설정
            // [EN] Billboard & Size Settings
            folder.addBinding(target, 'useBillboard', { label: 'Use Billboard' }).on('change', (evt) => {
                updateAll('useBillboard', evt.value);
                updateUIState();
            });
            
            const usePixelSizeBinding = folder.addBinding(target, 'usePixelSize', { label: 'Use Pixel Size' }).on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUIState();
            });
            
            const pixelSizeBinding = folder.addBinding(target, 'pixelSize', {
                min: 1, max: 1024, step: 1,
                label: 'Pixel Size'
            }).on('change', (evt) => {
                updateAll('pixelSize', evt.value);
            });
            
            const worldSizeBinding = folder.addBinding(target, 'worldSize', {
                min: 0.1, max: 10, step: 0.1,
                label: 'World Size'
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            folder.addBlade({view: 'separator'});

            // [KO] 애니메이션 루프 및 속도 제어
            // [EN] Animation Loop & Speed Control
            folder.addBinding(target, 'loop', { label: 'Animation Loop' }).on('change', (evt) => updateAll('loop', evt.value));
            folder.addBinding(target, 'frameRate', {
                min: 0, max: 60, step: 1,
                label: 'Frame Rate (FPS)'
            }).on('change', (evt) => updateAll('frameRate', evt.value));

            // [KO] 재생 제어 버튼
            // [EN] Playback Control Buttons
            const btnFolder = folder.addFolder({title: 'Actions'});
            ['Play', 'Pause', 'Stop'].forEach(title => {
                btnFolder.addButton({title}).on('click', () => updateAll(title.toLowerCase()));
            });

            // [KO] 상태 모니터링
            // [EN] Status Monitoring
            const monitor = pane.addFolder({title: 'Status Monitoring', expanded: true});
            ['state', 'currentIndex', 'totalFrame', 'segmentW', 'segmentH'].forEach(key => {
                monitor.addBinding(target, key, {readonly: true, label: key});
            });

            /**
             * [KO] 설정 상태에 따라 GUI 요소의 활성화 여부를 업데이트합니다.
             * [EN] Updates the enabled state of GUI elements based on settings.
             */
            const updateUIState = () => {
                const isBillboard = target.useBillboard;
                const isPixel = target.usePixelSize;

                usePixelSizeBinding.disabled = !isBillboard;
                pixelSizeBinding.disabled = !isBillboard || !isPixel;
                worldSizeBinding.disabled = isBillboard && isPixel;
            };

            updateUIState();
        }
    });
};
