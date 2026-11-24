import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] ChronographWatch (KHR_texture_basisu / KTX2) 예제
 * [EN] ChronographWatch (KHR_texture_basisu / KTX2) example
 *
 * [KO] Khronos 공식 `ChronographWatch`의 `glTF-KTX-BasisU`와 원본 Variant를 실시간 전환하며 KTX2 텍스처 자동 로딩과 색감 정합성을 비교합니다.
 * [EN] Switches between `glTF-KTX-BasisU` and standard variants of Khronos `ChronographWatch` to compare automatic KTX2 loading and PBR fidelity.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const VARIANTS = {
    'glTF-KTX-BasisU': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-KTX-BasisU/ChronographWatch.gltf',
    'glTF': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF/ChronographWatch.gltf',
    'glTF-WEBP': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-WEBP/ChronographWatch.gltf',
    'glTF-Binary': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb',
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] 선택한 Variant 모델 로드 및 교체 (최초 로드 시 카메라 중앙 맞춤)
        // [EN] Load and swap the selected variant model (fits camera on first load)
        let currentMesh = null;
        let isFirstLoad = true;
        let loadToken = 0;

        const loadVariant = (variantKey) => {
            const token = ++loadToken;
            new RedGPU.GLTFLoader(
                redGPUContext,
                VARIANTS[variantKey],
                (result) => {
                    if (token !== loadToken) return;
                    if (currentMesh) scene.removeChild(currentMesh);
                    currentMesh = result.resultMesh;
                    scene.addChild(currentMesh);
                    if (isFirstLoad) {
                        RedGPUExampleHelper.fitMeshToScreenCenter(currentMesh, view);
                        isFirstLoad = false;
                    }
                    if (result.parsingResult.animations.length > 0) {
                        result.playAnimation(result.parsingResult.animations[0]);
                    }
                },
                RedGPUExampleHelper.loadingProgressInfoHandler
            );
        };

        loadVariant('glTF-KTX-BasisU');

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, loadVariant);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, targetView, onVariantChange) => {
    const config = {variant: 'glTF-KTX-BasisU'};
    const options = Object.keys(VARIANTS).reduce((acc, key) => {
        acc[key] = key;
        return acc;
    }, {});

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        targetView: targetView,
        gui: (pane) => {
            const folder = pane.addFolder({title: 'KHR_texture_basisu'});
            folder.addBinding(config, 'variant', {options}).on('change', (ev) => {
                onVariantChange(ev.value);
            });
        },
    });
};
