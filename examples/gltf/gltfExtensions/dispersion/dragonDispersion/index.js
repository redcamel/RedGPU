import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794650694512";
import * as RedGPU from "../../../../../dist/index.js?t=1794650694512";

/**
 * [KO] Dragon Dispersion 예제
 * [EN] Dragon Dispersion example
 *
 * [KO] Dragon Dispersion GLTF 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the Dragon Dispersion GLTF model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonDispersion/glTF-Binary/DragonDispersion.glb';
        loadGLTF(view, MODEL_URL);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

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
            RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view)
            view.camera.distance *= 0.5
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
