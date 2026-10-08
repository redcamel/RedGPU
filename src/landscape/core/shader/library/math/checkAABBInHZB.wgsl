// ============================================================================
// RedGPU Landscape & Foliage Unified HZB Occlusion Culling Math
// - Projects 3D world AABB 8 corners to NDC & calculates screen-space bounding rect
// - Conservative 4-tap HZB pyramid depth testing with distance-adaptive safety bias
// ============================================================================

fn checkAABBInHZB(
    minPos: vec3<f32>,
    maxPos: vec3<f32>,
    viewProjectionMatrix: mat4x4<f32>,
    hzbTexture: texture_2d<f32>,
    hzbSampler: sampler,
    depthBias: f32
) -> bool {
    var minNDC = vec2<f32>(1.0, 1.0);
    var maxNDC = vec2<f32>(-1.0, -1.0);
    var minDepth = 1.0;
    var allBehindNearPlane = true;

    let corners = array<vec3<f32>, 8>(
        vec3<f32>(minPos.x, minPos.y, minPos.z),
        vec3<f32>(maxPos.x, minPos.y, minPos.z),
        vec3<f32>(minPos.x, maxPos.y, minPos.z),
        vec3<f32>(maxPos.x, maxPos.y, minPos.z),
        vec3<f32>(minPos.x, minPos.y, maxPos.z),
        vec3<f32>(maxPos.x, minPos.y, maxPos.z),
        vec3<f32>(minPos.x, maxPos.y, maxPos.z),
        vec3<f32>(maxPos.x, maxPos.y, maxPos.z),
    );

    for (var i = 0; i < 8; i = i + 1) {
        let clip = viewProjectionMatrix * vec4<f32>(corners[i], 1.0);
        if (clip.w > 0.01) {
            allBehindNearPlane = false;
            let invW = 1.0 / clip.w;
            let ndc = clip.xy * invW;
            let d = clip.z * invW;
            minNDC = min(minNDC, ndc);
            maxNDC = max(maxNDC, ndc);
            minDepth = min(minDepth, d);
        } else {
            // Near-plane clipping fallback (ensure visibility if intersecting or behind near plane)
            return true;
        }
    }

    if (allBehindNearPlane) {
        return false;
    }

    let minUV = clamp(vec2<f32>(minNDC.x * 0.5 + 0.5, 1.0 - (maxNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));
    let maxUV = clamp(vec2<f32>(maxNDC.x * 0.5 + 0.5, 1.0 - (minNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));

    let hzbDims = vec2<f32>(textureDimensions(hzbTexture, 0));
    let aabbPixelSize = max((maxUV - minUV) * hzbDims, vec2<f32>(1.0));
    let maxDim = max(aabbPixelSize.x, aabbPixelSize.y);

    // Bypass sub-texel objects (smaller than 4 pixels) to prevent sub-pixel flickering
    if (maxDim < 4.0) {
        return true;
    }

    // Conservative mip level for 4-tap footprint avoiding over-culling
    let mipLevel = clamp(floor(log2(maxDim)), 0.0, 7.0);

    let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
    let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
    let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
    let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
    let maxHZBDepth = max(max(hzb00, hzb10), max(hzb01, hzb11));

    // Distance-adaptive safety depth bias accounting for non-linear NDC precision
    let adaptiveBias = max(depthBias, 0.003 + minDepth * 0.004);
    if (minDepth > maxHZBDepth + adaptiveBias) {
        return false;
    }

    return true;
}
