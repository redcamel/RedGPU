import * as RedGPU from "../../../../dist/index.js?t=1767862292106";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createTorusKnotPrimitive(redGPUContext, scene);

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

const createTorusKnotPrimitive = (redGPUContext, scene) => {
    const torusKnotMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 4;
    const torusKnotProperties = [
        {material: torusKnotMaterials.solid, position: [0, 0, 0]},
        {
            material: torusKnotMaterials.wireframe,
            position: [-gap, 0, 0],
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        },
        {material: torusKnotMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    const defaultOptions = {
        radius: 1,
        tube: 0.4,
        tubularSegments: 64,
        radialSegments: 8,
        p: 2,
        q: 3,
    };

    torusKnotProperties.forEach(({material, position, topology}) => {
        const torusKnot = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.TorusKnot(
                redGPUContext,
                defaultOptions.radius,
                defaultOptions.tube,
                defaultOptions.tubularSegments,
                defaultOptions.radialSegments,
                defaultOptions.p,
                defaultOptions.q
            ),
            material
        );

        if (topology) {
            torusKnot.primitiveState.topology = topology;
        }

        torusKnot.setPosition(...position);
        scene.addChild(torusKnot);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2.5, position[2]);
        label.text = topology || 'Solid';
        label.color = '#ffffff';
        label.fontSize = 26;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        scene.addChild(label);
    });

    const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
    descriptionLabel.text = 'Customizable TorusKnot Primitive';
    descriptionLabel.color = '#ffffff';
    descriptionLabel.fontSize = 36;
    descriptionLabel.setPosition(0, -3, 0);
    descriptionLabel.useBillboard = true;
    descriptionLabel.useBillboardPerspective = true;
    scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767862292106");
    setDebugButtons(redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767862292106");
    const pane = new Pane();

    const config = {
        radius: 1,
        tube: 0.4,
        tubularSegments: 64,
        radialSegments: 8,
        p: 2,
        q: 3,
    };

    const updateTorusKnotGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children.filter(child => !(child instanceof RedGPU.Display.TextField3D));

        const newGeometry = new RedGPU.Primitive.TorusKnot(
            redGPUContext,
            config.radius,
            config.tube,
            config.tubularSegments,
            config.radialSegments,
            config.p,
            config.q
        );

        meshList.forEach(mesh => mesh.geometry = newGeometry);
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateTorusKnotGeometry();
        });
    };

    const torusKnotFolder = pane.addFolder({title: 'TorusKnot Properties', expanded: true});
    addBinding(torusKnotFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
    addBinding(torusKnotFolder, 'tube', {min: 0.1, max: 2, step: 0.1});
    addBinding(torusKnotFolder, 'tubularSegments', {min: 3, max: 128, step: 1});
    addBinding(torusKnotFolder, 'radialSegments', {min: 3, max: 32, step: 1});
    addBinding(torusKnotFolder, 'p', {min: 1, max: 10, step: 0.1});
    addBinding(torusKnotFolder, 'q', {min: 1, max: 10, step: 0.1});
};
