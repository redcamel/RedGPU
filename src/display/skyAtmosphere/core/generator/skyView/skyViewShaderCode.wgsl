// [KO] UE5 표준 Sky-View LUT 생성

@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

fn integrateScatSegment(p: vec3<f32>, viewDir: vec3<f32>, stepSize: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let r = params.earthRadius;
    let h = length(p) - r;
    let up = p / length(p);
    let cosSun = dot(up, params.sunDirection);

    let sunTrans = getPhysicalTransmittance(p, params.sunDirection, r, params.atmosphereHeight, params);
    var shadowMask = 1.0;
    if (params.useGround > 0.5 && getRaySphereIntersection(p, params.sunDirection, r) > 0.0) { shadowMask = 0.0; }

    let d = getAtmosphereDensities(h, params);
    let c = getAtmosphereCoefficients(d, params);
    
    let viewSunCos = dot(viewDir, params.sunDirection);
    let phase = c.scatR * phaseRayleigh(viewSunCos) + c.scatM * phaseMie(viewSunCos, params.mieAnisotropy) + c.scatF * phaseMie(viewSunCos, 0.7);
    
    let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
    let msScat = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (c.scatR + c.scatM + c.scatF);

    *radiance += *transmittance * (phase * sunTrans * shadowMask + msScat * shadowMask) * stepSize;
    *transmittance *= exp(-c.extinction * stepSize);
}

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
        let stepsFront = 32u;
        let stepSizeFront = intersect.x / f32(stepsFront);
        for (var i = 0u; i < stepsFront; i = i + 1u) {
            let t = (f32(i) + 0.5) * stepSizeFront;
            integrateScatSegment(rayOrigin + viewDir * t, viewDir, stepSizeFront, &radiance, &transmittance);
        }

        if (params.useGround > 0.5 && params.showGround > 0.5) {
            let hitPos = rayOrigin + viewDir * intersect.x;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let albedo = params.groundAlbedo * INV_PI;
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 0.0), 0.0).rgb;
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * albedo;
        } else if (intersect.y > 0.0 && tMax > intersect.y) {
            let backDist = tMax - intersect.y;
            let stepsBack = 32u;
            let stepSizeBack = backDist / f32(stepsBack);
            for (var i = 0u; i < stepsBack; i = i + 1u) {
                let t = intersect.y + (f32(i) + 0.5) * stepSizeBack;
                integrateScatSegment(rayOrigin + viewDir * t, viewDir, stepSizeBack, &radiance, &transmittance);
            }
        }
    } else if (tMax > 0.0) {
        let steps = 64u;
        let stepSize = tMax / f32(steps);
        for (var i = 0u; i < steps; i = i + 1u) {
            let t = (f32(i) + 0.5) * stepSize;
            integrateScatSegment(rayOrigin + viewDir * t, viewDir, stepSize, &radiance, &transmittance);
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
