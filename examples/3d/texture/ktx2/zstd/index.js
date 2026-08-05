import * as RedGPU from '../../../../../dist/index.js?t=1783327399999';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327399999';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 ZSTD 예제 - ZSTD 초고압축 텍스처 리스트 (GitHub Pages 호스팅 자산)
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

        // [2.중급 Block / ZSTD / BC / UASTC 2D 전수 리스트]
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {"path": BASE_URL + "camera_camera_BaseColor_uastc.ktx2"},
            {"path": BASE_URL + "ccwn2c08.ktx2"},
            {"path": BASE_URL + "CesiumLogoFlat.ktx2"},
            {"path": BASE_URL + "cimg5293_uastc.ktx2"},
            {"path": BASE_URL + "cimg5293_uastc_zstd.ktx2"},
            {"path": BASE_URL + "color_grid_uastc.ktx2"},
            {"path": BASE_URL + "color_grid_uastc_zstd.ktx2"},
            {"path": BASE_URL + "g03n2c08.ktx2"},
            {"path": BASE_URL + "hűtő.ktx2"},
            {"path": BASE_URL + "hűtő_zstd.ktx2"},
            {"path": BASE_URL + "ktx_app-u.ktx2"},
            {"path": BASE_URL + "ktx_document_uastc_rdo4_zstd5.ktx2"},
            {"path": BASE_URL + "orient-down-metadata-u.ktx2"},
            {"path": BASE_URL + "orient-up-metadata.ktx2"},
            {"path": BASE_URL + "orient-up-metadata-u.ktx2"},
            {"path": BASE_URL + "pattern_02_bc2.ktx2"},
            {"path": BASE_URL + "StainedGlassLamp_base.ktx2"},
            {"path": BASE_URL + "StainedGlassLamp_normal.ktx2"},
            {"path": BASE_URL + "tbrn2c08.ktx2"},
            {"path": BASE_URL + "tbyn3p08.ktx2"},
            {"path": BASE_URL + "tm3n3p02.ktx2"},
            {"path": BASE_URL + "uastc_Iron_Bars_001_normal.ktx2"},
            {"path": BASE_URL + "نَسِيج.ktx2"},
            {"path": BASE_URL + "نَسِيج_zstd.ktx2"},
            {"path": BASE_URL + "テクスチャ.ktx2"},
            {"path": BASE_URL + "テクスチャ_zstd.ktx2"},
            {"path": BASE_URL + "质地.ktx2"},
            {"path": BASE_URL + "质地_zstd.ktx2"},
            {"path": BASE_URL + "조직.ktx2"},
            {"path": BASE_URL + "조직_zstd.ktx2"}
        ];

        // XY 수직 평면 중앙 정렬 그리드 배치
        const cols = 6;
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = 8.5;
        const spacingY = 8.0;
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
