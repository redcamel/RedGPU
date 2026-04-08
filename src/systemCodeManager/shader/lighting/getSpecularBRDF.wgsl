#redgpu_include lighting.getDistributionGGX
#redgpu_include lighting.getSpecularVisibility
#redgpu_include lighting.getFresnelSchlick
#redgpu_include math.EPSILON

/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] Cook-Torrance 모델을 사용하여 물리 기반 스펙큘러 BRDF를 계산합니다.
 * [EN] Calculates Physically-Based Specular BRDF using the Cook-Torrance model.
 *
 * [KO] 하이라이트의 선명도와 수치적 안정성을 위해 높이 상관(Height-Correlated) 가시성 함수를 사용합니다.
 * [EN] Uses a Height-Correlated visibility function for highlight sharpness and numerical stability.
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

    // 2. Visibility (V) - Includes Geometry term and 1/(4*NoL*NoV)
    // [KO] 기존 분리된 G와 분모 계산 방식에서 발생하는 수치적 아티팩트(십자 형태 음영 등)를 방지하기 위해 통합된 가시성 함수 사용
    // [EN] Uses an integrated visibility function to prevent numerical artifacts (such as cross-shaped shading) that occur in the separate G and denominator calculation.
    let V = getSpecularVisibility(NdotV, NdotL, roughness);

    // 3. Fresnel (F)
    let F = getFresnelSchlick(LdotH, F0);

    return D * V * F;
}
