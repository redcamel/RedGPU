/**
 * [KO] SkyAtmosphere 시스템의 태양 정보를 담는 구조체입니다.
 * [EN] Structure containing sun information from the SkyAtmosphere system.
 */
struct AtmosphereSunLight {
    direction: vec3<f32>, // [KO] 태양을 향하는 방향 (Surface-to-Light) [EN] Direction toward the sun
    color: vec3<f32>,     // [KO] 태양 광색 [EN] Sun light color
    intensity: f32,       // [KO] 태양 광도 [EN] Sun light intensity
    visible: u32,         // [KO] 활성화 여부 (1: 활성, 0: 비활성) [EN] Whether active (1: active, 0: inactive)
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
    
    sun.visible = u_skyAtmosphere.useSkyAtmosphere;
    sun.direction = normalize(u_skyAtmosphere.skyAtmosphereSunDirection);
    sun.color = vec3<f32>(1.0, 1.0, 1.0); // [KO] 추후 대기 투과율에 따른 색상 연동 예정 [EN] Will be linked to color by transmittance later
    sun.intensity = u_skyAtmosphere.skyAtmosphereSunIntensity;
    
    return sun;
}
