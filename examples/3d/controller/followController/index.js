import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] FollowController 예제
 * [EN] FollowController example
 *
 * [KO] 지정된 타겟 메시(Mesh)의 이동과 회전을 부드럽게 추적하는 3인칭 시점 카메라 컨트롤러(FollowController)의 사용법을 시연합니다.
 * [EN] Demonstrates how to use FollowController, a third-person camera controller that smoothly tracks the movement and rotation of a specified target Mesh.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const boxGeometry = new RedGPU.Primitive.Box(redGPUContext);

        const targetMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            boxGeometry,
            new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
        );

        const targetMesh2 = new RedGPU.Display.Mesh(
            redGPUContext,
            boxGeometry,
            new RedGPU.Material.PhongMaterial(redGPUContext, '#00ff00')
        );
        targetMesh2.z = -2;
        targetMesh2.setScale(0.5);
        targetMesh.addChild(targetMesh2);

        const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
        const controller2 = new RedGPU.Camera.FollowController(redGPUContext, targetMesh2);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);
        scene.addChild(targetMesh);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        view.skybox = skybox;
        redGPUContext.addView(view);

        const view2 = new RedGPU.Display.View3D(redGPUContext, scene, controller2);
        view2.axis = true;
        view2.grid = true;
        view2.skybox = skybox;
        redGPUContext.addView(view2);

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                view.setSize('100%', '50%');
                view.setPosition(0, 0);
                view2.setSize('100%', '50%');
                view2.setPosition(0, '50%');
            } else {
                view.setSize('50%', '100%');
                view.setPosition(0, 0);
                view2.setSize('50%', '100%');
                view2.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        createSampleMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const elapsed = time * 0.001;
            const radius = 20;
            targetMesh.x = Math.sin(elapsed * 0.5) * radius;
            targetMesh.z = Math.cos(elapsed * 0.5) * radius;
            targetMesh.y = Math.sin(elapsed * 0.5) * 5;
            targetMesh.lookAt(0, 0, 0);
        });

        renderTestPane(redGPUContext, controller, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMeshes = (redGPUContext, scene, count = 100) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 3);
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
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50
        );
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext, controller, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            normalTitle: 'Follow TargetMesh (Controllable)',
            title: 'Follow Child TargetMesh2 (Default)',
            targetContainer: container
        },
        gui: (pane) => {
            const distanceFolder = pane.addFolder({title: 'Distance & Height', expanded: true});
            distanceFolder.addBinding(controller, 'distance', {min: 1, max: 50, step: 0.5});
            distanceFolder.addBinding(controller, 'distanceInterpolation', {min: 0.01, max: 0.3, step: 0.01});
            distanceFolder.addBinding(controller, 'height', {min: -10, max: 20, step: 0.5});
            distanceFolder.addBinding(controller, 'heightInterpolation', {min: 0.01, max: 0.3, step: 0.01});
            distanceFolder.addBinding(controller, 'interpolation', {min: 0.01, max: 0.3, step: 0.01});

            const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
            rotationFolder.addBinding(controller, 'pan', {min: -180, max: 180, step: 1});
            rotationFolder.addBinding(controller, 'panInterpolation', {min: 0.01, max: 0.3, step: 0.01});
            rotationFolder.addBinding(controller, 'tilt', {min: -89, max: 89, step: 1});
            rotationFolder.addBinding(controller, 'tiltInterpolation', {min: 0.01, max: 0.3, step: 0.01});
            rotationFolder.addBinding(controller, 'followTargetRotation');

            const offsetFolder = pane.addFolder({title: 'Target Offset', expanded: true});
            offsetFolder.addBinding(controller, 'targetOffsetX', {min: -5, max: 5, step: 0.1});
            offsetFolder.addBinding(controller, 'targetOffsetY', {min: -5, max: 5, step: 0.1});
            offsetFolder.addBinding(controller, 'targetOffsetZ', {min: -5, max: 5, step: 0.1});
            offsetFolder.addButton({title: 'Reset Offset'}).on('click', () => {
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            const presetFolder = pane.addFolder({title: 'Presets', expanded: true});
            presetFolder.addButton({title: 'Reset All Delays'}).on('click', () => {
                controller.interpolation = 0.02;
                controller.distanceInterpolation = 0.02;
                controller.heightInterpolation = 0.02;
                controller.panInterpolation = 0.02;
                controller.tiltInterpolation = 0.02;
                pane.refresh();
            });

            presetFolder.addButton({title: 'Behind View'}).on('click', () => {
                controller.distance = 15;
                controller.height = 5;
                controller.pan = 0;
                controller.tilt = 20;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            presetFolder.addButton({title: 'Top View'}).on('click', () => {
                controller.distance = 20;
                controller.height = 20;
                controller.pan = 0;
                controller.tilt = 60;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });

            presetFolder.addButton({title: 'Side View'}).on('click', () => {
                controller.distance = 15;
                controller.height = 5;
                controller.pan = 90;
                controller.tilt = 10;
                controller.setTargetOffset(0, 0, 0);
                pane.refresh();
            });
        }
    });
};

