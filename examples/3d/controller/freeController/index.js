import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] FreeController 예제
 * [EN] FreeController example
 *
 * [KO] 키보드(WASD/QE/ZCRF)와 마우스 입력을 사용하여 3D 공간을 자유롭게 이동하고 회전하는 FreeController의 사용법을 시연합니다.
 * [EN] Demonstrates how to use FreeController for free movement and rotation in 3D space using keyboard (WASD/QE/ZCRF) and mouse inputs.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.y = 10;
        controller.z = 10;
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

const createSampleMeshes = (redGPUContext, scene, count = 500) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2);
    const materialPool = Array.from({length: 20}, () => {
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.color.setColorByRGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
        return material;
    });

    for (let i = 0; i < count; i++) {
        const material = materialPool[Math.floor(Math.random() * materialPool.length)];
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(
            Math.random() * 200 - 100,
            Math.random() * 200 - 100,
            Math.random() * 200 - 100
        );
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const controller2 = new RedGPU.Camera.FreeController(redGPUContext);
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
                    'x', 'y', 'z',
                    'pan', 'tilt',
                    'moveSpeed', 'moveSpeedInterpolation', 'maxAcceleration',
                    'rotationSpeed', 'rotationSpeedInterpolation', 'mouseSensitivity'
                ].forEach((prop) => {
                    target[prop] = source[prop];
                });

                const sourceKeyMapper = source.keyNameMapper;
                for (const key in sourceKeyMapper) {
                    target[`set${key.charAt(0).toUpperCase()}${key.slice(1)}Key`](sourceKeyMapper[key]);
                }
            };

            const setFoldersHidden = (folders, hidden) => {
                folders.forEach((folder) => {
                    folder.hidden = hidden;
                });
            };

            const testModeFolder = pane.addFolder({title: 'Test Mode', expanded: true});
            const testModes = {testMode: 'singleView'};

            const positionFolder = pane.addFolder({title: 'Position', expanded: true});
            positionFolder.addBinding(controller, 'x', {min: -100, max: 100, step: 0.1});
            positionFolder.addBinding(controller, 'y', {min: -100, max: 100, step: 0.1});
            positionFolder.addBinding(controller, 'z', {min: -100, max: 100, step: 0.1});

            const movementFolder = pane.addFolder({title: 'Movement', expanded: true});
            movementFolder.addBinding(controller, 'moveSpeed', {min: 1, max: 100, step: 1});
            movementFolder.addBinding(controller, 'moveSpeedInterpolation', {min: 0.001, max: 0.3, step: 0.001});
            movementFolder.addBinding(controller, 'maxAcceleration', {min: 0.1, max: 10, step: 0.1});

            const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
            rotationFolder.addBinding(controller, 'pan', {min: -360, max: 360, step: 1});
            rotationFolder.addBinding(controller, 'tilt', {min: -89.9, max: 89.9, step: 1});
            rotationFolder.addBinding(controller, 'rotationSpeed', {min: 1, max: 360, step: 1});
            rotationFolder.addBinding(controller, 'rotationSpeedInterpolation', {min: 0.001, max: 0.3, step: 0.001});
            rotationFolder.addBinding(controller, 'mouseSensitivity', {min: 0.01, max: 1.0, step: 0.01});

            const keyBindings = controller.keyNameMapper;
            const keyBindingsFolder = pane.addFolder({title: 'Key Bindings', expanded: true});
            for (const key in keyBindings) {
                keyBindingsFolder.addBinding(keyBindings, key).on('change', (ev) => {
                    controller[`set${key.charAt(0).toUpperCase()}${key.slice(1)}Key`](ev.value);
                });
            }

            const controlFolders = [positionFolder, movementFolder, rotationFolder, keyBindingsFolder];

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

