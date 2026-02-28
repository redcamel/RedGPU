import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Ground Primitive 예제
 * [EN] Ground Primitive example
 *
 * [KO] Ground 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Ground primitive and control all its properties in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;
        controller.tilt = -15;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createPrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrimitive = (redGPUContext, scene) => {
    const materials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, 4, 4, 10, 10);

    const gap = 6.5;
    const items = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    items.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, groundGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 3.0, position[2]);
        label.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -3.3, 0);
    titleText.text = 'Customizable Ground Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48;
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane();

    const config = {
        width: 4,
        height: 4,
        widthSegments: 10,
        heightSegments: 10,
        flipY: false,
        cullMode: RedGPU.GPU_CULL_MODE.BACK
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Ground(
            redGPUContext,
            config.width, config.height, config.widthSegments, config.heightSegments, config.flipY
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const updateMaterial = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        meshList.forEach((mesh) => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.primitiveState.cullMode = config.cullMode;
            }
        });
    };

    const geometryFolder = pane.addFolder({title: 'Geometry Properties', expanded: true});
    geometryFolder.addBinding(config, 'width', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'height', {min: 1, max: 10, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'widthSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'heightSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'flipY').on('change', updateGeometry);

    const materialFolder = pane.addFolder({title: 'Material State', expanded: true});
    materialFolder.addBinding(config, 'cullMode', {
        options: {
            NONE: RedGPU.GPU_CULL_MODE.NONE,
            BACK: RedGPU.GPU_CULL_MODE.BACK,
            FRONT: RedGPU.GPU_CULL_MODE.FRONT
        }
    }).on('change', updateMaterial);
};
