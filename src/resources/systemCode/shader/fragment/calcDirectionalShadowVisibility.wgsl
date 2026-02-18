fn calcDirectionalShadowVisibility(
   directionalShadowMap: texture_depth_2d,
   directionalShadowMapSampler: sampler_comparison,
   shadowDepthTextureSize: u32,
   bias: f32,
   shadowCoord: vec3<f32>
) -> f32 {
    let oneOverShadowDepthTextureSize = 1.0 / f32(shadowDepthTextureSize);
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);

    var visibility: f32 = 0.0;

    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let offset = vec2f(vec2(x, y)) * oneOverShadowDepthTextureSize;
            let tUV = shadowCoord.xy + offset;

            let sampleVisibility = textureSampleCompare(
                directionalShadowMap,
                directionalShadowMapSampler,
                tUV,
                shadowDepth - bias
            );

            if (tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0) {
                visibility += 1.0;
            } else {
                visibility += sampleVisibility;
            }
        }
    }

    visibility /= 9.0;

    let depthFactor = shadowDepth;

    let minVisibility = 0.2 + depthFactor * 0.6;

    return max(visibility, minVisibility);
}
