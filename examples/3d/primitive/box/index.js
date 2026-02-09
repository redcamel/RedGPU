import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

/**
 * [KO] Box Primitive 예제
 * [EN] Box Primitive example
 *
 * [KO] Box 프리미티브 생성 및 치수(width, height, depth)와 세그먼트 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Box primitive and control its dimensions (width, height, depth) and segment properties in real-time.
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
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
            // [EN] Logic per frame
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

/**
 * [KO] Box 프리미티브들을 생성하고 정돈된 레이아웃으로 씬에 배치합니다.
 * [EN] Creates Box primitives and places them in the scene with an organized layout.
 *
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 * @param {RedGPU.Display.Scene} scene - [KO] 프리미티브가 추가될 씬 [EN] Scene where primitives will be added
 */
const createPrimitive = (redGPUContext, scene) => {
    const boxMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 2, 2, 2);

    const gap = 3.5;
    const boxes = [
        {material: boxMaterials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: boxMaterials.solid, position: [0, 0, 0]},
        {material: boxMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    boxes.forEach(({material, position, topology}) => {
        const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, material);
        if (topology) box.primitiveState.topology = topology;
        box.setPosition(...position);
        scene.addChild(box);

        // [KO] 토폴로지 이름 라벨 생성
        // [EN] Create topology name label
        const topologyName = new RedGPU.Display.TextField3D(redGPUContext);
        topologyName.setPosition(position[0], 1.5, position[2]);
        topologyName.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        topologyName.color = '#ffffff';
        topologyName.fontSize = 14;
        topologyName.worldSize = 0.7;
        scene.addChild(topologyName);
    });

    // [KO] 타이틀 라벨 생성
    // [EN] Create title label
    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -1.8, 0);
    titleText.text = 'Customizable Box Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48; 
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 초기화합니다.
 * [EN] Initializes the Tweakpane GUI for testing.
 *
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 */
const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770625511985");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        width: 1,
        height: 1,
        depth: 1,
        segmentX: 2,
        segmentY: 2,
        segmentZ: 2,
    };

    /**
     * [KO] 설정값 변경 시 Box 지오메트리를 재생성하여 업데이트합니다.
     * [EN] Recreates and updates the Box geometry when configuration values change.
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
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const boxFolder = pane.addFolder({title: 'Box Dimensions', expanded: true});
    
    ['width', 'height', 'depth'].forEach(prop => {
        boxFolder.addBinding(config, prop, {min: 0.1, max: 5, step: 0.1}).on('change', updateBoxGeometry);
    });

    ['segmentX', 'segmentY', 'segmentZ'].forEach(prop => {
        boxFolder.addBinding(config, prop, {min: 1, max: 15, step: 1}).on('change', updateBoxGeometry);
    });
};
