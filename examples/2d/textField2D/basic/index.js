import * as RedGPU from "../../../../dist/index.js?t=1769500077563";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
    const controller = new RedGPU.Camera.Camera2D();

    const scene = new RedGPU.Display.Scene();
    scene.backgroundColor.r = 255;
    scene.backgroundColor.g = 0;
    scene.backgroundColor.b = 0;
    scene.useBackgroundColor = true;
    const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const spriteCount = 10;
    const radius = 200;
    const centerX = redGPUContext.screenRectObject.width / 2;
    const centerY = redGPUContext.screenRectObject.height / 2;

    for (let i = 0; i < spriteCount; i++) {
        const angle = (i / spriteCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
        textField2D.text = textField2D.name.split(' ').join('<br/>');
        textField2D.x = Math.floor(x);
        textField2D.y = Math.floor(y);
        scene.addChild(textField2D);
    }

    const renderer = new RedGPU.Renderer(redGPUContext);
    const render = () => {
    };
    renderer.start(redGPUContext, render);

    renderTestPane(scene, redGPUContext);
}, (failReason) => {
    console.error('Initialization failed:', failReason);
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = failReason;
    document.body.appendChild(errorMessage);
});

const renderTestPane = async (scene, redGPUContext) => {
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769500077563");
    setDebugButtons(RedGPU, redGPUContext);
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769500077563');
    const pane = new Pane();

    const controls = {};

    const BASE_STYLES = {
        padding: 0,
        background: 'transparent',
        color: '#fff',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0,
        wordBreak: 'break-all',
        verticalAlign: 'middle',
        textAlign: 'center',
        borderRadius: '10px',
        lineHeight: 1.4,
        border: '',
        boxShadow: 'none',
        boxSizing: 'border-box',
        filter: '',
    };

    const OPTIONS = {
        fontFamily: ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'],
        fontWeight: ['normal', 'bold', 'bolder', 'lighter'],
        fontStyle: ['normal', 'italic', 'oblique'],
        wordBreak: ['normal', 'break-all', 'keep-all', 'break-word'],
        verticalAlign: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'],
        textAlign: ['left', 'right', 'center', 'justify'],
        background: ['transparent', '#000', '#fff', '#f00', '#0f0', '#00f'],
        color: ['#fff', '#000', '#f00', '#0f0', '#00f'],
        boxSizing: ['content-box', 'border-box'],
    };

    const updateTestData = () => {
        const child = scene.children[0];

        controls.scaleX = child.scaleX;
        controls.scaleY = child.scaleY;
        controls.scaleZ = child.scaleZ;
        controls.rotation = child.rotation;
        controls.useSmoothing = child.useSmoothing;

        pane.refresh();

        Object.keys(BASE_STYLES).forEach((key) => {
            controls[key] = child[key];
        });

        pane.refresh();
    };

    updateTestData();
    console.log(controls);
    updateTestData();

    const textField2DFolder = pane.addFolder({title: 'TextField2D', expanded: true});
    textField2DFolder.addBinding(controls, 'useSmoothing').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useSmoothing = evt.value;
        });
    });
    setSeparator(pane);

    const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});

    scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleX = evt.value;
        });
    });
    scaleFolder.addBinding(controls, 'rotation', {min: 0, max: 360, step: 0.1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.rotation = evt.value;
        });
    });
    scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleY = evt.value;
        });
    });

    const styleFolder = pane.addFolder({title: 'Styles', expanded: true});

    styleFolder.addBinding(controls, 'fontSize', {min: 12, max: 50, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.fontSize = evt.value;
        });
    });
    styleFolder.addBinding(controls, 'padding', {min: 0, max: 32, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.padding = evt.value;
        });
    });

    Object.keys(OPTIONS).forEach((key) => {
        styleFolder.addBinding(controls, key, {
            options: OPTIONS[key].reduce((obj, value) => {
                obj[value] = value;
                return obj;
            }, {}),
        }).on('change', (evt) => {
            scene.children.forEach((child) => {
                child[key] = evt.value;
            });
        });
    });

    setSeparator(pane);
};
