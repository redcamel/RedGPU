import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Sampler Combination 예제
 * [EN] Sampler Combination example
 *
 * [KO] 텍스처 샘플러의 필터(minFilter, magFilter, mipmapFilter) 4x2 전체 조합을 비교합니다.
 * [EN] Compares all 4x2 combinations of texture sampler filters (minFilter, magFilter, mipmapFilter).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const meshes = createFilterCombinationGrid(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            meshes.forEach((mesh) => {
                mesh.rotationX += 0.05;
                mesh.rotationY += 0.05;
                mesh.rotationZ += 0.05;
            });
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

/**
 * [KO] minFilter, magFilter, mipmapFilter의 4x2(8가지) 전체 조합 그리드를 생성합니다.
 * [EN] Creates a 4x2 (8 combinations) grid of all minFilter, magFilter, and mipmapFilter settings.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<RedGPU.Display.Mesh>}
 */
const createFilterCombinationGrid = (redGPUContext, scene) => {
    const filterModes = [
        RedGPU.GPU_FILTER_MODE.NEAREST,
        RedGPU.GPU_FILTER_MODE.LINEAR
    ];

    const combinations = [];
    filterModes.forEach((mipmapFilter) => {
        filterModes.forEach((minFilter) => {
            filterModes.forEach((magFilter) => {
                combinations.push({minFilter, magFilter, mipmapFilter});
            });
        });
    });

    const geometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 0.65, 0.3, 128, 64);
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

    const cols = 4;
    const spacingX = 4.2;
    const spacingY = 4.8;
    const meshes = [];

    combinations.forEach((samplerConfig, index) => {
        const colIndex = index % cols;
        const rowIndex = Math.floor(index / cols);

        const x = (colIndex - (cols - 1) / 2) * spacingX;
        const y = (0.5 - rowIndex) * spacingY + 0.5;

        // [KO] 샘플러의 minFilter, magFilter, mipmapFilter 조합 적용
        // [EN] Apply minFilter, magFilter, and mipmapFilter combination to the sampler
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.diffuseTextureSampler.minFilter = samplerConfig.minFilter;
        material.diffuseTextureSampler.magFilter = samplerConfig.magFilter;
        material.diffuseTextureSampler.mipmapFilter = samplerConfig.mipmapFilter;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, y, 0);
        scene.addChild(mesh);
        meshes.push(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `min: ${samplerConfig.minFilter}<br/>mag: ${samplerConfig.magFilter}<br/>mipmap: ${samplerConfig.mipmapFilter}`;
        label.color = '#ffffff';
        label.worldSize = 0.85;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        label.setPosition(x, y - 2.1, 0);
        scene.addChild(label);
    });

    return meshes;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
