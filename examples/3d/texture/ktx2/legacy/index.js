import * as RedGPU from '../../../../../dist/index.js?t=1792986902850';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1792986902850';
import {createKTX2TestTile} from '../createKTX2TestTile.js?t=1792986902850';

/**
 * [KO] KTX2 Legacy 예제
 * [EN] KTX2 Legacy example
 *
 * [KO] 1세대 구형 KTX2 레퍼런스 텍스처의 호환성 감지 및 폴백 로딩을 시연합니다.
 * [EN] Demonstrates compatibility detection and fallback loading for 1st-generation legacy KTX2 reference textures.
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

        // [KO] 1세대 구형 KTX2 레퍼런스 텍스처 리스트
        // [EN] 1st-generation legacy KTX2 reference texture list
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {path: BASE_URL + 'cyan_rgb_reference_uastc.ktx2'},
            {path: BASE_URL + 'cyan_rgba_reference_u.ktx2'},
            {path: BASE_URL + 'green_rgb_reference_u.ktx2'},
            {path: BASE_URL + 'luminance_alpha_reference_basis.ktx2'},
            {path: BASE_URL + 'luminance_alpha_reference_u.ktx2'},
            {path: BASE_URL + 'luminance_alpha_reference_uastc.ktx2'},
            {path: BASE_URL + 'luminance_reference_basis.ktx2'},
            {path: BASE_URL + 'luminance_reference_u.ktx2'},
            {path: BASE_URL + 'luminance_reference_uastc.ktx2'},
            {path: BASE_URL + 'r_reference_basis.ktx2'},
            {path: BASE_URL + 'r_reference_u.ktx2'},
            {path: BASE_URL + 'r_reference_uastc.ktx2'},
            {path: BASE_URL + 'rg_reference_basis.ktx2'},
            {path: BASE_URL + 'rg_reference_u.ktx2'},
            {path: BASE_URL + 'rg_reference_uastc.ktx2'},
            {path: BASE_URL + 'rgb-mipmap-reference-u.ktx2'},
            {path: BASE_URL + 'rgba-mipmap-reference-basis.ktx2'},
            {path: BASE_URL + 'rgba-reference-u.ktx2'}
        ];

        const cols = isNarrow ? 3 : Math.max(4, Math.floor(window.innerWidth / 150));
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = isNarrow ? 9.5 : 8.5;
        const spacingY = isNarrow ? 13.0 : 11.0;

        controller.distance = isNarrow ? 35 + totalRows * 5.5 : Math.max(40, 15 + cols * 2.5 + totalRows * 3.0);

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
