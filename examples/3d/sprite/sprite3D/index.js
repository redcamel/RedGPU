/**
 * [KO] Sprite3D 예제
 * [EN] Sprite3D example
 *
 * [KO] 3D 공간에서 Sprite3D의 사용법과 빌보드, 픽셀 사이즈 모드 등의 기능을 시연합니다.
 * [EN] Demonstrates the usage of Sprite3D in 3D space, including features like billboard and pixel size modes.
 * @packageDocumentation
 */
import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
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

        // [KO] 머티리얼 설정
        // [EN] Material setup
        const material = new RedGPU.Material.BitmapMaterial(
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

        // [KO] 메인 스프라이트 생성 (Pixel Size 모드 시연)
        // [EN] Create main sprite (Demonstrating Pixel Size mode)
        const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
         scene.addChild(sprite3D);

        // [KO] 가로/세로 비율 테스트용 스프라이트 배치
        // [EN] Arrange sprites for aspect ratio testing
        const sprite3DH = new RedGPU.Display.Sprite3D(redGPUContext, materialH);
        sprite3DH.x = -2.5;
        scene.addChild(sprite3DH);

        const sprite3DV = new RedGPU.Display.Sprite3D(redGPUContext, materialV);
        sprite3DV.x = 2.5;
        scene.addChild(sprite3DV);

        // [KO] 추가 인스턴스들을 원형으로 배치
        // [EN] Arrange additional instances in a circle
        const spriteCount = 10;
        const radius = 6;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const instance = new RedGPU.Display.Sprite3D(redGPUContext, material);
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
 * [KO] Sprite3D의 빌보드 모드, 픽셀 사이즈, 월드 사이즈 등을 실시간으로 제어할 수 있는 UI를 생성합니다.
 * [EN] Creates a UI to control Sprite3D's billboard mode, pixel size, and world size in real-time.
 *
 * @param redGPUContext -
 * [KO] RedGPU 렌더링 컨텍스트
 * [EN] RedGPU rendering context
 * @param scene -
 * [KO] 제어할 스프라이트들이 포함된 씬
 * [EN] Scene containing the sprites to control
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons, setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const folder = pane.addFolder({title: 'Sprite3D', expanded: true});

    const target = scene.children.find(c => c instanceof RedGPU.Display.Sprite3D);
    const updateAll = (key, value) => {
        scene.children.forEach(c => {
            if (c instanceof RedGPU.Display.Sprite3D) c[key] = value;
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
    const pixelSize = folder.addBinding(target, 'pixelSize', {min: 0, max: 1024, step: 1}).on('change', (evt) => {
        updateAll('pixelSize', evt.value);
    });
    const worldSize = folder.addBinding(target, 'worldSize', {min: 0.01, max: 10, step: 0.01}).on('change', (evt) => {
        updateAll('worldSize', evt.value);
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