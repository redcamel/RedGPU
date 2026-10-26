import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Primitives 예제
 * [EN] Primitives example
 *
 * [KO] RedGPU에서 제공하는 기본 프리미티브 지오메트리들을 토폴로지별로 한눈에 비교합니다.
 * [EN] Compares all basic primitive geometries provided by RedGPU across different topologies at a glance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createPrimitives(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrimitives = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const wireframeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');
    const pointMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff');

    const gap = 3.5;
    const startY = 3.5;
    const wireframeY = 0;
    const pointY = -3.5;

    // [KO] RedGPU 기본 제공 프리미티브 지오메트리 목록 정의
    // [EN] Define the list of built-in primitive geometries in RedGPU
    const primitives = [
        {constructor: RedGPU.Primitive.Box, args: [redGPUContext, 1, 1, 1, 2, 2, 2]},
        {constructor: RedGPU.Primitive.RoundedBox, args: [redGPUContext, 1, 1, 1, 1, 1, 1, 0.25, 8]},
        {constructor: RedGPU.Primitive.Circle, args: [redGPUContext, 1, 64]},
        {constructor: RedGPU.Primitive.Cone, args: [redGPUContext, 1, 2, 32]},
        {constructor: RedGPU.Primitive.Cylinder, args: [redGPUContext, 0.5, 1, 2, 64, 64]},
        {constructor: RedGPU.Primitive.Capsule, args: [redGPUContext, 0.5, 1, 32, 1, 12]},
        {constructor: RedGPU.Primitive.Plane, args: [redGPUContext, 2, 2, 10, 10]},
        {constructor: RedGPU.Primitive.Ground, args: [redGPUContext, 2, 2, 10, 10]},
        {constructor: RedGPU.Primitive.Sphere, args: [redGPUContext, 1, 32, 32]},
        {constructor: RedGPU.Primitive.Torus, args: [redGPUContext, 0.7, 0.3, 32, 32]},
        {constructor: RedGPU.Primitive.TorusKnot, args: [redGPUContext, 0.5, 0.2, 128, 64, 2, 3]},
        {constructor: RedGPU.Primitive.Ring, args: [redGPUContext, 0.5, 1, 64, 1]}
    ];

    // [KO] 토폴로지(TRIANGLE_LIST, LINE_LIST, POINT_LIST)별로 프리미티브 행 생성 및 배치
    // [EN] Create and arrange rows of primitives for each topology (TRIANGLE_LIST, LINE_LIST, POINT_LIST)
    const createRow = (rowMaterial, yPos, topology = null) => {
        primitives.forEach((primitive, index) => {
            const geometry = new primitive.constructor(...primitive.args);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, rowMaterial);
            if (topology) mesh.primitiveState.topology = topology;

            const xPos = -gap * (primitives.length - 1) / 2 + index * gap;
            mesh.setPosition(xPos, yPos, 0);
            scene.addChild(mesh);

            if (yPos === startY) {
                const primitiveName = new RedGPU.Display.TextField3D(redGPUContext);
                primitiveName.setPosition(xPos, startY + 2.2, 0);
                primitiveName.text = primitive.constructor.name;
                primitiveName.color = '#ffffff';
                primitiveName.fontSize = 64;
                primitiveName.worldSize = 0.6;
                scene.addChild(primitiveName);
            }
        });

        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(-gap * primitives.length / 2 - 2.5, yPos, 0);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 64;
        topologyName.worldSize = 0.8;
        scene.addChild(topologyName);
    };

    createRow(material, startY);
    createRow(wireframeMaterial, wireframeY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
    createRow(pointMaterial, pointY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST);
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
