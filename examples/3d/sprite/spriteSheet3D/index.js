import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
        
        // [KO] 메인 스프라이트 시트 생성 [EN] Create main sprite sheet
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        spriteSheet.worldSize = 1.0;
        scene.addChild(spriteSheet);

        // [KO] 원형 배치 [EN] Circular layout
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

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

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
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    // [KO] 유효한 스프라이트 시트 정보만 유지 [EN] Maintain only valid sprite sheet infos
    const spriteSheetInfos = [
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
    ];

    const child = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);
    const controls = {
        useBillboard: child.useBillboard,
        usePixelSize: child.usePixelSize,
        pixelSize: child.pixelSize,
        worldSize: child.worldSize,
        loop: child.loop,
        frameRate: child.frameRate,
        testSpriteSheetInfo: 0,
        state: child.state,
        currentIndex: child.currentIndex || 0,
        totalFrame: child.totalFrame || 0,
        segmentW: child.segmentW || 0,
        segmentH: child.segmentH || 0,
    };

    const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

    spriteSheet3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = spriteSheet3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const pixelSizeBinding = spriteSheet3DFolder.addBinding(controls, 'pixelSize', {min: 1, max: 512, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.pixelSize = evt.value;
        });
    });

    const worldSizeBinding = spriteSheet3DFolder.addBinding(controls, 'worldSize', {min: 0.01, max: 10, step: 0.01}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.worldSize = evt.value;
        });
    });

    spriteSheet3DFolder.addBinding(controls, 'loop').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) {
                child.loop = evt.value;
                child.play();
            }
        });
    });

    spriteSheet3DFolder.addBinding(controls, 'frameRate', {min: 0, max: 60, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.frameRate = evt.value;
        });
    });

    // [KO] 플레이 컨트롤 [EN] Play controls
    setSeparator(pane);
    const playControlsFolder = pane.addFolder({title: 'Play Controls', expanded: true});

    playControlsFolder.addButton({title: 'Play'}).on('click', () => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.play();
        });
    });

    playControlsFolder.addButton({title: 'Pause'}).on('click', () => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.pause();
        });
    });

    playControlsFolder.addButton({title: 'Stop'}).on('click', () => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.SpriteSheet3D) child.stop();
        });
    });

    // [KO] 모니터링 [EN] Monitoring
    const monitoringFolder = pane.addFolder({title: 'Monitoring', expanded: true});
    monitoringFolder.addBinding(controls, 'state', {readonly: true});
    monitoringFolder.addBinding(controls, 'currentIndex', {readonly: true});
    monitoringFolder.addBinding(controls, 'totalFrame', {readonly: true});
    monitoringFolder.addBinding(controls, 'segmentW', {readonly: true});
    monitoringFolder.addBinding(controls, 'segmentH', {readonly: true});

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;
        if (!useBillboard) {
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            pixelSizeBinding.element.style.opacity = 0.25;
            pixelSizeBinding.element.style.pointerEvents = 'none';
            worldSizeBinding.element.style.opacity = 1;
            worldSizeBinding.element.style.pointerEvents = 'painted';
        } else {
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';
            if (usePixelSize) {
                pixelSizeBinding.element.style.opacity = 1;
                pixelSizeBinding.element.style.pointerEvents = 'painted';
                worldSizeBinding.element.style.opacity = 0.25;
                worldSizeBinding.element.style.pointerEvents = 'none';
            } else {
                pixelSizeBinding.element.style.opacity = 0.25;
                pixelSizeBinding.element.style.pointerEvents = 'none';
                worldSizeBinding.element.style.opacity = 1;
                worldSizeBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    const refreshMonitoringControls = () => {
        const child = scene.children.find(c => c instanceof RedGPU.Display.SpriteSheet3D);
        if (child) {
            controls.currentIndex = child.currentIndex;
            controls.totalFrame = child.totalFrame;
            controls.segmentW = child.segmentW;
            controls.segmentH = child.segmentH;
            controls.state = child.state;
            pane.refresh();
        }
        requestAnimationFrame(refreshMonitoringControls);
    };
    requestAnimationFrame(refreshMonitoringControls);

    updateControlsState();
};