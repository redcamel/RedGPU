fn sampleNormalizedLayerWeight(
    weightTexture: texture_2d<f32>,
    landscapeSampler: sampler,
    uv: vec2<f32>,
    channelIndex: u32
) -> f32 {
    let weightSample = textureSampleLevel(weightTexture, landscapeSampler, uv, 0.0);
    let isAlphaFull = weightSample.a >= 0.99;
    let effectiveA = select(weightSample.a, saturate(1.0 - (weightSample.r + weightSample.g + weightSample.b)), isAlphaFull);
    let effectiveTotalW = weightSample.r + weightSample.g + weightSample.b + effectiveA;

    var rawW = 0.0;
    if (channelIndex == 0u) {
        rawW = weightSample.r;
    } else if (channelIndex == 1u) {
        rawW = weightSample.g;
    } else if (channelIndex == 2u) {
        rawW = weightSample.b;
    } else {
        rawW = effectiveA;
    }

    return select(rawW, rawW / effectiveTotalW, effectiveTotalW > 0.001);
}
