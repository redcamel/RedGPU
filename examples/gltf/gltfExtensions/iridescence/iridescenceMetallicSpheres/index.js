import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794650694512";
import * as RedGPU from "../../../../../dist/index.js?t=1794650694512";

/**
 * [KO] Iridescence Metallic Spheres 예제
 * [EN] Iridescence Metallic Spheres example
 *
 * [KO] GLTF Iridescence Metallic Spheres 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Iridescence Metallic Spheres model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        controller.tilt = 0

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/IridescenceMetallicSpheres/glTF/IridescenceMetallicSpheres.gltf');

        const renderer = new RedGPU.Renderer();
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        scene.addChild(mesh)
        RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view)
    });
}

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};