import * as RedGPU from "../../../../dist/index.js?t=1769500077563";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const parentMesh = createParentMesh(redGPUContext, scene);
        const childMesh = createChildMesh(redGPUContext, parentMesh);

        const parentPivotMesh = createPivotMesh(redGPUContext, parentMesh);
        const childPivotMesh = createPivotMesh(redGPUContext, childMesh);

        const animationConfig = {
            parentAnimationOn: true,
            childAnimationOn: true,
            parentSpeedX: 0.5,
            parentSpeedY: 0.5,
            parentSpeedZ: 0.5,
            childSpeedX: 1.0,
            childSpeedY: 1.0,
            childSpeedZ: 1.0,
        };

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            if (animationConfig.parentAnimationOn) {
                parentMesh.rotationX += animationConfig.parentSpeedX;
                parentMesh.rotationY += animationConfig.parentSpeedY;
                parentMesh.rotationZ += animationConfig.parentSpeedZ;
            } else {
                parentMesh.rotationX = 0;
                parentMesh.rotationY = 0;
                parentMesh.rotationZ = 0;
            }

            if (animationConfig.childAnimationOn) {
                childMesh.rotationX += animationConfig.childSpeedX;
                childMesh.rotationY += animationConfig.childSpeedY;
                childMesh.rotationZ += animationConfig.childSpeedZ;
            } else {
                childMesh.rotationX = 0;
                childMesh.rotationY = 0;
                childMesh.rotationZ = 0;
            }

            parentPivotMesh.setPosition(parentMesh.pivotX, parentMesh.pivotY, parentMesh.pivotZ);
            childPivotMesh.setPosition(childMesh.pivotX, childMesh.pivotY, childMesh.pivotZ);
        };

        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext, parentMesh, childMesh, animationConfig);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const createParentMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg")
    );
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3);
    const parentMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    parentMesh.setPosition(0, 0, 0);
    scene.addChild(parentMesh);

    return parentMesh;
};

const createChildMesh = (redGPUContext, parentMesh) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#ff0000");
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
    const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    childMesh.setPosition(3, 3, 0);
    parentMesh.addChild(childMesh);

    return childMesh;
};

const createPivotMesh = (redGPUContext, targetMesh) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00ff00");
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.1, 8, 8);
    const pivotMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    pivotMesh.depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;

    targetMesh.addChild(pivotMesh);
    return pivotMesh;
};

const renderTestPane = async (redGPUContext, parentMesh, childMesh, animationConfig) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769500077563");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769500077563");
    setDebugButtons(RedGPU, redGPUContext)
    const pane = new Pane();

    const parentFolder = pane.addFolder({title: "Parent Mesh", expanded: true});
    parentFolder.addBinding(animationConfig, "parentAnimationOn", {label: "Parent Animation"});
    parentFolder.addBinding(parentMesh, "pivotX", {min: -2, max: 2, step: 0.1, label: "Pivot X"});
    parentFolder.addBinding(parentMesh, "pivotY", {min: -2, max: 2, step: 0.1, label: "Pivot Y"});
    parentFolder.addBinding(parentMesh, "pivotZ", {min: -2, max: 2, step: 0.1, label: "Pivot Z"});

    const childFolder = pane.addFolder({title: "Child Mesh", expanded: true});
    childFolder.addBinding(animationConfig, "childAnimationOn", {label: "Child Animation"});
    childFolder.addBinding(childMesh, "pivotX", {min: -2, max: 2, step: 0.1, label: "Pivot X"});
    childFolder.addBinding(childMesh, "pivotY", {min: -2, max: 2, step: 0.1, label: "Pivot Y"});
    childFolder.addBinding(childMesh, "pivotZ", {min: -2, max: 2, step: 0.1, label: "Pivot Z"});
};
