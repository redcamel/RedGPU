#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var skyViewLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var skyAtmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

/**
 * [KO] 현재 카메라 고도에서 전 방위 하늘의 대기 산란 복사휘도와 평균 투과율을 SkyView 2D LUT에 베이킹합니다.
 * [EN] Bakes omnidirectional sky scattering radiance and average transmittance at the current camera altitude into the SkyView 2D LUT.
 */
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);

    let azimuth = (uv.x - 0.5) * PI2;
    let groundRadius = params.groundRadius;
    let viewHeight = max(0.0001, params.cameraHeight);

    let horizonCos = -sqrt(max(0.0, viewHeight * (2.0 * groundRadius + viewHeight))) / (groundRadius + viewHeight);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));

    // [KO] 지평선 부근의 해상도를 높이는 비선형 고도각(Elevation) 역매핑을 수행합니다.
    // [EN] Apply non-linear elevation inverse mapping to concentrate texel resolution near the horizon.
    var viewElevation: f32;
    if (uv.y < 0.5) {
        let ratio = 1.0 - (uv.y * 2.0);
        viewElevation = horizonElevation + ratio * ratio * (HPI - horizonElevation);
    } else {
        let ratio = (uv.y - 0.5) * 2.0;
        viewElevation = horizonElevation - ratio * ratio * (horizonElevation + HPI);
    }

    let cosEl = cos(viewElevation);
    let sinEl = sin(viewElevation);
    let cosAz = cos(azimuth);
    let sinAz = sin(azimuth);
    let viewDir = vec3<f32>(cosEl * cosAz, sinEl, cosEl * sinAz);
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, groundRadius);
    let atmosphereHeight = params.atmosphereHeight;

    // [KO] 지면 교차 여부에 따라 지표면 반사광을 포함한 산란 구간 또는 대기권 외곽까지의 산란 구간을 적분합니다.
    // [EN] Integrate scattering either up to the ground hit (with surface reflectance) or to the top of the atmosphere.
    if (groundRadius > 0.0 && tEarth > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tEarth, SKY_VIEW_STEPS / 2u, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, &radiance, &transmittance);

        let hitPoint = rayOrigin + viewDir * tEarth;
        let up = hitPoint * inverseSqrt(dot(hitPoint, hitPoint));
        let localCosSun = dot(up, params.sunDirection);

        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, localCosSun, atmosphereHeight);
        let msUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.001, 0.999), 1.0);
        let msEnergy = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb;

        let groundRadiance = evaluateGroundRadiance(localCosSun, sunT, msEnergy, params.groundAlbedo);
        radiance += transmittance * groundRadiance;
    } else {
        let tMax = getRaySphereIntersection(rayOrigin, viewDir, groundRadius + atmosphereHeight);
        if (tMax > 0.0) {
            integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, SKY_VIEW_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, &radiance, &transmittance);
        }
    }

    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) * (1.0 / 3.0);
    textureStore(skyViewLUT, global_id.xy, vec4<f32>(radiance, avgTrans));
}
