#redgpu_include math.EPSILON

/**
 * [KO] 이방성 GGX 스펙큘러 BRDF를 위한 가시성(Visibility) 항을 계산합니다.
 * [EN] Calculates the Visibility term for Anisotropic GGX specular BRDF.
 *
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param BdotV - [KO] 비탄젠트와 시선 방향의 내적 [EN] Dot product of bitangent and view direction
 * @param TdotV - [KO] 탄젠트와 시선 방향의 내적 [EN] Dot product of tangent and view direction
 * @param TdotL - [KO] 탄젠트와 광원 방향의 내적 [EN] Dot product of tangent and light direction
 * @param BdotL - [KO] 비탄젠트와 광원 방향의 내적 [EN] Dot product of bitangent and light direction
 * @param at - [KO] 탄젠트 방향의 거칠기 [EN] Roughness in the tangent direction
 * @param ab - [KO] 비탄젠트 방향의 거칠기 [EN] Roughness in the bitangent direction
 * @returns [KO] 계산된 가시성 값 [EN] Calculated visibility value
 */
fn getAnisotropicVisibility(
    NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, 
    at: f32, ab: f32
) -> f32 {
   let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
   let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
   let v = 0.5 / max(GGXV + GGXL, EPSILON);
   return clamp(v, 0.0, 1.0);
}
