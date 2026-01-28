import * as RedGPU from "../../../../dist/index.js?t=1769586528189";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 타겟 메시 생성
        const targetGeometry = new RedGPU.Primitive.Box(redGPUContext);
        const targetMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
        const targetMaterial2 = new RedGPU.Material.PhongMaterial(redGPUContext);
        targetMaterial.color.setColorByRGB(255, 0, 0);
        targetMaterial2.color.setColorByRGB(0, 255, 0);
        const targetMesh = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial);
        const targetMesh2 = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial2);
        targetMesh.x = 1
        targetMesh2.x = -1

        // IsometricController 생성
        const isometricController = new RedGPU.Camera.IsometricController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        scene.addChild(targetMesh);
        scene.addChild(targetMesh2);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, isometricController);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const addMeshesToScene = (scene, count = 500) => {
            const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
            const material = new RedGPU.Material.PhongMaterial(redGPUContext);

            for (let i = 0; i < count; i++) {
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

                mesh.setPosition(
                    Math.ceil(Math.random() * 300 - 150) - 0.5,
                    0.5,
                    Math.ceil(Math.random() * 300 - 150) - 0.5,
                );
                scene.addChild(mesh);
            }
        };

        addMeshesToScene(scene, 1000);

        const renderer = new RedGPU.Renderer(redGPUContext);

        const render = (time) => {
        };

        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, isometricController, targetMesh);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, controller, targetMesh) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769586528189');
    const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769586528189");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    {
        // 두 번째 컨트롤러 및 뷰 설정
        const controller2 = new RedGPU.Camera.IsometricController(redGPUContext);
        const view1 = redGPUContext.viewList[0];
        const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
        view2.axis = true;
        view2.grid = true;
        // 뷰 레이아웃 설정 유틸리티
        const ViewLayoutManager = {
            setSingleView: (view) => {
                view.setSize('100%', '100%');
                view.setPosition(0, 0);
            },
            setSplitView: (view1, view2, isMobile) => {
                if (isMobile) {
                    view1.setSize('100%', '50%');
                    view1.setPosition(0, 0);
                    view2.setSize('100%', '50%');
                    view2.setPosition(0, '50%');
                } else {
                    view1.setSize('50%', '100%');
                    view1.setPosition(0, 0);
                    view2.setSize('50%', '100%');
                    view2.setPosition('50%', 0);
                }
            }
        };

        // 컨트롤러 동기화 유틸리티
        const syncControllers = (source, target) => {
            [].forEach(prop => target[prop] = source[prop]);
        };

        // 테스트 모드 핸들러 맵
        const testModeHandlers = {
            singleView: (controlsFolders) => {
                ViewLayoutManager.setSingleView(view1);
                controlsFolders.forEach(controlsFolder => controlsFolder.hidden = false);
            },
            multiViewSharedControl: (controlsFolders) => {
                ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                redGPUContext.addView(view2);
                view2.camera = controller;
                controlsFolders.forEach(controlsFolder => controlsFolder.hidden = false);
            },
            multiViewIndependentControl: (controlsFolders) => {
                ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                redGPUContext.addView(view2);
                view2.camera = controller2;
                syncControllers(controller, controller2);
                controlsFolders.forEach(controlsFolder => controlsFolder.hidden = true);
            }
        };

        // 테스트 모드 폴더 설정
        const folder = pane.addFolder({title: 'Test Mode'});
        const testModes = {testMode: 'singleView'};
        folder.addBinding(testModes, 'testMode', {
            label: 'Test Mode',
            options: {
                singleView: 'singleView',
                multiViewSharedControl: 'multiViewSharedControl',
                multiViewIndependentControl: 'multiViewIndependentControl'
            }
        }).on('change', (ev) => {
            redGPUContext.removeAllViews();
            redGPUContext.addView(view1);
            view1.camera = controller;
            testModeHandlers[ev.value]([cameraFolder, zoomFolder, viewFolder, targetFolder]);
        });
    }

    // 카메라 설정 폴더
    const cameraFolder = pane.addFolder({
        title: 'Camera Settings',
    });
    cameraFolder.addBinding(controller, 'moveSpeed', {
        min: 0.01,
        max: 2,
        step: 0.01
    });

    cameraFolder.addBinding(controller, 'moveSpeedInterpolation', {
        min: 0.01,
        max: 1,
        step: 0.01
    });
    cameraFolder.addBinding(controller, 'mouseMoveSpeed', {
        min: 0.01,
        max: 1,
        step: 0.01
    });
    cameraFolder.addBinding(controller, 'mouseMoveSpeedInterpolation', {
        min: 0.01,
        max: 1,
        step: 0.01
    });

    // 줌 설정 폴더
    const zoomFolder = pane.addFolder({
        title: 'Zoom Settings',
    });

    zoomFolder.addBinding(controller, 'zoom', {
        min: controller.minZoom,
        max: controller.maxZoom,
        step: 0.1,
    });

    zoomFolder.addBinding(controller, 'zoomInterpolation', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    zoomFolder.addBinding(controller, 'speedZoom', {
        min: 0.01,
        max: 0.5,
        step: 0.01,
    });

    zoomFolder.addBinding(controller, 'minZoom', {
        min: 0.1,
        max: 2,
        step: 0.1,
    });

    zoomFolder.addBinding(controller, 'maxZoom', {
        min: 1,
        max: 10,
        step: 0.1,
    });

    // 뷰 설정 폴더
    const viewFolder = pane.addFolder({
        title: 'View Settings',
    });

    viewFolder.addBinding(controller, 'viewHeight', {
        min: 5,
        max: 100,
        step: 1,
    });

    viewFolder.addBinding(controller, 'viewHeightInterpolation', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    // 타겟 위치 폴더
    const targetFolder = pane.addFolder({
        title: 'Target Position',
    });

    targetFolder.addBinding(controller, 'x', {
        readonly: true,
    })

    targetFolder.addBinding(controller, 'y', {
        readonly: true,
    })

    targetFolder.addBinding(controller, 'z', {
        readonly: true,
    })
    const moveFolder = pane.addFolder({
        title: 'Movement Keys',
    });
    const keyBindings = controller.keyNameMapper;

    for (const key in keyBindings) {
        moveFolder.addBinding(keyBindings, key, {
            label: key,
        }).on('change', (ev) => {
            controller[`set${key.charAt(0).toUpperCase()}${key.substr(1)}`](ev.value);
        });
    }
    const update = () => {
        pane.refresh()
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
};
