import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] OrbitController 예제
 * [EN] OrbitController example
 *
 * [KO] 중심점(centerX/Y/Z)을 기준으로 공전 회전(pan, tilt)과 거리(distance)를 제어하는 OrbitController의 사용법을 시연합니다.
 * [EN] Demonstrates how to use OrbitController to control orbital rotation (pan, tilt) and distance around a center point (centerX/Y/Z).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.maxDistance = 50;

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

        createSampleMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, controller);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMeshes = (redGPUContext, scene) => {
    // [KO] 원점의 중심 구체 및 주변을 둘러싼 참조용 박스 배치
    // [EN] Place a central sphere at the origin and surrounding reference boxes
    const centerMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 32, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff3333')
    );
    scene.addChild(centerMesh);

    const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, 1.5, 1.5, 1.5);
    const ringCount = 12;
    const ringRadius = 8;

    for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2;
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.color.setColorByRGB(
            Math.floor(127 + 127 * Math.cos(angle)),
            Math.floor(127 + 127 * Math.sin(angle)),
            220
        );

        const mesh = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, material);
        mesh.setPosition(
            Math.cos(angle) * ringRadius,
            0.75,
            Math.sin(angle) * ringRadius
        );
        mesh.lookAt(0, 0.75, 0);
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
            controller2.maxDistance = 50;

            const view1 = redGPUContext.viewList[0];
            const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
            view2.axis = true;
            view2.grid = true;
            view2.skybox = view1.skybox;

            const setSingleViewLayout = (view) => {
                view.setSize('100%', '100%');
                view.setPosition(0, 0);
            };

            const setSplitViewLayout = (firstView, secondView, isMobile) => {
                if (isMobile) {
                    firstView.setSize('100%', '50%');
                    firstView.setPosition(0, 0);
                    secondView.setSize('100%', '50%');
                    secondView.setPosition(0, '50%');
                } else {
                    firstView.setSize('50%', '100%');
                    firstView.setPosition(0, 0);
                    secondView.setSize('50%', '100%');
                    secondView.setPosition('50%', 0);
                }
            };

            const syncControllers = (source, target) => {
                [
                    'centerX', 'centerY', 'centerZ',
                    'distance', 'minDistance', 'maxDistance', 'speedDistance', 'distanceInterpolation',
                    'pan', 'tilt', 'minTilt', 'maxTilt', 'speedRotation', 'rotationInterpolation'
                ].forEach((prop) => {
                    target[prop] = source[prop];
                });
            };

            const setFoldersHidden = (folders, hidden) => {
                folders.forEach((folder) => {
                    folder.hidden = hidden;
                });
            };

            const testModeFolder = pane.addFolder({title: 'Test Mode', expanded: true});
            const testModes = {testMode: 'singleView'};

            const centerFolder = pane.addFolder({title: 'Center', expanded: true});
            centerFolder.addBinding(controller, 'centerX', {min: -10, max: 10, step: 0.1});
            centerFolder.addBinding(controller, 'centerY', {min: -10, max: 10, step: 0.1});
            centerFolder.addBinding(controller, 'centerZ', {min: -10, max: 10, step: 0.1});

            const distanceFolder = pane.addFolder({title: 'Distance', expanded: true});
            distanceFolder.addBinding(controller, 'distance', {min: 0.5, max: 50, step: 0.1});
            distanceFolder.addBinding(controller, 'minDistance', {min: 0.1, max: 20, step: 0.1});
            distanceFolder.addBinding(controller, 'maxDistance', {min: 5, max: 100, step: 1});
            distanceFolder.addBinding(controller, 'speedDistance', {min: 0.1, max: 5, step: 0.1});
            distanceFolder.addBinding(controller, 'distanceInterpolation', {min: 0.01, max: 0.3, step: 0.01});

            const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
            rotationFolder.addBinding(controller, 'pan', {min: -360, max: 360, step: 1});
            rotationFolder.addBinding(controller, 'tilt', {min: -90, max: 90, step: 1});
            rotationFolder.addBinding(controller, 'minTilt', {min: -90, max: 90, step: 1});
            rotationFolder.addBinding(controller, 'maxTilt', {min: -90, max: 90, step: 1});
            rotationFolder.addBinding(controller, 'speedRotation', {min: 0.1, max: 10, step: 0.1});
            rotationFolder.addBinding(controller, 'rotationInterpolation', {min: 0.01, max: 0.3, step: 0.01});

            const controlFolders = [centerFolder, distanceFolder, rotationFolder];

            const testModeHandlers = {
                singleView: () => {
                    setSingleViewLayout(view1);
                    setFoldersHidden(controlFolders, false);
                },
                multiViewSharedControl: () => {
                    setSplitViewLayout(view1, view2, redGPUContext.detector.isMobile);
                    redGPUContext.addView(view2);
                    view2.camera = controller;
                    setFoldersHidden(controlFolders, false);
                },
                multiViewIndependentControl: () => {
                    setSplitViewLayout(view1, view2, redGPUContext.detector.isMobile);
                    redGPUContext.addView(view2);
                    view2.camera = controller2;
                    syncControllers(controller, controller2);
                    setFoldersHidden(controlFolders, true);
                }
            };

            testModeFolder.addBinding(testModes, 'testMode', {
                options: {
                    singleView: 'singleView',
                    multiViewSharedControl: 'multiViewSharedControl',
                    multiViewIndependentControl: 'multiViewIndependentControl'
                }
            }).on('change', (ev) => {
                redGPUContext.removeAllViews();
                redGPUContext.addView(view1);
                view1.camera = controller;
                testModeHandlers[ev.value]();
            });
        }
    });
};
