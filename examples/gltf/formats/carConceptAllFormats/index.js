import * as RedGPU from "../../../../dist/index.js?t=1795745510092";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1795745510092";

/**
 * [KO] CarConcept (glTF 5종 포맷 비교) 예제
 * [EN] CarConcept (All 5 glTF Formats Comparison) example
 *
 * [KO] Khronos 공식 `CarConcept`의 5가지 glTF 포맷(glTF, glTF-Binary, glTF-JPG, glTF-KTX-BasisU-Draco, glTF-WEBP)을 화면 비율에 따른 반응형 그리드로 배치하고 텍스처 압축(KTX2/WebP/JPG)·Draco·Material Variants를 한 화면에서 비교 검증합니다.
 * [EN] Loads all 5 official Khronos `CarConcept` glTF formats (glTF, glTF-Binary, glTF-JPG, glTF-KTX-BasisU-Draco, glTF-WEBP) in a responsive grid to compare texture compression, Draco decoding, and Material Variants side by side.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const MODELS = [
    {
        label: 'glTF',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF/CarConcept.gltf',
    },
    {
        label: 'glTF-Binary',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/CarConcept.glb',
    },
    {
        label: 'glTF-JPG',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-JPG/CarConcept.gltf',
    },
    {
        label: 'glTF-KTX-BasisU-Draco',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-KTX-BasisU-Draco/CarConcept.gltf',
    },
    {
        label: 'glTF-WEBP',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-WEBP/CarConcept.gltf',
    },
];

const getGridCols = (width, height) => {
    const aspect = height > 0 ? width / height : 1.5;
    if (aspect >= 2.2) return 5;
    if (aspect >= 0.9) return 3;
    return 2;
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -12;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        // [KO] 5종 포맷 CarConcept 모델을 반응형 그리드로 배치합니다.
        // [EN] Arranges all 5 CarConcept format variants in a responsive grid.
        const container = new RedGPU.Display.Mesh(redGPUContext);
        scene.addChild(container);

        const colSpacing = 3.0;
        const rowSpacing = 2.6;
        const targetSize = 2.4;
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
            const halfH = ((rows - 1) * rowSpacing) / 2;

            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                const row = Math.floor(i / cols);
                const col = i % cols;
                const rowItemCount = Math.min(cols, slots.length - row * cols);
                const halfRowW = ((rowItemCount - 1) * colSpacing) / 2;
                const slotX = col * colSpacing - halfRowW;
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
