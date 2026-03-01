import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Torus Primitive 예제
 * [EN] Torus Primitive example
 *
 * [KO] Torus 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Torus primitive and control all its properties in real-time.
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
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPrimitive = (redGPUContext, scene) => {
    const materials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        visualTest: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const torusGeometry = new RedGPU.Primitive.Torus(redGPUContext, 1, 0.5, 16, 16);

    const gap = 4.5;
    const objects = [
        {material: materials.wireframe, position: [-gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, label: 'Line List'},
        {material: materials.solid, position: [-gap * 0.5, 0, 0], label: 'Triangle List<br/>(Grid)'},
        {material: materials.visualTest, position: [gap * 0.5, 0, 0], label: 'Triangle List<br/>(Diffuse)'},
        {material: materials.point, position: [gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, label: 'Point List'},
    ];

    objects.forEach(({material, position, topology, label: labelText}) => {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, torusGeometry, material);
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.5, position[2]);
        label.text = labelText;
        label.color = '#ffffff';
        label.fontSize = 32;
        label.worldSize = labelText.includes('<br/>') ? 1.0 : 0.5;
        scene.addChild(label);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.8, 0);
    titleText.text = 'Customizable Torus Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 96;
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const pane = new Pane();

    const config = {
        radius: 1,
        thickness: 0.5,
        radialSegments: 16,
        tubularSegments: 16,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
        capStart: false,
        capEnd: false,
        isRadialCapStart: false,
        isRadialCapEnd: false,
        cullMode: RedGPU.GPU_CULL_MODE.BACK
    };

    /**
     * [KO] 설정값 변경 시 Torus 지오메트리를 재생성하여 업데이트합니다.
     * [EN] Recreates and updates the Torus geometry when configuration values change.
     */
    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        const newGeometry = new RedGPU.Primitive.Torus(
            redGPUContext,
            config.radius, config.thickness, config.radialSegments, config.tubularSegments,
            config.thetaStart, config.thetaLength, config.capStart, config.capEnd,
            config.isRadialCapStart, config.isRadialCapEnd
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const updateMaterial = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        meshList.forEach((mesh) => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.primitiveState.cullMode = config.cullMode;
            }
        });
    };

    const folder = pane.addFolder({title: 'Torus Properties', expanded: true});
    folder.addBinding(config, 'radius', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thickness', {min: 0.1, max: 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'radialSegments', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'tubularSegments', {min: 3, max: 64, step: 1}).on('change', updateGeometry);
    folder.addBinding(config, 'thetaStart', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'thetaLength', {min: 0, max: Math.PI * 2, step: 0.1}).on('change', updateGeometry);
    folder.addBinding(config, 'capStart').on('change', updateGeometry);
    folder.addBinding(config, 'capEnd').on('change', updateGeometry);
    folder.addBinding(config, 'isRadialCapStart').on('change', updateGeometry);
    folder.addBinding(config, 'isRadialCapEnd').on('change', updateGeometry);

    const materialFolder = pane.addFolder({title: 'Material State', expanded: true});
    materialFolder.addBinding(config, 'cullMode', {
        options: {
            NONE: RedGPU.GPU_CULL_MODE.NONE,
            BACK: RedGPU.GPU_CULL_MODE.BACK,
            FRONT: RedGPU.GPU_CULL_MODE.FRONT
        }
    }).on('change', updateMaterial);
};
