// [KO] UE5 표준 Sky-View LUT 생성

@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * PI2;
    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    
    let horizonCos = -sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));

    var viewElevation: f32;
    if (uv.y < 0.5) {
        let ratio = (1.0 - 2.0 * uv.y) * (1.0 - 2.0 * uv.y);
        viewElevation = horizonElevation + ratio * (HPI - horizonElevation);
    } else {
        let ratio = (2.0 * uv.y - 1.0) * (2.0 * uv.y - 1.0);
        viewElevation = horizonElevation - ratio * (horizonElevation + HPI);
    }

    if (params.useGround < 0.5) { viewElevation = abs(viewElevation); }

    let viewDir = vec3<f32>(cos(viewElevation) * cos(azimuth), sin(viewElevation), cos(viewElevation) * sin(azimuth));
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);
    let tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        // --- Segment 1: Front Atmosphere ---
        integrateScatSegment(rayOrigin, viewDir, 0.0, intersect.x, 32u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);

        if (params.useGround > 0.5 && params.showGround > 0.5) {
            // [KO] 지면 반사광 추가
            let hitPos = rayOrigin + viewDir * intersect.x;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let albedo = params.groundAlbedo * INV_PI;
            let msEnergy = getMultiScatteringEnergy(hitPos, params.sunDirection, multiScatTexture, atmosphereSampler, params);
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * albedo;
        } else if (intersect.y > 0.0 && tMax > intersect.y) {
            // --- Segment 2: Back Atmosphere ---
            integrateScatSegment(rayOrigin, viewDir, intersect.y, tMax, 32u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);
        }
    } else if (tMax > 0.0) {
        // --- Single Segment: Standard Sky Path ---
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, 64u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
