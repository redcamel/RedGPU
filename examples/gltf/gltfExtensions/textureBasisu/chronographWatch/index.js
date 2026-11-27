import * as RedGPU from "../../../../../dist/index.js?t=1795745510092";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1795745510092";

/**
 * [KO] ChronographWatch (KHR_texture_basisu + KHR_materials_variants) 예제
 * [EN] ChronographWatch (KHR_texture_basisu + KHR_materials_variants) example
 *
 * [KO] Khronos 공식 `ChronographWatch (glTF-KTX-BasisU)` 모델을 로드하여 다중 KTX2 텍스처 자동 로딩과 `KHR_materials_variants` 재질 바리에이션 전환을 검증합니다.
 * [EN] Loads Khronos `ChronographWatch (glTF-KTX-BasisU)` to verify automatic KTX2 texture loading and `KHR_materials_variants` switching.
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

        const helper = renderTestPane(redGPUContext, view);

        // [KO] KTX2(BasisU) 모델 로드 및 테스트 패널 연동
        // [EN] Load KTX2 (BasisU) model and bind test pane
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-KTX-BasisU/ChronographWatch.gltf',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
                if (result.parsingResult.animations.length > 0) {
                    result.playAnimation(result.parsingResult.animations[0]);
                }
                bindMaterialVariantsPane(helper, result);
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
    return new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: {expanded: false},
        skybox: {expanded: false},
        targetView: targetView,
    });
};

const bindMaterialVariantsPane = (helper, gltfLoader) => {
    const variants = gltfLoader.materialVariants;
    if (!variants.length) return;

    const config = {materialVariant: gltfLoader.activeMaterialVariant ?? variants[0]};
    const options = Object.fromEntries(variants.map((v) => [v, v]));

    helper.updateGui((pane) => {
        const folder = pane.addFolder({title: 'KHR_materials_variants', expanded: true});
        folder.addBinding(config, 'materialVariant', {options}).on('change', (ev) => {
            gltfLoader.applyMaterialVariant(ev.value);
        });
    });
};
