import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";
import * as RedGPU from "../../../../dist/index.js?t=1783326645983";

/**
 * [KO] Interpolation Test 예제
 * [EN] Interpolation Test example
 *
 * [KO] GLTF 애니메이션의 보간(Interpolation) 테스트 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Animation Interpolation Test model.
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

        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/InterpolationTest/glTF-Binary/InterpolationTest.glb');

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

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.Display.View3D} view
 * @param {string} url
 */
function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        scene.addChild(mesh)
        RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view)
        view.camera.distance += 5
        mesh.y = -1.5
    });
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};