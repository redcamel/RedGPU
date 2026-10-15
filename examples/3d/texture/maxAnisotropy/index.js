import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Max Anisotropy 예제
 * [EN] Max Anisotropy example
 *
 * [KO] 이방성 필터링(Anisotropic Filtering)을 통해 예각으로 멀어지는 평면 텍스처의 선명도를 유지하는 효과를 시연합니다.
 * [EN] Demonstrates how Anisotropic Filtering maintains texture clarity on surfaces viewed at sharp oblique angles in the distance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 40;
        controller.tilt = -10;
        controller.centerY = 2;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        createComparisonLanes(redGPUContext, scene);

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

/**
 * [KO] 서로 다른 maxAnisotropy 값이 적용된 긴 도로(Ground)들을 생성합니다.
 * [EN] Creates long roads (Ground) with different maxAnisotropy values applied.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createComparisonLanes = (redGPUContext, scene) => {
    const anisotropyValues = [1, 8, 16];
    const laneWidth = 10;
    const laneLength = 2000;
    const gap = 2;
    const totalWidth = (laneWidth + gap) * anisotropyValues.length - gap;

    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/maxAnisotropy/maxAnisotropy.jpg');
    const geometry = new RedGPU.Primitive.Ground(redGPUContext, laneWidth, laneLength, 1, 100);

    anisotropyValues.forEach((value, index) => {
        const x = (index * (laneWidth + gap)) - (totalWidth / 2) + (laneWidth / 2);

        // [KO] 각 도로별 고유한 샘플러 및 maxAnisotropy 설정
        // [EN] Configure a unique sampler and maxAnisotropy for each lane
        const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
            minFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
            magFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
            mipmapFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
            addressModeU: RedGPU.GPU_ADDRESS_MODE.REPEAT,
            addressModeV: RedGPU.GPU_ADDRESS_MODE.REPEAT,
            maxAnisotropy: value
        });

        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture, sampler);
        material.textureScale = [1, laneLength / laneWidth];

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, 0, -laneLength / 2 + 25);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `MaxAnisotropy: ${value}`;
        label.fontSize = 24;
        label.worldSize = 1.2;
        label.setPosition(x, 1, 5);
        label.useBillboard = true;
        scene.addChild(label);
    });
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
