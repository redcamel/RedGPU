import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] TorusKnot Primitive 예제
 * [EN] TorusKnot Primitive example
 *
 * [KO] TorusKnot 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a TorusKnot primitive and control all its properties in real-time.
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
        visualTest: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const torusKnotGeometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 64, 8, 2, 3);

    const gap = 4.0;
    const objects = [
        {material: materials.wireframe, position: [-gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, label: 'Line List'},
        {material: materials.solid, position: [-gap * 0.5, 0, 0], label: 'Triangle List<br/>(Grid)'},
        {material: materials.visualTest, position: [gap * 0.5, 0, 0], label: 'Triangle List<br/>(Diffuse)'},
        {material: materials.point, position: [gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, label: 'Point List'},
    ];

    objects.forEach(({material, position, topology, label: labelText}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, torusKnotGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.4, position[2]);
        label.text = labelText;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = labelText.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.7, 0);
    titleText.text = 'Customizable TorusKnot Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 96;
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
        radius: 1,
        tubeRadius: 0.4,
        tubularSegments: 64,
        radialSegments: 8,
        windingsAroundAxis: 2,
        windingsAroundCircle: 3,
        cullMode: RedGPU.GPU_CULL_MODE.BACK
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.TorusKnot(
            redGPUContext,
            config.radius, config.tubeRadius,
            config.tubularSegments, config.radialSegments,
            config.windingsAroundAxis, config.windingsAroundCircle
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
    geometryFolder.addBinding(config, 'radius', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'tubeRadius', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'tubularSegments', {min: 3, max: 128, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'radialSegments', {min: 3, max: 32, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'windingsAroundAxis', {label: 'windingsAroundAxis (p)', min: 1, max: 10, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'windingsAroundCircle', {label: 'windingsAroundCircle (q)', min: 1, max: 10, step: 0.1}).on('change', updateGeometry);

    const materialFolder = pane.addFolder({title: 'Material State', expanded: true});
    materialFolder.addBinding(config, 'cullMode', {
        options: {
            NONE: RedGPU.GPU_CULL_MODE.NONE,
            BACK: RedGPU.GPU_CULL_MODE.BACK,
            FRONT: RedGPU.GPU_CULL_MODE.FRONT
        }
    }).on('change', updateMaterial);
};
