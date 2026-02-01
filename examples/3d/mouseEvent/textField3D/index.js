import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = 0;
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

        const { updateLayout } = createSampleTextField3D(redGPUContext, scene, infoBox, updateInfo);

        /**
         * [KO] 화면 크기가 변경될 때 호출되는 이벤트 핸들러입니다.
         * [EN] Event handler called when the screen size changes.
         */
        redGPUContext.onResize = (resizeEvent) => {
            const { width, height } = resizeEvent.pixelRectObject;
            const aspect = width / height;
            const isMobile = redGPUContext.detector.isMobile;
            const baseDistance = isMobile ? 8 : 7.5;
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

const createSampleTextField3D = (redGPUContext, scene, infoBox, updateInfo) => {
    const textFields = [];
    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const textField = new RedGPU.Display.TextField3D(redGPUContext);
        textField.useBillboard = true;
        textField.text = `Hello ${eventName} Event!`;
        textField.background = 'blue';
        textField.color = 'white';
        textField.fontSize = 16;
        textField.padding = 10;
        textField.borderRadius = 10;
        textField.primitiveState.cullMode = 'none';

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
    return { textFields, updateLayout };
};

function getRandomHexValue() {
    var result = '';
    var characters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        result += characters[Math.floor(Math.random() * 16)];
    }
    return `#${result}`;
}

const renderTestPane = async (redGPUContext, scene) => {
    const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const pane = new Pane();
    const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js");
    setDebugButtons(RedGPU, redGPUContext);
    const TextField3DFolder = pane.addFolder({ title: 'TextField3D', expanded: true });
    const controls = {
        useBillboardPerspective: scene.children[0].useBillboardPerspective,
        useBillboard: scene.children[0].useBillboard,
    };

    TextField3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboardPerspective = evt.value;
        });
    });

    TextField3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
    });
};