import * as RedGPU from "../../../../dist/index.js?t=1770634235177";

/**
 * [KO] Sphere Primitive 예제
 * [EN] Sphere Primitive example
 *
 * [KO] Sphere 프리미티브 생성 및 반지름, 세그먼트, 각도 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Sphere primitive and control its radius, segments, and angle properties in real-time.
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
 * [KO] Sphere 프리미티브들을 생성하고 정돈된 레이아웃으로 씬에 배치합니다.
 * [EN] Creates Sphere primitives and places them in the scene with an organized layout.
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

    const defaultOptions = {
        radius: 1,
        widthSegments: 16,
        heightSegments: 16,
        phiStart: 0,
        phiLength: Math.PI * 2,
        thetaStart: 0,
        thetaLength: Math.PI,
        uvSize: 1,
    };

    const sphereGeometry = new RedGPU.Primitive.Sphere(
        redGPUContext,
        defaultOptions.radius,
        defaultOptions.widthSegments,
        defaultOptions.heightSegments,
        defaultOptions.phiStart,
        defaultOptions.phiLength,
        defaultOptions.thetaStart,
        defaultOptions.thetaLength,
        defaultOptions.uvSize
    );

    const gap = 3.5;
    const objects = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    objects.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
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
    titleText.text = 'Customizable Sphere Primitive';
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
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770634235177");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770634235177");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radius: 1,
        widthSegments: 16,
        heightSegments: 16,
        phiStart: 0,
        phiLength: Math.PI * 2,
        thetaStart: 0,
        thetaLength: Math.PI,
        uvSize: 1,
    };

    /**
     * [KO] 설정값 변경 시 Sphere 지오메트리를 재생성하여 업데이트합니다.
     * [EN] Recreates and updates the Sphere geometry when configuration values change.
     */
    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Sphere(
            redGPUContext,
            config.radius,
            config.widthSegments,
            config.heightSegments,
            config.phiStart,
            config.phiLength,
            config.thetaStart,
            config.thetaLength,
            config.uvSize
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const folder = pane.addFolder({title: 'Sphere Properties', expanded: true});
    folder.addBinding(config, 'radius', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'widthSegments', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'heightSegments', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'phiStart', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'phiLength', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thetaStart', {min: 0, max: Math.PI, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thetaLength', {min: 0, max: Math.PI, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'uvSize', {min: 0.1, max: 5, step: 0.1}).on('change', updateGeometry);
};
