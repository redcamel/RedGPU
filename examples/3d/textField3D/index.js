import * as RedGPU from "../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 6;
    controller.speedDistance = 0.5;

    const scene = new RedGPU.Display.Scene();
    scene.backgroundColor.r = 128;
    scene.useBackgroundColor = true;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.worldSize = 1.0;
    scene.addChild(textField3D);

    const spriteCount = 10;
    const radius = 5;

    for (let i = 0; i < spriteCount; i++) {
        const angle = (i / spriteCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
        textField3D.text = textField3D.name.split(' ').join('<br/>');
        textField3D.color = 'red';
        textField3D.x = x;
        textField3D.z = z;
        textField3D.worldSize = 1.0;
        scene.addChild(textField3D);
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

    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const pane = new Pane();
    const {
        setDebugButtons,
        setSeparator
    } = await import("../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    
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

    const child = scene.children.find(c => c instanceof RedGPU.Display.TextField3D);
    const controls = {
        useBillboard: child.useBillboard,
        usePixelSize: child.usePixelSize,
        worldSize: child.worldSize,
        ...BASE_STYLES
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

    const worldSizeBinding = TextField3DFolder.addBinding(controls, 'worldSize', {min: 0.01, max: 10, step: 0.01}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.worldSize = evt.value;
        });
    });

    setSeparator(pane);

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            worldSizeBinding.element.style.opacity = 1;
            worldSizeBinding.element.style.pointerEvents = 'painted';
        } else {
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                // 픽셀 사이즈 모드: fontSize가 크기를 결정함
                worldSizeBinding.element.style.opacity = 0.25;
                worldSizeBinding.element.style.pointerEvents = 'none';
            } else {
                worldSizeBinding.element.style.opacity = 1;
                worldSizeBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    const styleFolder = pane.addFolder({title: 'TextField3D Styles', expanded: true});

    styleFolder.addBinding(controls, 'fontSize', {min: 12, max: 128, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.fontSize = evt.value;
        });
    });

    styleFolder.addBinding(controls, 'padding', {min: 0, max: 32, step: 1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField3D) child.padding = evt.value;
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
                if (child instanceof RedGPU.Display.TextField3D) child[key] = evt.value;
            });
        });
    });

    setSeparator(pane);
    updateControlsState();
};