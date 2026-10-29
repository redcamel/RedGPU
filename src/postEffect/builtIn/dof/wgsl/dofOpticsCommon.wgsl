struct DOFCoCLensParams {
    focusDistMM: f32,
    cocScale: f32,
};

// [KO] 원근(TAA 지터 포함) 및 직교 역투영 행렬에서 뷰 깊이(Z/W) 복원에 필요한 3·4열 Z/W 계수만 추출 (invProj[0..1].zw === 0 항등 이용)
// [EN] Extract Z/W coefficients of columns 2 and 3 from perspective (including TAA jitter) or orthographic inverse projection matrix (using invProj[0..1].zw === 0 identity)
fn extractInvProjZW(invProj: mat4x4<f32>) -> vec4<f32> {
    return vec4<f32>(invProj[2].z, invProj[3].z, invProj[2].w, invProj[3].w);
}

// [KO] 원시 깊이(rawDepth in [0, 1])로부터 정확한 선형 뷰 공간 거리(-viewPos.z)를 2 FMA + 1 DIV로 복원
// [EN] Reconstruct exact linear view-space depth (-viewPos.z) from rawDepth in [0, 1] using 2 FMAs + 1 DIV
fn reconstructViewDepthFromRaw(rawDepth: f32, invProjZW: vec4<f32>, minNearDepth: f32) -> f32 {
    let viewZ = -(invProjZW.x * rawDepth + invProjZW.y) / (invProjZW.z * rawDepth + invProjZW.w);
    return max(minNearDepth, viewZ);
}

// [KO] 기하광학 Thin-Lens 공식의 픽셀 불변 렌즈 비례 계수(cocScale) 및 초점 거리(mm) 사전 산출
// [EN] Precompute thread-invariant geometric Thin-Lens CoC scale factor (cocScale) and focus distance (mm)
fn computeDOFCoCLensParams(
    aperture: f32,
    focalLength: f32,
    sensorSize: f32,
    effectiveFocusDistance: f32,
    halfScreenHeight: f32
) -> DOFCoCLensParams {
    let safeAperture = max(aperture, 0.1);
    let safeFocalLength = max(focalLength, 1.0);
    let safeSensorSize = max(sensorSize, 1.0);
    let focusDistMM = max(effectiveFocusDistance * 1000.0, safeFocalLength + 1.0);
    let cocScale = (0.5 * halfScreenHeight * safeFocalLength * safeFocalLength) / (safeAperture * (focusDistMM - safeFocalLength) * safeSensorSize);
    return DOFCoCLensParams(focusDistMM, cocScale);
}

// [KO] 사전 산출된 렌즈 파라미터(DOFCoCLensParams)로부터 절반 해상도 텍셀 단위 착란원 반경 산출
// [EN] Evaluate half-resolution texel Circle of Confusion radius from precomputed DOFCoCLensParams
fn evaluatePhysicalHalfCoC(viewDepth: f32, lensParams: DOFCoCLensParams, maxHalfCoC: f32) -> f32 {
    let depthMM = max(viewDepth * 1000.0, 1.0);
    let halfRadiusTexels = lensParams.cocScale * ((depthMM - lensParams.focusDistMM) / depthMM);
    return clamp(halfRadiusTexels, -maxHalfCoC, maxHalfCoC);
}
