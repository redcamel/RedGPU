import * as RedGPU from '../../../../../dist/index.js?t=1783327399999';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327399999';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 3D 볼륨, 텍스처 어레이, 큐브맵 특수 텍스처 전용 예제 (ArrayCube3D)
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

        // [3D Volume / Texture Array / Cubemap / Skybox 텍스처 리스트]
        const testKTX2Files = [
            {"path": "../../../../assets/ktx2TestImages/3dtex_1_reference_u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/3dtex_7_reference_u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/arraytex_1_reference_u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/arraytex_7_mipmap_reference_u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/arraytex_7_reference_u.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_3dtex_7.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7_mipmap.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_ldr_cubemap_6x6.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/astc_mipmap_ldr_cubemap_6x6.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/cubemap_goldengate_uastc_rdo4_zstd5_rd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/cubemap_yokohama_basis_rd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/skybox_zstd.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/skybox.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/texturearray_astc_8x8_unorm.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/texturearray_bc3_unorm.ktx2"},
            {"path": "../../../../assets/ktx2TestImages/texturearray_etc2_unorm.ktx2"}
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
