fn calcDirectionalShadowVisibility(
   directionalShadowMap:texture_depth_2d,
   directionalShadowMapSampler:sampler_comparison,
   directionalLightShadowDepthTextureSize:u32,
   directionalLightShadowBias:f32,
   shadowPos:vec3<f32>
) -> f32 {
    let oneOverShadowDepthTextureSize = 1.0 / f32(directionalLightShadowDepthTextureSize);
    let shadowDepth = clamp(shadowPos.z, 0.0, 1.0);
    var visibility:f32 = 0.0;
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let offset = vec2f(vec2(x, y)) * oneOverShadowDepthTextureSize;
            var tUV:vec2<f32> = shadowPos.xy + offset;
            var sampleVisibility = textureSampleCompare(
                 directionalShadowMap,
                 directionalShadowMapSampler,
                 tUV,
                 shadowDepth - directionalLightShadowBias
             );

            if (tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0) {
                visibility += 1.0;
            } else {
                visibility += sampleVisibility;
            }
        }
    }
    visibility /= 9.0;
    return visibility;
}
