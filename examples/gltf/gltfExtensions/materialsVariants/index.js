import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] KHR_materials_variants 예제 (MaterialsVariantsShoe)
 * [EN] KHR_materials_variants example (MaterialsVariantsShoe)
 *
 * [KO] Khronos 공식 `MaterialsVariantsShoe` 모델의 3종 재질 바리에이션(`Midnight`, `Beach`, `Street`)과 기본 재질을 실시간으로 전환합니다.
 * [EN] Switches between the three material variants (`Midnight`, `Beach`, `Street`) and default materials of Khronos `MaterialsVariantsShoe` in real time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -10;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] MaterialsVariantsShoe 로드 및 바리에이션 테스트 패널 연동
        // [EN] Load MaterialsVariantsShoe and bind variant selector pane
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
                renderTestPane(redGPUContext, view, result);
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

const renderTestPane = (redGPUContext, targetView, gltfLoader) => {
    const variants = gltfLoader.materialVariants;
    const config = {materialVariant: '__default__'};
    const options = {Default: '__default__'};
    variants.forEach((name) => {
        options[name] = name;
    });

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        targetView: targetView,
        gui: (pane) => {
            const folder = pane.addFolder({title: 'KHR_materials_variants'});
            folder.addBinding(config, 'materialVariant', {options}).on('change', (ev) => {
                gltfLoader.applyMaterialVariant(ev.value === '__default__' ? null : ev.value);
            });
        },
    });
};
