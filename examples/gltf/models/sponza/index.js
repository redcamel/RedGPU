import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";
import * as RedGPU from "../../../../dist/index.js?t=1792986333865";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Setup camera or controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.pan = 90;
        controller.centerY = 1;
        controller.distance = 2;
        controller.speedDistance = 0.5;

        // Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // Load GLTF model
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf';
        loadGLTF(view, MODEL_URL);

        // Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // Add additional per-frame logic here if needed
        });

        // Configure test panel
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);


const loadGLTF = (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)

        },
        RedGPUExampleHelper.loadingProgressInfoHandler
    );
}

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};
