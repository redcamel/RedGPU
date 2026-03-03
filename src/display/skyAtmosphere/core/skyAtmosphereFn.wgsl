#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere

const MAX_TAU: f32 = 50.0;

struct AtmosphereDensities {
    rhoR: f32, rhoM: f32, rhoF: f32, rhoO: f32
};

struct AtmosphereCoefficients {
    scatTotal: vec3<f32>,
    extinction: vec3<f32>
};

// [KO] 유틸리티
fn getRaySphereIntersection(rayOrigin: vec3<f32>, rayDir: vec3<f32>, sphereRadius: f32) -> f32 {
    let b = dot(rayOrigin, rayDir);
    let c = dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let s = sqrt(delta);
    let t0 = -b - s;
    let t1 = -b + s;
    if (t0 > EPSILON) { return t0; }
    if (t1 > EPSILON) { return t1; }
    return -1.0;
}

fn getPlanetIntersection(origin: vec3<f32>, dir: vec3<f32>, r: f32) -> vec2<f32> {
    let b = dot(origin, dir);
    let c = dot(origin, origin) - r * r;
    let delta = b * b - c;
    if (delta < 0.0) { return vec2<f32>(-1.0); }
    let s = sqrt(delta);
    return vec2<f32>(-b - s, -b + s);
}

fn getTransmittanceUV(h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
    let mu = cosTheta * 0.5 + 0.5;
    return vec2<f32>(mu, 1.0 - clamp(h / atmosphereHeight, 0.0, 1.0));
}

fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, earthRadius: f32, atmosphereHeight: f32) -> vec2<f32> {
    let azimuth = atan2(viewDir.z, viewDir.x);
    let u = (azimuth / PI2) + 0.5;
    let r = earthRadius;
    let h = max(0.0, viewHeight);
    let horizonCos = -sqrt(max(0.0, h * (2.0 * r + h))) / (r + h);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));
    let viewElevation = asin(clamp(viewDir.y, -1.0, 1.0));
    var v: f32;
    if (viewElevation >= horizonElevation) {
        let ratio = (viewElevation - horizonElevation) / (HPI - horizonElevation);
        v = 0.5 * (1.0 - sqrt(max(0.0, ratio)));
    } else {
        let ratio = (horizonElevation - viewElevation) / (horizonElevation + HPI);
        v = 0.5 * (1.0 + sqrt(max(0.0, ratio)));
    }
    return vec2<f32>(u, clamp(v, 0.0, 1.0));
}

fn getTransmittance(atmosphereTransmittanceTexture: texture_2d<f32>, atmosphereSampler: sampler, h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
    let uv = getTransmittanceUV(h, cosTheta, atmosphereHeight);
    return textureSampleLevel(atmosphereTransmittanceTexture, atmosphereSampler, uv, 0.0).rgb;
}

fn getPlanetShadowMask(p: vec3<f32>, sunDir: vec3<f32>, r: f32, params: SkyAtmosphere) -> f32 {
    if (params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0) { return 0.0; }
    return 1.0;
}

fn getAtmosphereDensities(h: f32, params: SkyAtmosphere) -> AtmosphereDensities {
    var d: AtmosphereDensities;
    if (h < 0.0) {
        d.rhoR = 0.0; d.rhoM = 0.0; d.rhoF = 0.0; d.rhoO = 0.0;
    } else {
        d.rhoR = exp(-h / params.rayleighScaleHeight);
        d.rhoM = exp(-h / params.mieScaleHeight);
        d.rhoF = exp(-h * params.heightFogFalloff);
        let ozoneDist = abs(h - params.ozoneLayerCenter);
        d.rhoO = exp(-max(0.0, ozoneDist * ozoneDist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));
    }
    return d;
}

