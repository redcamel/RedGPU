import * as RedGPU from "../../../../dist/index.js";

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

        createCapsulePrimitive(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
            // Frame logic
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

const createCapsulePrimitive = (redGPUContext, scene) => {
    const capsuleMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 3;
    const capsuleProperties = [
        {material: capsuleMaterials.solid, position: [0, 0, 0]},
        {
            material: capsuleMaterials.wireframe,
            position: [-gap, 0, 0],
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        },
        {material: capsuleMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    const defaultOptions = {
        radius: 0.5,
        cylinderHeight: 1.0,
        radialSegments: 32,
        heightSegments: 1,
        capSegments: 12
    };

    capsuleProperties.forEach(({material, position, topology}) => {
        const capsule = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Capsule(
                redGPUContext,
                defaultOptions.radius,
                defaultOptions.cylinderHeight,
                defaultOptions.radialSegments,
                defaultOptions.heightSegments,
                defaultOptions.capSegments
            ),
            material
        );

        if (topology) {
            capsule.primitiveState.topology = topology;
        }

        capsule.setPosition(...position);
        scene.addChild(capsule);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 2, position[2]);
        label.text = topology || 'Solid';
        label.color = '#ffffff';
        label.fontSize = 26;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        scene.addChild(label);
    });

    const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
    descriptionLabel.text = 'Customizable Capsule Primitive';
    descriptionLabel.color = '#ffffff';
    descriptionLabel.fontSize = 36;
    descriptionLabel.setPosition(0, -2.5, 0);
    descriptionLabel.useBillboard = true;
    descriptionLabel.useBillboardPerspective = true;
    scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
    setDebugButtons(RedGPU, redGPUContext)
    const config = {
        radius: 0.5,
        cylinderHeight: 1.0,
        radialSegments: 32,
        heightSegments: 1,
        capSegments: 12
    };

    const updateCapsuleGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children;

        const newGeometry = new RedGPU.Primitive.Capsule(
            redGPUContext,
            config.radius,
            config.cylinderHeight,
            config.radialSegments,
            config.heightSegments,
            config.capSegments
        );

        meshList.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh && !(mesh instanceof RedGPU.Display.TextField3D)) {
                mesh.geometry = newGeometry;
            }
        });
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateCapsuleGeometry();
        });
    };

    const capsuleFolder = pane.addFolder({title: 'Capsule Properties', expanded: true});
    addBinding(capsuleFolder, 'radius', {min: 0.1, max: 2, step: 0.1});
    addBinding(capsuleFolder, 'cylinderHeight', {min: 0.1, max: 5, step: 0.1});
    addBinding(capsuleFolder, 'radialSegments', {min: 3, max: 64, step: 1});
    addBinding(capsuleFolder, 'heightSegments', {min: 1, max: 32, step: 1});
    addBinding(capsuleFolder, 'capSegments', {min: 1, max: 32, step: 1});
};
