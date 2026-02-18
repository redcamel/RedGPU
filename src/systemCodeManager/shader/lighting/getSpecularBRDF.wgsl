#redgpu_include lighting.getDistributionGGX
#redgpu_include lighting.getGeometrySmith
#redgpu_include lighting.getFresnelSchlick
#redgpu_include math.EPSILON

/**
 * [KO] Cook-Torrance 모델을 사용하여 물리 기반 스펙큘러 BRDF를 계산합니다.
 * [EN] Calculates Physically-Based Specular BRDF using the Cook-Torrance model.
 *
 * [KO] 하이라이트의 선명도와 물리적 정확성을 위해 분모의 0 나누기 방지 처리를 최적화하였습니다.
 * [EN] Optimized the denominator's division-by-zero prevention for better highlight sharpness and physical accuracy.
 *
 * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
 * @param roughness - [KO] 표면 거칠기 [EN] Surface roughness
 * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 (프레넬용) [EN] Dot product of light and half vector (for Fresnel)
 * @returns [KO] 계산된 스펙큘러 BRDF 값 [EN] Calculated specular BRDF value
 */
fn getSpecularBRDF(
    F0: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32,
    LdotH: f32
) -> vec3<f32> {
    // 1. Distribution (D)
    let D = getDistributionGGX(NdotH, roughness);

    // 2. Geometric Shadowing (G)
    let G = getGeometrySmith(NdotV, NdotL, roughness);

    // 3. Fresnel (F)
    let F = getFresnelSchlick(LdotH, F0);

    // 4. Cook-Torrance BRDF 합산
    // [KO] 분모를 시스템 표준 EPSILON을 사용하여 방어함으로써 수치적 안정성과 정밀도 확보
    // [EN] Ensures numerical stability and precision by protecting the denominator using the system standard EPSILON.
    let numerator = D * G * F;
    let denominator = 4.0 * max(NdotV, EPSILON) * max(NdotL, EPSILON);

    return numerator / denominator;
}
