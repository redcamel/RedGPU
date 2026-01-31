import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

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

            view.scene.children.forEach((spriteSheet2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                spriteSheet2D.setPosition(
                    spriteSheet2D.x + (endX - spriteSheet2D.x) * 0.3,
                    spriteSheet2D.y + (endY - spriteSheet2D.y) * 0.3
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
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
        scene.addChild(spriteSheet);
        spriteSheet.addListener(eventName, (e) => {
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
        spriteSheet.addChild(label);
    });
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
};
