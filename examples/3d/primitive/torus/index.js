import * as RedGPU from "../../../../dist/index.js?t=1769499639386";

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

        createTorusPrimitive(redGPUContext, scene);

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

const createTorusPrimitive = (redGPUContext, scene) => {
    const torusMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 4;
    const torusProperties = [
        {material: torusMaterials.solid, position: [0, 0, 0]},
        {material: torusMaterials.wireframe, position: [-gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST},
        {material: torusMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

    const defaultOptions = {
        radius: 1,
        thickness: 0.5,
        radialSubdivisions: 16,
        bodySubdivisions: 16,
        startAngle: 0,
        endAngle: Math.PI * 2,
    };

    torusProperties.forEach(({material, position, topology}) => {
        const torus = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Torus(
                redGPUContext,
                defaultOptions.radius,
                defaultOptions.thickness,
                defaultOptions.radialSubdivisions,
                defaultOptions.bodySubdivisions,
                defaultOptions.startAngle,
                defaultOptions.endAngle
            ),
            material
        );

        if (topology) {
            torus.primitiveState.topology = topology;
        }

        torus.setPosition(...position);
        scene.addChild(torus);

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
    descriptionLabel.text = 'Customizable Torus Primitive';
    descriptionLabel.color = '#ffffff';
    descriptionLabel.fontSize = 36;
    descriptionLabel.setPosition(0, -2.5, 0);
    descriptionLabel.useBillboard = true;
    descriptionLabel.useBillboardPerspective = true;
    scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769499639386");
    setDebugButtons(RedGPU, redGPUContext)
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769499639386");
    const pane = new Pane();

    const config = {
        radius: 1,
        thickness: 0.5,
        radialSubdivisions: 16,
        bodySubdivisions: 16,
        startAngle: 0,
        endAngle: Math.PI * 2,
    };

    const updateTorusGeometry = () => {
        const meshList = redGPUContext.viewList[0].scene.children.filter(child => !(child instanceof RedGPU.Display.TextField3D));

        const newGeometry = new RedGPU.Primitive.Torus(
            redGPUContext,
            config.radius,
            config.thickness,
            config.radialSubdivisions,
            config.bodySubdivisions,
            config.startAngle,
            config.endAngle
        );

        meshList.forEach(mesh => mesh.geometry = newGeometry);
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateTorusGeometry();
        });
    };

    const torusFolder = pane.addFolder({title: 'Torus Properties', expanded: true});
    addBinding(torusFolder, 'radius', {min: 0.5, max: 5, step: 0.1});
    addBinding(torusFolder, 'thickness', {min: 0.1, max: 2, step: 0.1});
    addBinding(torusFolder, 'radialSubdivisions', {min: 3, max: 64, step: 1});
    addBinding(torusFolder, 'bodySubdivisions', {min: 3, max: 64, step: 1});
    addBinding(torusFolder, 'startAngle', {min: 0, max: Math.PI * 2, step: 0.1});
    addBinding(torusFolder, 'endAngle', {min: 0, max: Math.PI * 2, step: 0.1});
};
