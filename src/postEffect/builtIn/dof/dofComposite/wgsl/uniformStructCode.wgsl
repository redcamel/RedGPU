#redgpu_include math.reconstruct.getViewPositionFromDepth

struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    focalLength: f32,
    sensorSize: f32,
    maxCoC: f32,
};

const SLIGHT_DOF_OFFSETS = array<vec2<f32>, 8>(
    vec2<f32>(0.7071, 0.7071),
    vec2<f32>(-0.7071, 0.7071),
    vec2<f32>(-0.7071, -0.7071),
    vec2<f32>(0.7071, -0.7071),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(-1.0, 0.0),
    vec2<f32>(0.0, -1.0)
);

fn reconstructViewDepth(coord: vec2<i32>, invFullDims: vec2<f32>, invProj: mat4x4<f32>) -> f32 {
    let uv = (vec2<f32>(coord) + 0.5) * invFullDims;
    let rawDepth = textureLoad(depthTexture, coord, 0);
    let viewPos = getViewPositionFromDepth(uv, rawDepth, invProj);
    return max(0.001, -viewPos.z);
}

fn calculatePhysicalHalfCoC(viewDepth: f32, halfScreenHeight: f32, maxHalfCoC: f32) -> f32 {
    let safeAperture = max(uniforms.aperture, 0.1);
    let safeFocalLength = max(uniforms.focalLength, 1.0);
    let safeSensorSize = max(uniforms.sensorSize, 1.0);
    let focusDistMM = max(uniforms.focusDistance * 1000.0, safeFocalLength + 1.0);
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
