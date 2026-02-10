import * as RedGPU from "../../../../dist/index.js?t=1770699661827";

/**
 * [KO] Primitives 예제
 * [EN] Primitives example
 *
 * [KO] RedGPU에서 제공하는 모든 기본 프리미티브 지오메트리들을 한눈에 확인하고 비교할 수 있는 예제입니다.
 * [EN] An example where you can check and compare all basic primitive geometries provided by RedGPU at a glance.
 * 
 * [KO] 각 프리미티브는 TRIANGLE_LIST(면), LINE_LIST(와이어프레임), POINT_LIST(점)의 세 가지 토폴로지로 렌더링됩니다.
 * [EN] Each primitive is rendered in three topologies: TRIANGLE_LIST (surface), LINE_LIST (wireframe), and POINT_LIST (points).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 카메라 컨트롤러 설정. 거리를 20으로 설정하여 모든 객체가 보이도록 합니다.
        // [EN] Set up the camera controller. Set the distance to 20 so that all objects are visible.
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 프리미티브 생성 함수 호출
        // [EN] Call primitive creation function
        createPrimitive(redGPUContext, scene);

        // [KO] 렌더러 생성 및 시작
        // [EN] Create and start renderer
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트 패널 생성
        // [EN] Create test pane
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
 *
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 * @param {RedGPU.Display.Scene} scene - [KO] 프리미티브가 추가될 씬 [EN] Scene where primitives will be added
 */
const createPrimitive = (redGPUContext, scene) => {
    // [KO] 렌더링 모드별 머티리얼 정의
    // [EN] Define materials for each rendering mode
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

    // [KO] 생성할 프리미티브 목록 정의
    // [EN] Define list of primitives to be created
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

    /**
     * [KO] 지정된 재질과 위치에 프리미티브 행을 생성합니다.
     * [EN] Creates a row of primitives at the specified material and position.
     *
     * @param {RedGPU.RedMaterial} material - [KO] 적용할 머티리얼 [EN] Material to apply
     * @param {number} yPos - [KO] Y축 배치 위치 [EN] Y-axis position
     * @param {string} [topology] - [KO] 렌더링 토폴로지 (기본값: TRIANGLE_LIST) [EN] Rendering topology (default: TRIANGLE_LIST)
     */
    const createRow = (material, yPos, topology = null) => {
        primitives.forEach((primitive, index) => {
            const geometry = new primitive.constructor(...primitive.args);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            if (topology) mesh.primitiveState.topology = topology;

            mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, yPos, 0);
            scene.addChild(mesh);

            // [KO] 프리미티브 이름 라벨 생성 (첫 번째 행 상단)
            // [EN] Create primitive name label (on top of the first row)
            if (yPos === startY) {
                const primitiveName = new RedGPU.Display.TextField3D(redGPUContext);
                primitiveName.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, startY + 2, 0);
                primitiveName.text = primitive.constructor.name;
                primitiveName.color = '#ffffff';
                primitiveName.fontSize = 24;
                scene.addChild(primitiveName);
            }
        });

        // [KO] 해당 행의 토폴로지 이름 라벨 생성
        // [EN] Create topology name label for the row
        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(centerX - gap * primitives.length / 2 - 2, yPos, 0);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 24;
        scene.addChild(topologyName);
    };

    createRow(material, startY);
    createRow(wireframeMaterial, wireframeY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
    createRow(pointMaterial, pointY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST);
};

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 초기화합니다.
 * [EN] Initializes the Tweakpane GUI for testing.
 *
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 */
const renderTestPane = async (redGPUContext) => {
   const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770699661827");
    setDebugButtons(RedGPU, redGPUContext)

};
