struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    focalLength: f32,
    useAutoFocus: u32,
    historyValid: u32,
    pad0: u32, // 16-byte tail alignment
    pad1: u32,
    pad2: u32,
};

fn samplePhysicalHalfCoCAtDepthCoord(
    safeDepthCoord: vec2<i32>,
    invProjZW: vec4<f32>,
    minNearDepth: f32,
    lensParams: DOFCoCLensParams,
    maxHalfCoC: f32
) -> f32 {
    let rawDepth = textureLoad(depthTexture, safeDepthCoord, 0);
    let viewDepth = reconstructViewDepthFromRaw(rawDepth, invProjZW, minNearDepth);
    return evaluatePhysicalHalfCoC(viewDepth, lensParams, maxHalfCoC);
}
