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

    var viewDir = vec3<f32>(cos(viewElevation) * cos(azimuth), sin(viewElevation), cos(viewElevation) * sin(azimuth));
    
    if (abs(viewDir.y) > (1.0 - 1e-6)) {
        viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
    }

    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    var tMax = getRaySphereIntersection(rayOrigin, viewDir, groundRadius + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, groundRadius);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, intersect.x, SKY_VIEW_STEPS / 2u, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);

        if (params.groundRadius > 0.0) {
            let cosSun = params.sunDirection.y; 
            let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.01, 0.99), 1.0);
            let msEnergy = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb;
            let groundRadiance = evaluateGroundRadiance(cosSun, sunTrans, msEnergy, params.groundAlbedo, params.sunIntensity);
            radiance += transmittance * groundRadiance;
        }
    } else if (tMax > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, SKY_VIEW_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);
    }

    textureStore(skyViewLUT, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
