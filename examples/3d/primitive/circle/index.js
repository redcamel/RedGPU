import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Circle Primitive 예제
 * [EN] Circle Primitive example
 *
 * [KO] Circle 프리미티브 생성 및 반지름, 세그먼트 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Circle primitive and control its radius and segment properties in real-time.
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
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] Circle 프리미티브들을 생성하고 정돈된 레이아웃으로 씬에 배치합니다.
 * [EN] Creates Circle primitives and places them in the scene with an organized layout.
 *
 * @param {RedGPU.RedGPUContext} redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 * @param {RedGPU.Display.Scene} scene - [KO] 프리미티브가 추가될 씬 [EN] Scene where primitives will be added
 */
const createPrimitive = (redGPUContext, scene) => {
    const materials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const circleGeometry = new RedGPU.Primitive.Circle(redGPUContext, 1, 64);

    const gap = 3.5;
    const objects = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    objects.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, circleGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        // [KO] 토폴로지 이름 라벨 생성
        // [EN] Create topology name label
        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.0, position[2]);
        label.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });

    // [KO] 타이틀 라벨 생성
    // [EN] Create title label
    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.3, 0);
    titleText.text = 'Customizable Circle Primitive';
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
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radius: 1,
        segments: 64,
    };

    /**
     * [KO] 설정값 변경 시 Circle 지오메트리를 재생성하여 업데이트합니다.
     * [EN] Recreates and updates the Circle geometry when configuration values change.
     */
    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Circle(
            redGPUContext,
            config.radius,
            config.segments
        );

        meshList.forEach((mesh) => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const folder = pane.addFolder({title: 'Circle Properties', expanded: true});
    folder.addBinding(config, 'radius', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'segments', {min: 3, max: 128, step: 1}).on('change', updateGeometry);
};
