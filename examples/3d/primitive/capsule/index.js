import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Capsule Primitive 예제
 * [EN] Capsule Primitive example
 *
 * [KO] Capsule 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Capsule primitive and control all its properties in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.tilt = 0;
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

    const capsuleGeometry = new RedGPU.Primitive.Capsule(redGPUContext, 0.5, 1.0, 32, 1, 12);

    const gap = 3.5;
    const items = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    items.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, capsuleGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.0, position[2]);
        label.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.3, 0);
    titleText.text = 'Customizable Capsule Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48;
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radius: 0.5,
        height: 1.0,
        radialSegments: 32,
        heightSegments: 1,
        capSegments: 12,
        cullMode: RedGPU.GPU_CULL_MODE.BACK
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Capsule(
            redGPUContext,
            config.radius, config.height,
            config.radialSegments, config.heightSegments, config.capSegments
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
    geometryFolder.addBinding(config, 'radius', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'height', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'radialSegments', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'heightSegments', {min: 1, max: 32, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'capSegments', {min: 1, max: 32, step: 1}).on('change', updateGeometry);

    const materialFolder = pane.addFolder({title: 'Material State', expanded: true});
    materialFolder.addBinding(config, 'cullMode', {
        options: {
            NONE: RedGPU.GPU_CULL_MODE.NONE,
            BACK: RedGPU.GPU_CULL_MODE.BACK,
            FRONT: RedGPU.GPU_CULL_MODE.FRONT
        }
    }).on('change', updateMaterial);
};
