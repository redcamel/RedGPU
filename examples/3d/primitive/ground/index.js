import * as RedGPU from "../../../../dist/index.js?t=1769586528189";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createGroundPrimitive(redGPUContext, scene);

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

const createGroundPrimitive = (redGPUContext, scene) => {
    const groundMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 5;
    const groundProperties = [
        {material: groundMaterials.solid, position: [0, 0, 0]},
        {
            material: groundMaterials.wireframe,
            position: [-gap, 0, 0],
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        },
        {material: groundMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    const defaultOptions = {
        width: 4,
        height: 4,
        widthSegments: 10,
        heightSegments: 10,
    };

    groundProperties.forEach(({material, position, topology}) => {
        const ground = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Ground(
                redGPUContext,
                defaultOptions.width,
                defaultOptions.height,
                defaultOptions.widthSegments,
                defaultOptions.heightSegments
            ),
            material
        );

        if (topology) {
            ground.primitiveState.topology = topology;
        }

        ground.setPosition(...position);
        scene.addChild(ground);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 3, position[2]);
        label.text = topology || 'Solid';
        label.color = '#ffffff';
        label.fontSize = 26;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        scene.addChild(label);
    });

    const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
    descriptionLabel.text = 'Customizable Ground Primitive';
    descriptionLabel.color = '#ffffff';
    descriptionLabel.fontSize = 36;
    descriptionLabel.setPosition(0, -3, 0);
    descriptionLabel.useBillboard = true;
    descriptionLabel.useBillboardPerspective = true;
    scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769586528189");
    setDebugButtons(RedGPU, redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769586528189");
    const pane = new Pane();

    const config = {
        width: 4,
        height: 4,
        widthSegments: 10,
        heightSegments: 10,
    };

    const updateGroundGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children.filter(child => !(child instanceof RedGPU.Display.TextField3D));

        const newGeometry = new RedGPU.Primitive.Ground(
            redGPUContext,
            config.width,
            config.height,
            config.widthSegments,
            config.heightSegments
        );

        meshList.forEach(mesh => mesh.geometry = newGeometry);
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateGroundGeometry();
        });
    };

    const groundFolder = pane.addFolder({title: 'Ground Properties', expanded: true});
    addBinding(groundFolder, 'width', {min: 1, max: 10, step: 1});
    addBinding(groundFolder, 'height', {min: 1, max: 10, step: 1});
    addBinding(groundFolder, 'widthSegments', {min: 1, max: 64, step: 1});
    addBinding(groundFolder, 'heightSegments', {min: 1, max: 64, step: 1});
};
