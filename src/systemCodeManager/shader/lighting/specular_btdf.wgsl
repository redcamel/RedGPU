#redgpu_include lighting.distribution_ggx
#redgpu_include lighting.fresnel_schlick
#redgpu_include math.EPSILON

/**
 * [KO] 미세면(Microfacet) 모델 기반의 스펙큘러 BTDF를 계산합니다. (굴절 및 투과)
 * [EN] Calculates Specular BTDF based on the microfacet model. (Refraction and Transmission)
 *
 * [KO] 하이라이트의 정밀도와 수치적 안정성을 위해 분모 계산식을 최적화하였습니다.
 * [EN] Optimized the denominator calculation for better highlight precision and numerical stability.
 *
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
 * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
 * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 (프레넬용) [EN] Dot product of light direction and half vector (for Fresnel)
 * @param roughness - [KO] 표면 거칠기 [EN] Surface roughness
 * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
 * @param ior - [KO] 굴절률 [EN] Index of refraction
 * @returns [KO] 계산된 스펙큘러 BTDF 값 [EN] Calculated specular BTDF value
 */
fn specular_btdf(
    NdotV: f32,
    NdotL: f32,
    NdotH: f32,
    VdotH: f32,
    LdotH: f32,
    roughness: f32,
    F0: vec3<f32>,
    ior: f32
) -> vec3<f32> {
    let eta: f32 = 1.0 / ior;

    // 1. D (Distribution) 계산
    let D_rough: f32 = distribution_ggx(NdotH, roughness);
    let t: f32 = clamp((ior - 1.0) * 100.0, 0.0, 1.0);
    let D: f32 = mix(1.0, D_rough, t);

    // 2. G (Geometric) 계산
    let G: f32 = min(1.0, min((2.0 * NdotH * NdotV) / VdotH, (2.0 * NdotH * NdotL) / VdotH));

    // 3. F (Fresnel) 계산
    let F: vec3<f32> = fresnel_schlick(VdotH, F0);

    let denom = (eta * VdotH + LdotH) * (eta * VdotH + LdotH);

    // 4. BTDF 공식 적용
    // [KO] 분모에 시스템 표준 EPSILON을 적용하여 일관된 정밀도 유지
    // [EN] Applies the system standard EPSILON to the denominator for consistent precision.
    let btdf: vec3<f32> =
        (vec3<f32>(1.0) - F) *
        abs(VdotH * LdotH) *
        (eta * eta) *
        D *
        G /
        (max(NdotV, EPSILON) * max(denom, EPSILON));

    return btdf;
}
