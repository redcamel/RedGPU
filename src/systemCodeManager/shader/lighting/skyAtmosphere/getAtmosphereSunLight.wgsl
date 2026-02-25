/**
 * [KO] SkyAtmosphere 시스템의 태양 정보를 담는 구조체입니다.
 * [EN] Structure containing sun information from the SkyAtmosphere system.
 */
struct AtmosphereSunLight {
    direction: vec3<f32>, // [KO] 태양을 향하는 방향 (Surface-to-Light) [EN] Direction toward the sun
    intensity: f32,       // [KO] 태양 광도 [EN] Sun light intensity
    color: vec3<f32>,     // [KO] 태양 광색 [EN] Sun light color
    padding: f32          // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
};

/**
 * [KO] 시스템 유니폼으로부터 대기 태양광 정보를 추출합니다.
 * [EN] Extracts atmospheric sun light information from system uniforms.
 *
 * @returns [KO] 태양 정보 구조체 [EN] Sun light information structure
 */
fn getAtmosphereSunLight() -> AtmosphereSunLight {
    var sun: AtmosphereSunLight;
    let u_skyAtmosphere = systemUniforms.skyAtmosphere;
    
    sun.direction = normalize(u_skyAtmosphere.skyAtmosphereSunDirection);
    sun.intensity = u_skyAtmosphere.skyAtmosphereSunIntensity;
    sun.color = vec3<f32>(1.0, 1.0, 1.0); // [KO] 추후 대기 투과율에 따른 색상 연동 예정 [EN] Will be linked to color by transmittance later
    
    return sun;
}
