// ============================================================================
// 🌿 HZB (Hierarchical Z-Buffer) Conservative Downsampler
// Standard-Z: 0.0 (Near) ~ 1.0 (Far)
// 보수적 오클루전(Conservative Occlusion): 2x2 텍셀 중 가장 먼 깊이(Max Depth) 선택
// ============================================================================

struct HZBMipParams {
    srcMipDimensions: vec2<u32>,
    dstMipDimensions: vec2<u32>,
};

// ----------------------------------------------------------------------------
// 1. Mip 0 생성 셰이더 (Depth Texture -> HZB Mip 0 텍스처)
// ----------------------------------------------------------------------------
@group(0) @binding(0) var srcDepthTexture: texture_depth_2d;
@group(0) @binding(1) var dstHZBTextureMip0: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> mipParamsMip0: HZBMipParams;

@compute @workgroup_size(8, 8)
fn mainMip0(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dstCoord = global_id.xy;
    if (dstCoord.x >= mipParamsMip0.dstMipDimensions.x || dstCoord.y >= mipParamsMip0.dstMipDimensions.y) {
        return;
    }

    let srcDim = mipParamsMip0.srcMipDimensions;
    let dstDim = mipParamsMip0.dstMipDimensions;

    // 소스 뎁스 텍스처 좌표 매핑 (보수적 2x2 또는 비율 샘플링)
    let scale = vec2<f32>(srcDim) / vec2<f32>(dstDim);
    let baseSrcX = u32(f32(dstCoord.x) * scale.x);
    let baseSrcY = u32(f32(dstCoord.y) * scale.y);

    let maxSrcX = srcDim.x - 1u;
    let maxSrcY = srcDim.y - 1u;

    let c00 = vec2<i32>(i32(min(baseSrcX, maxSrcX)), i32(min(baseSrcY, maxSrcY)));
    let c10 = vec2<i32>(i32(min(baseSrcX + 1u, maxSrcX)), i32(min(baseSrcY, maxSrcY)));
    let c01 = vec2<i32>(i32(min(baseSrcX, maxSrcX)), i32(min(baseSrcY + 1u, maxSrcY)));
    let c11 = vec2<i32>(i32(min(baseSrcX + 1u, maxSrcX)), i32(min(baseSrcY + 1u, maxSrcY)));

    let d00 = textureLoad(srcDepthTexture, c00, 0);
    let d10 = textureLoad(srcDepthTexture, c10, 0);
    let d01 = textureLoad(srcDepthTexture, c01, 0);
    let d11 = textureLoad(srcDepthTexture, c11, 0);

    let maxDepth = max(max(d00, d10), max(d01, d11));
    textureStore(dstHZBTextureMip0, vec2<i32>(dstCoord), vec4<f32>(maxDepth, 0.0, 0.0, 1.0));
}

// ----------------------------------------------------------------------------
// 2. SPD Stage 1: Mip 1 ~ Mip 5 단일 패스 LDS 계층 축약 (Single-Pass Downsampler)
// 16x16 워크그룹(256스레드)이 Mip 0(512x256)을 읽어 온칩 SRAM에서 Mip 1~5 동시 생성
// ----------------------------------------------------------------------------
@group(0) @binding(0) var srcHZBMip0Texture: texture_2d<f32>;
@group(0) @binding(1) var dstHZBMip1: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var dstHZBMip2: texture_storage_2d<r32float, write>;
@group(0) @binding(3) var dstHZBMip3: texture_storage_2d<r32float, write>;
@group(0) @binding(4) var dstHZBMip4: texture_storage_2d<r32float, write>;
@group(0) @binding(5) var dstHZBMip5: texture_storage_2d<r32float, write>;

// 🚀 [온칩 16x16 초고속 SRAM (총 1.0 KB)]
var<workgroup> s_depth: array<array<f32, 16>, 16>;

