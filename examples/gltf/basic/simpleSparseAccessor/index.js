import * as RedGPU from "../../../../dist/index.js?t=1795745510092";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1795745510092";

/**
 * [KO] Simple Sparse Accessor 예제
 * [EN] Simple Sparse Accessor example
 *
 * [KO] Khronos 공식 `SimpleSparseAccessor` 모델을 로드하여 Sparse Accessor 부분 정점 치환 정확도를 검증합니다.
 * [EN] Loads Khronos `SimpleSparseAccessor` to verify partial vertex substitution using glTF sparse accessors.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -20;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] SimpleSparseAccessor 모델 로드 및 화면 중앙 배치
        // [EN] Load SimpleSparseAccessor model and fit to screen center
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SimpleSparseAccessor/glTF/SimpleSparseAccessor.gltf',
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
