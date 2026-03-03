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
    
    var tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    // [KO] 지하 시점에서 아래를 볼 때, 적분 거리가 지구 반대편(수만 km)으로 튀는 것을 방지
    // [EN] Prevent integration distance from jumping to the other side of the planet when looking down from underground
    if (camH < 0.0 && viewDir.y < 0.0) {
        let tFloor = getRaySphereIntersection(rayOrigin, viewDir, r - 1.0);
        if (tFloor > 0.0) { tMax = min(tMax, tFloor); }
    }

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        integrateSegment(rayOrigin, viewDir, 0.0, intersect.x, 32u, &radiance, &transmittance);
        
        if (params.useGround > 0.5 && params.showGround > 0.5) {
            let hitPos = rayOrigin + viewDir * intersect.x;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 1.0), 0.0).rgb;
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * (params.groundAlbedo * INV_PI);
        } else if (intersect.y > 0.0 && tMax > intersect.y) {
            integrateSegment(rayOrigin, viewDir, intersect.y, tMax, 32u, &radiance, &transmittance);
        }
    } else if (tMax > 0.0) {
        integrateSegment(rayOrigin, viewDir, 0.0, tMax, 64u, &radiance, &transmittance);
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}

fn integrateSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let r = params.earthRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = phaseMieDual(viewSunCos, params.mieAnisotropy);
    let phaseF = phaseMie(viewSunCos, 0.7);

    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let h = pLen - r;
        if (params.useGround > 0.5 && h < -0.001) { continue; }

        let up = p / pLen;
        let cosSun = dot(up, sunDir);
        
        // LUT 사용 (성능 핵심)
        let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, h, cosSun, params.atmosphereHeight);
        let shadowMask = select(1.0, 0.0, params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0);

        let rhoR = exp(-h / params.rayleighScaleHeight);
        let rhoM = exp(-h / params.mieScaleHeight);
        let rhoF = exp(-h * params.heightFogFalloff);
        let ozoneDist = abs(h - params.ozoneLayerCenter);
        let rhoO = exp(-max(0.0, ozoneDist * ozoneDist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));

        let scatR = params.rayleighScattering * rhoR;
        let scatM = params.mieScattering * rhoM;
        let scatF = params.heightFogDensity * rhoF;
        
        let stepScat = (scatR * phaseR + vec3<f32>(scatM * phaseM + scatF * phaseF)) * sunTrans * shadowMask;
        
        let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
        let msScat = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (scatR + vec3<f32>(scatM + scatF)) * shadowMask;

        let ext = scatR + vec3<f32>(params.mieExtinction * rhoM) + params.ozoneAbsorption * rhoO + vec3<f32>(scatF);

        *radiance += *transmittance * (stepScat + msScat) * stepSize;
        *transmittance *= exp(-ext * stepSize);
    }
}
