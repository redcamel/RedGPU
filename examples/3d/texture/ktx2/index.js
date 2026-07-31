import * as RedGPU from '../../../../dist/index.js?t=1783326645983';
import RedGPUExampleHelper from '../../../exampleHelper/dist/index.js?t=1783326645983';

/**
 * [KO] KTX2 테스트 텍스처 (초급 Raw만 활성화, 중급/상급/최심화는 주석 처리)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 42;
        controller.speedDistance = 1.0;
        controller.tilt = -0.6;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1b1c2b');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // Three.js 샘플 18개 전수 KTX2 텍스처 리스트
        const testKTX2Files = [
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgba8.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgba8_linear.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgba16_linear.ktx2"},
            // {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgba16unorm_linear.ktx2"}, //TODO - 이거 파싱확인
            // {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgba32_linear.ktx2"}, //TODO - 이거 파싱확인
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_rgb9e5_linear.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_r11g11b10_linear.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_astc4x4.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_etc1.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_etc2.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_bc1.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_bc3.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_bc4.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_bc5.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_bc7.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_etc1s.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_uastc.ktx2"},
            {"path": "../../../assets/ktx2TestImages/threejs_samples/2d_uastc_hdr4x4.ktx2"},
// {
//     "name": "[1.기초 Raw] cyan_rgb_reference_uastc",
//     "path": "../../../assets/ktx2TestImages/cyan_rgb_reference_uastc.ktx2"
// },
// {
//     "name": "[1.기초 Raw] cyan_rgba_reference_u",
//     "path": "../../../assets/ktx2TestImages/cyan_rgba_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] green_rgb_reference_u",
//     "path": "../../../assets/ktx2TestImages/green_rgb_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_alpha_reference_basis",
//     "path": "../../../assets/ktx2TestImages/luminance_alpha_reference_basis.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_alpha_reference_u",
//     "path": "../../../assets/ktx2TestImages/luminance_alpha_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_alpha_reference_uastc",
//     "path": "../../../assets/ktx2TestImages/luminance_alpha_reference_uastc.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_reference_basis",
//     "path": "../../../assets/ktx2TestImages/luminance_reference_basis.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_reference_u",
//     "path": "../../../assets/ktx2TestImages/luminance_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] luminance_reference_uastc",
//     "path": "../../../assets/ktx2TestImages/luminance_reference_uastc.ktx2"
// },
// {
//     "name": "[1.기초 Raw] r_reference_basis",
//     "path": "../../../assets/ktx2TestImages/r_reference_basis.ktx2"
// },
// {
//     "name": "[1.기초 Raw] r_reference_u",
//     "path": "../../../assets/ktx2TestImages/r_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] r_reference_uastc",
//     "path": "../../../assets/ktx2TestImages/r_reference_uastc.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rg_reference_basis",
//     "path": "../../../assets/ktx2TestImages/rg_reference_basis.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rg_reference_u",
//     "path": "../../../assets/ktx2TestImages/rg_reference_u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rg_reference_uastc",
//     "path": "../../../assets/ktx2TestImages/rg_reference_uastc.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rgb-mipmap-reference-u",
//     "path": "../../../assets/ktx2TestImages/rgb-mipmap-reference-u.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rgba-mipmap-reference-basis",
//     "path": "../../../assets/ktx2TestImages/rgba-mipmap-reference-basis.ktx2"
// },
// {
//     "name": "[1.기초 Raw] rgba-reference-u",
//     "path": "../../../assets/ktx2TestImages/rgba-reference-u.ktx2"
// },
// {
//           "name": "[2.중급 Block] 조직",
//           "path": "../../../assets/ktx2TestImages/조직.ktx2"
// },
// {
//           "name": "[2.중급 Block] 质地",
//           "path": "../../../assets/ktx2TestImages/质地.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_10x5_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_10x5_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_12x10_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_12x10_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_12x12_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_12x12_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_4x4_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_4x4_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_5x4_Iron_Bars_001_normal",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_5x4_Iron_Bars_001_normal.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_6x5_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x5_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_6x6_Iron_Bars_001_normal",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x6_Iron_Bars_001_normal.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_6x6_posx",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x6_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_8x6_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_8x6_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_ldr_8x8_FlightHelmet_baseColor",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_8x8_FlightHelmet_baseColor.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_10x5_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_10x5_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_12x10_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_12x10_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_12x12_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_12x12_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_4x4_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_4x4_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x5_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x5_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_kodim17_fast",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_fast.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_kodim17_fastest",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_fastest.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_kodim17_medium",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_kodim17_medium.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_posy",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posy.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_6x6_posz",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_6x6_posz.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_8x6_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_8x6_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] astc_mipmap_ldr_8x8_posx",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_8x8_posx.ktx2"
// },
// {
//           "name": "[2.중급 Block] camera_camera_BaseColor_uastc",
//           "path": "../../../assets/ktx2TestImages/camera_camera_BaseColor_uastc.ktx2"
// },
// {
//           "name": "[2.중급 Block] ccwn2c08",
//           "path": "../../../assets/ktx2TestImages/ccwn2c08.ktx2"
// },
// {
//           "name": "[2.중급 Block] CesiumLogoFlat",
//           "path": "../../../assets/ktx2TestImages/CesiumLogoFlat.ktx2"
// },
// {
//           "name": "[2.중급 Block] cimg5293_uastc_zstd",
//           "path": "../../../assets/ktx2TestImages/cimg5293_uastc_zstd.ktx2"
// },
// {
//           "name": "[2.중급 Block] cimg5293_uastc",
//           "path": "../../../assets/ktx2TestImages/cimg5293_uastc.ktx2"
// },
// {
//           "name": "[2.중급 Block] color_grid_uastc_zstd",
//           "path": "../../../assets/ktx2TestImages/color_grid_uastc_zstd.ktx2"
// },
// {
//           "name": "[2.중급 Block] color_grid_uastc",
//           "path": "../../../assets/ktx2TestImages/color_grid_uastc.ktx2"
// },
// {
//           "name": "[2.중급 Block] g03n2c08",
//           "path": "../../../assets/ktx2TestImages/g03n2c08.ktx2"
// },
// {
//           "name": "[2.중급 Block] hűtő",
//           "path": "../../../assets/ktx2TestImages/hűtő.ktx2"
// },
// {
//           "name": "[2.중급 Block] ktx_app-u",
//           "path": "../../../assets/ktx2TestImages/ktx_app-u.ktx2"
// },
// {
//           "name": "[2.중급 Block] ktx_document_uastc_rdo4_zstd5",
//           "path": "../../../assets/ktx2TestImages/ktx_document_uastc_rdo4_zstd5.ktx2"
// },
// {
//           "name": "[2.중급 Block] orient-down-metadata-u",
//           "path": "../../../assets/ktx2TestImages/orient-down-metadata-u.ktx2"
// },
// {
//           "name": "[2.중급 Block] orient-up-metadata-u",
//           "path": "../../../assets/ktx2TestImages/orient-up-metadata-u.ktx2"
// },
// {
//           "name": "[2.중급 Block] orient-up-metadata",
//           "path": "../../../assets/ktx2TestImages/orient-up-metadata.ktx2"
// },
// {
//           "name": "[2.중급 Block] pattern_02_bc2",
//           "path": "../../../assets/ktx2TestImages/pattern_02_bc2.ktx2"
// },
// {
//           "name": "[2.중급 Block] StainedGlassLamp_base",
//           "path": "../../../assets/ktx2TestImages/StainedGlassLamp_base.ktx2"
// },
// {
//           "name": "[2.중급 Block] StainedGlassLamp_normal",
//           "path": "../../../assets/ktx2TestImages/StainedGlassLamp_normal.ktx2"
// },
// {
//           "name": "[2.중급 Block] tbrn2c08",
//           "path": "../../../assets/ktx2TestImages/tbrn2c08.ktx2"
// },
// {
//           "name": "[2.중급 Block] tbyn3p08",
//           "path": "../../../assets/ktx2TestImages/tbyn3p08.ktx2"
// },
// {
//           "name": "[2.중급 Block] tm3n3p02",
//           "path": "../../../assets/ktx2TestImages/tm3n3p02.ktx2"
// },
// {
//           "name": "[2.중급 Block] uastc_Iron_Bars_001_normal",
//           "path": "../../../assets/ktx2TestImages/uastc_Iron_Bars_001_normal.ktx2"
// },
// {
//           "name": "[2.중급 Block] نَسِيج",
//           "path": "../../../assets/ktx2TestImages/نَسِيج.ktx2"
// },
// {
//           "name": "[2.중급 Block] テクスチャ",
//           "path": "../../../assets/ktx2TestImages/テクスチャ.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] 조직_zstd",
//           "path": "../../../assets/ktx2TestImages/조직_zstd.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] 质地_zstd",
//           "path": "../../../assets/ktx2TestImages/质地_zstd.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] alpha_simple_basis",
//           "path": "../../../assets/ktx2TestImages/alpha_simple_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] camera_camera_BaseColor_basis",
//           "path": "../../../assets/ktx2TestImages/camera_camera_BaseColor_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] color_grid_basis",
//           "path": "../../../assets/ktx2TestImages/color_grid_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] color_grid_zstd",
//           "path": "../../../assets/ktx2TestImages/color_grid_zstd.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] cyan_rgb_reference_basis",
//           "path": "../../../assets/ktx2TestImages/cyan_rgb_reference_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] etc1s_Iron_Bars_001_normal",
//           "path": "../../../assets/ktx2TestImages/etc1s_Iron_Bars_001_normal.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] FlightHelmet_baseColor_basis",
//           "path": "../../../assets/ktx2TestImages/FlightHelmet_baseColor_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] hűtő_zstd",
//           "path": "../../../assets/ktx2TestImages/hűtő_zstd.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] kodim17_basis",
//           "path": "../../../assets/ktx2TestImages/kodim17_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] ktx_document_basis",
//           "path": "../../../assets/ktx2TestImages/ktx_document_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] StainedGlassLamp_basis",
//           "path": "../../../assets/ktx2TestImages/StainedGlassLamp_basis.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] نَسِيج_zstd",
//           "path": "../../../assets/ktx2TestImages/نَسِيج_zstd.ktx2"
// },
// {
//           "name": "[3.상급 Basis 2D] テクスチャ_zstd",
//           "path": "../../../assets/ktx2TestImages/テクスチャ_zstd.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] 3dtex_1_reference_u",
//           "path": "../../../assets/ktx2TestImages/3dtex_1_reference_u.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] 3dtex_7_reference_u",
//           "path": "../../../assets/ktx2TestImages/3dtex_7_reference_u.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] arraytex_1_reference_u",
//           "path": "../../../assets/ktx2TestImages/arraytex_1_reference_u.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] arraytex_7_mipmap_reference_u",
//           "path": "../../../assets/ktx2TestImages/arraytex_7_mipmap_reference_u.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] arraytex_7_reference_u",
//           "path": "../../../assets/ktx2TestImages/arraytex_7_reference_u.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] astc_ldr_6x6_3dtex_7",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x6_3dtex_7.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] astc_ldr_6x6_arraytex_7_mipmap",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7_mipmap.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] astc_ldr_6x6_arraytex_7",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_6x6_arraytex_7.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] astc_ldr_cubemap_6x6",
//           "path": "../../../assets/ktx2TestImages/astc_ldr_cubemap_6x6.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] astc_mipmap_ldr_cubemap_6x6",
//           "path": "../../../assets/ktx2TestImages/astc_mipmap_ldr_cubemap_6x6.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] cubemap_goldengate_uastc_rdo4_zstd5_rd",
//           "path": "../../../assets/ktx2TestImages/cubemap_goldengate_uastc_rdo4_zstd5_rd.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] cubemap_yokohama_basis_rd",
//           "path": "../../../assets/ktx2TestImages/cubemap_yokohama_basis_rd.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] skybox_zstd",
//           "path": "../../../assets/ktx2TestImages/skybox_zstd.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] skybox",
//           "path": "../../../assets/ktx2TestImages/skybox.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] texturearray_astc_8x8_unorm",
//           "path": "../../../assets/ktx2TestImages/texturearray_astc_8x8_unorm.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] texturearray_bc3_unorm",
//           "path": "../../../assets/ktx2TestImages/texturearray_bc3_unorm.ktx2"
// },
// {
//           "name": "[4.최심화 3D/Array/Cube] texturearray_etc2_unorm",
//           "path": "../../../assets/ktx2TestImages/texturearray_etc2_unorm.ktx2"
// }
        ];

        // XY 수직 평면 그리드 배치 (6열 x 3행)
        const cols = 6;
        const totalRows = Math.ceil(testKTX2Files.length / cols);
        const spacingX = 5.0;
        const spacingY = 5.0;
        const geometry = new RedGPU.Primitive.Plane(redGPUContext, 2.5, 2.5);

        testKTX2Files.forEach((item, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;

            const posX = (col - (cols - 1) / 2) * spacingX;
            const posY = ((totalRows - 1) / 2 - row) * spacingY;

            try {
                const fileName = item.path.split('/').pop();

                // 텍스처 하단 표기용 TextField3D 생성
                const labelField = new RedGPU.Display.TextField3D(redGPUContext);
                labelField.useBillboard = true;
                labelField.fontSize = 28;
                labelField.color = '#ffffff';
                labelField.setPosition(posX, posY - 1.9, 0.1);
                labelField.text = `<div style="text-align:center; padding: 6px 12px; background: rgba(0,0,0,0.7); border-radius: 6px; font-size: 22px;"><b>${fileName}</b><br/><span style="color:#ffc107; font-size: 18px;">⏳ Loading...</span></div>`;
                scene.addChild(labelField);

                const updateStatusText = (tex) => {
                    const targetTexture = tex || texture;
                    const gpuTex = targetTexture ? targetTexture.gpuTexture : null;
                    const fmt = gpuTex ? gpuTex.format : 'unknown';
                    const w = gpuTex ? gpuTex.width : 0;
                    const h = gpuTex ? gpuTex.height : 0;
                    const isFallback = gpuTex && gpuTex.label && gpuTex.label.includes('fallback');

                    if (isFallback) {
                        labelField.text = `<div style="text-align:center; padding: 6px 12px; background: rgba(0,0,0,0.7); border-radius: 6px; font-size: 22px;"><b>${fileName}</b><br/><span style="color:#ff9800; font-size: 18px;">⚠️ Fallback (GPU Feature Missing)</span></div>`;
                    } else {
                        labelField.text = `<div style="text-align:center; padding: 6px 12px; background: rgba(0,0,0,0.7); border-radius: 6px; font-size: 22px;"><b>${fileName}</b><br/><span style="color:#4caf50; font-size: 18px;">✅ SUCCESS</span><br/><span style="color:#ddd; font-size: 18px; font-weight: bold;">(${fmt}, ${w}x${h})</span></div>`;
                    }
                };

                const texture = new RedGPU.Resource.BitmapTexture(
                    redGPUContext,
                    item.path,
                    true,
                    (tex) => updateStatusText(tex),
                    (err) => {
                        labelField.text = `<div style="text-align:center; padding: 6px 12px; background: rgba(0,0,0,0.7); border-radius: 6px; font-size: 22px;"><b>${fileName}</b><br/><span style="color:#f44336; font-size: 18px;">❌ LOAD FAILED</span></div>`;
                    }
                );

                const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
                mesh.setPosition(posX, posY, 0); // XY 평면 정렬
                mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;

                scene.addChild(mesh);

            } catch (e) {
                console.error('Error creating texture:', item.name, e);
            }
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        new RedGPUExampleHelper(redGPUContext, {
            gui: (pane) => {
                const folder = pane.addFolder({title: 'KTX2 Formats (초급만 활성화)'});
                folder.addBinding({count: testKTX2Files.length}, 'count', {readonly: true, label: 'Active Files'});
            }
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
