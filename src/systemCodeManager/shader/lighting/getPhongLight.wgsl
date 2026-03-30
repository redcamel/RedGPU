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
    
    // Diffuse (Lambertian): 1 / PI
    let diffuseTerm = (1.0 / PI) * NdotL;
    
    // Specular (Phong): (shininess + 2) / (2 * PI)
    let specularNormalization = (shininess + 2.0) / (2.0 * PI);
    let specularTerm = specularNormalization * pow(max(dot(R, V), 0.0), shininess) * specularSamplerValue * NdotL;

    return (diffuseColor * illuminance * diffuseTerm) + (specularColor * specularStrength * illuminance * specularTerm);
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
