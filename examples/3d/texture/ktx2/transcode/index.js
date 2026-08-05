import * as RedGPU from '../../../../../dist/index.js?t=1785971559678';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1785971559678';
import {layoutKTX2TestTiles} from '../createKTX2TestTile.js?t=1785971559678';

/**
 * [KO] KTX2 Transcode 예제 - Basis Universal 런타임 트랜스코딩 리스트 (GitHub Pages 호스팅 자산)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = redGPUContext.detector.isMobile ? 40 : 28;
        controller.tilt = 0;

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
