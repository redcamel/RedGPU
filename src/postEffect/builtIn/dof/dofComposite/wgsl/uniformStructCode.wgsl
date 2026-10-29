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
    let safeCoord = clamp(coord, vec2<i32>(0), maxCoord);
    let uv = (vec2<f32>(safeCoord) + 0.5) * invFullDims;
    let currRawDepth = textureLoad(depthTexture, safeCoord, 0);
    let minNearDepth = max(systemUniforms.camera.nearClipping, 0.001);
    return max(minNearDepth, -getViewPositionFromDepth(uv, currRawDepth, invProj).z);
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
