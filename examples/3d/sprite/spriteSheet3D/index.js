import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);

        scene.addChild(spriteSheet);

        const spriteCount = 10;
        const radius = 5;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);

            spriteSheet.x = x;
            spriteSheet.z = z;
            scene.addChild(spriteSheet);
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const controls = {
        testSpriteSheetInfo: 0
    };

    const updateTestData = () => {
        const child = scene.children[0];

        controls.useSizeAttenuation = child.useSizeAttenuation;
        controls.useBillboard = child.useBillboard;
        controls.usePixelSize = child.usePixelSize;
        controls.pixelSize = child.pixelSize;
        controls.loop = child.loop;
        controls.frameRate = child.frameRate;
        controls.state = child.state;
        controls.currentIndex = child.currentIndex || 0;
        controls.totalFrame = child.totalFrame || 0;
        controls.segmentW = child.segmentW || 0;
        controls.segmentH = child.segmentH || 0;
        controls.scaleX = child.scaleX;
        controls.scaleY = child.scaleY;
        controls.scaleZ = child.scaleZ;
        pane.refresh();
    };

    const spriteSheetInfos = [
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/walk.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/jump.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/attack.png', 6, 1, 6, 0, true, 24)
    ];

    updateTestData();

    const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

    const useSizeAttenuationBinding = spriteSheet3DFolder.addBinding(controls, 'useSizeAttenuation').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useSizeAttenuation = evt.value;
        });
    });

    const useBillboardBinding = spriteSheet3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = spriteSheet3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const pixelSizeBinding = spriteSheet3DFolder.addBinding(controls, 'pixelSize', {min: 1, max: 256, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.pixelSize = evt.value;
        });
    });

    spriteSheet3DFolder.addBinding(controls, 'loop').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.loop = evt.value;
            child.play();
        });
    });

    spriteSheet3DFolder.addBinding(controls, 'frameRate', {min: 0, max: 60, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.frameRate = evt.value;
        });
    });

    const spriteSelectorOptions = spriteSheetInfos.map((_, index) => ({
        text: `SpriteSheet ${index + 1}`, value: index,
    }));

    spriteSheet3DFolder.addBinding(controls, 'testSpriteSheetInfo', {
        options: spriteSelectorOptions,
    }).on('change', (evt) => {
        const selectedSpriteSheetInfo = spriteSheetInfos[evt.value];
        scene.children.forEach((child) => {
            child.spriteSheetInfo = selectedSpriteSheetInfo;
        });
        updateTestData();
    });

    setSeparator(pane);

    const playControlsFolder = pane.addFolder({title: 'Play Controls', expanded: true});

    playControlsFolder.addButton({title: 'Play'}).on('click', () => {
        scene.children.forEach((child) => child.play());
    });

    playControlsFolder.addButton({title: 'Pause'}).on('click', () => {
        scene.children.forEach((child) => child.pause());
    });

    playControlsFolder.addButton({title: 'Stop'}).on('click', () => {
        scene.children.forEach((child) => child.stop());
    });

    setSeparator(pane);

    const scaleFolder = pane.addFolder({title: 'SpriteSheet3D Scale', expanded: true});

    const scaleXBinding = scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
        scene.children.forEach((child) => {
            child.scaleX = controls.scaleX;
        });
    });

    const scaleYBinding = scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
        scene.children.forEach((child) => {
            child.scaleY = controls.scaleY;
        });
    });

    const monitoringFolder = pane.addFolder({title: 'Monitoring', expanded: true});

    monitoringFolder.addBinding(controls, 'state', {readonly: true});
    monitoringFolder.addBinding(controls, 'currentIndex', {readonly: true});
    monitoringFolder.addBinding(controls, 'totalFrame', {readonly: true});
    monitoringFolder.addBinding(controls, 'segmentW', {readonly: true});
    monitoringFolder.addBinding(controls, 'segmentH', {readonly: true});

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            // 빌보드가 꺼지면 빌보드 관련 옵션 모두 비활성화
            useSizeAttenuationBinding.element.style.opacity = 0.25;
            useSizeAttenuationBinding.element.style.pointerEvents = 'none';
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            pixelSizeBinding.element.style.opacity = 0.25;
            pixelSizeBinding.element.style.pointerEvents = 'none';

            // 스케일은 활성화 (일반 메시 모드)
            scaleXBinding.element.style.opacity = 1;
            scaleXBinding.element.style.pointerEvents = 'painted';
            scaleYBinding.element.style.opacity = 1;
            scaleYBinding.element.style.pointerEvents = 'painted';
        } else {
            // 빌보드 켜짐
            useSizeAttenuationBinding.element.style.opacity = 1;
            useSizeAttenuationBinding.element.style.pointerEvents = 'painted';
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                // 픽셀 사이즈 모드
                pixelSizeBinding.element.style.opacity = 1;
                pixelSizeBinding.element.style.pointerEvents = 'painted';

                // 픽셀 모드에서는 원근감/월드스케일 무시됨
                useSizeAttenuationBinding.element.style.opacity = 0.25;
                useSizeAttenuationBinding.element.style.pointerEvents = 'none';
                scaleXBinding.element.style.opacity = 0.25;
                scaleXBinding.element.style.pointerEvents = 'none';
                scaleYBinding.element.style.opacity = 0.25;
                scaleYBinding.element.style.pointerEvents = 'none';
            } else {
                // 월드 스케일 모드
                pixelSizeBinding.element.style.opacity = 0.25;
                pixelSizeBinding.element.style.pointerEvents = 'none';

                // 원근감/월드스케일 활성화
                useSizeAttenuationBinding.element.style.opacity = 1;
                useSizeAttenuationBinding.element.style.pointerEvents = 'painted';
                scaleXBinding.element.style.opacity = 1;
                scaleXBinding.element.style.pointerEvents = 'painted';
                scaleYBinding.element.style.opacity = 1;
                scaleYBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    const refreshMonitoringControls = () => {
        const child = scene.children[0];
        if (child) {
            controls.currentIndex = child.currentIndex;
            controls.totalFrame = child.totalFrame;
            controls.segmentW = child.segmentW;
            controls.segmentH = child.segmentH;
            controls.state = child.state;
        }
        requestAnimationFrame(refreshMonitoringControls);
    };
    requestAnimationFrame(refreshMonitoringControls);

    // 초기 상태 업데이트
    updateControlsState();
};
