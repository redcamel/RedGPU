import * as RedGPU from '../../../../../dist/index.js?t=1785971869723';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1785971869723';
import {createKTX2TestTile} from '../createKTX2TestTile.js?t=1785971869723';

/**
 * [KO] KTX2 ASTC 예제 - 순수 ASTC 텍스처 전수 리스트 (GitHub Pages 호스팅 자산)
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

        // [순수 ASTC 텍스처 전용 전수 리스트]
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {"path": BASE_URL + "threejs_samples/2d_astc4x4.ktx2"},
            {"path": BASE_URL + "astc_ldr_4x4_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_5x4_Iron_Bars_001_normal.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x5_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_3dtex_7.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_Iron_Bars_001_normal.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_arraytex_7.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_arraytex_7_mipmap.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_posx.ktx2"},
            {"path": BASE_URL + "astc_ldr_8x6_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_8x8_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_10x5_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_12x10_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_12x12_FlightHelmet_baseColor.ktx2"},
            {"path": BASE_URL + "astc_ldr_cubemap_6x6.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_4x4_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x5_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_kodim17_fast.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_kodim17_fastest.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_kodim17_medium.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_posy.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_6x6_posz.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_8x6_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_8x8_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_10x5_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_12x10_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_12x12_posx.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_cubemap_6x6.ktx2"}
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
