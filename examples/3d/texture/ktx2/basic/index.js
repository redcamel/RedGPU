import * as RedGPU from '../../../../../dist/index.js?t=1783327300000';
import RedGPUExampleHelper from '../../../../exampleHelper/dist/index.js?t=1783327300000';
import {createKTX2TestTile} from '../createKTX2TestTile.js';

/**
 * [KO] KTX2 표준 18종 전수 테스트 예제 (Basic)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 25;
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // Three.js 샘플 18개 전수 KTX2 텍스처 리스트 전용
        const testKTX2Files = [
            // [Raw 비압축] RGBA8 sRGB - 가장 기본적인 비압축 포맷. VK_FORMAT_R8G8B8A8_SRGB(43) → rgba8unorm-srgb
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgba8.ktx2"},
            // [Raw 비압축] RGBA8 Linear - sRGB 감마 없는 선형 색공간. VK_FORMAT_R8G8B8A8_UNORM(37) → rgba8unorm
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgba8_linear.ktx2"},
            // [Raw 비압축] RGBA16 Float Linear - 16비트 부동소수점 HDR. VK_FORMAT_R16G16B16A16_SFLOAT(97) → rgba16float
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgba16_linear.ktx2"},
            // [Raw 비압축] RGBA16 UNorm Linear - 16비트 정규화 정수. VK_FORMAT_R16G16B16A16_UNORM(91) → rgba16float(변환)
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgba16unorm_linear.ktx2"},
            // [Raw 비압축] RGBA32 Float Linear - 32비트 고정밀 HDR. VK_FORMAT_R32G32B32A32_SFLOAT(109) → rgba16float(변환)
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgba32_linear.ktx2"},
            // [Raw 비압축] RGB9E5 공유지수 Float - 특수 HDR 포맷. VK_FORMAT_E5B9G9R9_UFLOAT_PACK32(123) → rgb9e5ufloat
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_rgb9e5_linear.ktx2"},
            // [Raw 비압축] R11G11B10 Float - 11/10비트 압축 HDR. VK_FORMAT_B10G11R11_UFLOAT_PACK32(122) → rg11b10ufloat
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_r11g11b10_linear.ktx2"},
            // [Raw 블록압축 - 모바일/ARM] ASTC 4x4 - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 미지원 → Fallback
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_astc4x4.ktx2"},
            // [Raw 블록압축 - 모바일] ETC1 (RGB) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 미지원 → Fallback
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_etc1.ktx2"},
            // [Raw 블록압축 - 모바일] ETC2 (RGBA) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 미지원 → Fallback
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_etc2.ktx2"},
            // [Raw 블록압축 - PC/콘솔] BC1 (DXT1, RGB) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 지원 → 정상
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_bc1.ktx2"},
            // [Raw 블록압축 - PC/콘솔] BC3 (DXT5, RGBA) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 지원 → 정상
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_bc3.ktx2"},
            // [Raw 블록압축 - PC/콘솔] BC4 (R 단채널) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 지원 → 정상
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_bc4.ktx2"},
            // [Raw 블록압축 - PC/콘솔] BC5 (RG 2채널, 노말맵) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 지원 → 정상
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_bc5.ktx2"},
            // [Raw 블록압축 - PC/콘솔] BC7 (고품질 RGBA) - 트랜스코딩 없이 직접 업로드. 윈도우 PC GPU 지원 → 정상
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_bc7.ktx2"},
            // [Basis Universal 트랜스코딩] ETC1S (colorModel=163, vkFormat=0) - 런타임 트랜스코딩: 윈도우→BC1/BC3, 모바일→ETC2, 범용→RGBA32
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_etc1s.ktx2"},
            // [Basis Universal 트랜스코딩] UASTC LDR (colorModel=166, vkFormat=0) - 런타임 트랜스코딩: 윈도우→BC7, 모바일/Mac→ASTC4x4, 범용→RGBA32
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_uastc.ktx2"},
            // [Basis Universal 트랜스코딩] UASTC HDR (isHDR=true, vkFormat=0) - 런타임 트랜스코딩: 윈도우→BC6H, 범용→RGBA16F
            {"path": "../../../../assets/ktx2TestImages/threejs_samples/2d_uastc_hdr4x4.ktx2"}
        ];

        // XY 수직 평면 중앙 정렬 그리드 배치
        const cols = 6;
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = 7.0;
        const spacingY = 7.0;
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
