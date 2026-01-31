import * as RedGPU from "../../../../dist/index.js?t=1769587130347";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 7.5;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMesh = async (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));

    const geometry = new RedGPU.Primitive.Box(redGPUContext);

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const total = array.length;
        const radius = 3;

        const angle = (index / total) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.x = x;
        mesh.y = y;

        scene.addChild(mesh);
        mesh.addListener(eventName, (e) => {
            console.log(`Event: ${eventName}`, e, e.ray);
            let tRotation = Math.random() * 360;
            TweenMax.to(e.target, 0.5, {
                rotationX: tRotation,
                rotationY: tRotation,
                rotationZ: tRotation,
                ease: Back.easeOut
            });
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.y = -1;
        label.useBillboard = true;
        label.primitiveState.cullMode = 'none';
        mesh.addChild(label);
    });
};

const renderTestPane = async (redGPUContext) => {
    const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769587130347");
    setDebugButtons(RedGPU, redGPUContext);
};
