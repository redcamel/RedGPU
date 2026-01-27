import * as RedGPU from "../../../../dist/index.js?t=1769512737237";

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

        createCylinderPrimitive(redGPUContext, scene);

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

const createCylinderPrimitive = (redGPUContext, scene) => {
    const cylinderMaterials = {
        solid: new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        ),
        wireframe: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00'),
        point: new RedGPU.Material.ColorMaterial(redGPUContext, '#00ffff'),
    };

    const gap = 4;
    const cylinderProperties = [
        {material: cylinderMaterials.solid, position: [0, 0, 0]},
        {
            material: cylinderMaterials.wireframe,
            position: [-gap, 0, 0],
            topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST
        },
        {material: cylinderMaterials.point, position: [gap, 0, 0], topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.POINT_LIST},
    ];

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

    cylinderProperties.forEach(({material, position, topology}) => {
        const cylinder = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Cylinder(
                redGPUContext,
                defaultOptions.radiusTop,
                defaultOptions.radiusBottom,
                defaultOptions.height,
                defaultOptions.radialSegments,
                defaultOptions.heightSegments,
                defaultOptions.openEnded,
                defaultOptions.thetaStart,
                defaultOptions.thetaLength
            ),
            material
        );

        if (topology) {
            cylinder.primitiveState.topology = topology;
        }

        cylinder.setPosition(...position);
        scene.addChild(cylinder);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.setPosition(position[0], 1.5, position[2]);
        label.text = topology || 'Solid';
        label.color = '#ffffff';
        label.fontSize = 26;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        scene.addChild(label);
    });

    const descriptionLabel = new RedGPU.Display.TextField3D(redGPUContext);
    descriptionLabel.text = 'Customizable Cylinder Primitive';
    descriptionLabel.color = '#ffffff';
    descriptionLabel.fontSize = 36;
    descriptionLabel.setPosition(0, -2, 0);
    descriptionLabel.useBillboard = true;
    descriptionLabel.useBillboardPerspective = true;
    scene.addChild(descriptionLabel);
};

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512737237");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512737237");
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

    const updateCylinderGeometry = () => {

        const meshList = redGPUContext.viewList[0].scene.children.filter(child => !(child instanceof RedGPU.Display.TextField3D));

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

        meshList.forEach(mesh => mesh.geometry = newGeometry);
    };

    const addBinding = (folder, property, params) => {
        folder.addBinding(config, property, params).on('change', (v) => {
            config[property] = v.value;
            updateCylinderGeometry();
        });
    };

    const cylinderFolder = pane.addFolder({title: 'Cylinder Properties', expanded: true});
    addBinding(cylinderFolder, 'radiusTop', {min: 0.1, max: 2, step: 0.1});
    addBinding(cylinderFolder, 'radiusBottom', {min: 0.1, max: 2, step: 0.1});
    addBinding(cylinderFolder, 'height', {min: 0.5, max: 5, step: 0.1});
    addBinding(cylinderFolder, 'radialSegments', {min: 3, max: 128, step: 1});
    addBinding(cylinderFolder, 'heightSegments', {min: 1, max: 64, step: 1});
    addBinding(cylinderFolder, 'openEnded', {});
    addBinding(cylinderFolder, 'thetaStart', {min: 0, max: Math.PI * 2, step: 0.1});
    addBinding(cylinderFolder, 'thetaLength', {min: 0, max: Math.PI * 2, step: 0.1});
};
