import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

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
    const controls = {
        useSizeAttenuation: scene.children[0].useSizeAttenuation,
        useBillboard: scene.children[0].useBillboard,
        usePixelSize: scene.children[0].usePixelSize,
        pixelSize: scene.children[0].pixelSize,
        scaleX: scene.children[0].scaleX,
        scaleY: scene.children[0].scaleY,
        scaleZ: scene.children[0].scaleZ,
    };

    const sprite3DFolder = pane.addFolder({title: 'Sprite3D', expanded: true});

    const useSizeAttenuationBinding = sprite3DFolder.addBinding(controls, 'useSizeAttenuation').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useSizeAttenuation = evt.value;
        });
    });

    const useBillboardBinding = sprite3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.useBillboard = evt.value;
        });
        updateControlsState();
    });

    const usePixelSizeBinding = sprite3DFolder.addBinding(controls, 'usePixelSize').on('change', (evt) => {
        scene.children.forEach((child) => {
            child.usePixelSize = evt.value;
        });
        updateControlsState();
    });

    const pixelSizeBinding = sprite3DFolder.addBinding(controls, 'pixelSize', {
        min: 1,
        max: 256,
        step: 1
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.pixelSize = evt.value;
        });
    });

    const scaleFolder = pane.addFolder({title: 'Sprite3D Scale', expanded: true});
    const scaleXBinding = scaleFolder.addBinding(controls, 'scaleX', {
        min: 0.1,
        max: 5,
        step: 0.1
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleX = controls.scaleX;
        });
    });
    const scaleYBinding = scaleFolder.addBinding(controls, 'scaleY', {
        min: 0.1,
        max: 5,
        step: 0.1
    }).on('change', (evt) => {
        scene.children.forEach((child) => {
            child.scaleY = controls.scaleY;
        });
    });

    const updateControlsState = () => {
        const {useBillboard, usePixelSize} = controls;

        if (!useBillboard) {
            // 빌보드가 꺼지면 빌보드 관련 옵션 모두 비활성화
            useSizeAttenuationBinding.element.style.opacity = 0.25;
            useSizeAttenuationBinding.element.style.pointerEvents = 'none';
            usePixelSizeBinding.element.style.opacity = 0.25;
            usePixelSizeBinding.element.style.pointerEvents = 'none';
            pixelSizeBinding.element.style.opacity = 0.25;
            pixelSizeBinding.element.style.pointerEvents = 'none';

            // 스케일은 활성화 (일반 메시 모드)
            scaleXBinding.element.style.opacity = 1;
            scaleXBinding.element.style.pointerEvents = 'painted';
            scaleYBinding.element.style.opacity = 1;
            scaleYBinding.element.style.pointerEvents = 'painted';
        } else {
            // 빌보드 켜짐
            useSizeAttenuationBinding.element.style.opacity = 1;
            useSizeAttenuationBinding.element.style.pointerEvents = 'painted';
            usePixelSizeBinding.element.style.opacity = 1;
            usePixelSizeBinding.element.style.pointerEvents = 'painted';

            if (usePixelSize) {
                // 픽셀 사이즈 모드
                pixelSizeBinding.element.style.opacity = 1;
                pixelSizeBinding.element.style.pointerEvents = 'painted';

                // 픽셀 모드에서는 원근감/월드스케일 무시됨
                useSizeAttenuationBinding.element.style.opacity = 0.25;
                useSizeAttenuationBinding.element.style.pointerEvents = 'none';
                scaleXBinding.element.style.opacity = 0.25;
                scaleXBinding.element.style.pointerEvents = 'none';
                scaleYBinding.element.style.opacity = 0.25;
                scaleYBinding.element.style.pointerEvents = 'none';
            } else {
                // 월드 스케일 모드
                pixelSizeBinding.element.style.opacity = 0.25;
                pixelSizeBinding.element.style.pointerEvents = 'none';

                // 원근감/월드스케일 활성화
                useSizeAttenuationBinding.element.style.opacity = 1;
                useSizeAttenuationBinding.element.style.pointerEvents = 'painted';
                scaleXBinding.element.style.opacity = 1;
                scaleXBinding.element.style.pointerEvents = 'painted';
                scaleYBinding.element.style.opacity = 1;
                scaleYBinding.element.style.pointerEvents = 'painted';
            }
        }
    };

    // 초기 상태 업데이트
    updateControlsState();
};

