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
// 2. Mip 1..N 다운샘플링 셰이더 (HZB Mip[K-1] -> HZB Mip[K])
// ----------------------------------------------------------------------------
@group(0) @binding(0) var srcHZBMipTexture: texture_2d<f32>;
@group(0) @binding(1) var dstHZBTargetMipTexture: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> mipParams: HZBMipParams;

@compute @workgroup_size(8, 8)
fn mainDownsample(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dstCoord = global_id.xy;
    if (dstCoord.x >= mipParams.dstMipDimensions.x || dstCoord.y >= mipParams.dstMipDimensions.y) {
        return;
    }

    let srcDim = mipParams.srcMipDimensions;
    let baseSrc = dstCoord * 2u;

    let maxSrcX = srcDim.x - 1u;
    let maxSrcY = srcDim.y - 1u;

    let c00 = vec2<i32>(i32(min(baseSrc.x, maxSrcX)), i32(min(baseSrc.y, maxSrcY)));
    let c10 = vec2<i32>(i32(min(baseSrc.x + 1u, maxSrcX)), i32(min(baseSrc.y, maxSrcY)));
    let c01 = vec2<i32>(i32(min(baseSrc.x, maxSrcX)), i32(min(baseSrc.y + 1u, maxSrcY)));
    let c11 = vec2<i32>(i32(min(baseSrc.x + 1u, maxSrcX)), i32(min(baseSrc.y + 1u, maxSrcY)));

    let d00 = textureLoad(srcHZBMipTexture, c00, 0).r;
    let d10 = textureLoad(srcHZBMipTexture, c10, 0).r;
    let d01 = textureLoad(srcHZBMipTexture, c01, 0).r;
    let d11 = textureLoad(srcHZBMipTexture, c11, 0).r;

    let maxDepth = max(max(d00, d10), max(d01, d11));
    textureStore(dstHZBTargetMipTexture, vec2<i32>(dstCoord), vec4<f32>(maxDepth, 0.0, 0.0, 1.0));
}
