import * as RedGPU from '../../../../../dist/index.js?t=1785971869723';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1785971869723';
import {createKTX2TestTile} from '../createKTX2TestTile.js?t=1785971869723';

/**
 * [KO] KTX2 Transcode 예제 - Basis Universal 런타임 트랜스코딩 리스트 (GitHub Pages 호스팅 자산)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const isNarrow = window.innerWidth <= 768;

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [Basis Universal ETC1S / UASTC 런타임 트랜스코딩 텍스처 리스트]
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {"path": BASE_URL + "alpha_simple_basis.ktx2"},
            {"path": BASE_URL + "camera_camera_BaseColor_basis.ktx2"},
            {"path": BASE_URL + "color_grid_basis.ktx2"},
            {"path": BASE_URL + "color_grid_zstd.ktx2"},
            {"path": BASE_URL + "cyan_rgb_reference_basis.ktx2"},
            {"path": BASE_URL + "etc1s_Iron_Bars_001_normal.ktx2"},
            {"path": BASE_URL + "FlightHelmet_baseColor_basis.ktx2"},
            {"path": BASE_URL + "kodim17_basis.ktx2"},
            {"path": BASE_URL + "ktx_document_basis.ktx2"},
            {"path": BASE_URL + "StainedGlassLamp_basis.ktx2"}
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
        renderer.start(redGPUContext, () => {
        });

        new RedGPUExampleHelper(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
