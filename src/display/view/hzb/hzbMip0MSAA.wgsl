// ============================================================================
// 🌿 HZB (Hierarchical Z-Buffer) Conservative Downsampler - Mip 0 (MSAA 4x)
// Standard-Z: 0.0 (Near) ~ 1.0 (Far)
// 보수적 오클루전(Conservative Occlusion): 2x2 텍셀 x 4개 서브샘플 중 가장 먼 깊이(Max Depth) 선택
// ============================================================================

struct HZBMipParams {
    srcMipDimensions: vec2<u32>,
    dstMipDimensions: vec2<u32>,
};

// ----------------------------------------------------------------------------
// 1. Mip 0 생성 셰이더 (MSAA 4x Depth Texture -> HZB Mip 0 텍스처)
// ----------------------------------------------------------------------------
@group(0) @binding(0) var srcDepthTextureMSAA: texture_depth_multisampled_2d;
@group(0) @binding(1) var dstHZBTextureMip0: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> mipParamsMip0: HZBMipParams;

@compute @workgroup_size(8, 8)
fn mainMip0MSAA(@builtin(global_invocation_id) global_id: vec3<u32>) {
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

    var maxDepth = 0.0;

    // 4x MSAA: 4개 서브샘플 x 2x2 텍셀(총 16개 샘플)에 대해 보수적 Max Depth 추출
    for (var s = 0; s < 4; s++) {
        let d00 = textureLoad(srcDepthTextureMSAA, c00, s);
        let d10 = textureLoad(srcDepthTextureMSAA, c10, s);
        let d01 = textureLoad(srcDepthTextureMSAA, c01, s);
        let d11 = textureLoad(srcDepthTextureMSAA, c11, s);
        maxDepth = max(maxDepth, max(max(d00, d10), max(d01, d11)));
    }

    textureStore(dstHZBTextureMip0, vec2<i32>(dstCoord), vec4<f32>(maxDepth, 0.0, 0.0, 1.0));
}
