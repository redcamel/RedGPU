// [KO] 35mm 풀프레임 표준 세로 센서 높이(24.0mm), 5-Ring + Mip 2(1/8) 나이퀴스트 샘플링 한계 기반 최대 착란원 반경(36.0px), 및 유효 화면 공간 모션 벡터 UV 상한(2.0)
// [EN] 35mm full-frame standard vertical sensor height (24.0mm), 5-Ring + Mip 2 (1/8) Nyquist-safe maximum CoC radius (36.0px), and valid screen-space motion vector UV bound (2.0)
const DOF_SENSOR_HEIGHT_MM: f32 = 24.0;
const DOF_MAX_COC_FULL_PX: f32 = 36.0;
const DOF_MAX_VALID_MOTION_UV: f32 = 2.0;

struct DOFCoCLensParams {
    focusDistMM: f32,
    cocScale: f32,
};

// [KO] 디스플레이 DPR 및 5-Ring + Mip 2 커널 대역폭에 기반한 절반 해상도 최대 착란원 반경(maxHalfCoC) 자동 산출
// [EN] Automatically compute maximum half-resolution CoC radius (maxHalfCoC) from display DPR and 5-Ring + Mip 2 kernel budget
fn computeAutoMaxHalfCoC(devicePixelRatio: f32) -> f32 {
    let dpr = clamp(devicePixelRatio, 1.0, 2.0);
    return 0.5 * DOF_MAX_COC_FULL_PX * dpr;
}

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

// [KO] 35mm 풀프레임 센서(24mm) 기준 기하광학 Thin-Lens 공식의 픽셀 불변 렌즈 비례 계수(cocScale) 및 초점 거리(mm) 사전 산출
// [EN] Precompute thread-invariant geometric Thin-Lens CoC scale factor (cocScale) and focus distance (mm) for a 35mm full-frame sensor (24mm)
fn computeDOFCoCLensParams(
    aperture: f32,
    focalLength: f32,
    effectiveFocusDistance: f32,
    halfScreenHeight: f32
) -> DOFCoCLensParams {
    let safeAperture = max(aperture, 0.1);
    let safeFocalLength = max(focalLength, 1.0);
    let focusDistMM = max(effectiveFocusDistance * 1000.0, safeFocalLength + 1.0);
    let cocScale = (0.5 * halfScreenHeight * safeFocalLength * safeFocalLength) / (safeAperture * (focusDistMM - safeFocalLength) * DOF_SENSOR_HEIGHT_MM);
    return DOFCoCLensParams(focusDistMM, cocScale);
}

// [KO] 사전 산출된 렌즈 파라미터(DOFCoCLensParams)로부터 절반 해상도 텍셀 단위 착란원 반경 산출
// [EN] Evaluate half-resolution texel Circle of Confusion radius from precomputed DOFCoCLensParams
fn evaluatePhysicalHalfCoC(viewDepth: f32, lensParams: DOFCoCLensParams, maxHalfCoC: f32) -> f32 {
    let depthMM = max(viewDepth * 1000.0, 1.0);
    let halfRadiusTexels = lensParams.cocScale * ((depthMM - lensParams.focusDistMM) / depthMM);
    return clamp(halfRadiusTexels, -maxHalfCoC, maxHalfCoC);
}
