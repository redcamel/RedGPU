import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794640510497";
import * as RedGPU from "../../../../dist/index.js?t=1794640510497";

/**
 * [KO] Tokyo 예제
 * [EN] Tokyo example
 *
 * [KO] GLTF Tokyo 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Tokyo model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.camera.nearClipping = 1

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const MODEL_URL = 'https://redcamel.github.io/RedGL-Examples-test/asset/glTF/tokyo/scene.gltf'
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
