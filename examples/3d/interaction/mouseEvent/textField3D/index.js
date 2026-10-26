import * as RedGPU from "../../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] TextField3D Mouse Event 예제
 * [EN] TextField3D Mouse Event example
 *
 * [KO] TextField3D 객체에서 발생하는 마우스 피킹 이벤트(MOVE, DOWN, UP, OVER, OUT, CLICK) 처리 방법을 시연합니다.
 * [EN] Demonstrates how to handle mouse picking events (MOVE, DOWN, UP, OVER, OUT, CLICK) on TextField3D objects.
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

        const textFields = createSampleTextField3D(redGPUContext, scene, eventState);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, textFields, eventState);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleTextField3D = (redGPUContext, scene, eventState) => {
    const eventTypes = Object.values(RedGPU.Picking.PICKING_EVENT_TYPE);
    const radius = 3;
    const textFields = [];

    // [KO] 모든 피킹 이벤트 타입별로 TextField3D 생성 및 리스너 등록
    // [EN] Create a TextField3D and register a listener for each picking event type
    eventTypes.forEach((eventName, index) => {
        const angle = (index / eventTypes.length) * Math.PI * 2;
        const textField = new RedGPU.Display.TextField3D(redGPUContext, eventName);
        textField.name = `TextField3D_${eventName}`;
        textField.background = '#1d4ed8';
        textField.color = '#ffffff';
        textField.fontSize = 32;
        textField.padding = 10;
        textField.borderRadius = 10;
        textField.primitiveState.cullMode = 'none';
        textField.worldSize = 0.5;
        textField.x = Math.cos(angle) * radius;
        textField.y = Math.sin(angle) * radius;
        scene.addChild(textField);

        textField.addListener(eventName, (e) => {
            const randomHex = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
            e.target.background = randomHex;
            eventState.type = e.type;
            eventState.target = e.target.name;
            eventState.pickingId = e.pickingId;
            eventState.mouseX = Math.round(e.mouseX);
            eventState.mouseY = Math.round(e.mouseY);
            eventState.distance = Number(e.distance.toFixed(3));
            eventState.point = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
            eventState.uv = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
        });

        textFields.push(textField);
    });

    return textFields;
};

const renderTestPane = (redGPUContext, textFields, eventState) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const target = textFields[0];
            const updateAll = (key, value) => {
                textFields.forEach((textField) => {
                    textField[key] = value;
                });
            };

            const textFieldFolder = pane.addFolder({title: 'TextField3D', expanded: true});
            textFieldFolder.addBinding(target, 'useBillboard').on('change', (evt) => {
                updateAll('useBillboard', evt.value);
            });
            textFieldFolder.addBinding(target, 'usePixelSize').on('change', (evt) => {
                updateAll('usePixelSize', evt.value);
                updateUIState();
            });
            const fontSizeBinding = textFieldFolder.addBinding(target, 'fontSize', {
                min: 12,
                max: 128,
                step: 1
            }).on('change', (evt) => {
                updateAll('fontSize', evt.value);
            });
            const worldSizeBinding = textFieldFolder.addBinding(target, 'worldSize', {
                min: 0.1,
                max: 5,
                step: 0.01
            }).on('change', (evt) => {
                updateAll('worldSize', evt.value);
            });

            const updateUIState = () => {
                const isPixel = target.usePixelSize;
                fontSizeBinding.disabled = !isPixel;
                worldSizeBinding.disabled = isPixel;
                fontSizeBinding.refresh();
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
