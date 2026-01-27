import * as RedGPU from "../../../../dist/index.js?t=1769495390300";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        controller.distance = 15;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        addGround(redGPUContext, scene);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', -1, 1);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb', 1, 0);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            redGPUContext.viewList.forEach(view => {
                const {scene} = view;
                let i = scene.numChildren;
                while (i--) {
                    if (i === 0) continue;
                    let testObj = scene.children[i];
                    testObj.rotationY += 0.5;
                }
            });
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function loadGLTF(redGPUContext, scene, url, xPosition, yPosition) {
    let mesh;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            mesh = scene.addChild(v['resultMesh']);
            mesh.x = xPosition;
            mesh.y = yPosition;
            mesh.setCastShadowRecursively(true);
            mesh.setReceiveShadowRecursively(true);
        }
    );
}

const addGround = (redGPUContext, scene) => {
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    ground.setScale(200);
    ground.receiveShadow = true;
    scene.addChild(ground);
};

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769495390300");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769495390300");
    setDebugButtons(RedGPU, redGPUContext);
    const {createIblHelper} = await import('../../../exampleHelper/createExample/panes/index.js?t=1769495390300');

    const pane = new Pane();
    const {shadowManager} = targetView.scene;
    const {directionalShadowManager} = shadowManager;

    pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
        min: 128,
        max: 2048,
        step: 1
    }).on("change", (ev) => {
        directionalShadowManager.shadowDepthTextureSize = ev.value;
    });
    createIblHelper(pane, targetView, RedGPU, {useLight: true});

};
