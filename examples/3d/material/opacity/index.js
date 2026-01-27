import * as RedGPU from "../../../../dist/index.js?t=1769499639386";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const bitmapSprite3D = createChildSprite3D(redGPUContext, scene, 'BitmapMaterial', 0, 4, '../../../assets/UV_Grid_Sm.jpg');
        const childSprite3D = createChildSprite3D(redGPUContext, scene, 'ColorMaterial', 0, 1.5);
        const childTextField3D = createChildTextField3D(redGPUContext, scene, 0, -0.5);
        const childSpriteSheet3D = createChildSpriteSheet3D(redGPUContext, scene, 0, -3);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, bitmapSprite3D, [childSprite3D, childTextField3D, childSpriteSheet3D]);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createChildSprite3D = (redGPUContext, parent, labelPrefix, x = 0, y = 0, textureUrl = null) => {
    let material;
    if (textureUrl) {
        material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, textureUrl));
    } else {
        material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    }

    const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3D.x = x;
    sprite3D.y = y;
    parent.addChild(sprite3D);

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.y = 1;
    title.fontSize = '10px';
    sprite3D.addChild(title);

    return sprite3D;
};

const createChildSpriteSheet3D = (redGPUContext, parent, x = 0, y = 0) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const sprite3D = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    sprite3D.x = x;
    sprite3D.y = y;
    parent.addChild(sprite3D);

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.y = 1;
    title.fontSize = '10px';
    sprite3D.addChild(title);

    return sprite3D;
};

const createChildTextField3D = (redGPUContext, parent, x = 0, y = 0) => {
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.x = x;
    textField3D.y = y;
    textField3D.fontSize = '10px';
    textField3D.useBillboard = true;
    parent.addChild(textField3D);

    return textField3D;
};

const renderTestPane = async (redGPUContext, parent, children) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769499639386');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769499639386");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const allObjects = [parent, ...children];

    allObjects.forEach((obj) => {
        let objType = '';
        if (obj instanceof RedGPU.Display.TextField3D) {
            objType = 'TextField3D';
        } else if (obj instanceof RedGPU.Display.SpriteSheet3D) {
            objType = 'SpriteSheet3D';
        } else if (obj.material instanceof RedGPU.Material.BitmapMaterial) {
            objType = 'BitmapMaterial';
        } else if (obj.material instanceof RedGPU.Material.ColorMaterial) {
            objType = 'ColorMaterial';
        }

        const title = `${objType} Material`;
        const objConfig = {
            opacity: obj.material.opacity,
        };

        const objFolder = pane.addFolder({title: title, expanded: true});

        const update = (obj, evt) => {
            obj.material.opacity = evt.value;
            const opacityText = `${objType} instance.material<br/>Opacity ${obj.material.opacity.toFixed(2)}`;

            if (obj instanceof RedGPU.Display.TextField3D) {
                obj.text = opacityText;
            } else if (obj instanceof RedGPU.Display.SpriteSheet3D) {
                obj.getChildAt(0).text = opacityText;
            } else if (obj.material instanceof RedGPU.Material.BitmapMaterial || obj.material instanceof RedGPU.Material.ColorMaterial) {
                obj.getChildAt(0).text = opacityText;
            }
        };

        objFolder.addBinding(objConfig, 'opacity', {
            min: 0,
            max: 1,
            step: 0.01
        }).on('change', (evt) => {
            update(obj, evt);
        });

        update(obj, {value: objConfig.opacity});
    });
};