@compute @workgroup_size(16, 16)
fn mainDownsampleSPD5(
    @builtin(workgroup_id) workgroup_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let lx = local_id.x;
    let ly = local_id.y;

    // 1단계: Mip 0 -> Mip 1 (256x128) 생성 및 온칩 SRAM 적재
    let baseSrc = (workgroup_id.xy * 16u + local_id.xy) * 2u;
    let d00 = textureLoad(srcHZBMip0Texture, vec2<i32>(baseSrc), 0).r;
    let d10 = textureLoad(srcHZBMip0Texture, vec2<i32>(baseSrc + vec2<u32>(1u, 0u)), 0).r;
    let d01 = textureLoad(srcHZBMip0Texture, vec2<i32>(baseSrc + vec2<u32>(0u, 1u)), 0).r;
    let d11 = textureLoad(srcHZBMip0Texture, vec2<i32>(baseSrc + vec2<u32>(1u, 1u)), 0).r;

    let m1 = max(max(d00, d10), max(d01, d11));
    s_depth[ly][lx] = m1;
    let dstCoord1 = workgroup_id.xy * 16u + local_id.xy;
    textureStore(dstHZBMip1, vec2<i32>(dstCoord1), vec4<f32>(m1, 0.0, 0.0, 1.0));

    workgroupBarrier();

    // 2단계: Mip 1 -> Mip 2 (128x64) 온칩 축약 (8x8 스레드 참여)
    if (lx < 8u && ly < 8u) {
        let sx = lx * 2u;
        let sy = ly * 2u;
        let m2 = max(max(s_depth[sy][sx], s_depth[sy][sx + 1u]), max(s_depth[sy + 1u][sx], s_depth[sy + 1u][sx + 1u]));
        s_depth[ly][lx] = m2;
        let dstCoord2 = workgroup_id.xy * 8u + local_id.xy;
        textureStore(dstHZBMip2, vec2<i32>(dstCoord2), vec4<f32>(m2, 0.0, 0.0, 1.0));
    }

    workgroupBarrier();

    // 3단계: Mip 2 -> Mip 3 (64x32) 온칩 축약 (4x4 스레드 참여)
    if (lx < 4u && ly < 4u) {
        let sx = lx * 2u;
        let sy = ly * 2u;
        let m3 = max(max(s_depth[sy][sx], s_depth[sy][sx + 1u]), max(s_depth[sy + 1u][sx], s_depth[sy + 1u][sx + 1u]));
        s_depth[ly][lx] = m3;
        let dstCoord3 = workgroup_id.xy * 4u + local_id.xy;
        textureStore(dstHZBMip3, vec2<i32>(dstCoord3), vec4<f32>(m3, 0.0, 0.0, 1.0));
    }

    workgroupBarrier();

    // 4단계: Mip 3 -> Mip 4 (32x16) 온칩 축약 (2x2 스레드 참여)
    if (lx < 2u && ly < 2u) {
        let sx = lx * 2u;
        let sy = ly * 2u;
        let m4 = max(max(s_depth[sy][sx], s_depth[sy][sx + 1u]), max(s_depth[sy + 1u][sx], s_depth[sy + 1u][sx + 1u]));
        s_depth[ly][lx] = m4;
        let dstCoord4 = workgroup_id.xy * 2u + local_id.xy;
        textureStore(dstHZBMip4, vec2<i32>(dstCoord4), vec4<f32>(m4, 0.0, 0.0, 1.0));
    }

    workgroupBarrier();

    // 5단계: Mip 4 -> Mip 5 (16x8) 온칩 축약 (1x1 스레드 참여)
    if (lx == 0u && ly == 0u) {
        let m5 = max(max(s_depth[0][0], s_depth[0][1]), max(s_depth[1][0], s_depth[1][1]));
        textureStore(dstHZBMip5, vec2<i32>(workgroup_id.xy), vec4<f32>(m5, 0.0, 0.0, 1.0));
    }
}

// ----------------------------------------------------------------------------
// 3. SPD Stage 2: Mip 5 -> Mip 6 (8x4), Mip 7 (4x2) 최종 온칩 축약
// 8x4 워크그룹(32스레드) 1개가 Mip 5(16x8)를 읽어 Mip 6, Mip 7을 1패스로 생성
// ----------------------------------------------------------------------------
@group(0) @binding(0) var srcHZBMip5Texture: texture_2d<f32>;
@group(0) @binding(1) var dstHZBMip6: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var dstHZBMip7: texture_storage_2d<r32float, write>;

// 🚀 [온칩 8x4 초고속 SRAM (총 128 Bytes)]
var<workgroup> s_tailDepth: array<array<f32, 8>, 4>;

@compute @workgroup_size(8, 4)
fn mainDownsampleTail(
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let lx = local_id.x;
    let ly = local_id.y;

    // 1단계: Mip 5 -> Mip 6 (8x4) 생성 및 온칩 SRAM 적재
    let baseSrc = local_id.xy * 2u;
    let d00 = textureLoad(srcHZBMip5Texture, vec2<i32>(baseSrc), 0).r;
    let d10 = textureLoad(srcHZBMip5Texture, vec2<i32>(baseSrc + vec2<u32>(1u, 0u)), 0).r;
    let d01 = textureLoad(srcHZBMip5Texture, vec2<i32>(baseSrc + vec2<u32>(0u, 1u)), 0).r;
    let d11 = textureLoad(srcHZBMip5Texture, vec2<i32>(baseSrc + vec2<u32>(1u, 1u)), 0).r;

    let m6 = max(max(d00, d10), max(d01, d11));
    s_tailDepth[ly][lx] = m6;
    textureStore(dstHZBMip6, vec2<i32>(local_id.xy), vec4<f32>(m6, 0.0, 0.0, 1.0));

    workgroupBarrier();

    // 2단계: Mip 6 -> Mip 7 (4x2) 온칩 축약 (4x2 스레드 참여)
    if (lx < 4u && ly < 2u) {
        let sx = lx * 2u;
        let sy = ly * 2u;
        let m7 = max(max(s_tailDepth[sy][sx], s_tailDepth[sy][sx + 1u]), max(s_tailDepth[sy + 1u][sx], s_tailDepth[sy + 1u][sx + 1u]));
        textureStore(dstHZBMip7, vec2<i32>(local_id.xy), vec4<f32>(m7, 0.0, 0.0, 1.0));
    }
}
