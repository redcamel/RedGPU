import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createPrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // 매 프레임 로직
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);

        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrimitive = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const wireframeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');
    const pointMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff');

    const gap = 3.0;
    const centerX = 0;
    const startY = 2.5;
    const wireframeY = -0.5;
    const pointY = -3.5;

    const primitives = [
        {constructor: RedGPU.Primitive.Box, args: [redGPUContext, 1, 1, 1, 2, 2, 2]},
        {constructor: RedGPU.Primitive.Circle, args: [redGPUContext, 1, 64]},
        {constructor: RedGPU.Primitive.Cylinder, args: [redGPUContext, 0.5, 1, 2, 64, 64]},
        {constructor: RedGPU.Primitive.Capsule, args: [redGPUContext, 0.5, 1, 32, 1, 12]},
        {constructor: RedGPU.Primitive.Plane, args: [redGPUContext, 2, 2, 10, 10]},
        {constructor: RedGPU.Primitive.Sphere, args: [redGPUContext, 1, 32, 32]},
        {constructor: RedGPU.Primitive.Torus, args: [redGPUContext, 0.7, 0.3, 32, 32]},
        {constructor: RedGPU.Primitive.TorusKnot, args: [redGPUContext, 0.5, 0.2, 128, 64, 2, 3]}
    ];

    const createRow = (material, yPos, topology = null) => {
        primitives.forEach((primitive, index) => {
            const geometry = new primitive.constructor(...primitive.args);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            if (topology) {
                mesh.primitiveState.topology = topology;
            }

            mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, yPos, 0);
            scene.addChild(mesh);

            if (yPos === startY) {
                const primitiveName = new RedGPU.Display.TextField3D(redGPUContext);
                primitiveName.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, startY + 2, 0);
                primitiveName.text = primitive.constructor.name;
                primitiveName.color = '#ffffff';
                primitiveName.fontSize = 32;
                primitiveName.useBillboard = true;
                primitiveName.useBillboardPerspective = true;
                scene.addChild(primitiveName);
            }
        });

        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(centerX - gap * primitives.length / 2 - 1, yPos, 0);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 32;
        topologyName.useBillboard = true;
        topologyName.useBillboardPerspective = true;
        scene.addChild(topologyName);
    };

    createRow(material, startY);
    createRow(wireframeMaterial, wireframeY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
    createRow(pointMaterial, pointY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {
        setRedGPUTest_pane,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();
    setRedGPUTest_pane(pane, redGPUContext, false);
};
