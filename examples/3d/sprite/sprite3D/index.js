import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.2;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const material = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        );

        const materialH = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')
        );

        const materialV = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/v_test.jpg')
        );

        const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
        sprite3D.worldSize = 1.0;
        scene.addChild(sprite3D);

        const sprite3DH = new RedGPU.Display.Sprite3D(redGPUContext, materialH);
        sprite3DH.x = -2.5;
        sprite3DH.worldSize = 1.0;
        scene.addChild(sprite3DH);

        const sprite3DV = new RedGPU.Display.Sprite3D(redGPUContext, materialV);
        sprite3DV.x = 2.5;
        sprite3DV.worldSize = 1.0;
        scene.addChild(sprite3DV);

        const spriteCount = 10;
        const radius = 6;

        for (let i = 0; i < spriteCount; i++) {
            const angle = (i / spriteCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
            sprite3D.worldSize = 1.0;
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const child = scene.children.find(c => c instanceof RedGPU.Display.Sprite3D);
    const controls = {
        useBillboard: child.useBillboard,
        usePixelSize: child.usePixelSize,
        pixelSize: child.pixelSize,
        worldSize: child.worldSize,
    };

    const sprite3DFolder = pane.addFolder({title: 'Sprite3D', expanded: true});

    const useBillboardBinding = sprite3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.Sprite3D) child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = sprite3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.Sprite3D) child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const pixelSizeBinding = sprite3DFolder.addBinding(controls, 'pixelSize', {
        min: 1,
        max: 512,
        step: 1
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.Sprite3D) child.pixelSize = evt.value;
        });
    });

    const worldSizeBinding = sprite3DFolder.addBinding(controls, 'worldSize', {
        min: 0.01,
        max: 10,
        step: 0.01
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            if (child instanceof RedGPU.Display.Sprite3D) child.worldSize = evt.value;
        });
    });

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            pixelSizeBinding.element.style.opacity = 0.25;
            pixelSizeBinding.element.style.pointerEvents = 'none';
            worldSizeBinding.element.style.opacity = 1;
            worldSizeBinding.element.style.pointerEvents = 'painted';
        } else {
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                pixelSizeBinding.element.style.opacity = 1;
                pixelSizeBinding.element.style.pointerEvents = 'painted';
                worldSizeBinding.element.style.opacity = 0.25;
                worldSizeBinding.element.style.pointerEvents = 'none';
            } else {
                pixelSizeBinding.element.style.opacity = 0.25;
                pixelSizeBinding.element.style.pointerEvents = 'none';
                worldSizeBinding.element.style.opacity = 1;
                worldSizeBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    updateControlsState();
};