[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [skyAtmosphere](../README.md) / skyAtmosphereFn

# Variable: skyAtmosphereFn

> `const` **skyAtmosphereFn**: `string` = `skyAtmosphereFn_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2012](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L2012)

Retrieves atmospheric transmittance at a specific altitude and angle.

```wgsl
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include color.getLuminance

const MAX_TAU: f32 = 100.0;

const SUN_ANGULAR_RADIUS_RAD: f32 = 0.00465;
const SUN_SOLID_ANGLE_BASE: f32 = 6.794e-5;

const TRANSMITTANCE_STEPS: u32 = 40u;
const MULTI_SCAT_STEPS: u32 = 40u;
const SKY_VIEW_STEPS: u32 = 128u;
const AP_STEPS: u32 = 64u;
const MULTI_SCAT_SAMPLES: u32 = 128u;
const IRRADIANCE_SAMPLES: u32 = 256u;

const SUN_RADIANCE_BOOST: f32 = 1.0;
const MIE_GLOW_SUPPRESS: f32 = 0.40;
const NEAR_FIELD_CORRECTION_DIST: f32 = 0.2;

struct AtmosphereDensities {
    rhoR: f32, rhoM: f32, rhoO: f32
};

struct AtmosphereCoefficients {
    scatTotal: vec3<f32>,
    extinction: vec3<f32>
};

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

fn getTransmittanceUV(viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
    let mu = clamp(cosTheta, -1.0, 1.0);
    let u = clamp(0.5 + 0.5 * sign(mu) * sqrt(abs(mu)), 0.001, 0.999);
    let v = clamp(1.0 - viewHeight / atmosphereHeight, 0.001, 0.999);
    return vec2<f32>(u, v);
}

fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, groundRadius: f32, atmosphereHeight: f32) -> vec2<f32> {
    var azimuth: f32;
    if (abs(viewDir.z) < 1e-6 && abs(viewDir.x) < 1e-6) {
        azimuth = 0.0;
    } else {
        azimuth = atan2(viewDir.z, viewDir.x);
    }
    let u = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
    let r = groundRadius;
    let h = max(0.0001, viewHeight);

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
    return vec2<f32>(u, clamp(v, 0.001, 0.999));
}

fn getTransmittance(transmittanceLUT: texture_2d<f32>, skyAtmosphereSampler: sampler, viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
    let uv = getTransmittanceUV(viewHeight, cosTheta, atmosphereHeight);
    // Smoothly interpolate between LUT entries via hardware linear sampling.
    var transmittance = textureSampleLevel(transmittanceLUT, skyAtmosphereSampler, uv, 0.0).rgb;
    let mu = clamp(cosTheta, -1.0, 1.0);
    if (mu < 0.0) {
        // Smoothly apply ground occlusion when below the horizon.
        let groundMask = smoothstep(-0.015, 0.0, mu);
        transmittance *= groundMask;
    }
    return transmittance;
}

fn getPlanetShadowMask(p: vec3<f32>, sunDir: vec3<f32>, r: f32, params: SkyAtmosphere) -> f32 {
    if (r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0) { return 0.0; }
    return 1.0;
}

fn getAtmosphereDensities(viewHeight: f32, params: SkyAtmosphere) -> AtmosphereDensities {
    var d: AtmosphereDensities;
    if (viewHeight < 0.0) {
        d.rhoR = 0.0; d.rhoM = 0.0; d.rhoO = 0.0;
    } else {
        d.rhoR = exp(-viewHeight / params.rayleighExponentialDistribution);
        d.rhoM = exp(-viewHeight / params.mieExponentialDistribution);
        let ozoneDist = abs(viewHeight - params.absorptionTipAltitude);
        d.rhoO = max(0.0, 1.0 - ozoneDist / params.absorptionTentWidth);
    }
    return d;
}

fn getSunTransmittanceManual(p: vec3<f32>, sunDir: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
    let r = params.groundRadius;
    let tMax = getRaySphereIntersection(p, sunDir, r + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(1.0); }
    let intersect = getPlanetIntersection(p, sunDir, r);

    if (r > 0.0 && intersect.x > EPSILON) { return vec3<f32>(0.0); }

    var optExt = vec3<f32>(0.0);
    let halfSteps = TRANSMITTANCE_STEPS / 2u;

    if (intersect.x > EPSILON && intersect.x < tMax) {
        optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, halfSteps, params);
        if (intersect.y > 0.0 && tMax > intersect.y) {
            optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, halfSteps, params);
        }
    } else {
        optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, TRANSMITTANCE_STEPS, params);
    }
    return exp(-min(optExt, vec3<f32>(MAX_TAU)));
}

fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmosphereHeight: f32, params: SkyAtmosphere) -> vec3<f32> {
    let minElevationRad = params.transmittanceMinLightElevationAngle * DEG_TO_RAD;
    var adjustedSunDir = sunDir;
    if (sunDir.y < sin(minElevationRad)) {
        let cosEl = cos(minElevationRad);
        let sinEl = sin(minElevationRad);
        let horizontalDir = normalize(vec3<f32>(sunDir.x, 0.0, sunDir.z));
        adjustedSunDir = vec3<f32>(horizontalDir.x * cosEl, sinEl, horizontalDir.z * cosEl);
    }

    let intersect = getPlanetIntersection(p, adjustedSunDir, r);
    if (r > 0.0 && intersect.x > EPSILON) { return vec3<f32>(0.0); }
    return getSunTransmittanceManual(p, adjustedSunDir, params);
}

fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
    if (tMax <= tMin) { return vec3<f32>(0.0); }
    let stepSize = (tMax - tMin) / f32(steps);
    var optExt = vec3<f32>(0.0);
    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let viewHeight = length(origin + dir * t) - params.groundRadius;
        if (viewHeight < 0.0) { continue; }
        let d = getAtmosphereDensities(viewHeight, params);

        let scatR_phys = params.rayleighScattering * d.rhoR;
        let mieExt_phys = (params.mieScattering + params.mieAbsorption) * d.rhoM;
        let absC_phys = params.absorptionCoefficient * d.rhoO;

        optExt += (scatR_phys + mieExt_phys + absC_phys) * stepSize;
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

fn phaseMieStable(cosTheta: f32, g: f32) -> f32 {
    return phaseMie(cosTheta, min(g, 0.80));
}

fn getSquashedViewSunCos(viewDir: vec3<f32>, sunDir: vec3<f32>) -> f32 {
    let sunElevationParam = saturate(sunDir.y);
    let squashFactor = mix(0.85, 1.0, sunElevationParam);
    let verticalDist = viewDir.y - sunDir.y;
    let correctionGuard = saturate(dot(viewDir, sunDir) * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
    let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) * correctionGuard;
    return dot(viewDir, sunDir) - squashCorrection;
}

fn getSunDiskRadianceUnit(
    viewSunCos: f32,
    sunSize: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>,
    edgeSoftness: f32,
    params: SkyAtmosphere
) -> vec3<f32> {
    let sunRad = (sunSize * 0.5) * DEG_TO_RAD;
    let cosSunRad = cos(sunRad);
    let solidAngle = PI2 * (1.0 - cosSunRad);
    let radianceScale = SUN_RADIANCE_BOOST / max(6.7e-5, solidAngle);

    let dist = (1.0 - viewSunCos) / max(1e-7, 1.0 - cosSunRad);
    let sunMask = 1.0 - smoothstep(1.0 - edgeSoftness, 1.0, dist);
    if (sunMask <= 0.0) { return vec3<f32>(0.0); }

    let limbDarkening = pow(max(1e-7, 1.0 - saturate(dist)), sunLimbDarkening);
    let energyNormalization = sunLimbDarkening + 1.0;

    return (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;
}

fn getSunDiskRadianceIBL(
    viewSunCos: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>,
    params: SkyAtmosphere
) -> vec3<f32> {
    let sunRad = (params.sunSize * 0.5) * DEG_TO_RAD;
    let iblAlpha = max(sunRad * 2.0, 0.175);
    let cosAlpha = cos(iblAlpha);

    let radScale = 1.0 / (PI2 * (1.0 - cosAlpha));
    let diff = saturate(1.0 - viewSunCos);
    let sigma_sq = 1.0 - cosAlpha;
    let falloff = exp(-diff / max(1e-7, sigma_sq));
    if (falloff < 0.001) { return vec3<f32>(0.0); }

    return (radScale * falloff) * skyTrans;
}

fn getMieGlowAmountUnit(
    viewSunCos: f32,
    viewHeight: f32,
    params: SkyAtmosphere,
    transmittanceLUT: texture_2d<f32>,
    skyAtmosphereSampler: sampler,
    transToEdge: vec3<f32>,
    overrideHalo: f32
) -> vec3<f32> {
    let actualAnisotropy = params.mieAnisotropy;
    let halo = select(actualAnisotropy, overrideHalo, overrideHalo > 0.0);

    let sharpG = min(max(halo, 0.88), 0.94);
    let stableG = min(actualAnisotropy, 0.80);

    let sharpPhase = phaseMie(viewSunCos, sharpG);
    let stablePhase = phaseMie(viewSunCos, stableG);
    let diffPhase = max(0.0, sharpPhase - stablePhase);

    let sunDirY = params.sunDirection.y;
    let sunCosTheta = clamp(sunDirY, -1.0, 1.0);
    let sunTransForGlow = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, sunCosTheta, params.atmosphereHeight);

    return sunTransForGlow * (params.mieScattering / max(vec3<f32>(0.0001), params.mieScattering + params.mieAbsorption))
                        * (diffPhase) * (1.0 - transToEdge) * MIE_GLOW_SUPPRESS * params.skyLuminanceFactor;
}

