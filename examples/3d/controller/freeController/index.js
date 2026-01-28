import * as RedGPU from "../../../../dist/index.js?t=1769585073767";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(canvas, (redGPUContext) => {
    const controller = new RedGPU.Camera.FreeController(redGPUContext);
    controller.z = 10;
    controller.y = 10;
    controller.tilt = -45;

    const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    const scene = new RedGPU.Display.Scene();
    const directionalLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(directionalLight);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.axis = true;
    view.grid = true;
    view.skybox = skybox;
    redGPUContext.addView(view);

    const addMeshesToScene = (scene, count = 500) => {
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);

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
    };
    renderer.start(redGPUContext, render);

    renderTestPane(redGPUContext, controller);
}, (failReason) => {
    console.error('초기화 실패:', failReason);
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = failReason;
    document.body.appendChild(errorMessage);
});
const renderTestPane = async (redGPUContext, controller) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769585073767');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769585073767");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    {
        // 두 번째 컨트롤러 및 뷰 설정
        const controller2 = new RedGPU.Camera.FreeController(redGPUContext);
        const view1 = redGPUContext.viewList[0];
        const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
        view2.axis = true;
        view2.grid = true;
        view2.skybox = view1.skybox;

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
            ['x', 'y', 'z', 'tilt', 'pan'].forEach(prop => target[prop] = source[prop]);
        };

        // 테스트 모드 핸들러 맵
        const testModeHandlers = {
            singleView: (controlsFolder) => {
                ViewLayoutManager.setSingleView(view1);
                controlsFolder.hidden = false;
            },
            multiViewSharedControl: (controlsFolder) => {
                ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                redGPUContext.addView(view2);
                view2.camera = controller;
                controlsFolder.hidden = false;
            },
            multiViewIndependentControl: (controlsFolder) => {
                ViewLayoutManager.setSplitView(view1, view2, redGPUContext.detector.isMobile);
                redGPUContext.addView(view2);
                view2.camera = controller2;
                syncControllers(controller, controller2);
                controlsFolder.hidden = true;
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
            testModeHandlers[ev.value](controlsFolder);
        });
    }
    // 조작 파라미터 조정
    const controlsFolder = pane.addFolder({
        title: 'Control Parameters'
    });

    controlsFolder.addBinding(controller, 'moveSpeed', {
        min: 0.1, max: 5, step: 0.1
    });

    controlsFolder.addBinding(controller, 'moveSpeedInterpolation', {
        min: 0.01, max: 0.5, step: 0.01
    });

    controlsFolder.addBinding(controller, 'rotationSpeed', {
        min: 0.1, max: 5, step: 0.1
    });

    controlsFolder.addBinding(controller, 'rotationSpeedInterpolation', {
        min: 0.01, max: 0.5, step: 0.01
    });

    controlsFolder.addBinding(controller, 'maxAcceleration', {
        min: 1, max: 10, step: 0.5
    });

    const keyBindings = controller.keyNameMapper;

    // 이동 키
    const moveFolder = pane.addFolder({
        title: 'Movement Keys'
    });

    for (const key in keyBindings) {
        moveFolder.addBinding(keyBindings, key, {
            label: key
        }).on('change', (ev) => {
            controller[`set${key.charAt(0).toUpperCase()}${key.substr(1)}`](ev.value);
        });
    }

};
