import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        const controller2 = new RedGPU.Camera.FreeController(redGPUContext);

        console.log(controller.name,controller2.name);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const view2 = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view2.axis = true;
        view2.grid = true;
        redGPUContext.addView(view2);



        if (redGPUContext.detector.isMobile) {
            // 모바일: 위아래 분할
            view.setSize('100%', '50%');
            view.setPosition(0, 0);         // 상단
            view2.setSize('100%', '50%');
            view2.setPosition(0, '50%');     // 하단
        } else {
            // 데스크톱: 좌우 분할
            view.setSize('50%', '100%');
            view.setPosition(0, 0);         // 좌측
            view2.setSize('50%', '100%');
            view2.setPosition('50%', 0);     // 우측
        }

        const addMeshesToScene = (scene, count = 500) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
            const material = new RedGPU.Material.ColorMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250
                );

                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // 매 프레임 로직
            redGPUContext.viewList.forEach((view) => {
                console.log(view.name,view.camera.startX)
            })
        };
        renderer.start(redGPUContext, render);

        // renderTestPane(redGPUContext, controller);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);
const renderTestPane = async (redGPUContext, controller) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js");

    setDebugButtons(redGPUContext);
    const pane = new Pane();

    // 카메라 위치 조정
    const cameraFolder = pane.addFolder({
        title: 'Camera',
    });

    const positionParams = {
        x: controller.x,
        y: controller.y,
        z: controller.z,
    };

    cameraFolder.addButton({
        title: 'Reset Position',
    }).on('click', () => {
        controller.x = 0;
        controller.y = 0;
        controller.z = 0;
        positionParams.x = 0;
        positionParams.y = 0;
        positionParams.z = 0;
        pane.refresh();
    });

    const rotationParams = {
        pan: controller.pan,
        tilt: controller.tilt,
    };

    cameraFolder.addButton({
        title: 'Reset Rotation',
    }).on('click', () => {
        controller.pan = 0;
        controller.tilt = 0;
        rotationParams.pan = 0;
        rotationParams.tilt = 0;
        pane.refresh();
    });

    // 조작 파라미터 조정
    const controlsFolder = pane.addFolder({
        title: 'Control Parameters',
    });

    controlsFolder.addBinding(controller, 'speed', {
        min: 0.1,
        max: 5,
        step: 0.1,
    });

    controlsFolder.addBinding(controller, 'delay', {
        min: 0.01,
        max: 0.5,
        step: 0.01,
    });

    controlsFolder.addBinding(controller, 'speedRotation', {
        min: 0.1,
        max: 5,
        step: 0.1,
    });

    controlsFolder.addBinding(controller, 'delayRotation', {
        min: 0.01,
        max: 0.5,
        step: 0.01,
    });

    controlsFolder.addBinding(controller, 'maxAcceleration', {
        min: 1,
        max: 10,
        step: 0.5,
    });


    const keyBindings = controller.keyNameMapper;

    // 이동 키
    const moveFolder = pane.addFolder({
        title: 'Movement Keys',
    });

    for (const key in keyBindings) {
        moveFolder.addBinding(keyBindings, key, {
            label: key,
        }).on('change', (ev) => {
            controller[`set${key.charAt(0).toUpperCase()}${key.substr(1)}`](ev.value);
        });
    }

};
