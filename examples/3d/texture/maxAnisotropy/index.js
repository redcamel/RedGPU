import * as RedGPU from "../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] Max Anisotropy 예제
 * [EN] Max Anisotropy example
 *
 * [KO] 이방성 필터링(Anisotropic Filtering)을 통해 예각으로 멀어지는 바닥 텍스처의 선명도를 비교 시연합니다.
 * [EN] Compares and demonstrates how Anisotropic Filtering maintains floor texture clarity at oblique viewing angles into the distance.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 14;
        controller.tilt = -8;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const {texture, lanes} = createComparisonLanes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, texture, lanes);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 서로 다른 maxAnisotropy 값이 적용된 비교 차선(Ground)들을 생성합니다.
 * [EN] Creates comparison lanes (Ground) with different maxAnisotropy values applied.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {{texture: RedGPU.Resource.BitmapTexture, lanes: Array<{sampler: RedGPU.Resource.Sampler, label: RedGPU.Display.TextField3D}>}}
 */
const createComparisonLanes = (redGPUContext, scene) => {
    const anisotropyValues = [1, 4, 16];
    const laneWidth = 8;
    const laneLength = 2000;
    const gap = 0.8;
    const totalWidth = (laneWidth + gap) * anisotropyValues.length - gap;

    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/maxAnisotropy/maxAnisotropy.jpg');
    const geometry = new RedGPU.Primitive.Ground(redGPUContext, laneWidth, laneLength, 1, 100);
    const lanes = [];

    anisotropyValues.forEach((value, index) => {
        const x = (index * (laneWidth + gap)) - (totalWidth / 2) + (laneWidth / 2);

        // [KO] 각 차선별 샘플러 주소 모드 및 maxAnisotropy 설정
        // [EN] Configure sampler address mode and maxAnisotropy for each lane
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.textureScale = [1, laneLength / laneWidth];
        material.diffuseTextureSampler.addressModeU = RedGPU.GPU_ADDRESS_MODE.REPEAT;
        material.diffuseTextureSampler.addressModeV = RedGPU.GPU_ADDRESS_MODE.REPEAT;
        material.diffuseTextureSampler.maxAnisotropy = value;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, 0, -laneLength / 2 + 12);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `maxAnisotropy: ${value}`;
        label.fontSize = 28;
        label.worldSize = 0.9;
        label.setPosition(x, 1.2, 0);
        label.useBillboard = true;
        scene.addChild(label);

        lanes.push({sampler: material.diffuseTextureSampler, label});
    });

    return {texture, lanes};
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Resource.BitmapTexture} texture
 * @param {Array<{sampler: RedGPU.Resource.Sampler, label: RedGPU.Display.TextField3D}>} lanes
 */
const renderTestPane = (redGPUContext, texture, lanes) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const textureFolder = pane.addFolder({title: 'Texture', expanded: true});
            textureFolder.addBinding(texture, 'useMipmap');

            const laneTitles = ['Left Lane', 'Center Lane', 'Right Lane'];
            lanes.forEach(({sampler, label}, index) => {
                const folder = pane.addFolder({title: laneTitles[index], expanded: true});
                folder.addBinding(sampler, 'maxAnisotropy', {
                    min: 1,
                    max: 16,
                    step: 1
                }).on('change', (evt) => {
                    label.text = `maxAnisotropy: ${evt.value}`;
                });
            });
        }
    });
};
