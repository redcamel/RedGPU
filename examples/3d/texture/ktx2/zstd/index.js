import * as RedGPU from '../../../../../dist/index.js?t=1783327399999';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327399999';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 ZSTD 초고압축 및 블록 압축 전용 예제 (ZSTD - Supercompressed 2D & Multilingual)
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

        // [ZSTD Supercompressed / BC / UASTC 2D 텍스처 리스트]
        const testKTX2Files = [
            {"path": "../../../../assets/ktx2TestImages/camera_camera_BaseColor_uastc.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/ccwn2c08.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/CesiumLogoFlat.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/cimg5293_uastc.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/cimg5293_uastc_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/color_grid_uastc.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/color_grid_uastc_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/g03n2c08.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/hűtő.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/hűtő_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/ktx_app-u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/ktx_document_uastc_rdo4_zstd5.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/orient-down-metadata-u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/orient-up-metadata.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/orient-up-metadata-u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/pattern_02_bc2.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/StainedGlassLamp_base.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/StainedGlassLamp_normal.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/tbrn2c08.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/tbyn3p08.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/tm3n3p02.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/uastc_Iron_Bars_001_normal.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/نَسِيج.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/نَسِيج_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/テクスチャ.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/テクスチャ_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/质地.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/质地_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/조직.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/조직_zstd.ktx2"}
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
