import * as RedGPU from "../../../../dist/index.js?t=1769512410570";

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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512410570');
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512410570");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const controls = {
        testSpriteSheetInfo: 0
    };

    const updateTestData = () => {
        const child = scene.children[0];

        controls.useBillboardPerspective = child.useBillboardPerspective;
        controls.useBillboard = child.useBillboard;
        controls.billboardFixedScale = child.billboardFixedScale;
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

    updateTestData();

    const spriteSheetInfos = [
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/walk.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/jump.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/attack.png', 6, 1, 6, 0, true, 24)
    ];

    const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});

    spriteSheet3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboardPerspective = evt.value;
        });
        updateBillboardFixedScaleBinding();
    });

    spriteSheet3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
        updateBillboardFixedScaleBinding();
    });

    const billboardFixedScaleBinding = spriteSheet3DFolder
        .addBinding(controls, 'billboardFixedScale', {min: 0.1, max: 1})
        .on('change', (evt) => {
            scene.children.forEach((child) => {
                child.billboardFixedScale = evt.value;
            });
        });

    const updateBillboardFixedScaleBinding = () => {
        const hidden = controls.useBillboardPerspective || !controls.useBillboard;
        billboardFixedScaleBinding.element.style.opacity = hidden ? 0.25 : 1;
        billboardFixedScaleBinding.element.style.pointerEvents = hidden ? 'none' : 'painted';
    };

    updateBillboardFixedScaleBinding();

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

    scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
        scene.children.forEach((child) => {
            child.scaleX = controls.scaleX;
        });
    });

    scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', () => {
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

    const refreshMonitoringControls = () => {
        const child = scene.children[0];
        controls.currentIndex = child.currentIndex;
        controls.totalFrame = child.totalFrame;
        controls.segmentW = child.segmentW;
        controls.segmentH = child.segmentH;
        controls.state = child.state;
        requestAnimationFrame(refreshMonitoringControls);
    };
    requestAnimationFrame(refreshMonitoringControls);
};
