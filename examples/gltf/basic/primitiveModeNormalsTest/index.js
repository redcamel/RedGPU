import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Primitive Mode Normals Test 예제
 * [EN] Primitive Mode Normals Test example
 *
 * [KO] Khronos 공식 `PrimitiveModeNormalsTest` 모델을 로드하여 토폴로지별 `NORMAL`/`TANGENT` 유무 및 플랫 노멀 전개 정확도를 검증합니다.
 * [EN] Loads Khronos `PrimitiveModeNormalsTest` to verify normal/tangent handling and flat normal generation across primitive modes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] PrimitiveModeNormalsTest 모델 로드 및 화면 중앙 배치
        // [EN] Load PrimitiveModeNormalsTest model and fit to screen center
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/PrimitiveModeNormalsTest/glTF/PrimitiveModeNormalsTest.gltf',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
        targetView: targetView,
    });
};
