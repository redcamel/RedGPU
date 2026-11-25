import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] AnimationPointerUVs (KHR_animation_pointer) 예제
 * [EN] AnimationPointerUVs (KHR_animation_pointer) example
 *
 * [KO] Khronos 공식 `AnimationPointerUVs` 모델을 로드하여 PBR 및 확장 텍스처의 `KHR_texture_transform` UV 스크롤·스케일·회전 애니메이션을 검증합니다.
 * [EN] Loads Khronos `AnimationPointerUVs` to verify `KHR_texture_transform` UV offset, scale, and rotation pointer animations.
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

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        renderTestPane(redGPUContext, view);

        // [KO] AnimationPointerUVs 로드 및 UV 포인터 애니메이션 재생
        // [EN] Load AnimationPointerUVs and play UV pointer animations
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimationPointerUVs/glTF-Binary/AnimationPointerUVs.glb',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
                result.parsingResult.animations.forEach((clip) => {
                    result.playAnimation(clip);
                });
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

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
        targetView: targetView,
    });
};
