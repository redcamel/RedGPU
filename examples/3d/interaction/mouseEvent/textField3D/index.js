import * as RedGPU from "../../../../../dist/index.js?t=1770635178902";

/**
 * [KO] TextField3D Mouse Event 예제
 * [EN] TextField3D Mouse Event example
 *
 * [KO] TextField3D 객체에서 발생하는 마우스 이벤트를 처리하는 방법을 보여줍니다.
 * [EN] Demonstrates how to handle mouse events on TextField3D objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const isMobile = redGPUContext.detector.isMobile;
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 정보 표시용 HTML 요소 생성
        // [EN] Create HTML element for displaying information
        const infoBox = document.createElement('div');
        const updateInfoBoxStyle = () => {
            const isMobile = redGPUContext.detector.isMobile;
            Object.assign(infoBox.style, {
                position: 'absolute',
                bottom: isMobile ? '100px' : '70px',
                left: '12px',
                width: isMobile ? 'calc(100% - 64px)' : 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: isMobile ? '12px' : '11px',
                lineHeight: '1.6',
                pointerEvents: 'none',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                display: 'none',
                userSelect: 'none',
                zIndex: '100',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            });
        };
        updateInfoBoxStyle();
        document.body.appendChild(infoBox);

        const updateInfo = (eventName, e) => {
            infoBox.style.display = 'block';
            infoBox.innerHTML = `[Event Info]
Object: ${e.target.name || 'TextField3D'}
Event: ${eventName}
Distance: ${e.distance ? e.distance.toFixed(4) : 'N/A'}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
        };

        const {updateLayout} = createSampleTextField3D(redGPUContext, scene, infoBox, updateInfo);

        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const isMobile = redGPUContext.detector.isMobile;
            const baseDistance = isMobile ? 7.5 : 9.5;
            controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
            updateInfoBoxStyle();
            updateLayout();
        };
        redGPUContext.onResize({
            target: redGPUContext,
            screenRectObject: redGPUContext.screenRectObject,
            pixelRectObject: redGPUContext.pixelRectObject
        });

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
 * [KO] 테스트용 TextField3D 객체들을 생성합니다.
 * [EN] Creates TextField3D objects for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {HTMLElement} infoBox
 * @param {function} updateInfo
 * @returns {{textFields: Array<RedGPU.Display.TextField3D>, updateLayout: function}}
 */
const createSampleTextField3D = (redGPUContext, scene, infoBox, updateInfo) => {
    const textFields = [];

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const textField = new RedGPU.Display.TextField3D(redGPUContext);
        textField.name = `TextField_${eventName}`;
        textField.text = eventName; // [KO] 텍스트 자체에 이벤트 명 표시 [EN] Set event name directly on text
        textField.background = 'blue';
        textField.color = 'white';
        textField.fontSize = 20; // [KO] 가독성을 위해 크기 약간 확대 [EN] Slightly increased size for readability
        textField.padding = 10;
        textField.borderRadius = 10;
        textField.primitiveState.cullMode = 'none';
        textField.worldSize = 1.0;

        scene.addChild(textField);
        textField.addListener(eventName, (e) => {
            updateInfo(eventName, e);
            e.target.background = getRandomHexValue();
        });

        textFields.push(textField);
    });

    const updateLayout = () => {
        const isMobile = redGPUContext.detector.isMobile;
        const radius = isMobile ? 2.5 : 3;
        const total = textFields.length;
        textFields.forEach((textField, index) => {
            const angle = (index / total) * Math.PI * 2;
            textField.x = Math.cos(angle) * radius;
            textField.y = Math.sin(angle) * radius;
        });
    };

    updateLayout();
    return {textFields, updateLayout};
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 * @returns {string}
 */
function getRandomHexValue() {
    var result = '';
    var characters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        result += characters[Math.floor(Math.random() * 16)];
    }
    return `#${result}`;
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770635178902");
    setDebugButtons(RedGPU, redGPUContext);

    const child = scene.children.find(c => c instanceof RedGPU.Display.TextField3D);
    const controls = {
        useBillboard: child.useBillboard,
        usePixelSize: child.usePixelSize,
        fontSize: child.fontSize,
        worldSize: child.worldSize,
    };

    const TextField3DFolder = pane.addFolder({title: 'TextField3D', expanded: true});

    const useBillboardBinding = TextField3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = TextField3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const fontSizeBinding = TextField3DFolder.addBinding(controls, 'fontSize', {
        min: 12,
        max: 128,
        step: 1
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.fontSize = evt.value;
        });
    });

    const worldSizeBinding = TextField3DFolder.addBinding(controls, 'worldSize', {
        min: 0.01,
        max: 5,
        step: 0.01
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.worldSize = evt.value;
        });
    });

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            fontSizeBinding.element.style.opacity = 0.25;
            fontSizeBinding.element.style.pointerEvents = 'none';
            worldSizeBinding.element.style.opacity = 1;
            worldSizeBinding.element.style.pointerEvents = 'painted';
        } else {
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                fontSizeBinding.element.style.opacity = 1;
                fontSizeBinding.element.style.pointerEvents = 'painted';
                worldSizeBinding.element.style.opacity = 0.25;
                worldSizeBinding.element.style.pointerEvents = 'none';
            } else {
                fontSizeBinding.element.style.opacity = 0.25;
                fontSizeBinding.element.style.pointerEvents = 'none';
                worldSizeBinding.element.style.opacity = 1;
                worldSizeBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    updateControlsState();
};
