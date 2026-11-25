import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] BrainStem (glTF 6종 포맷 비교) 예제
 * [EN] BrainStem (All 6 glTF Formats Comparison) example
 *
 * [KO] Khronos 공식 `BrainStem`의 6가지 glTF 포맷(glTF, glTF-Binary, glTF-Embedded, glTF-Draco, glTF-Meshopt, glTF-Meshopt-EXT)을 화면 비율에 따른 반응형 그리드(6×1 / 3×2 / 2×3)로 배치하고 스키닝 애니메이션 디코딩을 비교 검증합니다.
 * [EN] Loads all 6 official Khronos `BrainStem` glTF formats in a responsive grid (6×1 / 3×2 / 2×3) based on viewport aspect ratio to compare skinning animation decoding across formats.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const MODELS = [
    {
        label: 'glTF',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF/BrainStem.gltf',
    },
    {
        label: 'glTF-Binary',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb',
    },
    {
        label: 'glTF-Embedded',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Embedded/BrainStem.gltf',
    },
    {
        label: 'glTF-Draco',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Draco/BrainStem.gltf',
    },
    {
        label: 'glTF-Meshopt',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Meshopt/BrainStem.gltf',
    },
    {
        label: 'glTF-Meshopt-EXT',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Meshopt-EXT/BrainStem.gltf',
    },
];

const getGridCols = (width, height) => {
    const aspect = height > 0 ? width / height : 1.5;
    if (aspect >= 2.2) return 6;
    if (aspect >= 0.9) return 3;
    return 2;
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -8;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] 6종 포맷 BrainStem 모델을 화면 비율에 맞는 반응형 그리드로 배치하고 스키닝 애니메이션을 동시 재생합니다.
        // [EN] Arranges all 6 BrainStem format variants in a responsive grid and plays skinning animations simultaneously.
        const container = new RedGPU.Display.Mesh(redGPUContext);
        scene.addChild(container);

        const colSpacing = 2.1;
        const rowSpacing = 2.8;
        const targetSize = 2.0;
        let currentCols = getGridCols(window.innerWidth, window.innerHeight);
        let loadedCount = 0;

        const slots = MODELS.map((item) => {
            const label = new RedGPU.Display.TextField3D(redGPUContext, item.label);
            label.worldSize = 0.22;
            label.useBillboard = true;
            scene.addChild(label);
            return {label, mesh: null, offsetX: 0, offsetY: 0, offsetZ: 0};
        });

        const layoutSlots = (cols, refit) => {
            const rows = Math.ceil(slots.length / cols);
            const halfW = ((cols - 1) * colSpacing) / 2;
            const halfH = ((rows - 1) * rowSpacing) / 2;

            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                const col = i % cols;
                const row = Math.floor(i / cols);
                const slotX = col * colSpacing - halfW;
                const slotY = halfH - row * rowSpacing;

                slot.label.setPosition(slotX, slotY - 0.35, 0);
                if (slot.mesh) {
                    slot.mesh.setPosition(
                        slotX + slot.offsetX,
                        slotY + slot.offsetY,
                        slot.offsetZ
                    );
                }
            }

            if (refit && loadedCount === slots.length) {
                updateSubtreeMatrix(container, view);
                RedGPUExampleHelper.fitMeshToScreenCenter(container, view);
            }
        };

        layoutSlots(currentCols, false);

        view.onResize = ({screenRectObject}) => {
            const nextCols = getGridCols(screenRectObject.width, screenRectObject.height);
            if (nextCols !== currentCols) {
                currentCols = nextCols;
                layoutSlots(currentCols, true);
            }
        };

        MODELS.forEach((item, index) => {
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

                    slots[index].mesh = mesh;
                    slots[index].offsetX = -aabb.centerX * scale;
                    slots[index].offsetY = -aabb.minY * scale;
                    slots[index].offsetZ = -aabb.centerZ * scale;

                    loadedCount++;
                    layoutSlots(currentCols, loadedCount === slots.length);
                },
                RedGPUExampleHelper.loadingProgressInfoHandler
            );
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
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

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
