/**
 * [KO] SpriteSheet3D 예제
 * [EN] SpriteSheet3D example
 *
 * [KO] 3D 공간에서 SpriteSheet3D의 사용법과 빌보드, 픽셀 사이즈 모드 등의 기능을 시연합니다.
 * [EN] Demonstrates the usage of SpriteSheet3D in 3D space, including features like billboard and pixel size modes.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1770635178902";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(canvas, (redGPUContext) => {
        // [KO] 카메라 컨트롤러 설정
        // [EN] Camera controller setup
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        // [KO] 씬 및 뷰 설정
        // [EN] Scene and View setup
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 스프라이트 시트 정보 생성 (텍스처, 가로 세그먼트, 세로 세그먼트, 총 프레임 등)
        // [EN] Create sprite sheet info (texture, horizontal segments, vertical segments, total frames, etc.)
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);

        // [KO] 메인 스프라이트 시트 생성 및 설정
        // [EN] Create and configure main sprite sheet
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        spriteSheet.worldSize = 1.0;
        scene.addChild(spriteSheet);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const spriteCount = 10;
        const radius = 5;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const instance = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
            instance.worldSize = 1.0;
            instance.x = x;
            instance.z = z;
            scene.addChild(instance);
        }

        // [KO] 렌더러 생성 및 시작
        // [EN] Create and start renderer
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        // [KO] 테스트용 GUI 설정
        // [EN] Setup GUI for testing
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
 * [KO] 테스트를 위한 Tweakpane GUI를 설정합니다.
 * [EN] Sets up the Tweakpane GUI for testing.
 *
 * [KO] SpriteSheet3D의 빌보드 모드, 픽셀 사이즈, 애니메이션 루프 및 프레임 레이트 등을 실시간으로 제어하고 상태를 모니터링할 수 있는 UI를 생성합니다.
 * [EN] Creates a UI to control and monitor SpriteSheet3D's billboard mode, pixel size, animation loop, and frame rate in real-time.
 *
 * @param redGPUContext -
 * [KO] RedGPU 렌더링 컨텍스트
 * [EN] RedGPU rendering context
 * @param scene -
 * [KO] 제어할 스프라이트들이 포함된 씬
 * [EN] Scene containing the sprites to control
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770635178902");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const folder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

    const target = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);
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
    folder.addBinding(target, 'useBillboard').on('change', (evt) => {
        updateAll('useBillboard', evt.value);
        updateUI();
    });
    const usePixelSize = folder.addBinding(target, 'usePixelSize').on('change', (evt) => {
        updateAll('usePixelSize', evt.value);
        updateUI();
    });
    const pixelSize = folder.addBinding(target, 'pixelSize', {min: 0, max: 512, step: 1}).on('change', (evt) => {
        updateAll('pixelSize', evt.value);
    });
    const worldSize = folder.addBinding(target, 'worldSize', {min: 0.01, max: 10, step: 0.01}).on('change', (evt) => {
        updateAll('worldSize', evt.value);
    });

    setSeparator(folder);

    // [KO] 애니메이션 제어
    // [EN] Animation Control
    folder.addBinding(target, 'loop').on('change', (evt) => updateAll('loop', evt.value));
    folder.addBinding(target, 'frameRate', {
        min: 0,
        max: 60,
        step: 1
    }).on('change', (evt) => updateAll('frameRate', evt.value));

    const btnFolder = folder.addFolder({title: 'Actions'});
    ['Play', 'Pause', 'Stop'].forEach(title => {
        btnFolder.addButton({title}).on('click', () => updateAll(title.toLowerCase()));
    });

    // [KO] 상태 모니터링
    // [EN] Monitoring
    const monitor = pane.addFolder({title: 'Monitoring', expanded: true});
    ['state', 'currentIndex', 'totalFrame', 'segmentW', 'segmentH'].forEach(key => {
        monitor.addBinding(target, key, {readonly: true});
    });

    // [KO] UI 활성화 상태 업데이트
    // [EN] Update UI activation state
    const updateUI = () => {
        const isBillboard = target.useBillboard;
        const isPixel = target.usePixelSize;

        usePixelSize.disabled = !isBillboard;
        pixelSize.disabled = !isBillboard || !isPixel;
        worldSize.disabled = isBillboard && isPixel;
    };

    const refresh = () => {
        pane.refresh();
        requestAnimationFrame(refresh);
    };

    refresh();
    updateUI();
};
