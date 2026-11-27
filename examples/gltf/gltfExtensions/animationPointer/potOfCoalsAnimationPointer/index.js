import * as RedGPU from "../../../../../dist/index.js?t=1795745510092";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1795745510092";

/**
 * [KO] PotOfCoalsAnimationPointer (KHR_animation_pointer) 예제
 * [EN] PotOfCoalsAnimationPointer (KHR_animation_pointer) example
 *
 * [KO] Khronos 공식 `PotOfCoalsAnimationPointer` 모델을 로드하여 `KHR_animation_pointer` 기반 텍스처 회전 및 열기 굴절 애니메이션을 검증합니다.
 * [EN] Loads Khronos `PotOfCoalsAnimationPointer` to verify `KHR_animation_pointer` texture rotation and heat refraction animation.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -45;

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

        // [KO] PotOfCoalsAnimationPointer 로드 및 포인터 애니메이션 재생
        // [EN] Load PotOfCoalsAnimationPointer and play pointer animations
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/PotOfCoalsAnimationPointer/glTF-Binary/PotOfCoalsAnimationPointer.glb',
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
