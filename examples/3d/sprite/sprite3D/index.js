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
        scene.addChild(sprite3D);
        sprite3D.usePixelSize = true
        sprite3D.pixelSize = 64

        const sprite3DH = new RedGPU.Display.Sprite3D(redGPUContext, materialH);
        sprite3DH.x = -2.5;
        scene.addChild(sprite3DH);

        const sprite3DV = new RedGPU.Display.Sprite3D(redGPUContext, materialV);
        sprite3DV.x = 2.5;
        scene.addChild(sprite3DV);

        const spriteCount = 10;
        const radius = 6;

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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const child = scene.children.find(c => c instanceof RedGPU.Display.Sprite3D);
    console.log(child.position)

    const sprite3DFolder = pane.addFolder({title: 'Sprite3D', expanded: true});

    const useBillboardBinding = sprite3DFolder.addBinding(child, 'useBillboard');
    useBillboardBinding.on('change', (evt) => {
        scene.children.forEach((c) => {
            if (c instanceof RedGPU.Display.Sprite3D) c.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const worldSizeBinding = sprite3DFolder.addBinding(child, 'worldSize', {
        min: 0.01,
        max: 10,
        step: 0.01
    });
    worldSizeBinding.on('change', (evt) => {
        scene.children.forEach((c) => {
            if (c instanceof RedGPU.Display.Sprite3D) c.worldSize = evt.value;
        });
    });

    const pixelOptionsFolder = sprite3DFolder.addFolder({title: 'Pixel Options', expanded: true});
    pixelOptionsFolder.addBinding(child, 'usePixelSize');


    const pixelSizeBinding = pixelOptionsFolder.addBinding(child, 'pixelSize', {
        min: 1,
        max: 1024,
        step: 1
    });
    pixelSizeBinding.on('change', (evt) => {
        scene.children.forEach((c) => {
            if (c instanceof RedGPU.Display.Sprite3D) c.pixelSize = evt.value;
        });
    });

    function updateControlsState() {
        const {useBillboard, usePixelSize} = child;

        // billboard가 꺼져있으면 pixelSize 관련 모든 컨트롤 비활성화
        pixelOptionsFolder.disabled = !useBillboard;
        pixelOptionsFolder.element.style.pointerEvents = useBillboard ? 'auto' : 'none';

        // pixelSize 모드 여부에 따라 슬라이더 활성화 상태 제어
        const isPixelMode = useBillboard && usePixelSize;
        pixelSizeBinding.disabled = !isPixelMode;
        pixelSizeBinding.element.style.pointerEvents = isPixelMode ? 'auto' : 'none';


        // worldSize는 pixelSize 모드가 아닐 때만 활성화
        worldSizeBinding.disabled = isPixelMode;
        worldSizeBinding.element.style.pointerEvents = isPixelMode ? 'none' : 'auto';

    }

    const check = ()=>{
        pixelSizeBinding.refresh();
        requestAnimationFrame(check);
    }
    requestAnimationFrame(check);

    updateControlsState();
};