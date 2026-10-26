import * as RedGPU from "../../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] SpriteSheet3D Mouse Event 예제
 * [EN] SpriteSheet3D Mouse Event example
 *
 * [KO] SpriteSheet3D 객체에서 발생하는 마우스 피킹 이벤트(MOVE, DOWN, UP, OVER, OUT, CLICK) 처리 방법을 시연합니다.
 * [EN] Demonstrates how to handle mouse picking events (MOVE, DOWN, UP, OVER, OUT, CLICK) on SpriteSheet3D objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const eventState = {
            type: 'None',
            target: 'None',
            pickingId: 0,
            mouseX: 0,
            mouseY: 0,
            distance: 0,
            point: '0.00, 0.00, 0.00',
            uv: '0.000, 0.000'
        };

        const spriteSheets = createSampleSpriteSheet3D(redGPUContext, scene, eventState);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, spriteSheets, eventState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleSpriteSheet3D = (redGPUContext, scene, eventState) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        '../../../../assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );
    const eventTypes = Object.values(RedGPU.Picking.PICKING_EVENT_TYPE);
    const radius = 3;
    const labelRadius = 4.25;
    const spriteSheets = [];

    // [KO] 모든 피킹 이벤트 타입별로 SpriteSheet3D 생성 및 리스너 등록
    // [EN] Create a SpriteSheet3D and register a listener for each picking event type
    eventTypes.forEach((eventName, index) => {
        const angle = (index / eventTypes.length) * Math.PI * 2;
        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        spriteSheet.name = `SpriteSheet3D_${eventName}`;
        spriteSheet.primitiveState.cullMode = 'none';
        spriteSheet.worldSize = 1.0;
        spriteSheet.pixelSize = 64;
        spriteSheet.x = Math.cos(angle) * radius;
        spriteSheet.y = Math.sin(angle) * radius;
        spriteSheet.material.useTint = true;
        scene.addChild(spriteSheet);

        spriteSheet.addListener(eventName, (e) => {
            spriteSheet.material.tint.setColorByRGB(
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            );
            eventState.type = e.type;
            eventState.target = e.target.name;
            eventState.pickingId = e.pickingId;
            eventState.mouseX = Math.round(e.mouseX);
            eventState.mouseY = Math.round(e.mouseY);
            eventState.distance = Number(e.distance.toFixed(3));
            eventState.point = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
            eventState.uv = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext, eventName);
        label.x = Math.cos(angle) * labelRadius;
        label.y = Math.sin(angle) * labelRadius;
        label.worldSize = 0.5;
        scene.addChild(label);

        spriteSheets.push(spriteSheet);
    });

    return spriteSheets;
};

const renderTestPane = (redGPUContext, spriteSheets, eventState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const target = spriteSheets[0];
            const updateAll = (key, value) => {
                spriteSheets.forEach((spriteSheet) => {
                    spriteSheet[key] = value;
                });
            };

            const spriteSheetFolder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});
            spriteSheetFolder.addBinding(target, 'useBillboard').on('change', (evt) => {
                updateAll('useBillboard', evt.value);
            });
            spriteSheetFolder.addBinding(target, 'usePixelSize').on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUIState();
            });
            const pixelSizeBinding = spriteSheetFolder.addBinding(target, 'pixelSize', {
                min: 16,
                max: 256,
                step: 1
            }).on('change', (evt) => {
                updateAll('pixelSize', evt.value);
            });
            const worldSizeBinding = spriteSheetFolder.addBinding(target, 'worldSize', {
                min: 0.1,
                max: 5,
                step: 0.01
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            const updateUIState = () => {
                const isPixel = target.usePixelSize;
                pixelSizeBinding.disabled = !isPixel;
                worldSizeBinding.disabled = isPixel;
                pixelSizeBinding.refresh();
                worldSizeBinding.refresh();
            };
            updateUIState();

            const eventFolder = pane.addFolder({title: 'PickingEvent', expanded: true});
            eventFolder.addBinding(eventState, 'type', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'target', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'pickingId', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'mouseX', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'mouseY', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'distance', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'point', {readonly: true, interval: 50});
            eventFolder.addBinding(eventState, 'uv', {readonly: true, interval: 50});
        }
    });
};
