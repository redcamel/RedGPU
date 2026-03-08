// [KO] UE5 표준 Sky-View LUT 생성
#redgpu_include math.INV_PI

@group(0) @binding(0) var atmosphereSkyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var atmosphereTransmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereMultiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(atmosphereSkyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * PI2;
    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    
    let horizonCos = -sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));

    var viewElevation: f32;
    if (uv.y < 0.5) {
        let ratio = 1.0 - (uv.y * 2.0);
        viewElevation = horizonElevation + ratio * ratio * (HPI - horizonElevation);
    } else {
        let ratio = (uv.y - 0.5) * 2.0;
        viewElevation = horizonElevation - ratio * ratio * (horizonElevation + HPI);
    }

    if (params.useGround < 0.5) { viewElevation = abs(viewElevation); }

    var viewDir = vec3<f32>(cos(viewElevation) * cos(azimuth), sin(viewElevation), cos(viewElevation) * sin(azimuth));
    
    // [KO] 양극점(Zenith/Nadir) 특이점 방지 범위를 확대하여 LUT 상/하단 라인을 완벽히 균일화합니다. (약 3도 범위)
    // [EN] Expand stabilization radius near Zenith/Nadir to ensure perfectly uniform LUT top/bottom rows.
    if (abs(viewElevation) > (HPI - 0.05)) {
        viewDir = vec3<f32>(0.0, sign(viewElevation), 0.0);
    }

    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);
    var tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        // [KO] 지면까지의 대기 산란 적분
        integrateScatSegment(rayOrigin, viewDir, 0.0, intersect.x, 32u, params, atmosphereTransmittanceTexture, atmosphereSampler, atmosphereMultiScatTexture, true, false, &radiance, &transmittance);
        
        if (params.useGround > 0.5 && params.showGround > 0.5) {
            // [KO] 지면 반사광 계산 안정화
            // [KO] hitPos 대신 카메라 수직 상단을 기준으로 cosSun을 단순화하여 수평선 부근의 특이점을 제거합니다.
            let cosSun = params.sunDirection.y; 
            let sunTrans = getTransmittance(atmosphereTransmittanceTexture, atmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.01, 0.99), 1.0);
            let msEnergy = textureSampleLevel(atmosphereMultiScatTexture, atmosphereSampler, msUV, 0.0).rgb;
            
            // [KO] 지면 반사광 합성 (Transmittance는 적분 함수에서 누적된 값 사용)
            // [KO] msEnergy * PI: 전역 환경광 조도(Irradiance)를 나타냄
            // [EN] Combine ground reflection (Transmittance uses the value accumulated in the integration function)
            // [EN] msEnergy * PI: Represents global environment irradiance
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy * PI) * (params.groundAlbedo * INV_PI);
        }
    } else if (tMax > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, 64u, params, atmosphereTransmittanceTexture, atmosphereSampler, atmosphereMultiScatTexture, true, false, &radiance, &transmittance);
    }

    textureStore(atmosphereSkyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
