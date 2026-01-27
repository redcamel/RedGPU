import * as RedGPU from "../../../../dist/index.js?t=1769512187569";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 7.5;
        controller.tilt = -15;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        createSampleSprite3D(redGPUContext, scene);

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

const createSampleSprite3D = async (redGPUContext, scene) => {
    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const total = array.length;
        const radius = 2;

        const angle = (index / total) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')));
        sprite3D.x = x;
        sprite3D.y = y;

        scene.addChild(sprite3D);
        sprite3D.addListener(eventName, (e) => {
            console.log(`Event: ${eventName}`, e);
            sprite3D.material.useTint = true;
            sprite3D.material.tint.r = Math.floor(Math.random() * 255);
            sprite3D.material.tint.g = Math.floor(Math.random() * 255);
            sprite3D.material.tint.b = Math.floor(Math.random() * 255);
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.y = -1;
        label.useBillboard = true;
        label.primitiveState.cullMode = 'none';
        sprite3D.addChild(label);
    });
};

const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512187569');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512187569");
    setDebugButtons(RedGPU, redGPUContext);
    const folder = pane.addFolder({title: 'Sprite3D', expanded: true});
    const controls = {
        useBillboardPerspective: scene.children[0].useBillboardPerspective,
        useBillboard: scene.children[0].useBillboard,
    };

    folder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboardPerspective = evt.value;
        });
    });

    folder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
    });
};
