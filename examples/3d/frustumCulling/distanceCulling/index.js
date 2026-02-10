import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Distance Culling 예제
 * [EN] Distance Culling example
 *
 * [KO] 거리에 따른 컬링 기능을 시연합니다.
 * [EN] Demonstrates distance-based culling feature.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        controller.distance = 10;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.useDistanceCulling = true
        view.distanceCulling = 75
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
    const gridSize = 15;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            mesh.setPosition(x * 5, 0, z * 5);

            const distance = Math.sqrt(x * x + z * z);
            if (distance < 3) {
                mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
                mesh.material.color.setColorByHEX('#ff0000');
            } else if (distance < 8) {
                mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
                mesh.material.color.setColorByHEX('#00ff00');
            } else if (distance < 12) {
                mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
                mesh.material.color.setColorByHEX('#0000ff');
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
        enableDistanceCulling: view.useDistanceCulling,
        cullingDistance: view.distanceCulling,
        showBoundingBoxes: false,
        drawCalls: meshes.length,
    };

    const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});
    cameraFolder.addBinding(config, 'cameraDistance', {min: 10, max: 150, step: 1}).on('change', (evt) => {
        view.camera.distance = evt.value;
    });

    const cullingFolder = pane.addFolder({title: 'Distance Culling', expanded: true});
    cullingFolder.addBinding(config, 'enableDistanceCulling').on('change', (evt) => {
        view.useDistanceCulling = evt.value;
    });
    cullingFolder.addBinding(config, 'cullingDistance', {min: 5, max: 200, step: 1}).on('change', (evt) => {
        view.distanceCulling = evt.value;
    });
    cullingFolder.addBinding(config, 'showBoundingBoxes').on('change', (evt) => {
        meshes.forEach(mesh => {
            mesh.enableDebugger = evt.value;
        });
    });

    const statsFolder = pane.addFolder({title: 'Statistics', expanded: true});
    const drawCallsBinding = statsFolder.addBinding(config, 'drawCalls', {readonly: true});

    const updateStats = () => {
        config.drawCalls = view.renderViewStateData.numDrawCalls;

        drawCallsBinding.refresh();

        requestAnimationFrame(updateStats);
    };

    updateStats();

    const utilsFolder = pane.addFolder({title: 'Utils', expanded: true});

    utilsFolder.addButton({title: 'Reset Camera'}).on('click', () => {
        view.camera.distance = 50;
        view.camera.tilt = 0;
        view.camera.pan = 0;
        config.cameraDistance = 50;
        pane.refresh();
    });

    utilsFolder.addButton({title: 'Move Close'}).on('click', () => {
        view.camera.distance = 20;
        config.cameraDistance = 20;
        pane.refresh();
    });

    utilsFolder.addButton({title: 'Move Far'}).on('click', () => {
        view.camera.distance = 100;
        config.cameraDistance = 100;
        pane.refresh();
    });

};