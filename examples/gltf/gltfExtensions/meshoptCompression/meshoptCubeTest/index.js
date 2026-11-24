import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] MeshoptCubeTest (KHR_meshopt_compression) 예제
 * [EN] MeshoptCubeTest (KHR_meshopt_compression) example
 *
 * [KO] Khronos 공식 `MeshoptCubeTest` 모델을 로드하여 `KHR_meshopt_compression` 온디맨드 WASM 디코딩을 검증합니다.
 * [EN] Loads Khronos `MeshoptCubeTest` to verify on-demand WASM decoding for `KHR_meshopt_compression`.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        renderTestPane(redGPUContext, view);

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MeshoptCubeTest/glTF-Meshopt/MeshoptCubeTest.gltf',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                updateSubtreeMatrix(mesh, view);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const updateSubtreeMatrix = (node, view) => {
    RedGPU.Math.updateObject3DMatrix(node, view);
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            updateSubtreeMatrix(node.children[i], view);
        }
    }
};

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: {expanded: false},
        targetView: targetView,
    });
};
