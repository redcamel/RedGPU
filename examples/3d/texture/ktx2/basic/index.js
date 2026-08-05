import * as RedGPU from '../../../../../dist/index.js?t=1785971869723';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1785971869723';
import {createKTX2TestTile} from '../createKTX2TestTile.js?t=1785971869723';

/**
 * [KO] KTX2 Basic 예제 - Three.js 18개 표준 실무 샘플 전수 리스트 (GitHub Pages 호스팅 자산)
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

        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/threejs_samples/';
        const testKTX2Files = [
            {"path": BASE_URL + "2d_rgba8.ktx2"},
            {"path": BASE_URL + "2d_rgba8_linear.ktx2"},
            {"path": BASE_URL + "2d_rgba16_linear.ktx2"},
            {"path": BASE_URL + "2d_rgba16unorm_linear.ktx2"},
            {"path": BASE_URL + "2d_rgba32_linear.ktx2"},
            {"path": BASE_URL + "2d_rgb9e5_linear.ktx2"},
            {"path": BASE_URL + "2d_r11g11b10_linear.ktx2"},
            {"path": BASE_URL + "2d_astc4x4.ktx2"},
            {"path": BASE_URL + "2d_etc1.ktx2"},
            {"path": BASE_URL + "2d_etc2.ktx2"},
            {"path": BASE_URL + "2d_bc1.ktx2"},
            {"path": BASE_URL + "2d_bc3.ktx2"},
            {"path": BASE_URL + "2d_bc4.ktx2"},
            {"path": BASE_URL + "2d_bc5.ktx2"},
            {"path": BASE_URL + "2d_bc7.ktx2"},
            {"path": BASE_URL + "2d_etc1s.ktx2"},
            {"path": BASE_URL + "2d_uastc.ktx2"},
            {"path": BASE_URL + "2d_uastc_hdr4x4.ktx2"}
        ];

        // isNarrow (window.innerWidth <= 768)일 땐 3열, 넓을 땐 화면 크기(window.innerWidth)에 따라 가로 열 수 넓게 채움
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
        renderer.start(redGPUContext, () => {
        });

        new RedGPUExampleHelper(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
