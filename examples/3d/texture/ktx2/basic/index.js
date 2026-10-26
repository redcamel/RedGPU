import * as RedGPU from '../../../../../dist/index.js?t=1792986001111';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1792986001111';
import {createKTX2TestTile} from '../createKTX2TestTile.js?t=1792986001111';

/**
 * [KO] KTX2 Basic 예제
 * [EN] KTX2 Basic example
 *
 * [KO] 다양한 포맷(RGBA8, RGBA16, RGBA32, RGB9E5, R11G11B10, ASTC, ETC, BC, BasisU)의 표준 KTX2 2D 텍스처 로딩을 시연합니다.
 * [EN] Demonstrates loading standard 2D KTX2 textures across various formats (RGBA8, RGBA16, RGBA32, RGB9E5, R11G11B10, ASTC, ETC, BC, BasisU).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const isNarrow = window.innerWidth <= 768;

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 표준 2D KTX2 텍스처 포맷 리스트
        // [EN] Standard 2D KTX2 texture format list
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/threejs_samples/';
        const testKTX2Files = [
            {path: BASE_URL + '2d_rgba8.ktx2'},
            {path: BASE_URL + '2d_rgba8_linear.ktx2'},
            {path: BASE_URL + '2d_rgba16_linear.ktx2'},
            {path: BASE_URL + '2d_rgba16unorm_linear.ktx2'},
            {path: BASE_URL + '2d_rgba32_linear.ktx2'},
            {path: BASE_URL + '2d_rgb9e5_linear.ktx2'},
            {path: BASE_URL + '2d_r11g11b10_linear.ktx2'},
            {path: BASE_URL + '2d_astc4x4.ktx2'},
            {path: BASE_URL + '2d_etc1.ktx2'},
            {path: BASE_URL + '2d_etc2.ktx2'},
            {path: BASE_URL + '2d_bc1.ktx2'},
            {path: BASE_URL + '2d_bc3.ktx2'},
            {path: BASE_URL + '2d_bc4.ktx2'},
            {path: BASE_URL + '2d_bc5.ktx2'},
            {path: BASE_URL + '2d_bc7.ktx2'},
            {path: BASE_URL + '2d_etc1s.ktx2'},
            {path: BASE_URL + '2d_uastc.ktx2'},
            {path: BASE_URL + '2d_uastc_hdr4x4.ktx2'}
        ];

        const cols = isNarrow ? 3 : Math.max(4, Math.floor(window.innerWidth / 150));
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = isNarrow ? 9.5 : 8.5;
        const spacingY = isNarrow ? 10.5 : 8.0;

        controller.distance = isNarrow ? 28 + totalRows * 4.5 : Math.max(25, 12 + cols * 2.2 + totalRows * 2.5);

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
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
