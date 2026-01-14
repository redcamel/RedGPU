import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 7.5;
        controller.tilt = -15;

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
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const total = array.length;
        const radius = 3;

        const angle = (index / total) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
        spriteSheet.x = x;
        spriteSheet.y = y;
        spriteSheet.primitiveState.cullMode = 'none';

        scene.addChild(spriteSheet);
        spriteSheet.addListener(eventName, (e) => {
            console.log(`Event: ${eventName}`, e);
            spriteSheet.material.useTint = true;
            spriteSheet.material.tint.r = Math.floor(Math.random() * 255);
            spriteSheet.material.tint.g = Math.floor(Math.random() * 255);
            spriteSheet.material.tint.b = Math.floor(Math.random() * 255);
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.y = -1;
        label.useBillboard = true;
        label.primitiveState.cullMode = 'none';
        spriteSheet.addChild(label);
    });
};

const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1768301050717");
    setDebugButtons(RedGPU, redGPUContext);
    const folder = pane.addFolder({title: 'SpriteSheet3D', expanded: true});
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
