import * as RedGPU from "../../../../dist/index.js?t=1769513175662";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

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
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);
const renderTestPane = async (redGPUContext, controller) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769513175662');
    const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769513175662");

    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    {
        // 두 번째 컨트롤러 및 뷰 설정
        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
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
            ['tilt', 'pan', 'distance', 'centerX', 'centerY', 'centerZ'].forEach(prop => target[prop] = source[prop]);
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
    // 중심점 (Center) 설정
    const centerFolder = pane.addFolder({
        title: 'Center Position'
    });

    centerFolder.addBinding(controller, 'centerX', {
        label: 'Center X',
        min: -50,
        max: 50,
        step: 0.5
    });

    centerFolder.addBinding(controller, 'centerY', {
        label: 'Center Y',
        min: -50,
        max: 50,
        step: 0.5
    });

    centerFolder.addBinding(controller, 'centerZ', {
        label: 'Center Z',
        min: -50,
        max: 50,
        step: 0.5
    });

    // 거리 및 줌 설정
    const distanceFolder = pane.addFolder({
        title: 'Distance & Zoom'
    });

    distanceFolder.addBinding(controller, 'distance', {
        label: 'Distance',
        min: 0.1,
        max: 100,
        step: 0.5
    });

    distanceFolder.addBinding(controller, 'speedDistance', {
        label: 'Speed Distance',
        min: 0.01,
        max: 10,
        step: 0.1
    });

    distanceFolder.addBinding(controller, 'distanceInterpolation', {
        label: 'Delay Distance',
        min: 0.01,
        max: 1,
        step: 0.01
    });

    // 회전 (Pan & Tilt) 설정
    const rotationFolder = pane.addFolder({
        title: 'Rotation'
    });

    rotationFolder.addBinding(controller, 'pan', {
        label: 'Pan',
        min: -360,
        max: 360,
        step: 1
    });

    rotationFolder.addBinding(controller, 'tilt', {
        label: 'Tilt',
        min: -90,
        max: 90,
        step: 1
    });

    rotationFolder.addBinding(controller, 'minTilt', {
        label: 'Min Tilt',
        min: -90,
        max: 90,
        step: 1
    });

    rotationFolder.addBinding(controller, 'maxTilt', {
        label: 'Max Tilt',
        min: -90,
        max: 90,
        step: 1
    });

    rotationFolder.addBinding(controller, 'speedRotation', {
        label: 'Speed Rotation',
        min: 0.01,
        max: 10,
        step: 0.1
    });

    rotationFolder.addBinding(controller, 'rotationInterpolation', {
        label: 'Delay Rotation',
        min: 0.01,
        max: 1,
        step: 0.01
    });

    // 조작 파라미터 조정
    const controlsFolder = pane.addFolder({
        title: 'Control Parameters'
    });

};
