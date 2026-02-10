import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Frustum Culling 예제
 * [EN] Frustum Culling example
 *
 * [KO] 프러스텀 컬링 기능을 시연합니다.
 * [EN] Demonstrates the frustum culling feature.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        controller.distance = 20;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        redGPUContext.addView(view);

        const meshes = createTestMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, meshes, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 메시들을 생성합니다.
 * [EN] Creates test meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<RedGPU.Display.Mesh>}
 */
const createTestMeshes = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );

    const meshes = [];
    const gridSize = 30;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
            // const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32,32);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            mesh.setPosition(x * 15, 0, z * 15);
            mesh.setScale(2)

            if (x === 0 && z === 0) {
                mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
                mesh.material.color.setColorByHEX('#ff0000');
            }

            mesh.setRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            scene.addChild(mesh);
            meshes.push(mesh);
        }
    }

    return meshes;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {Array<RedGPU.Display.Mesh>} meshes
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (redGPUContext, meshes, view) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const pane = new Pane();
    const {setDebugButtons} = await import( "../../../exampleHelper/createExample/panes/index.js?t=1770697269592" );
    setDebugButtons(RedGPU, redGPUContext);
    const config = {
        cameraDistance: view.camera.distance,
        cameraFOV: view.rawCamera.fieldOfView || 60,
        enableFrustumCulling: true,
        showBoundingBoxes: false,
        drawCalls: meshes.length,
        totalMeshes: meshes.length,
        culledMeshes: 0,
    };

    const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});
    cameraFolder.addBinding(config, 'cameraDistance', {min: 5, max: 300, step: 0.5}).on('change', (evt) => {
        view.camera.distance = evt.value;
    });
    cameraFolder.addBinding(config, 'cameraFOV', {min: 10, max: 120, step: 1}).on('change', (evt) => {
        view.rawCamera.fieldOfView = evt.value;
    });

    const cullingFolder = pane.addFolder({title: 'Frustum Culling', expanded: true});

    cullingFolder.addBinding(config, 'showBoundingBoxes').on('change', (evt) => {
        meshes.forEach(mesh => {
            mesh.enableDebugger = evt.value;
        });
    });

    const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
    const drawCallsBinding = statsFolder.addBinding(config, 'drawCalls', {readonly: true});
    statsFolder.addBinding(view.renderViewStateData, 'needResetRenderLayer', {readonly: true});

    const updateStats = () => {
        config.drawCalls = view.renderViewStateData.numDrawCalls;

        drawCallsBinding.refresh();

        requestAnimationFrame(updateStats);
    };

    updateStats();

    const utilsFolder = pane.addFolder({title: 'Utils', expanded: true});

    utilsFolder.addButton({title: 'Reset Camera'}).on('click', () => {
        view.camera.distance = 20;
        view.camera.tilt = 0;
        view.camera.pan = 0;
        config.cameraDistance = 20;
        pane.refresh();
    });

    utilsFolder.addButton({title: 'Move to Corner'}).on('click', () => {
        view.camera.distance = 15;
        view.camera.pan = 45;
        view.camera.tilt = -30;
        config.cameraDistance = 15;
        pane.refresh();
    });
    utilsFolder.addButton({title: 'Move Out'}).on('click', () => {
        view.camera.distance = 300;
        view.camera.pan = 45;
        view.camera.tilt = -30;
        config.cameraDistance = 300;
        pane.refresh();
    });

};