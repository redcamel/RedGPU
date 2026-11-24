import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] StainedGlassLamp (KHR_texture_basisu + KHR_materials_variants) 예제
 * [EN] StainedGlassLamp (KHR_texture_basisu + KHR_materials_variants) example
 *
 * [KO] Khronos 공식 `StainedGlassLamp (glTF-KTX-BasisU)` 모델을 로드하여 KTX2 텍스처 자동 로딩과 `KHR_materials_variants` 재질 바리에이션 실시간 전환을 검증합니다.
 * [EN] Loads Khronos `StainedGlassLamp (glTF-KTX-BasisU)` to verify automatic KTX2 texture loading and real-time `KHR_materials_variants` switching.
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

        const helper = renderTestPane(redGPUContext, view);

        // [KO] KTX2(BasisU) + KHR_materials_variants 모델 로드 및 테스트 패널 연동
        // [EN] Load KTX2 (BasisU) + KHR_materials_variants model and bind test pane
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/StainedGlassLamp/glTF-KTX-BasisU/StainedGlassLamp.gltf',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
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
        targetView: targetView,
    });
};

const bindMaterialVariantsPane = (helper, gltfLoader) => {
    const variants = gltfLoader.materialVariants;
    if (!variants.length) return;

    const config = {materialVariant: '__default__'};
    const options = {Default: '__default__', ...Object.fromEntries(variants.map((v) => [v, v]))};

    helper.updateGui((pane) => {
        const folder = pane.addFolder({title: 'KHR_materials_variants'});
        folder.addBinding(config, 'materialVariant', {options}).on('change', (ev) => {
            gltfLoader.applyMaterialVariant(ev.value === '__default__' ? null : ev.value);
        });
    });
};
