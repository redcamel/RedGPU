import * as RedGPU from "../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] IsometricController 예제
 * [EN] IsometricController example
 *
 * [KO] 직교 투영(OrthographicCamera)을 사용하여 고정된 각도의 아이소메트릭(쿼터뷰) 시점을 제공하는 IsometricController의 사용법을 시연합니다.
 * [EN] Demonstrates how to use IsometricController, which provides a fixed-angle isometric (quarter-view) perspective using orthographic projection (OrthographicCamera).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.IsometricController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
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

const createSampleMeshes = (redGPUContext, scene, count = 1000) => {
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);

    const targetMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        geometry,
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    targetMesh.x = 1;
    scene.addChild(targetMesh);

    const targetMesh2 = new RedGPU.Display.Mesh(
        redGPUContext,
        geometry,
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00')
    );
    targetMesh2.x = -1;
    scene.addChild(targetMesh2);

    const materialPool = Array.from({length: 20}, () => {
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.color.setColorByRGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
        return material;
    });

    const step = 2;
    const range = 300;
    const positions = [];
    for (let x = -range / 2; x < range / 2; x += step) {
        for (let z = -range / 2; z < range / 2; z += step) {
            positions.push({x, z});
        }
    }

    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const limit = Math.min(count, positions.length);
    for (let i = 0; i < limit; i++) {
        const pos = positions[i];
        const material = materialPool[Math.floor(Math.random() * materialPool.length)];
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(pos.x, 0.5, pos.z);
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext, controller) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const controller2 = new RedGPU.Camera.IsometricController(redGPUContext);
            const view1 = redGPUContext.viewList[0];
            const view2 = new RedGPU.Display.View3D(redGPUContext, view1.scene, controller2);
            view2.axis = true;
            view2.grid = true;

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
                    'zoom', 'zoomInterpolation', 'speedZoom', 'minZoom', 'maxZoom',
                    'viewHeight', 'viewHeightInterpolation',
                    'moveSpeed', 'moveSpeedInterpolation',
                    'mouseMoveSpeed', 'mouseMoveSpeedInterpolation'
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

            const movementFolder = pane.addFolder({title: 'Movement', expanded: true});
            movementFolder.addBinding(controller, 'moveSpeed', {min: 1, max: 100, step: 1});
            movementFolder.addBinding(controller, 'moveSpeedInterpolation', {min: 0.001, max: 0.3, step: 0.001});
            movementFolder.addBinding(controller, 'mouseMoveSpeed', {min: 0.1, max: 10, step: 0.1});
            movementFolder.addBinding(controller, 'mouseMoveSpeedInterpolation', {min: 0.001, max: 0.3, step: 0.001});

            const zoomFolder = pane.addFolder({title: 'Zoom', expanded: true});
            zoomFolder.addBinding(controller, 'zoom', {min: 0.1, max: 10, step: 0.1});
            zoomFolder.addBinding(controller, 'zoomInterpolation', {min: 0.001, max: 0.3, step: 0.001});
            zoomFolder.addBinding(controller, 'speedZoom', {min: 0.01, max: 1.0, step: 0.01});
            zoomFolder.addBinding(controller, 'minZoom', {min: 0.1, max: 2, step: 0.1});
            zoomFolder.addBinding(controller, 'maxZoom', {min: 1, max: 20, step: 0.1});

            const viewFolder = pane.addFolder({title: 'View', expanded: true});
            viewFolder.addBinding(controller, 'viewHeight', {min: 1, max: 100, step: 1});
            viewFolder.addBinding(controller, 'viewHeightInterpolation', {min: 0.001, max: 0.3, step: 0.001});

            const targetFolder = pane.addFolder({title: 'Target Position', expanded: true});
            targetFolder.addBinding(controller, 'targetX', {readonly: true});
            targetFolder.addBinding(controller, 'targetY', {readonly: true});
            targetFolder.addBinding(controller, 'targetZ', {readonly: true});

            const keyBindings = controller.keyNameMapper;
            const keyBindingsFolder = pane.addFolder({title: 'Key Bindings', expanded: true});
            for (const key in keyBindings) {
                keyBindingsFolder.addBinding(keyBindings, key).on('change', (ev) => {
                    controller[`set${key.charAt(0).toUpperCase()}${key.slice(1)}Key`](ev.value);
                });
            }

            const controlFolders = [movementFolder, zoomFolder, viewFolder, targetFolder, keyBindingsFolder];

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

