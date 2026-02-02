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
 * [KO] Cylinder 프리미티브들을 생성하고 정돈된 레이아웃으로 씬에 배치합니다.
 * [EN] Creates Cylinder primitives and places them in the scene with an organized layout.
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
        radiusTop: 1,
        radiusBottom: 1.0,
        height: 1.0,
        radialSegments: 8,
        heightSegments: 8,
        openEnded: false,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
    };

    const cylinderGeometry = new RedGPU.Primitive.Cylinder(
        redGPUContext,
        defaultOptions.radiusTop,
        defaultOptions.radiusBottom,
        defaultOptions.height,
        defaultOptions.radialSegments,
        defaultOptions.heightSegments,
        defaultOptions.openEnded,
        defaultOptions.thetaStart,
        defaultOptions.thetaLength
    );

    const gap = 4.0; // [KO] 수평 간격 조정 [EN] Adjusted horizontal gap
    const objects = [
        {material: materials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: materials.solid, position: [0, 0, 0]},
        {material: materials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    objects.forEach(({material, position, topology}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, cylinderGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        // Topology Name Label (H=1.0 -> y=0.5+1.0=1.5)
        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 1.5, position[2]);
        label.text = topology || RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
    });

    // Title Label (H=1.0 -> y=-0.5-1.3=-1.8)
    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -1.8, 0);
    titleText.text = 'Customizable Cylinder Primitive';
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
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769835266959");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radiusTop: 1,
        radiusBottom: 1.0,
        height: 1.0,
        radialSegments: 8,
        heightSegments: 8,
        openEnded: false,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Cylinder(
            redGPUContext,
            config.radiusTop,
            config.radiusBottom,
            config.height,
            config.radialSegments,
            config.heightSegments,
            config.openEnded,
            config.thetaStart,
            config.thetaLength
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const folder = pane.addFolder({title: 'Cylinder Properties', expanded: true});
    folder.addBinding(config, 'radiusTop', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'radiusBottom', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'height', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'radialSegments', {min: 3, max: 128, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'heightSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'openEnded').on('change', updateGeometry);
    folder.addBinding(config, 'thetaStart', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thetaLength', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
};