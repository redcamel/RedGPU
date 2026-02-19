#redgpu_include lighting.getFresnelSchlick
#redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicNDF
#redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicVisibility

/**
 * [KO] 이방성(Anisotropic) GGX 모델을 사용하여 물리 기반 스펙큘러 BRDF를 계산합니다.
 * [EN] Calculates Physically-Based Specular BRDF using the Anisotropic GGX model.
 *
 * @param f0 - [KO] 기본 반사율 [EN] Base reflectance
 * @param alphaRoughness - [KO] 표면 거칠기 [EN] Surface roughness
 * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
 * @param BdotV - [KO] 비탄젠트와 시선 방향의 내적 [EN] Dot product of bitangent and view direction
 * @param TdotV - [KO] 탄젠트와 시선 방향의 내적 [EN] Dot product of tangent and view direction
 * @param TdotL - [KO] 탄젠트와 광원 방향의 내적 [EN] Dot product of tangent and light direction
 * @param BdotL - [KO] 비탄젠트와 광원 방향의 내적 [EN] Dot product of bitangent and light direction
 * @param TdotH - [KO] 탄젠트와 하프 벡터의 내적 [EN] Dot product of tangent and half vector
 * @param BdotH - [KO] 비탄젠트와 하프 벡터의 내적 [EN] Dot product of bitangent and half vector
 * @param anisotropy - [KO] 이방성 강도 [EN] Anisotropy strength
 * @returns [KO] 계산된 이방성 스펙큘러 BRDF 값 [EN] Calculated anisotropic specular BRDF value
 */
fn getAnisotropicSpecularBRDF(
    f0: vec3<f32>, 
    alphaRoughness: f32, 
    VdotH: f32, 
    NdotL: f32, 
    NdotV: f32, 
    NdotH: f32, 
    BdotV: f32, 
    TdotV: f32, 
    TdotL: f32, 
    BdotL: f32, 
    TdotH: f32, 
    BdotH: f32, 
    anisotropy: f32
) -> vec3<f32> {
    // [KO] 이방성 파라미터를 기반으로 방향별 거칠기(alpha) 계산
    // [EN] Calculates directional roughness (alpha) based on anisotropic parameters
    var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
    var ab = alphaRoughness;
    
    var F: vec3<f32> = getFresnelSchlick(VdotH, f0);
    var V: f32 = getAnisotropicVisibility(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
    var D: f32 = getAnisotropicNDF(NdotH, TdotH, BdotH, at, ab);
    
    return F * (V * D);
}
