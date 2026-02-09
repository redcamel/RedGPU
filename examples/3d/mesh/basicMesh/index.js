import * as RedGPU from "../../../../dist/index.js?t=1770635178902";

/**
 * [KO] Basic Mesh 예제
 * [EN] Basic Mesh example
 *
 * [KO] 기본적인 3D 메시 생성 및 속성(위치, 크기, 회전) 제어 방법을 보여줍니다.
 * [EN] Demonstrates basic 3D mesh creation and property control (position, scale, rotation).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        const mesh = createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            // 매 프레임 로직
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );

    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = async (redGPUContext, mesh) => {

    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770635178902");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        material: 'Bitmap',
        x: mesh.x,
        y: mesh.y,
        z: mesh.z,
        scaleX: mesh.scaleX,
        scaleY: mesh.scaleY,
        scaleZ: mesh.scaleZ,
        rotationX: mesh.rotationX,
        rotationY: mesh.rotationY,
        rotationZ: mesh.rotationZ,
        opacity: 1
    };

    pane.addBinding(config, 'material', {
        options: {
            Color: 'Color',
            Bitmap: 'Bitmap'
        }
    }).on('change', (evt) => {
        if (evt.value === 'Color') {
            mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
        } else {
            mesh.material = new RedGPU.Material.BitmapMaterial(
                redGPUContext,
                new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
            );
        }
    });
    const positionFolder = pane.addFolder({title: 'Position', expanded: true});
    positionFolder.addBinding(config, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(evt.value, config.y, config.z);
    });
    positionFolder.addBinding(config, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(config.x, evt.value, config.z);
    });
    positionFolder.addBinding(config, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
        mesh.setPosition(config.x, config.y, evt.value);
    });

    const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
    scaleFolder.addBinding(config, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        mesh.setScale(evt.value, config.scaleY, config.scaleZ);
    });
    scaleFolder.addBinding(config, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        mesh.setScale(config.scaleX, evt.value, config.scaleZ);
    });
    scaleFolder.addBinding(config, 'scaleZ', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
        mesh.setScale(config.scaleX, config.scaleY, evt.value);
    });

    const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
    rotationFolder.addBinding(config, 'rotationX', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
        mesh.setRotation(evt.value, config.rotationY, config.rotationZ);
    });
    rotationFolder.addBinding(config, 'rotationY', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
        mesh.setRotation(config.rotationX, evt.value, config.rotationZ);
    });
    rotationFolder.addBinding(config, 'rotationZ', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
        mesh.setRotation(config.rotationX, config.rotationY, evt.value);
    });
};