import * as RedGPU from '../../../../../dist/index.js?t=1785971559678';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1785971559678';
import {layoutKTX2TestTiles} from '../createKTX2TestTile.js?t=1785971559678';

/**
 * [KO] KTX2 ArrayCube3D 예제 - 3D Volume, Array, Cubemap 리스트 (GitHub Pages 호스팅 자산)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [3D Volume / Texture Array / Cubemap / Skybox 텍스처 리스트]
        const BASE_URL = 'https://redcamel.github.io/testAsset/ktx2TestImages/';
        const testKTX2Files = [
            {"path": BASE_URL + "3dtex_1_reference_u.ktx2"},
            {"path": BASE_URL + "3dtex_7_reference_u.ktx2"},
            {"path": BASE_URL + "arraytex_1_reference_u.ktx2"},
            {"path": BASE_URL + "arraytex_7_mipmap_reference_u.ktx2"},
            {"path": BASE_URL + "arraytex_7_reference_u.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_3dtex_7.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_arraytex_7_mipmap.ktx2"},
            {"path": BASE_URL + "astc_ldr_6x6_arraytex_7.ktx2"},
            {"path": BASE_URL + "astc_ldr_cubemap_6x6.ktx2"},
            {"path": BASE_URL + "astc_mipmap_ldr_cubemap_6x6.ktx2"},
            {"path": BASE_URL + "cubemap_goldengate_uastc_rdo4_zstd5_rd.ktx2"},
            {"path": BASE_URL + "cubemap_yokohama_basis_rd.ktx2"},
            {"path": BASE_URL + "skybox_zstd.ktx2"},
            {"path": BASE_URL + "skybox.ktx2"},
            {"path": BASE_URL + "texturearray_astc_8x8_unorm.ktx2"},
            {"path": BASE_URL + "texturearray_bc3_unorm.ktx2"},
            {"path": BASE_URL + "texturearray_etc2_unorm.ktx2"}
        ];

        const geometry = new RedGPU.Primitive.Plane(redGPUContext, 2.5, 2.5);
        const linearSampler = new RedGPU.Resource.Sampler(redGPUContext, {
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear'
        });

        // PC / 모바일 분기 그리드 배치
        layoutKTX2TestTiles(redGPUContext, scene, geometry, linearSampler, testKTX2Files, controller);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        new RedGPUExampleHelper(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
