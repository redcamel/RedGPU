struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    focalLength: f32,
    useAutoFocus: u32,
};

const INV_SQRT2: f32 = 1.0 / sqrt(2.0);

const SLIGHT_DOF_OFFSETS = array<vec2<f32>, 8>(
    vec2<f32>(INV_SQRT2, INV_SQRT2),
    vec2<f32>(-INV_SQRT2, INV_SQRT2),
    vec2<f32>(-INV_SQRT2, -INV_SQRT2),
    vec2<f32>(INV_SQRT2, -INV_SQRT2),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(-1.0, 0.0),
    vec2<f32>(0.0, -1.0)
);

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

fn computeBgUpsampleBilateralWeight(sampleFarCoC: f32, refBgHalfCoC: f32, bilateralScale: f32, tentWeight: f32) -> f32 {
    let cocDiff = abs(sampleFarCoC - refBgHalfCoC) / bilateralScale;
    return tentWeight / (1.0 + cocDiff * cocDiff);
}
