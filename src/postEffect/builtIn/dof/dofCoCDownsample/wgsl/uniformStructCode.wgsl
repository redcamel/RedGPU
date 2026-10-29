#redgpu_include math.reconstruct.getViewPositionFromDepth

struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    focalLength: f32,
    sensorSize: f32,
    maxCoC: f32,
};

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

    // [KO] 기하광학 Thin-Lens 착란원 직경(mm): c_mm = (f^2 / (N * (S1 - f))) * ((S2 - S1) / S2)
    // [EN] Geometric optics Thin-Lens CoC diameter (mm): c_mm = (f^2 / (N * (S1 - f))) * ((S2 - S1) / S2)
    let cocDiameterMM = (safeFocalLength * safeFocalLength) / (safeAperture * (focusDistMM - safeFocalLength)) * ((depthMM - focusDistMM) / depthMM);

    // [KO] 센서 세로 높이(sensorSize) 대비 착란원 반경(0.5 * c_mm)을 절반 해상도 텍셀 단위 반경으로 직접 변환
    // [EN] Directly convert CoC radius (0.5 * c_mm) relative to vertical sensor height (sensorSize) into half-resolution texel radius
    let halfRadiusTexels = 0.5 * (cocDiameterMM / safeSensorSize) * halfScreenHeight;
    return clamp(halfRadiusTexels, -maxHalfCoC, maxHalfCoC);
}
