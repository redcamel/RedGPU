import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        createSampleTextField2D(redGPUContext, scene);

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

            view.scene.children.forEach((textField2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                textField2D.setPosition(
                    textField2D.x + (endX - textField2D.x) * 0.3,
                    textField2D.y + (endY - textField2D.y) * 0.3
                );
            });
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleTextField2D = async (redGPUContext, scene) => {
    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const textField = new RedGPU.Display.TextField2D(redGPUContext);

        textField.text = `Hello ${eventName} Event!`;
        textField.background = 'blue';
        textField.color = 'white';
        textField.fontSize = 16;
        textField.padding = 10;
        textField.borderRadius = 10;

        scene.addChild(textField);
        textField.addListener(eventName, (e) => {
            console.log(`Event: ${eventName}`, e);
            e.target.background = getRandomHexValue();
        });
    });
};

function getRandomHexValue() {
    let result = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
        result += characters[Math.floor(Math.random() * 16)];
    }
    return `#${result}`;
}

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
};
