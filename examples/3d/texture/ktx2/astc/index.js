import * as RedGPU from '../../../../../dist/index.js?t=1783327399999';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327399999';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 순수 ASTC 전용 텍스처 예제 (Mobile / Apple Silicon GPU 전용 포맷전수)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 32;
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [순수 ASTC 텍스처 전용 전수 리스트]
        const testKTX2Files = [
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_astc4x4.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_4x4_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_5x4_Iron_Bars_001_normal.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x5_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_3dtex_7.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_Iron_Bars_001_normal.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7_mipmap.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_8x6_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_8x8_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_10x5_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_12x10_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_12x12_FlightHelmet_baseColor.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_cubemap_6x6.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_4x4_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x5_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_fast.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_fastest.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_medium.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posy.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posz.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_8x6_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_8x8_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_10x5_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_12x10_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_12x12_posx.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_cubemap_6x6.ktx2"}
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
