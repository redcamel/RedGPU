const SSS_DISTORTION: f32 = 0.35;
const NORM_225: f32 = 0.44444445;

fn filterGrassAlpha(baseTex: vec4<f32>, alphaFade: f32) -> f32 {
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    return sourceAlpha * alphaFade;
}

fn blendGrassGroundColor(
    baseColor: vec3<f32>,
    exposureBoost: f32,
    hasGroundTexture: u32,
    groundBlendStrength: f32,
    heightRatio: f32,
    groundColor: vec3<f32>
) -> vec3<f32> {
    let boost = max(0.1, exposureBoost);
    var albedo = baseColor * boost;
    if (hasGroundTexture != 0u && groundBlendStrength > 0.01) {
        let blendFactor = clamp((0.40 - heightRatio) * 2.5, 0.0, 1.0) * groundBlendStrength;
        albedo = mix(albedo, groundColor, blendFactor);
    }
    return albedo;
}

fn computeGrassUpwardNormal(vertexNormal: vec3<f32>, heightRatio: f32) -> vec3<f32> {
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, heightRatio);
    return normalize(mix(vertexNormal, upVec, upwardBlend));
}

fn computeGrassSkyOcclusion(heightRatio: f32) -> f32 {
    return mix(0.65, 1.0, clamp(heightRatio * 1.43, 0.0, 1.0));
}

fn computeGrassContactAO(heightRatio: f32) -> f32 {
    return mix(0.40, 1.0, clamp(heightRatio * 4.0, 0.0, 1.0));
}
