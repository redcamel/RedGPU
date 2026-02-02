import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

/**
 * [KO] 캔버스 생성 및 문서 추가
 * [EN] Create canvas and append to document
 */
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] RedGPU 초기화
 * [EN] Initialize RedGPU
 */
RedGPU.init(
    canvas,
    (redGPUContext) => {
        /**
         * [KO] 카메라 컨트롤러 설정 (OrbitController)
         * [EN] Set up camera controller (OrbitController)
         */
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10; // [KO] 사용자 설정 거리 유지 [EN] Preserved user-defined distance
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        /**
         * [KO] 씬 및 뷰 생성
         * [EN] Create Scene and View
         */
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        /**
         * [KO] 프리미티브 생성 및 배치
         * [EN] Create and place primitives
         */
        createPrimitive(redGPUContext, scene);

        /**
         * [KO] 렌더러 시작
         * [EN] Start Renderer
         */
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            // [KO] 매 프레임 실행될 로직 [EN] Logic to execute every frame
        });

        /**
         * [KO] 테스트 패널(Tweakpane) 렌더링
         * [EN] Render test pane (Tweakpane)
         */
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
 * [KO] Box 프리미티브들을 생성하고 사용자가 설정한 배치대로 씬에 추가합니다.
 * [EN] Creates Box primitives and adds them to the scene following the user's specific layout.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트
 * [EN] RedGPU context
 * @param scene -
 * [KO] 프리미티브가 추가될 씬
 * [EN] Scene where primitives will be added
 */
const createPrimitive = (redGPUContext, scene) => {
    /**
     * [KO] 다양한 렌더링 모드(Solid, Wireframe, Point)를 위한 머티리얼 정의
     * [EN] Define materials for various rendering modes (Solid, Wireframe, Point)
     */
    const boxMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    /**
     * [KO] 공통으로 사용할 Box 지오메트리 생성
     * [EN] Create common Box geometry
     */
    const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 2, 2, 2);

    // 배치 설정
    const gap = 3.5; // [KO] 박스 간 간격 [EN] Spacing between boxes
    const boxes = [
        {material: boxMaterials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: boxMaterials.solid, position: [0, 0, 0]},
        {material: boxMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    boxes.forEach(({material, position, topology}) => {
        /**
         * [KO] 메시 생성 및 씬 추가
         * [EN] Create mesh and add to scene
         */
        const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, material);
        if (topology) box.primitiveState.topology = topology;
        box.setPosition(...position);
        scene.addChild(box);

        /**
         * [KO] 상단 속성 라벨 생성 (사용자 설정값 유지)
         * [EN] Create property label on top (Preserving user values)
         */
        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(position[0], 1.5, position[2]); // [KO] 사용자 설정 위치 [EN] Preserved position
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 14; // [KO] 속성 타이틀은 작게 설정 [EN] Property titles are set small
        topologyName.worldSize = 0.7; // [KO] 사용자 설정 크기 [EN] Preserved worldSize
        scene.addChild(topologyName);
    });

    /**
     * [KO] 메인 타이틀 생성 (사용자 설정값 유지)
     * [EN] Create main title (Preserving user values)
     */
    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -1.8, 0); // [KO] 사용자 설정 위치 [EN] Preserved position
    titleText.text = 'Customizable Box Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48; 
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3; // [KO] 사용자 설정 크기 [EN] Preserved worldSize
    scene.addChild(titleText);
};

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 초기화합니다.
 * [EN] Initializes the Tweakpane GUI for testing.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트
 * [EN] RedGPU context
 */
const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    /**
     * [KO] 박스 치수 및 세그먼트 설정 객체
     * [EN] Box dimensions and segments configuration object
     */
    const config = {
        width: 1,
        height: 1,
        depth: 1,
        segmentX: 2,
        segmentY: 2,
        segmentZ: 2,
    };

    /**
     * [KO] 입력된 설정값에 따라 실시간으로 Box 지오메트리를 업데이트합니다.
     * [EN] Updates the Box geometry in real-time based on the configured values.
     */
    const updateBoxGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Box(
            redGPUContext,
            config.width,
            config.height,
            config.depth,
            config.segmentX,
            config.segmentY,
            config.segmentZ
        );

        meshList.forEach((mesh) => {
            // [KO] 라벨 객체를 제외한 박스 메시들의 지오메트리만 교체 [EN] Replace geometry only for box meshes, excluding labels
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const boxFolder = pane.addFolder({title: 'Box Dimensions', expanded: true});
    
    /**
     * [KO] 치수 설정 바인딩
     * [EN] Bind dimension settings
     */
    ['width', 'height', 'depth'].forEach(prop => {
        boxFolder.addBinding(config, prop, {min: 0.1, max: 5, step: 0.1}).on('change', updateBoxGeometry);
    });

    /**
     * [KO] 세그먼트 설정 바인딩
     * [EN] Bind segment settings
     */
    ['segmentX', 'segmentY', 'segmentZ'].forEach(prop => {
        boxFolder.addBinding(config, prop, {min: 1, max: 15, step: 1}).on('change', updateBoxGeometry);
    });
};