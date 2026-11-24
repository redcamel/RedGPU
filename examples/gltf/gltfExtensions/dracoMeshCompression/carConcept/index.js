import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] CarConcept (KHR_draco_mesh_compression + KHR_texture_basisu) 예제
 * [EN] CarConcept (KHR_draco_mesh_compression + KHR_texture_basisu) example
 *
 * [KO] Khronos 공식 `CarConcept (glTF-KTX-BasisU-Draco)` 모델을 로드하여 Draco 지오메트리 압축과 KTX2 BasisU 텍스처 복합 디코딩을 검증합니다.
 * [EN] Loads Khronos `CarConcept (glTF-KTX-BasisU-Draco)` to verify combined Draco mesh compression and KTX2 BasisU texture decoding.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        const helper = renderTestPane(redGPUContext, view);

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-KTX-BasisU-Draco/CarConcept.gltf',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);

                if (result.materialVariants.length > 0) {
                    const variantState = {variant: result.materialVariants[0]};
                    result.applyMaterialVariant(variantState.variant);
                    helper.updateGui((pane) => {
                        const folder = pane.addFolder({title: 'KHR_materials_variants', expanded: true});
                        const options = {};
                        result.materialVariants.forEach((name) => {
                            options[name] = name;
                        });
                        folder.addBinding(variantState, 'variant', {options}).on('change', (ev) => {
                            result.applyMaterialVariant(ev.value);
                        });
                    });
                }
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
