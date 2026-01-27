import * as RedGPU from "../../../../dist/index.js?t=1769497870527";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createPrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            // 매 프레임 로직
        });

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
    const circleMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const circleGeometry = new RedGPU.Primitive.Circle(redGPUContext, 1, 64);

    const circles = [
        {material: circleMaterials.solid, position: [0, 0, 0]},
        {material: circleMaterials.wireframe, position: [-3, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: circleMaterials.point, position: [3, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    circles.forEach(({material, position, topology}) => {
        const circle = new RedGPU.Display.Mesh(redGPUContext, circleGeometry, material);

        if (topology) {
            circle.primitiveState.topology = topology;
        }

        circle.setPosition(...position);
        scene.addChild(circle);

        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(position[0], 1.5, position[2]);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 26;
        topologyName.useBillboard = true;
        topologyName.useBillboardPerspective = true;
        scene.addChild(topologyName);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2, 0);
    titleText.text = 'Customizable Circle Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 36;
    titleText.fontWeight = 500;
    titleText.useBillboard = true;
    titleText.useBillboardPerspective = true;
    scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769497870527');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769497870527");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radius: 1,
        segments: 64,
    };

    const updateCircleGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Circle(
            redGPUContext,
            config.radius,
            config.segments
        );

        meshList.forEach((mesh) => {
            if (!(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateCircleGeometry();
        });
    };

    const circleFolder = pane.addFolder({title: 'Circle Properties', expanded: true});
    addBinding(circleFolder, 'radius', {min: 0.1, max: 5, step: 0.1});
    addBinding(circleFolder, 'segments', {min: 3, max: 128, step: 1});
};
