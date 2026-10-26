import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Sampler Address Mode 예제
 * [EN] Sampler Address Mode example
 *
 * [KO] 텍스처 샘플러의 Address Mode(clamp-to-edge, repeat, mirror-repeat) 3x3 전체 조합을 비교합니다.
 * [EN] Compares all 3x3 combinations of Texture Sampler Address Modes (clamp-to-edge, repeat, mirror-repeat).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 16;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const meshes = createAddressModeGrid(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            meshes.forEach((mesh) => {
                mesh.rotationY += 0.1;
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
 * [KO] addressModeU와 addressModeV의 3x3 전체 조합 그리드를 생성합니다.
 * [EN] Creates a 3x3 grid of all addressModeU and addressModeV combinations.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<RedGPU.Display.Mesh>}
 */
const createAddressModeGrid = (redGPUContext, scene) => {
    const addressModes = [
        RedGPU.GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
        RedGPU.GPU_ADDRESS_MODE.REPEAT,
        RedGPU.GPU_ADDRESS_MODE.MIRRORED_REPEAT
    ];

    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2, 1, 1, 1, 2);
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png');

    const spacingX = 4.5;
    const spacingY = 4.2;
    const meshes = [];

    addressModes.forEach((modeV, rowIndex) => {
        addressModes.forEach((modeU, colIndex) => {
            const x = (colIndex - 1) * spacingX;
            const y = (1 - rowIndex) * spacingY + 0.5;

            // [KO] 샘플러의 addressModeU, addressModeV 조합 설정
            // [EN] Set addressModeU and addressModeV combination on the sampler
            const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
            material.textureScale = [2, 2];
            material.diffuseTextureSampler.addressModeU = modeU;
            material.diffuseTextureSampler.addressModeV = modeV;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            mesh.setPosition(x, y, 0);
            scene.addChild(mesh);
            meshes.push(mesh);

            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = `U: ${modeU}<br/>V: ${modeV}`;
            label.color = '#ffffff';
            label.worldSize = 0.85;
            label.useBillboard = true;
            label.useBillboardPerspective = true;
            label.setPosition(x, y - 1.8, 0);
            scene.addChild(label);
        });
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
