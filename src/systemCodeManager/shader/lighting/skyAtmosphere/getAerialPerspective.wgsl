#redgpu_include math.PI2
#redgpu_include math.INV_PI

/**
 * [KO] 객체에 공중 투시(Aerial Perspective) 효과를 적용합니다.
 * [EN] Applies the Aerial Perspective effect to an object.
 *
 * @param finalColor - [KO] 원래의 색상 [EN] Original color
 * @param worldPosition - [KO] 객체의 월드 위치 [EN] World position of the object
 * @returns [KO] 공중 투시가 적용된 최종 색상 [EN] Final color with Aerial Perspective applied
 */
fn getAerialPerspective(finalColor: vec4<f32>, worldPosition: vec3<f32>) -> vec4<f32> {
    let u_skyAtmosphere = systemUniforms.skyAtmosphere;
    let viewVec = worldPosition - systemUniforms.camera.cameraPosition;
    let viewDir = normalize(viewVec);
    let distKm = length(viewVec) / 1000.0;

    // [KO] 3D LUT 샘플링을 위한 UVW 계산 (Sky-View 및 CameraVolume과 동일한 매핑 사용)
    // [EN] UVW calculation for 3D LUT sampling (using the same mapping as Sky-View and CameraVolume)
    let u = atan2(viewDir.z, viewDir.x) / PI2 + 0.5;
    let v = asin(clamp(viewDir.y, -1.0, 1.0)) * INV_PI + 0.5;
    let w = sqrt(clamp(distKm / 100.0, 0.0, 1.0));

    let apSample = textureSampleLevel(cameraVolumeTexture, atmosphereSampler, vec3<f32>(u, v, w), 0.0);
    
    // [KO] 대기 산란광(In-scattering) 및 투과율(Transmittance) 적용
    // [EN] Apply atmospheric in-scattering and transmittance
    let atmosphereColor = apSample.rgb * u_skyAtmosphere.skyAtmosphereSunIntensity;
    let atmosphereTransmittance = apSample.a;
    
    var result = vec4<f32>((finalColor.rgb * atmosphereTransmittance) + atmosphereColor, finalColor.a);
    
    // [KO] 전체 노출 적용
    // [EN] Apply overall exposure
    result = vec4<f32>(result.rgb * u_skyAtmosphere.skyAtmosphereExposure, result.a);
    
    return result;
}
