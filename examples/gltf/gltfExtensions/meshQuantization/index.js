import * as RedGPU from "../../../../dist/index.js?t=1795745510092";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1795745510092";

/**
 * [KO] KHR_mesh_quantization 예제
 * [EN] KHR_mesh_quantization example
 *
 * [KO] Khronos 공식 `glTF-Quantized` 4종 모델(AnimatedMorphCube, Avocado, Duck, Lantern)을 한 화면에 배치하여 정수 양자화 정점 및 모프 애니메이션을 검증합니다.
 * [EN] Displays all four official Khronos `glTF-Quantized` models (AnimatedMorphCube, Avocado, Duck, Lantern) side by side to verify integer-quantized vertices and morph animation.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const MODEL_URLS = [
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedMorphCube/glTF-Quantized/AnimatedMorphCube.gltf',
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Quantized/Avocado.gltf',
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Quantized/Duck.gltf',
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Quantized/Lantern.gltf',
];

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -10;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        // [KO] 순수 glTF-Quantized 4종 모델 로드 및 동일 크기로 정규화 배치
        // [EN] Load all four glTF-Quantized models and normalize their sizes side by side
        const container = new RedGPU.Display.Mesh(redGPUContext);
        scene.addChild(container);

        const spacing = 3.2;
        const targetSize = 2.0;
        const halfSpan = ((MODEL_URLS.length - 1) * spacing) / 2;
        let loadedCount = 0;

        MODEL_URLS.forEach((url, index) => {
            new RedGPU.GLTFLoader(
                redGPUContext,
                url,
                (result) => {
                    const mesh = result.resultMesh;
                    container.addChild(mesh);

                    if (result.parsingResult.animations.length > 0) {
                        result.playAnimation(result.parsingResult.animations[0]);
                    }

                    updateSubtreeMatrix(mesh, view);
                    const aabb = mesh.combinedBoundingAABB;
                    const maxDim = Math.max(aabb.xSize, aabb.ySize, aabb.zSize);
                    const scale = maxDim > 0 ? targetSize / maxDim : 1;
                    mesh.setScale(scale);
                    mesh.setPosition(
                        index * spacing - halfSpan - aabb.centerX * scale,
                        -aabb.minY * scale,
                        -aabb.centerZ * scale
                    );

                    loadedCount++;
                    if (loadedCount === MODEL_URLS.length) {
                        RedGPUExampleHelper.fitMeshToScreenCenter(container, view);
                    }
                },
                RedGPUExampleHelper.loadingProgressInfoHandler
            );
        });

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

const updateSubtreeMatrix = (mesh, view) => {
    RedGPU.Math.updateObject3DMatrix(mesh, view);
    for (let i = 0; i < mesh.children.length; i++) {
        updateSubtreeMatrix(mesh.children[i], view);
    }
};

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
        targetView: targetView,
    });
};
