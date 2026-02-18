#redgpu_include math.PI
#redgpu_include math.INV_PI

/**
 * [KO] Disney Diffuse BRDF 모델을 사용하여 확산광을 계산합니다.
 * [EN] Calculates diffuse lighting using the Disney Diffuse BRDF model.
 *
 * [KO] 이 모델은 거친 표면에서 발생하는 역반사(Retro-reflection) 효과를 고려하여 물리적으로 더 정확한 확산광을 제공합니다.
 * [EN] This model considers retro-reflection effects on rough surfaces to provide physically more accurate diffuse lighting.
 *
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param LdotH - [KO] 광원 방향과 하프 벡터의 내적 [EN] Dot product of light direction and half vector
 * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
 * @param albedo - [KO] 표면 반사율(색상) [EN] Surface albedo (color)
 * @returns [KO] 계산된 확산광 BRDF 값 [EN] Calculated diffuse BRDF value
 */
fn getDiffuseBRDFDisney(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }

    // Disney diffuse term
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);

    return albedo * NdotL * lightScatter * viewScatter * energyFactor * INV_PI;
}
