import * as RedGPU from "../../../../dist/index.js?t=1767862292106";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const rootGroup = createRootGroup(redGPUContext, scene);
        const parentMesh = createParentMesh(redGPUContext, rootGroup);
        const childMesh = createChildMesh(redGPUContext, parentMesh);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, rootGroup, parentMesh, childMesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createRootGroup = (redGPUContext, scene) => {
    const group = new RedGPU.Display.Group3D();
    group.x = 0;
    group.y = 0;
    group.z = 0;
    scene.addChild(group);

    return group;
};

const createParentMesh = (redGPUContext, rootGroup) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.x = 0;
    mesh.y = 0;
    mesh.z = 0;
    rootGroup.addChild(mesh);

    return mesh;
};

const createChildMesh = (redGPUContext, parent) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.x = 1;
    mesh.y = 1;
    mesh.z = 0;
    parent.addChild(mesh);

    return mesh;
};

const renderTestPane = async (redGPUContext, rootGroup, parent, child) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767862292106");
    setDebugButtons(redGPUContext);
    const rootConfig = {
        x: rootGroup.x,
        y: rootGroup.y,
        z: rootGroup.z,
        rotationX: rootGroup.rotationX,
        rotationY: rootGroup.rotationY,
        rotationZ: rootGroup.rotationZ,
        scaleX: rootGroup.scaleX,
        scaleY: rootGroup.scaleY,
        scaleZ: rootGroup.scaleZ,
    };

    const parentConfig = {
        x: parent.x,
        y: parent.y,
        z: parent.z,
        scaleX: parent.scaleX,
        scaleY: parent.scaleY,
        scaleZ: parent.scaleZ,
        rotationX: parent.rotationX,
        rotationY: parent.rotationY,
        rotationZ: parent.rotationZ,
    };

    const childConfig = {
        x: child.x,
        y: child.y,
        z: child.z,
        scaleX: child.scaleX,
        scaleY: child.scaleY,
        scaleZ: child.scaleZ,
        rotationX: child.rotationX,
        rotationY: child.rotationY,
        rotationZ: child.rotationZ,
    };

    const rootFolder = pane.addFolder({title: 'Root Group3D', expanded: true});
    rootFolder.addBinding(rootConfig, 'x', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (rootGroup.x = evt.value));
    rootFolder.addBinding(rootConfig, 'y', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (rootGroup.y = evt.value));
    rootFolder.addBinding(rootConfig, 'z', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (rootGroup.z = evt.value));
    rootFolder.addBinding(rootConfig, 'rotationX', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (rootGroup.rotationX = evt.value));
    rootFolder.addBinding(rootConfig, 'rotationY', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (rootGroup.rotationY = evt.value));
    rootFolder.addBinding(rootConfig, 'rotationZ', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (rootGroup.rotationZ = evt.value));
    rootFolder.addBinding(rootConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (rootGroup.scaleX = evt.value));
    rootFolder.addBinding(rootConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (rootGroup.scaleY = evt.value));
    rootFolder.addBinding(rootConfig, 'scaleZ', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (rootGroup.scaleZ = evt.value));

    const parentFolder = pane.addFolder({title: 'Parent Mesh', expanded: true});
    parentFolder.addBinding(parentConfig, 'x', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (parent.x = evt.value));
    parentFolder.addBinding(parentConfig, 'y', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (parent.y = evt.value));
    parentFolder.addBinding(parentConfig, 'z', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (parent.z = evt.value));
    parentFolder.addBinding(parentConfig, 'rotationX', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (parent.rotationX = evt.value));
    parentFolder.addBinding(parentConfig, 'rotationY', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (parent.rotationY = evt.value));
    parentFolder.addBinding(parentConfig, 'rotationZ', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (parent.rotationZ = evt.value));
    parentFolder.addBinding(parentConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (parent.scaleX = evt.value));
    parentFolder.addBinding(parentConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (parent.scaleY = evt.value));
    parentFolder.addBinding(parentConfig, 'scaleZ', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (parent.scaleZ = evt.value));

    const childFolder = pane.addFolder({title: 'Child Mesh', expanded: true});
    childFolder.addBinding(childConfig, 'x', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (child.x = evt.value));
    childFolder.addBinding(childConfig, 'y', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (child.y = evt.value));
    childFolder.addBinding(childConfig, 'z', {
        min: -2,
        max: 2,
        step: 0.1
    }).on('change', (evt) => (child.z = evt.value));
    childFolder.addBinding(childConfig, 'rotationX', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (child.rotationX = evt.value));
    childFolder.addBinding(childConfig, 'rotationY', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (child.rotationY = evt.value));
    childFolder.addBinding(childConfig, 'rotationZ', {
        min: 0,
        max: 360,
        step: 0.01
    }).on('change', (evt) => (child.rotationZ = evt.value));
    childFolder.addBinding(childConfig, 'scaleX', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (child.scaleX = evt.value));
    childFolder.addBinding(childConfig, 'scaleY', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (child.scaleY = evt.value));
    childFolder.addBinding(childConfig, 'scaleZ', {
        min: 0,
        max: 5,
        step: 0.1
    }).on('change', (evt) => (child.scaleZ = evt.value));
};
