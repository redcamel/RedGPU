import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

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
        renderer.start(redGPUContext, () => {
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

/**
 * [KO] Torus 프리미티브들을 생성하고 정돈된 레이아웃으로 씬에 배치합니다.
 * [EN] Creates Torus primitives and places them in the scene with an organized layout.
 *
 * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
 * @param scene - [KO] 프리미티브가 추가될 씬 [EN] Scene where primitives will be added
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
        thickness: 0.5,
        radialSubdivisions: 16,
        bodySubdivisions: 16,
        startAngle: 0,
        endAngle: Math.PI * 2,
    };

    const torusGeometry = new RedGPU.Primitive.Torus(
        redGPUContext,
        defaultOptions.radius,
        defaultOptions.thickness,
        defaultOptions.radialSubdivisions,
        defaultOptions.bodySubdivisions,
        defaultOptions.startAngle,
        defaultOptions.endAngle
    );

    const gap = 4.5; // [KO] 수평 간격 조정 [EN] Adjusted horizontal gap
    const objects = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    objects.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, torusGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        // Topology Name Label (H=3.0 -> y=1.5+1.0=2.5)
        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.5, position[2]);
        label.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });

    // Title Label (H=3.0 -> y=-1.5-1.3=-2.8)
    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.8, 0);
    titleText.text = 'Customizable Torus Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48;
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

/**
 * [KO] 테스트를 위한 Tweakpane GUI를 초기화합니다.
 * [EN] Initializes the Tweakpane GUI for testing.
 */
const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959");
    const pane = new Pane();

    const config = {
        radius: 1,
        thickness: 0.5,
        radialSubdivisions: 16,
        bodySubdivisions: 16,
        startAngle: 0,
        endAngle: Math.PI * 2,
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Torus(
            redGPUContext,
            config.radius,
            config.thickness,
            config.radialSubdivisions,
            config.bodySubdivisions,
            config.startAngle,
            config.endAngle
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const folder = pane.addFolder({title: 'Torus Properties', expanded: true});
    folder.addBinding(config, 'radius', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thickness', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'radialSubdivisions', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'bodySubdivisions', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'startAngle', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'endAngle', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
};