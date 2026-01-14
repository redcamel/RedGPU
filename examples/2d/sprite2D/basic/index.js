import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

        const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
        sprite2D.setSize(100, 100);
        sprite2D.x = view.screenRectObject.width / 2;
        sprite2D.y = view.screenRectObject.height / 2;
        scene.addChild(sprite2D);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {

        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, sprite2D);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, sprite2D) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717');
    const {
        setDebugButtons,
        setRedGPUTest_pane
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1768301050717");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);

    const config = {
        material: 'Bitmap',
    };

    pane.addBinding(config, 'material', {
        options: {
            Color: 'Color',
            Bitmap: 'Bitmap'
        }
    }).on('change', (evt) => {
        if (evt.value === 'Color') {
            sprite2D.material = new RedGPU.Material.ColorMaterial(redGPUContext)
        } else {
            sprite2D.material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))
        }
    });

    const positionFolder = pane.addFolder({title: 'Position', expanded: true});
    positionFolder.addBinding(sprite2D, 'x', {
        min: 0,
        max: redGPUContext.screenRectObject.width,
        step: 0.1
    }).on('change', (evt) => {
        sprite2D.x = evt.value;
    });
    positionFolder.addBinding(sprite2D, 'y', {
        min: 0,
        max: redGPUContext.screenRectObject.height,
        step: 0.1
    }).on('change', (evt) => {
        sprite2D.y = evt.value;
    });

    const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
    scaleFolder.addBinding(sprite2D, 'scaleX', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
        sprite2D.scaleX = evt.value;
    });
    scaleFolder.addBinding(sprite2D, 'scaleY', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
        sprite2D.scaleY = evt.value;
    });

    const widthHeightFolder = pane.addFolder({title: 'Width & Height', expanded: true});
    widthHeightFolder.addBinding(sprite2D, 'width', {
        min: 0,
        max: sprite2D.width * 2,
        step: 0.1
    }).on('change', (evt) => {
        sprite2D.width = evt.value;
    });
    widthHeightFolder.addBinding(sprite2D, 'height', {
        min: 0,
        max: sprite2D.height * 2,
        step: 0.1
    }).on('change', (evt) => {
        sprite2D.height = evt.value;
    });

    const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
    rotationFolder.addBinding(sprite2D, 'rotation', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
        sprite2D.rotation = evt.value
    });
};
