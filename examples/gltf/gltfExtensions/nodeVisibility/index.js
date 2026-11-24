import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] KHR_node_visibility 예제
 * [EN] KHR_node_visibility example
 *
 * [KO] Khronos 공식 `NodeVisibilityTest`와 `CubeVisibility` 모델을 나란히 배치하여 초기 `visible: false` 반영과 계층 가시성 상속을 검증합니다.
 * [EN] Displays Khronos `NodeVisibilityTest` and `CubeVisibility` side by side to verify initial `visible: false` handling and hierarchy inheritance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const MODELS = [
    {
        name: 'NodeVisibilityTest',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/NodeVisibilityTest/glTF-Binary/NodeVisibilityTest.glb',
    },
    {
        name: 'CubeVisibility',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CubeVisibility/glTF-Binary/CubeVisibility.glb',
    },
];

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        renderTestPane(redGPUContext, view);

        // [KO] KHR_node_visibility 공식 모델 2종 로드 및 정규화 배치
        // [EN] Load two official KHR_node_visibility models and arrange them side by side
        const container = new RedGPU.Display.Mesh(redGPUContext);
        scene.addChild(container);

        let loadedCount = 0;
        const spacing = 4.0;
        const targetSize = 2.4;
        const halfSpan = ((MODELS.length - 1) * spacing) / 2;

        MODELS.forEach((item, index) => {
            new RedGPU.GLTFLoader(
                redGPUContext,
                item.url,
                (result) => {
                    const mesh = result.resultMesh;
                    container.addChild(mesh);

                    updateSubtreeMatrix(mesh, view);
                    const aabb = mesh.combinedBoundingAABB;
                    const maxDim = Math.max(aabb.xSize, aabb.ySize, aabb.zSize);
                    const scale = maxDim > 0 ? targetSize / maxDim : 1;
                    mesh.setScale(scale);
                    mesh.setPosition(
                        index * spacing - halfSpan - aabb.centerX * scale,
                        -aabb.centerY * scale,
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

const updateSubtreeMatrix = (mesh, view) => {
    RedGPU.Math.updateObject3DMatrix(mesh, view);
    for (let i = 0; i < mesh.children.length; i++) {
        updateSubtreeMatrix(mesh.children[i], view);
    }
};

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: {expanded: false},
        targetView: targetView,
    });
};
