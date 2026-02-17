/**
 * [KO] 금속(Conductor)의 반사 특성을 고려한 프레넬 반사율을 계산합니다.
 * [EN] Calculates Fresnel reflectance considering the reflective characteristics of conductors (metals).
 *
 * @param F0 - [KO] 금속의 기본 반사율 (알베도 색상) [EN] Base reflectance of the metal (albedo color)
 * @param bsdf - [KO] 계산된 BRDF 값 [EN] Calculated BRDF value
 * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
 * @returns [KO] 프레넬이 적용된 최종 BRDF [EN] Final BRDF with Fresnel applied
 */
fn conductor_fresnel(F0: vec3<f32>, bsdf: vec3<f32>, VdotH: f32) -> vec3<f32> {
    let fresnel = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
    return bsdf * fresnel;
}
