#redgpu_include skyAtmosphere.skyAtmosphereFn

/**
 * [KO] SkyAtmosphere 시스템의 태양 정보를 담는 구조체입니다.
 * [EN] Structure containing sun information from the SkyAtmosphere system.
 */
struct AtmosphereSunLight {
    direction: vec3<f32>, // [KO] 태양을 향하는 방향 (Surface-to-Light) [EN] Direction toward the sun
    intensity: f32,       // [KO] 태양 광도 [EN] Sun light intensity
    color: vec3<f32>,     // [KO] 태양 광색 (대기 투과율이 적용된 물리적 색상) [EN] Sun light color (physical color with atmospheric transmittance applied)
    padding: f32          // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
};

/**
 * [KO] 시스템 유니폼으로부터 대기 태양광 정보를 추출합니다.
 * [EN] Extracts atmospheric sun light information from system uniforms.
 *
 * @param worldPosition - [KO] 월드 공간 좌표 [EN] World space position
 * @returns [KO] 태양 정보 구조체 [EN] Sun light information structure
 */
fn getAtmosphereSunLight(worldPosition: vec3<f32>) -> AtmosphereSunLight {
    var sun: AtmosphereSunLight;
    let u_skyAtmosphere = systemUniforms.skyAtmosphere;
    
    let sunDir = normalize(u_skyAtmosphere.sunDirection);
    sun.direction = sunDir;
    sun.intensity = u_skyAtmosphere.sunIntensity;
    
    // [KO] 현재 픽셀의 고도와 태양 각도를 기반으로 대기 투과율(Transmittance)을 샘플링하여 실제 태양색 결정
    // [EN] Sample Atmospheric Transmittance based on current pixel's height and sun angle to determine actual sun color
    let h = max(0.001, worldPosition.y / 1000.0);
    sun.color = getTransmittance(
        transmittanceTexture, 
        atmosphereSampler, 
        h, 
        sunDir.y, 
        u_skyAtmosphere.atmosphereHeight
    );
    
    return sun;
}
