import * as RedGPU from "../../../../dist/index.js?t=1781132971803";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132971803";

/**
 * [KO] Primitives 예제
 * [EN] Primitives example
 *
 * [KO] RedGPU에서 제공하는 모든 기본 프리미티브 지오메트리들을 한눈에 확인하고 비교할 수 있는 예제입니다.
 * [EN] An example where you can check and compare all basic primitive geometries provided by RedGPU at a glance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정 [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성 [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 프리미티브 생성 및 추가 [EN] Create and Add Primitives
        createPrimitive(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작 [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링 [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 다양한 프리미티브 지오메트리를 생성하여 씬에 배치합니다.
 * [EN] Creates various primitive geometries and places them in the scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createPrimitive = (redGPUContext, scene) => {
    // [KO] 재질 정의 [EN] Define Materials
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const wireframeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');
    const pointMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff');

    // [KO] 배치 변수 설정 [EN] Setup Placement Variables
    const gap = 3.5;
    const centerX = 0;
    const startY = 3.5;
    const wireframeY = 0;
    const pointY = -3.5;

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

    /**
     * [KO] 특정 재질과 위치에 한 줄의 프리미티브를 생성합니다.
     * [EN] Creates a row of primitives with specific material and position.
     */
    const createRow = (material, yPos, topology = null) => {
        primitives.forEach((primitive, index) => {
            const geometry = new primitive.constructor(...primitive.args);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            if (topology) mesh.primitiveState.topology = topology;

            // [KO] 위치 계산 (중앙 정렬) [EN] Calculate Position (Center Aligned)
            mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, yPos, 0);
            scene.addChild(mesh);

            // [KO] 첫 번째 행 상단에 프리미티브 이름 표시 [EN] Show Primitive Name at top of first row
            if (yPos === startY) {
                const primitiveName = new RedGPU.Display.TextField3D(redGPUContext);
                primitiveName.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, startY + 2.2, 0);
                primitiveName.text = primitive.constructor.name;
                primitiveName.color = '#ffffff';
                primitiveName.fontSize = 64;
                primitiveName.worldSize = 0.6;
                scene.addChild(primitiveName);
            }
        });

        // [KO] 행 좌측에 토폴로지 이름 표시 [EN] Show Topology Name at left of row
        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(centerX - gap * primitives.length / 2 - 2.5, yPos, 0);
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the test GUI.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
