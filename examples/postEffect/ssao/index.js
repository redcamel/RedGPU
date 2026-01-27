import * as RedGPU from "../../../dist/index.js?t=1769502127937";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);

        controller.z = 1.0
        controller.x = 2
        controller.y = 2
        controller.tilt = 15
        controller.pan = 110

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        view.postEffectManager.useSSAO = true
        view.postEffectManager.useSSR = true

        redGPUContext.antialiasingManager.useTAA = true

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf');

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        scene.addChild(mesh)
    });
}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769502127937');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../exampleHelper/createExample/panes/index.js?t=1769502127937');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);

    pane.addBinding(targetView.postEffectManager, 'useSSAO', {label: 'Enable SSAO'})
    pane.addBinding(targetView.postEffectManager, 'useSSR', {label: 'Enable SSR'})

    // SSAO 파라미터 조절
    const ssaoFolder = pane.addFolder({title: 'SSAO Parameters', expanded: true});

    const ssao = targetView.postEffectManager.ssao;
    ssaoFolder.addBinding(ssao, 'useBlur')
    ssaoFolder.addBinding(ssao, 'radius', {
        min: 0.01,
        max: 5.0,
        step: 0.01,
        label: 'Radius'
    });

    ssaoFolder.addBinding(ssao, 'intensity', {
        min: 0.0,
        max: 10.0,
        step: 0.1,
        label: 'Intensity'
    });

    ssaoFolder.addBinding(ssao, 'bias', {
        min: 0.0,
        max: 0.1,
        step: 0.001,
        label: 'Bias'
    });

    ssaoFolder.addBinding(ssao, 'biasDistanceScale', {
        min: 0.0,
        max: 0.5,
        step: 0.01,
        label: 'Bias Distance Scale'
    });

    ssaoFolder.addBinding(ssao, 'fadeDistanceStart', {
        min: 1.0,
        max: 200.0,
        step: 0.01,
        label: 'Fade Distance Start'
    });

    ssaoFolder.addBinding(ssao, 'fadeDistanceRange', {
        min: 1.0,
        max: 100.0,
        step: 0.01,
        label: 'Fade Distance Range'
    });

    ssaoFolder.addBinding(ssao, 'contrast', {
        min: 0.5,
        max: 4.0,
        step: 0.1,
        label: 'Contrast'
    });
};
