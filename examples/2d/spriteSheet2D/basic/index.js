import * as RedGPU from "../../../../dist/index.js?t=1770699661827";

/**
 * [KO] SpriteSheet2D Basic 예제
 * [EN] SpriteSheet2D Basic example
 *
 * [KO] SpriteSheet2D의 기본 사용법과 애니메이션 제어 방법을 보여줍니다.
 * [EN] Demonstrates the basic usage and animation control of SpriteSheet2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
    const controller = new RedGPU.Camera.Camera2D();

    const scene = new RedGPU.Display.Scene();
    const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const spriteCount = 4;
    for (let i = 0; i < spriteCount; i++) {
        const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
        scene.addChild(spriteSheet);
    }

    let centerX = redGPUContext.screenRectObject.width / 2;
    let centerY = redGPUContext.screenRectObject.height / 2;

    /**
     * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
     * [EN] Event handler called when the screen size changes.
     */
    redGPUContext.onResize = (resizeEvent) => {
        const {width, height} = resizeEvent.screenRectObject;
        centerX = width / 2;
        centerY = height / 2;
    };

    const renderer = new RedGPU.Renderer(redGPUContext);
    const render = () => {
        const radius = 250;
        const numChildren = view.scene.children.length;

        view.scene.children.forEach((spriteSheet2D, index) => {
            const angle = (index / numChildren) * Math.PI * 2;
            const endX = centerX + Math.cos(angle) * radius;
            const endY = centerY + Math.sin(angle) * radius;

            spriteSheet2D.x += (endX - spriteSheet2D.x) * 0.3;
            spriteSheet2D.y += (endY - spriteSheet2D.y) * 0.3;
        });
    };
    renderer.start(redGPUContext, render);

    renderTestPane(scene, redGPUContext);
}, (failReason) => {
    console.error('Initialization failed:', failReason);
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = failReason;
    document.body.appendChild(errorMessage);
});

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.Scene} scene
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (scene, redGPUContext) => {
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext);
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
    const pane = new Pane();

    const controls = {
        testSpriteSheetInfo: 0
    };

    const updateTestData = () => {
        const child = scene.children[0];
        controls.loop = child.loop;
        controls.frameRate = child.frameRate;
        controls.state = child.state;
        controls.currentIndex = child.currentIndex || 0;
        controls.totalFrame = child.totalFrame || 0;
        controls.segmentW = child.segmentW || 0;
        controls.segmentH = child.segmentH || 0;
        controls.scaleX = child.scaleX;
        controls.scaleY = child.scaleY;
        controls.width = child.width;
        controls.height = child.height;
        pane.refresh();
    };
    updateTestData();

    const spriteSheetInfos = [
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/walk.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/jump.png', 8, 1, 8, 0, true, 24),
        new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/attack.png', 6, 1, 6, 0, true, 24)
    ];

    const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet2D', expanded: true});

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

    const scaleFolder = pane.addFolder({title: 'Scale Controls', expanded: true});

    scaleFolder.addBinding(controls, 'scaleX', {min: 0, max: 1, step: 0.1}).on('change', () => {
        scene.children.forEach((child) => {
            child.scaleX = controls.scaleX;
        });
    });

    scaleFolder.addBinding(controls, 'scaleY', {min: 0, max: 1, step: 0.1}).on('change', () => {
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