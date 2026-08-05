import * as RedGPU from '../../../../../dist/index.js?t=1783327399999';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327399999';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 Legacy 예제 - 1세대 구형 KTX2 레퍼런스 리스트 전용 (GitHub Pages 호스팅 자산)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 28;
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [1.기초 Raw / 레퍼런스] 1세대 구형 KTX2 텍스처 리스트 전용 (https://redcamel.github.io/testAsset/ktx2TestImages/ 호스팅 자산)
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {"path": BASE_URL + "cyan_rgb_reference_uastc.ktx2"},
            {"path": BASE_URL + "cyan_rgba_reference_u.ktx2"},
            {"path": BASE_URL + "green_rgb_reference_u.ktx2"},
            {"path": BASE_URL + "luminance_alpha_reference_basis.ktx2"},
            {"path": BASE_URL + "luminance_alpha_reference_u.ktx2"},
            {"path": BASE_URL + "luminance_alpha_reference_uastc.ktx2"},
            {"path": BASE_URL + "luminance_reference_basis.ktx2"},
            {"path": BASE_URL + "luminance_reference_u.ktx2"},
            {"path": BASE_URL + "luminance_reference_uastc.ktx2"},
            {"path": BASE_URL + "r_reference_basis.ktx2"},
            {"path": BASE_URL + "r_reference_u.ktx2"},
            {"path": BASE_URL + "r_reference_uastc.ktx2"},
            {"path": BASE_URL + "rg_reference_basis.ktx2"},
            {"path": BASE_URL + "rg_reference_u.ktx2"},
            {"path": BASE_URL + "rg_reference_uastc.ktx2"},
            {"path": BASE_URL + "rgb-mipmap-reference-u.ktx2"},
            {"path": BASE_URL + "rgba-mipmap-reference-basis.ktx2"},
            {"path": BASE_URL + "rgba-reference-u.ktx2"}
        ];

        // XY 수직 평면 중앙 정렬 그리드 배치
        const cols = 6;
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = 8.5;
        const spacingY = 11.0;
        const geometry = new RedGPU.Primitive.Plane(redGPUContext, 2.5, 2.5);

        const linearSampler = new RedGPU.Resource.Sampler(redGPUContext, {
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear'
        });

        testKTX2Files.forEach((item, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const itemsInThisRow = Math.min(cols, testKTX2Files.length - row * cols);
            const posX = (col - (itemsInThisRow - 1) / 2) * spacingX;
            const posY = ((totalRows - 1) / 2 - row) * spacingY;

            createKTX2TestTile(redGPUContext, scene, geometry, linearSampler, item, posX, posY);
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        new RedGPUExampleHelper(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
