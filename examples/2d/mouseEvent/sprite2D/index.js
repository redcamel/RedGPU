import * as RedGPU from "../../../../dist/index.js?t=1769512410570";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        createSampleSprite2D(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            const radius = 250;
            const numChildren = view.scene.children.length;

            const centerX = view.screenRectObject.width / 2;
            const centerY = view.screenRectObject.height / 2;

            view.scene.children.forEach((sprite2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                sprite2D.setPosition(
                    sprite2D.x + (endX - sprite2D.x) * 0.3,
                    sprite2D.y + (endY - sprite2D.y) * 0.3
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

const createSampleSprite2D = async (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        scene.addChild(sprite2D);
        sprite2D.addListener(eventName, (e) => {
            console.log(`Event: ${eventName}`, e);
            let tRotation = Math.random() * 360;
            TweenMax.to(e.target, 0.5, {
                rotation: tRotation,
                ease: Back.easeOut
            });
        });

        const label = new RedGPU.Display.TextField2D(redGPUContext);
        label.text = `Hello ${eventName} Event!`;
        label.padding = 20;
        label.borderRadius = 16;
        label.background = 'rgba(104,54,54,0.4)';
        label.y = 0;
        sprite2D.addChild(label);
    });
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512410570');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512410570");
    setDebugButtons(RedGPU, redGPUContext);
};
