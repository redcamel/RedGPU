fn evaluateMipScaledAlphaCutoff(alpha: f32, ddxUV: vec2<f32>, ddyUV: vec2<f32>, baseCutOff: f32) {
    if (alpha < baseCutOff) {
        let lenSq = max(dot(ddxUV, ddxUV), dot(ddyUV, ddyUV));
        let mipLevel = max(0.0, 0.5 * log2(max(lenSq * 1048576.0, 1.0)));
        let mipAlphaScale = 1.0 + mipLevel * 0.70;
        let effectiveAlpha = alpha * mipAlphaScale;
        if (effectiveAlpha <= baseCutOff) {
            discard;
        }
    }
}