fn getSunTransmittanceManual(p: vec3<f32>, sunDir: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
    let r = params.earthRadius;
    let tMax = getRaySphereIntersection(p, sunDir, r + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(1.0); }
    let intersect = getPlanetIntersection(p, sunDir, r);
    var optExt = vec3<f32>(0.0);
    if (intersect.x > EPSILON && intersect.x < tMax) {
        optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, 10u, params);
        if (intersect.y > 0.0 && tMax > intersect.y) {
            optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, 10u, params);
        }
    } else {
        optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 20u, params);
    }
    return exp(-min(optExt, vec3<f32>(MAX_TAU)));
}

fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmH: f32, params: SkyAtmosphere) -> vec3<f32> {
    let intersect = getPlanetIntersection(p, sunDir, r);
    if (params.useGround > 0.5 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
    return getSunTransmittanceManual(p, sunDir, params);
}

fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
    if (tMax <= tMin) { return vec3<f32>(0.0); }
    let stepSize = (tMax - tMin) / f32(steps);
    var optExt = vec3<f32>(0.0);
    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let h = length(origin + dir * t) - params.earthRadius;
        if (h < 0.0) { continue; }
        let d = getAtmosphereDensities(h, params);
        optExt += (params.rayleighScattering * d.rhoR + vec3<f32>(params.mieExtinction * d.rhoM) + params.ozoneAbsorption * d.rhoO) * stepSize;
    }
    return optExt;
}

fn phaseRayleigh(cosTheta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

fn phaseMie(cosTheta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(EPSILON, 1.0 + g2 - 2.0 * g * cosTheta), 1.5));
}

fn phaseMieDual(cosTheta: f32, g: f32) -> f32 {
    return mix(phaseMie(cosTheta, g), phaseMie(cosTheta, 0.99), 0.2);
}

fn getAtmosphereCoefficients(h: f32, params: SkyAtmosphere) -> AtmosphereCoefficients {
    var c: AtmosphereCoefficients;
    let d = getAtmosphereDensities(h, params);
    let scatR = params.rayleighScattering * d.rhoR;
    let scatM = params.mieScattering * d.rhoM;
    let scatF = params.heightFogDensity * d.rhoF;
    c.scatTotal = scatR + vec3<f32>(scatM + scatF);
    c.extinction = scatR + vec3<f32>(params.mieExtinction * d.rhoM) + params.ozoneAbsorption * d.rhoO + vec3<f32>(scatF);
    return c;
}

fn integrateScatSegment(
    origin: vec3<f32>, dir: vec3<f32>, 
    tMin: f32, tMax: f32, steps: u32, 
    params: SkyAtmosphere,
    atmosphereTransmittanceTexture: texture_2d<f32>, 
    atmosphereSampler: sampler,
    atmosphereMultiScatTexture: texture_2d<f32>,
    useLUT: bool,
    radiance: ptr<function, vec3<f32>>, 
    transmittance: ptr<function, vec3<f32>>
) {
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
        
        if (params.useGround > 0.5 && h < 0.0) { continue; }

        let up = p / pLen;
        let cosSun = dot(up, sunDir);
        
        var sunTrans: vec3<f32>;
        if (useLUT) {
            sunTrans = getTransmittance(atmosphereTransmittanceTexture, atmosphereSampler, h, cosSun, params.atmosphereHeight);
        } else {
            sunTrans = getSunTransmittanceManual(p, sunDir, params);
        }
        
        let shadowMask = select(1.0, 0.0, params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0);
        let d = getAtmosphereDensities(h, params);

        let scatR = params.rayleighScattering * d.rhoR;
        let scatM = params.mieScattering * d.rhoM;
        let scatF = params.heightFogDensity * d.rhoF;
        
        let stepScat = (scatR * phaseR + vec3<f32>(scatM * phaseM + scatF * phaseF)) * sunTrans * shadowMask;
        
        let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
        let msScat = textureSampleLevel(atmosphereMultiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (scatR + vec3<f32>(scatM + scatF)) * shadowMask;

        let ext = scatR + vec3<f32>(params.mieExtinction * d.rhoM) + params.ozoneAbsorption * d.rhoO + vec3<f32>(scatF);

        *radiance += *transmittance * (stepScat + msScat) * stepSize;
        *transmittance *= exp(-ext * stepSize);
    }
}
