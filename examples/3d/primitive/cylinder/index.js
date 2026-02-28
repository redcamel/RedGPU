import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Cylinder Primitive 예제
 * [EN] Cylinder Primitive example
 *
 * [KO] Cylinder 프리미티브 생성 및 모든 속성을 실시간으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Cylinder primitive and control all its properties in real-time.
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
        radialTest: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 3.5;
    const items = [
        {material: materials.wireframe, position: [-gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, label: 'line-list (Planar)', isRadialTop: false, isRadialBottom: false},
        {material: materials.solid, position: [-gap * 0.5, 0, 0], label: 'triangle-list (Planar)', isRadialTop: false, isRadialBottom: false},
        {material: materials.radialTest, position: [gap * 0.5, 0, 0], label: 'triangle-list (Radial)', isRadialTop: true, isRadialBottom: true},
        {material: materials.point, position: [gap * 1.5, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, label: 'point-list (Planar)', isRadialTop: false, isRadialBottom: false},
    ];

    items.forEach(({material, position, topology, label: labelText, isRadialTop, isRadialBottom}) => {
        const cylinderGeometry = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 1, 32, 8, true, true, 0, Math.PI * 2, isRadialTop, isRadialBottom);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, cylinderGeometry, material);
        if (!mesh.userData) mesh.userData = {};
        mesh.userData.isRadialTop = isRadialTop;
        mesh.userData.isRadialBottom = isRadialBottom;
        if (topology) mesh.primitiveState.topology = topology;
        mesh.setPosition(...position);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 1.8, position[2]);
        label.text = labelText;
        label.color = '#ffffff';
        label.fontSize = 14;
        label.worldSize = 0.6;
        scene.addChild(label);
    });

    const titleText = new RedGPU.Display.TextField3D(redGPUContext);
    titleText.setPosition(0, -2.3, 0);
    titleText.text = 'Customizable Cylinder Primitive';
    titleText.color = '#ffffff';
    titleText.fontSize = 48;
    titleText.fontWeight = 500;
    titleText.worldSize = 1.3;
    scene.addChild(titleText);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const config = {
        radiusTop: 1,
        radiusBottom: 1.0,
        height: 1.0,
        radialSegments: 32,
        heightSegments: 8,
        capTop: true,
        capBottom: true,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
        isRadialTop: false,
        isRadialBottom: false,
        cullMode: RedGPU.GPU_CULL_MODE.BACK
    };

    const updateGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;
        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = new RedGPU.Primitive.Cylinder(
                    redGPUContext,
                    config.radiusTop, config.radiusBottom, config.height,
                    config.radialSegments, config.heightSegments,
                    config.capTop, config.capBottom,
                    config.thetaStart, config.thetaLength,
                    mesh.userData.isRadialTop !== undefined ? mesh.userData.isRadialTop : config.isRadialTop,
                    mesh.userData.isRadialBottom !== undefined ? mesh.userData.isRadialBottom : config.isRadialBottom
                );
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

    const geometryFolder = pane.addFolder({title: 'Geometry Properties', expanded: true});
    geometryFolder.addBinding(config, 'radiusTop', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'radiusBottom', {min: 0, max: 2, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'height', {min: 0.5, max: 5, step: 0.1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'radialSegments', {min: 3, max: 128, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'heightSegments', {min: 1, max: 64, step: 1}).on('change', updateGeometry);
    geometryFolder.addBinding(config, 'capTop').on('change', updateGeometry);
    geometryFolder.addBinding(config, 'capBottom').on('change', updateGeometry);
    const materialFolder = pane.addFolder({title: 'Material State', expanded: true});
    materialFolder.addBinding(config, 'cullMode', {
        options: {
            NONE: RedGPU.GPU_CULL_MODE.NONE,
            BACK: RedGPU.GPU_CULL_MODE.BACK,
            FRONT: RedGPU.GPU_CULL_MODE.FRONT
        }
    }).on('change', updateMaterial);
};
