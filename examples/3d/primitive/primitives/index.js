import * as RedGPU from "../../../../dist/index.js?t=1778920968741";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778920968741";

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

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        // [KO] 씬 생성
        // [EN] Create scene
        const scene = new RedGPU.Display.Scene();

        // [KO] 뷰 생성 (3D)
        // [EN] Create view (3D)
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        // [KO] 프리미티브 생성 함수 호출
        // [EN] Call primitive creation function
        createPrimitive(redGPUContext, scene);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 작성
            // [EN] Write logic to be executed every frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
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
    // [KO] 렌더링 모드별 머티리얼 정의 (비트맵, 컬러, 와이어프레임)
    // [EN] Define materials for each rendering mode (Bitmap, Color, Wireframe)
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const wireframeMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');
    const pointMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff');

    // [KO] 배치 관련 변수 설정
    // [EN] Set placement related variables
    const gap = 3.5;
    const centerX = 0;
    const startY = 3.5;
    const wireframeY = 0;
    const pointY = -3.5;

    // [KO] 생성할 프리미티브 목록 및 생성 인자 정의
    // [EN] Define list of primitives and their constructor arguments
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
     * [KO] 지정된 재질과 위치에 프리미티브 행을 생성합니다.
     * [EN] Creates a row of primitives at the specified material and position.
     *
     * @param {RedGPU.RedMaterial} material - [KO] 적용할 머티리얼 [EN] Material to apply
     * @param {number} yPos - [KO] Y축 배치 위치 [EN] Y-axis position
     * @param {string} [topology] - [KO] 렌더링 토폴로지 (기본값: TRIANGLE_LIST) [EN] Rendering topology (default: TRIANGLE_LIST)
     */
    const createRow = (material, yPos, topology = null) => {
        primitives.forEach((primitive, index) => {
            // [KO] 프리미티브 지오메트리 생성
            // [EN] Create primitive geometry
            const geometry = new primitive.constructor(...primitive.args);

            // [KO] 메쉬 생성 및 머티리얼 적용
            // [EN] Create mesh and apply material
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            // [KO] 토폴로지 설정 (있는 경우)
            // [EN] Set topology (if provided)
            if (topology) mesh.primitiveState.topology = topology;

            // [KO] 위치 계산 및 설정
            // [EN] Calculate and set position
            mesh.setPosition(centerX - gap * (primitives.length - 1) / 2 + index * gap, yPos, 0);
            scene.addChild(mesh);

            // [KO] 프리미티브 이름 라벨 생성 (첫 번째 행 상단에만 표시)
            // [EN] Create primitive name label (displayed only on top of the first row)
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

        // [KO] 해당 행의 토폴로지 이름 라벨 생성
        // [EN] Create topology name label for the row
        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(centerX - gap * primitives.length / 2 - 2.5, yPos, 0);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 64;
        topologyName.worldSize = 0.8;
        scene.addChild(topologyName);
    };

    // [KO] 각 토폴로지별로 행 생성
    // [EN] Create rows for each topology
    createRow(material, startY); // TRIANGLE_LIST
    createRow(wireframeMaterial, wireframeY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
    createRow(pointMaterial, pointY, RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST);
};

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
 */
const renderTestPane = async (redGPUContext) => {
    // [KO] RedGPUExampleHelper를 사용하여 기본 디버그 UI 생성
    // [EN] Create basic debug UI using RedGPUExampleHelper
    new RedGPUExampleHelper(redGPUContext);
};