/**
 * Performs atmospheric scattering integration over a specified segment (Using LUTs and physical parameters).
 *
 */
fn integrateScatSegment(
    origin: vec3<f32>, dir: vec3<f32>,
    tMin: f32, tMax: f32, steps: u32,
    params: SkyAtmosphere,
    transmittanceLUT: texture_2d<f32>,
    skyAtmosphereSampler: sampler,
    multiScatLUT: texture_2d<f32>,
    useLUT: bool,
    radiance: ptr<function, vec3<f32>>,
    transmittance: ptr<function, vec3<f32>>
) {
    if (tMax <= tMin) { return; }
    let r = params.groundRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);

    // Calculate Phase Functions (Reflecting Rayleigh/Mie scattering characteristics)
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = select(phaseMie(viewSunCos, params.mieAnisotropy), phaseMieStable(viewSunCos, params.mieAnisotropy), useLUT);

    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let viewHeight = pLen - r;

        if (r > 0.0 && viewHeight < 0.0) { continue; }

        let up = p / pLen;
        let cosSun = dot(up, sunDir);

        var sunTrans: vec3<f32>;
        if (useLUT) {
            // Sample precomputed transmittance LUT
            sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, cosSun, params.atmosphereHeight);
        } else {
            // Perform real-time numerical integration (Used during LUT generation)
            sunTrans = getSunTransmittanceManual(p, sunDir, params);
        }

        let shadowMask = select(1.0, 0.0, r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0);
        let d = getAtmosphereDensities(viewHeight, params);

        let scatR_phys = params.rayleighScattering * d.rhoR;
        let scatM_phys = params.mieScattering * d.rhoM;
        let mieAbs_phys = params.mieAbsorption * d.rhoM;
        let ozoneAbs_phys = params.absorptionCoefficient * d.rhoO;

        let scatR_luminous = scatR_phys * params.skyLuminanceFactor;
        let scatM_luminous = scatM_phys * params.skyLuminanceFactor;

        let stepScat = (scatR_luminous * phaseR + scatM_luminous * phaseM) * sunTrans * shadowMask;

        let scatTotal_luminous = scatR_luminous + scatM_luminous;
        let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - viewHeight / params.atmosphereHeight, 0.001, 0.999));

        // Add multi-scattering contribution (Hardware linear sampling mandatory)
        let msScat = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb * scatTotal_luminous * shadowMask * params.multiScatteringFactor;

        *radiance += *transmittance * (stepScat + msScat) * stepSize;

        let extinction_phys = scatR_phys + scatM_phys + mieAbs_phys + ozoneAbs_phys;
        *transmittance *= exp(-extinction_phys * stepSize);
    }
}

fn getCubeMapDirection(uv: vec2<f32>, face: u32) -> vec3<f32> {
    let tex = uv * 2.0 - 1.0;
    var dir: vec3<f32>;
    switch (face) {
        case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); }
        case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); }
        case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }
        case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); }
        case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }
        case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); }
        default: { dir = vec3<f32>(0.0); }
    }
    return dir;
}

fn evaluateGroundRadiance(cosSun: f32, sunTrans: vec3<f32>, msEnergy: vec3<f32>, groundAlbedo: vec3<f32>) -> vec3<f32> {
    let sunShadow = smoothstep(-0.01, 0.01, cosSun);
    var groundRadiance = vec3<f32>(0.0);

    if (sunShadow > 0.0) {
        groundRadiance = (sunTrans * max(0.0, cosSun) * INV_PI + msEnergy) * groundAlbedo * sunShadow;
    } else {
        groundRadiance = msEnergy * groundAlbedo;
    }

    return groundRadiance;
}

