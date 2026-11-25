import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] BrainStem (KHR_meshopt_compression & EXT_meshopt_compression) 예제
 * [EN] BrainStem (KHR_meshopt_compression & EXT_meshopt_compression) example
 *
 * [KO] Khronos 공식 `BrainStem (glTF-Meshopt)`과 `BrainStem (glTF-Meshopt-EXT)` 두 모델을 나란히 로드하고 `TextField3D` 라벨로 규격별 스키닝 애니메이션을 비교 검증합니다.
 * [EN] Loads Khronos `BrainStem (glTF-Meshopt)` and `BrainStem (glTF-Meshopt-EXT)` side by side with `TextField3D` labels to compare skinning animation decoding across both specifications.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const MODELS = [
    {
        label: 'KHR_meshopt_compression',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Meshopt/BrainStem.gltf',
    },
    {
        label: 'EXT_meshopt_compression',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Meshopt-EXT/BrainStem.gltf',
    },
];

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -10;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        renderTestPane(redGPUContext, view);

        const container = new RedGPU.Display.Mesh(redGPUContext);
        scene.addChild(container);

        const spacing = 2.6;
        const targetSize = 2.0;
        const halfSpan = ((MODELS.length - 1) * spacing) / 2;
        let loadedCount = 0;

        MODELS.forEach((item, index) => {
            const slotX = index * spacing - halfSpan;

            const label = new RedGPU.Display.TextField3D(redGPUContext, item.label);
            label.worldSize = 0.22;
            label.useBillboard = true;
            label.setPosition(slotX, -0.35, 0);
            scene.addChild(label);

            new RedGPU.GLTFLoader(
                redGPUContext,
                item.url,
                (result) => {
                    const mesh = result.resultMesh;
                    container.addChild(mesh);

                    result.parsingResult.animations.forEach((clip) => {
                        result.playAnimation(clip);
                    });

                    updateSubtreeMatrix(mesh, view);
                    const aabb = mesh.combinedBoundingAABB;
                    const maxDim = Math.max(aabb.xSize, aabb.ySize, aabb.zSize);
                    const scale = maxDim > 0 ? targetSize / maxDim : 1;
                    mesh.setScale(scale);
                    mesh.setPosition(
                        slotX - aabb.centerX * scale,
                        -aabb.minY * scale,
                        -aabb.centerZ * scale
                    );

                    loadedCount++;
                    if (loadedCount === MODELS.length) {
                        RedGPUExampleHelper.fitMeshToScreenCenter(container, view);
                    }
                },
                RedGPUExampleHelper.loadingProgressInfoHandler
            );
        });

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

const updateSubtreeMatrix = (node, view) => {
    RedGPU.Math.updateObject3DMatrix(node, view);
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            updateSubtreeMatrix(node.children[i], view);
        }
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
