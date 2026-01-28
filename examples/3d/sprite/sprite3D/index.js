import * as RedGPU from "../../../../dist/index.js?t=1769585073767";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.2;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const material = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        );

        const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);

        scene.addChild(sprite3D);

        const spriteCount = 10;
        const radius = 5;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);

            sprite3D.x = x;
            sprite3D.z = z;
            scene.addChild(sprite3D);
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view, scene);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, view, scene) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769585073767');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769585073767");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const controls = {
        useBillboardPerspective: scene.children[0].useBillboardPerspective,
        useBillboard: scene.children[0].useBillboard,
        billboardFixedScale: scene.children[0].billboardFixedScale,
        scaleX: scene.children[0].scaleX,
        scaleY: scene.children[0].scaleY,
        scaleZ: scene.children[0].scaleZ,
    };

    const sprite3DFolder = pane.addFolder({title: 'Sprite3D', expanded: true});

    sprite3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboardPerspective = evt.value;
        });
        updateBillboardFixedScaleBinding();
    });

    sprite3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
        updateBillboardFixedScaleBinding();
    });

    const updateBillboardFixedScaleBinding = () => {
        if (!controls.useBillboardPerspective && controls.useBillboard) {
            billboardFixedScaleBinding.element.style.opacity = 1;
            billboardFixedScaleBinding.element.style.pointerEvents = 'painted';
        } else {
            billboardFixedScaleBinding.element.style.opacity = 0.25;
            billboardFixedScaleBinding.element.style.pointerEvents = 'none';
        }
    };

    const billboardFixedScaleBinding = sprite3DFolder
        .addBinding(controls, 'billboardFixedScale', {min: 0.1, max: 1})
        .on('change', (evt) => {
            scene.children.forEach((child) => {
                child.billboardFixedScale = evt.value;
            });
        });

    updateBillboardFixedScaleBinding();

    const scaleFolder = pane.addFolder({title: 'Sprite3D Scale', expanded: true});
    scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleX = controls.scaleX;
        });
    });
    scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleY = controls.scaleY;
        });
    });
};
