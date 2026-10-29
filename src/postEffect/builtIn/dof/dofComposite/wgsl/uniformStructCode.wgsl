#redgpu_include math.reconstruct.getViewPositionFromDepth

struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    focalLength: f32,
    sensorSize: f32,
    maxCoC: f32,
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

fn reconstructViewDepth(coord: vec2<i32>, invFullDims: vec2<f32>, invProj: mat4x4<f32>) -> f32 {
    let maxCoord = max(vec2<i32>(textureDimensions(depthTexture)) - vec2<i32>(1), vec2<i32>(0));
    let ndcJitter = systemUniforms.projection.projectionMatrix[2].xy - systemUniforms.projection.noneJitterProjectionMatrix[2].xy;
    let jitterUV = vec2<f32>(-0.5 * ndcJitter.x, 0.5 * ndcJitter.y);
    let jitterPix = jitterUV / max(invFullDims, vec2<f32>(1e-6));
    let hasJitter = (abs(jitterPix.x) + abs(jitterPix.y)) > 1e-3;
    let stepDir = select(vec2<i32>(0), vec2<i32>(sign(jitterPix)), hasJitter);

    let c00 = clamp(coord, vec2<i32>(0), maxCoord);
    let c10 = clamp(coord + vec2<i32>(stepDir.x, 0), vec2<i32>(0), maxCoord);
    let c01 = clamp(coord + vec2<i32>(0, stepDir.y), vec2<i32>(0), maxCoord);
    let d00 = textureLoad(depthTexture, c00, 0);
    let d10 = textureLoad(depthTexture, c10, 0);
    let d01 = textureLoad(depthTexture, c01, 0);
    let rawDepth = min(d00, min(d10, d01));

    let uv = clamp((vec2<f32>(c00) + 0.5) * invFullDims + jitterUV, vec2<f32>(0.0), vec2<f32>(1.0));
    let viewPos = getViewPositionFromDepth(uv, rawDepth, invProj);
    let minNearDepth = max(systemUniforms.camera.nearClipping, 0.001);
    return max(minNearDepth, -viewPos.z);
}

fn calculatePhysicalHalfCoC(viewDepth: f32, halfScreenHeight: f32, maxHalfCoC: f32, effectiveFocusDistance: f32) -> f32 {
    let safeAperture = max(uniforms.aperture, 0.1);
    let safeFocalLength = max(uniforms.focalLength, 1.0);
    let safeSensorSize = max(uniforms.sensorSize, 1.0);
    let focusDistMM = max(effectiveFocusDistance * 1000.0, safeFocalLength + 1.0);
    let depthMM = max(viewDepth * 1000.0, 1.0);

    let cocDiameterMM = (safeFocalLength * safeFocalLength) / (safeAperture * (focusDistMM - safeFocalLength)) * ((depthMM - focusDistMM) / depthMM);
    let halfRadiusTexels = 0.5 * (cocDiameterMM / safeSensorSize) * halfScreenHeight;
    return clamp(halfRadiusTexels, -maxHalfCoC, maxHalfCoC);
}

fn computeBgUpsampleBilateralWeight(sampleFarCoC: f32, exactHalfCoC: f32, tentWeight: f32) -> f32 {
    let centerSharpClamp = clamp(abs(exactHalfCoC), 0.0, 1.5);
    let sampleSharpClamp = clamp(sampleFarCoC, 0.0, 1.5);
    let focusBoundaryDiff = abs(sampleSharpClamp - centerSharpClamp);
    return tentWeight / (0.1 + focusBoundaryDiff * 6.0);
}
