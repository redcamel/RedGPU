#redgpu_include math.PI
#redgpu_include lighting.getLightDistanceAttenuation

/**
 * [KO] 에너지 보존이 적용된 물리 기반 Phong BRDF를 계산합니다. (내부 계산용)
 * [EN] Calculates physically based Phong BRDF with energy conservation. (Internal use)
 */
fn calcPhongBRDF(
    lightColor: vec3<f32>,
    illuminance: vec3<f32>,
    L: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    shininess: f32,
    specularSamplerValue: f32,
    diffuseColor: vec3<f32>,
    specularColor: vec3<f32>,
    specularStrength: f32
) -> vec3<f32> {
    let R = reflect(-L, N);
    let NdotL = max(dot(N, L), 0.0);
    let NdotV = max(dot(N, V), 0.0);
    
    // [KO] 프레넬-슐릭 근사 (Fresnel-Schlick Approximation)
    // [KO] 정면 반사율(F0)을 specularStrength로 간주하고 각도에 따른 반사율 변화 계산
    // [EN] Fresnel-Schlick approximation: Calculate reflectance change based on angle, using specularStrength as F0
    let F0 = specularStrength;
    let F = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);
    
    // [KO] 에너지 보존을 위한 디퓨즈/스페큘러 비중 조절
    // [EN] Adjust diffuse/specular ratio for energy conservation
    let kS = F * specularSamplerValue;
    let kD = (1.0 - kS);

    // Diffuse (Lambertian): 1 / PI
    let diffuseTerm = (1.0 / PI) * NdotL;
    
    // Specular (Phong): (shininess + 2) / (2 * PI)
    let specularNormalization = (shininess + 2.0) / (2.0 * PI);
    let specularTerm = specularNormalization * pow(max(dot(R, V), 0.0), shininess) * NdotL;

    // [KO] 최종 합성: kD와 kS를 통해 에너지가 각도에 따라 물리적으로 올바르게 분포되도록 함
    // [EN] Final composition: Use kD and kS to ensure energy is physically distributed correctly based on angle
    return (diffuseColor * kD * illuminance * diffuseTerm) + (specularColor * kS * illuminance * specularTerm);
}

/**
 * [KO] 방향성 광원(Lux 기반)에 대한 Phong 조명을 계산합니다.
 * [EN] Calculates Phong lighting for a directional light (Lux based).
 */
fn getDirectionalLightPhong(
    lightColor: vec3<f32>,
    intensityLux: f32,
    L: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    shininess: f32,
    specularSamplerValue: f32,
    diffuseColor: vec3<f32>,
    specularColor: vec3<f32>,
    specularStrength: f32
) -> vec3<f32> {
    let illuminance = lightColor * intensityLux;
    return calcPhongBRDF(lightColor, illuminance, L, N, V, shininess, specularSamplerValue, diffuseColor, specularColor, specularStrength);
}

/**
 * [KO] 점/스폿 광원(Lumen 기반)에 대한 Phong 조명을 계산합니다.
 * [EN] Calculates Phong lighting for point/spot lights (Lumen based).
 */
fn getPointLightPhong(
    lightColor: vec3<f32>,
    intensityLumen: f32,
    lightDistance: f32,
    lightRadius: f32,
    L: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    shininess: f32,
    specularSamplerValue: f32,
    diffuseColor: vec3<f32>,
    specularColor: vec3<f32>,
    specularStrength: f32
) -> vec3<f32> {
    // 1. 거리 감쇄 (1/d^2 + Windowing)
    let attenuation = getLightDistanceAttenuation(lightDistance, lightRadius);
    // 2. Lumen -> Illuminance (Lux) 변환: Phi / (4 * PI * d^2)
    let illuminance = lightColor * (intensityLumen * attenuation / (4.0 * PI));
    
    return calcPhongBRDF(lightColor, illuminance, L, N, V, shininess, specularSamplerValue, diffuseColor, specularColor, specularStrength);
}

/**
 * [KO] 대기 투과율이 적용된 태양광 Phong 조명을 계산합니다.
 * [EN] Calculates sun light Phong lighting with atmospheric transmittance.
 */
fn getAtmosphereSunLightPhong(
    lightColor: vec3<f32>,
    intensityLux: f32,
    L: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    shininess: f32,
    specularSamplerValue: f32,
    diffuseColor: vec3<f32>,
    specularColor: vec3<f32>,
    specularStrength: f32,
    worldPos: vec3<f32>,
    cameraPos: vec3<f32>,
    params: SkyAtmosphere,
    atmosphereSampler: sampler,
    transmittanceLUT: texture_2d<f32>
) -> vec3<f32> {
    // [KO] 대기 투과율 계산 (지면 기준 높이 Km 변환)
    let groundRadius = params.groundRadius;
    let atmosphereHeight = params.atmosphereHeight;
    let up = normalize(worldPos + vec3<f32>(0.0, groundRadius, 0.0));
    let viewHeight = length(worldPos + vec3<f32>(0.0, groundRadius, 0.0)) - groundRadius;
    let cosSun = dot(up, L);

    // [KO] 투과율 LUT 참조
    let sunTransmittance = getTransmittance(transmittanceLUT, atmosphereSampler, max(0.0, viewHeight), cosSun, atmosphereHeight);
    
    // [KO] 투과율이 적용된 최종 조도
    let illuminance = lightColor * intensityLux * sunTransmittance;
    
    return calcPhongBRDF(lightColor, illuminance, L, N, V, shininess, specularSamplerValue, diffuseColor, specularColor, specularStrength);
}
