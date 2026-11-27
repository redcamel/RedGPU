import * as RedGPU from "../../../../dist/index.js?t=1794646734270";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794646734270";

/**
 * [KO] Normal Tangent Test 예제
 * [EN] Normal Tangent Test example
 *
 * [KO] GLTF 노말·탄젠트(Normal Tangent) 테스트 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Normal Tangent Test model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] GLTF 모델 로드 및 화면 중앙 맞춤
        // [EN] Load GLTF model and fit to screen center
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/NormalTangentTest/glTF-Binary/NormalTangentTest.glb',
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

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
