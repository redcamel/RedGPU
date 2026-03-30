// [KO] UE5 표준 Sky-View LUT 생성
#redgpu_include skyAtmosphere.skyAtmosphereFn
#redgpu_include math.INV_PI

@group(0) @binding(0) var skyViewLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var skyAtmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * PI2;
    let groundRadius = params.groundRadius;
    let viewHeight = max(0.0001, params.cameraHeight);
    
    let horizonCos = -sqrt(max(0.0, viewHeight * (2.0 * groundRadius + viewHeight))) / (groundRadius + viewHeight);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));

    var viewElevation: f32;
    if (uv.y < 0.5) {
        let ratio = 1.0 - (uv.y * 2.0);
        viewElevation = horizonElevation + ratio * ratio * (HPI - horizonElevation);
    } else {
        let ratio = (uv.y - 0.5) * 2.0;
        viewElevation = horizonElevation - ratio * ratio * (horizonElevation + HPI);
    }

    let viewDir = vec3<f32>(cos(viewElevation) * cos(azimuth), sin(viewElevation), cos(viewElevation) * sin(azimuth));
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    
    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 행성(지면)과의 교차점 확인
    // [EN] Check for intersection with the planet (ground)
    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, groundRadius);
    let atmosphereHeight = params.atmosphereHeight;
    let tMax = getRaySphereIntersection(rayOrigin, viewDir, groundRadius + atmosphereHeight);

    if (groundRadius > 0.0 && tEarth > 0.0) {
        // [KO] 지면까지의 산란광 적분
        integrateScatSegment(rayOrigin, viewDir, 0.0, tEarth, SKY_VIEW_STEPS / 2u, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);

        // [KO] UE5 방식: 지면 충돌 지점의 로컬 태양 고도를 기반으로 반사광 계산
        // [EN] UE5 style: Calculate ground radiance based on local sun elevation at the hit point
        let hitPoint = rayOrigin + viewDir * tEarth;
        let up = normalize(hitPoint);
        let localCosSun = dot(up, normalize(params.sunDirection));
        
        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, localCosSun, atmosphereHeight);
        
        // [KO] 다중 산란 에너지 (지면 높이 h=0 기준)
        let msUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.001, 0.999), 1.0);
        let msEnergy = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb;
        
        let groundRadiance = evaluateGroundRadiance(localCosSun, sunT, msEnergy, params.groundAlbedo);
        radiance += transmittance * groundRadiance;
    } else if (tMax > 0.0) {
        // [KO] 대기 경계까지의 산란광 적분
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, SKY_VIEW_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);
    }

    // [KO] Sky-View LUT는 단위 광휘(Unit Radiance)를 저장하며, 알파 채널에 투과율을 저장함
    textureStore(skyViewLUT, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
