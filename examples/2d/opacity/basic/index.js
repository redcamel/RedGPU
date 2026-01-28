import * as RedGPU from "../../../../dist/index.js?t=1769587130347";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.Camera2D();

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const parentSprite2D = createParentSprite2D(redGPUContext, scene);
        const childSprite2D = createChildSprite2D(redGPUContext, parentSprite2D);
        const childTextField2D = createChildTextField2D(redGPUContext, parentSprite2D);
        const childSpriteSheet2D = createChildSpriteSheet2D(redGPUContext, parentSprite2D);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, parentSprite2D, [childSprite2D, childTextField2D, childSpriteSheet2D]);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createParentSprite2D = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(100, 100);
    sprite2D.x = redGPUContext.screenRectObject.width / 2;
    sprite2D.y = redGPUContext.screenRectObject.height / 2;
    scene.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 85;
    sprite2D.addChild(title);

    return sprite2D;
};

const createChildSprite2D = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
    sprite2D.setSize(75);
    sprite2D.x = 150;
    sprite2D.y = 150;
    parent.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 72;
    sprite2D.addChild(title);
    return sprite2D;
};

const createChildSpriteSheet2D = (redGPUContext, parent) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const sprite2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
    sprite2D.x = -150;
    sprite2D.y = 150;
    parent.addChild(sprite2D);

    const title = new RedGPU.Display.TextField2D(redGPUContext);
    title.text = `SpriteSheet2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`;
    title.fontSize = 12;
    title.y = 120;
    sprite2D.addChild(title);
    return sprite2D;
};

const createChildTextField2D = (redGPUContext, parent) => {
    const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
    textField2D.x = 0;
    textField2D.y = -150;
    textField2D.text = `TextField2D<br/>Opacity ${textField2D.opacity}<br/>combinedOpacity ${textField2D.getCombinedOpacity()}`;
    parent.addChild(textField2D);
    return textField2D;
};

const renderTestPane = async (redGPUContext, parent, children) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769587130347');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769587130347");
    setDebugButtons(RedGPU, redGPUContext);
    const maxW = redGPUContext.screenRectObject.width;
    const maxH = redGPUContext.screenRectObject.height;

    const parentConfig = {
        x: parent.x,
        y: parent.y,
        width: parent.width,
        height: parent.height,
        rotation: parent.rotation,
        scaleX: parent.scaleX,
        scaleY: parent.scaleY,
        opacity: parent.opacity,
    };

    const parentFolder = pane.addFolder({title: 'Parent Sprite2D', expanded: true});
    parentFolder.addBinding(parentConfig, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01
    }).on('change', (evt) => {
        parent.opacity = evt.value;

        const parentTitle = parent.children.find(child => child instanceof RedGPU.Display.TextField2D);
        if (parentTitle) {
            parentTitle.text = `Opacity ${parent.opacity.toFixed(2)}<br/>combinedOpacity ${parent.getCombinedOpacity().toFixed(2)}`;
        }

        children.forEach((child) => {
            if (child instanceof RedGPU.Display.TextField2D) {
                child.text = `TextField2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
            } else {
                const childTitle = child.children?.find(
                    (child) => child instanceof RedGPU.Display.TextField2D
                );
                if (childTitle) {
                    childTitle.text = `Sprite2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
                }
            }
        });
    });

    children.forEach((child, index) => {
        const childConfig = {
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height,
            rotation: child.rotation,
            scaleX: child.scaleX,
            scaleY: child.scaleY,
            opacity: child.opacity,
        };

        const childFolder = pane.addFolder({title: `Child ${child.constructor.name}`, expanded: true});
        childFolder.addBinding(childConfig, 'opacity', {
            min: 0,
            max: 1,
            step: 0.01,
        }).on('change', (evt) => {
            child.opacity = evt.value;

            if (child instanceof RedGPU.Display.TextField2D) {
                child.text = `TextField2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
            } else {
                const childTitle = child.children?.find(
                    (child) => child instanceof RedGPU.Display.TextField2D
                );
                if (childTitle) {
                    childTitle.text = `Sprite2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
                }
            }
        });
    });
};