fn evaluateIBLRadiance(
    viewDir: vec3<f32>,
    params: SkyAtmosphere,
    transmittanceLUT: texture_2d<f32>,
    multiScatLUT: texture_2d<f32>,
    skyViewLUT: texture_2d<f32>,
    skyAtmosphereSampler: sampler
) -> vec3<f32> {
    let r = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let atmosphereHeight = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
    let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);

    var radiance = skySample.rgb;

    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);

    let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);
    let isGround = r > 0.0 && tEarth > 0.0 && viewDir.y < -0.0001;

    let transToEdge = select(getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), vec3<f32>(skySample.a), isGround);

    let sunShadow = getPlanetShadowMask(camPos, sunDir, r, params);
    if (!isGround && sunShadow > 0.0) {
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge, 0.0);
        radiance += mieGlow * sunShadow;
    }

    return radiance;
}

fn getSpecularSunLobe(viewSun: f32, lobeHalfAngle: f32) -> f32 {
    let cosHalf = cos(lobeHalfAngle);
    let sunLobePower = clamp(log(0.5) / log(max(1e-4, cosHalf)), 2.0, 128.0);
    let sunLobeNorm = (sunLobePower + 1.0) * (0.5 * INV_PI);
    return sunLobeNorm * pow(max(0.0, viewSun), sunLobePower);
}

fn evaluateIBLRadianceCompensated(
    viewDir: vec3<f32>,
    params: SkyAtmosphere,
    transmittanceLUT: texture_2d<f32>,
    multiScatLUT: texture_2d<f32>,
    skyViewLUT: texture_2d<f32>,
    skyAtmosphereSampler: sampler
) -> vec3<f32> {
    let r = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let atmosphereHeight = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
    let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);

    var radiance = skySample.rgb;

    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);

    let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);
    let isGround = r > 0.0 && tEarth > 0.0 && viewDir.y < -0.0001;

    let transToEdge = select(getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), vec3<f32>(skySample.a), isGround);

    let sunShadow = getPlanetShadowMask(camPos, sunDir, r, params);
    if (!isGround && sunShadow > 0.0) {
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge, 0.0);
        radiance += mieGlow * sunShadow;
        radiance += getSunDiskRadianceIBL(viewSunCos, params.sunLimbDarkening, transToEdge, params) * sunShadow;
    }

    return radiance;
}
fn getFrustumRayDirection(uv: vec2<f32>, invP: mat4x4<f32>, invV: mat4x4<f32>) -> vec3<f32> {
    let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
    let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    return normalize(worldRotation * viewSpaceDir);
}

// Procedural noise functions
fn cloud_hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453123);
}

fn cloud_noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(cloud_hash(i + vec2<f32>(0.0, 0.0)), cloud_hash(i + vec2<f32>(1.0, 0.0)), u.x),
               mix(cloud_hash(i + vec2<f32>(0.0, 1.0)), cloud_hash(i + vec2<f32>(1.0, 1.0)), u.x), u.y);
}

fn cloud_fbm(p: vec2<f32>) -> f32 {
    var v = 0.0;
    var a = 0.5;
    var shift = vec2<f32>(100.0);
    var p_mut = p;
    for (var i = 0; i < 5; i = i + 1) {
        v += a * cloud_noise(p_mut);
        p_mut = p_mut * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

fn getCloudWarpedUV(hitP: vec3<f32>, params: SkyAtmosphere) -> vec2<f32> {
    let baseUV = hitP.xz * 0.05 + vec2<f32>(params.cloudTime * 0.02);
    // Domain Warping: Distort UVs with noise to create organic shapes
    let warp = vec2<f32>(
        cloud_noise(baseUV * 1.2 + vec2<f32>(params.cloudTime * 0.01)),
        cloud_noise(baseUV * 1.2 + vec2<f32>(5.7, 1.3) + vec2<f32>(params.cloudTime * 0.012))
    );
    return baseUV + warp * 0.2;
}

fn getCloudDensity(hitP: vec3<f32>, params: SkyAtmosphere) -> f32 {
    let warpedUV = getCloudWarpedUV(hitP, params);
    let density = cloud_fbm(warpedUV);
    let coverage = params.cloudCoverage;
    let softness = (1.0 - params.cloudDensity) * 0.5 + 0.01;
    return smoothstep(1.0 - coverage, 1.0 - coverage + softness, density);
}

fn getCloudNormal(hitP: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
    let warpedUV = getCloudWarpedUV(hitP, params);
    let density = cloud_fbm(warpedUV);
    let eps = 0.2;
    let dIdx = (cloud_fbm(warpedUV + vec2<f32>(eps, 0.0)) - density) / eps;
    let dIdy = (cloud_fbm(warpedUV + vec2<f32>(0.0, eps)) - density) / eps;
    return normalize(vec3<f32>(-dIdx, 2.0, -dIdy));
}
```
