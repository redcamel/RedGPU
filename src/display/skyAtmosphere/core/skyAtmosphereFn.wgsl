#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere

const MAX_TAU: f32 = 50.0;

// [KO] 태양 물리 상수 (기본값 계산용)
const SUN_ANGULAR_RADIUS_RAD: f32 = 0.00465; // 0.2665 degrees
const SUN_SOLID_ANGLE_BASE: f32 = 6.794e-5;

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
    // [KO] 수평선(cosTheta = 0) 부근의 정밀도를 높이기 위한 비선형 매핑
    // [EN] Non-linear mapping to increase precision near the horizon (cosTheta = 0)
    let mu = cosTheta;
    let u = 0.5 + 0.5 * sign(mu) * sqrt(abs(mu));
    let v = 1.0 - clamp(h / atmosphereHeight, 0.0, 1.0);
    return vec2<f32>(u, v);
}

fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, earthRadius: f32, atmosphereHeight: f32) -> vec2<f32> {
    // [KO] Zenith/Nadir 부근에서의 atan2(0, 0) 특이점 방지
    var azimuth: f32;
    if (abs(viewDir.z) < 1e-6 && abs(viewDir.x) < 1e-6) {
        azimuth = 0.0;
    } else {
        azimuth = atan2(viewDir.z, viewDir.x);
    }
    let u = (azimuth / PI2) + 0.5;
    let r = earthRadius;
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
        // [KO] 산란 배율 적용
        optExt += (params.rayleighScattering * d.rhoR * params.skyViewScatMult 
                   + vec3<f32>(params.mieExtinction * d.rhoM * params.skyViewScatMult) 
                   + params.ozoneAbsorption * d.rhoO) * stepSize;
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

fn phaseMieDual(cosTheta: f32, g: f32, halo: f32, glow: f32) -> f32 {
    return mix(phaseMie(cosTheta, g), phaseMie(cosTheta, halo), glow);
}

/**
 * [KO] 태양 본체의 물리적 휘도(Radiance)를 계산합니다. (Unit Scale)
 * [EN] Calculates the physical radiance of the sun disk. (Unit Scale)
 */
fn getSunDiskRadianceUnit(
    viewSunCos: f32,
    sunSize: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>,
    edgeSoftness: f32 
) -> vec3<f32> {
    let sunRad = sunSize * DEG_TO_RAD;
    let cosSunRad = cos(sunRad);
    
    // [KO] 고체각 기반 휘도 배율 계산 (에너지 보존)
    let solidAngle = PI2 * (1.0 - cosSunRad);
    
    // [KO] f16 오버플로우 방지 및 물리적 정확도 확보 (최소 고체각 제한: 태양 물리 상수 6.794e-5 기준)
    // [EN] Prevent f16 overflow and ensure physical accuracy (Minimum solid angle limit: based on sun physical constant 6.794e-5)
    let radianceScale = 1.0 / max(6.7e-5, solidAngle); 

    let dist = (1.0 - viewSunCos) / max(1e-7, 1.0 - cosSunRad);
    let sunMask = 1.0 - smoothstep(1.0 - edgeSoftness, 1.0, dist);
    if (sunMask <= 0.0) { return vec3<f32>(0.0); }

    // [KO] 주연 감광 및 정규화
    let limbDarkening = pow(max(1e-7, 1.0 - saturate(dist)), sunLimbDarkening);
    let energyNormalization = sunLimbDarkening + 1.0;

    return (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;
}

/**
 * [KO] IBL(반사 큐브맵) 전용 태양 휘도를 계산합니다. (Gaussian 모델)
 * [EN] Calculates sun radiance for IBL using a Gaussian-like profile. (Unit Scale)
 */
fn getSunDiskRadianceIBL(
    viewSunCos: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>
) -> vec3<f32> {
    // [KO] IBL 안정성을 위해 태양 반지름을 약 4도(sigma=2.0)로 크게 분산시킴.
    // [KO] Gaussian profile: L = L0 * exp(-(1-cosTheta)/(1-cosAlpha))
    const IBL_SUN_ALPHA: f32 = 0.07; // ~4 degrees
    const IBL_SUN_COS: f32 = 0.9975; // cos(IBL_SUN_ALPHA)
    const IBL_RADIANCE_SCALE: f32 = 63.66; // 1.0 / (2 * PI * (1 - IBL_SUN_COS))

    let diff = saturate(1.0 - viewSunCos);
    let sigma_sq = 1.0 - IBL_SUN_COS;
    
    // [KO] Exponential falloff (Gaussian approximation)
    let falloff = exp(-diff / max(1e-7, sigma_sq));
    if (falloff < 0.001) { return vec3<f32>(0.0); }

    // [KO] 에너지 정규화 (주연 감광 무시하고 가우시안 면적으로 정규화)
    return (IBL_RADIANCE_SCALE * falloff) * skyTrans;
}

/**
 * [KO] 실시간 Mie Glow(Hybrid) 강도를 계산합니다. (Unit Scale)
 * [EN] Calculates real-time Mie Glow (Hybrid) intensity (Unit Scale).
 */
fn getMieGlowAmountUnit(
    viewSunCos: f32,
    h: f32, 
    params: SkyAtmosphere, 
    transmittanceTexture: texture_2d<f32>, 
    atmosphereSampler: sampler,
    transToEdge: vec3<f32>,
    overrideHalo: f32 // [KO] 비등방성 계수 오버라이드 (0.0이면 기본값 사용)
) -> vec3<f32> {
    let halo = select(params.mieHalo, overrideHalo, overrideHalo > 0.0);
    
    // [KO] 전체 Mie 에너지는 보존하면서 위상 함수만 분리하여 처리
    // [KO] Glow = (Sharp Phase - Base Phase) * Glow Amount
    // [EN] Conserve total Mie energy while processing phase functions separately
    // [EN] Glow = (Sharp Phase - Base Phase) * Glow Amount
    let basePhase = phaseMie(viewSunCos, params.mieAnisotropy);
    let sharpPhase = phaseMie(viewSunCos, min(halo, 0.98));
    let diffPhase = max(0.0, sharpPhase - basePhase);

    let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, h, params.sunDirection.y, params.atmosphereHeight);
    
    // [KO] (params.mieScattering / params.mieExtinction)은 단일 산란 알베도(SSA) 역할
    // [EN] (params.mieScattering / params.mieExtinction) acts as Single Scattering Albedo (SSA)
    return params.skyViewScatMult * sunTransForGlow * (params.mieScattering / max(0.0001, params.mieExtinction)) 
                        * (diffPhase * params.mieGlow) * (1.0 - transToEdge);
}

fn integrateScatSegment(
    origin: vec3<f32>, dir: vec3<f32>, 
    tMin: f32, tMax: f32, steps: u32, 
    params: SkyAtmosphere,
    atmosphereTransmittanceTexture: texture_2d<f32>, 
    atmosphereSampler: sampler,
    atmosphereMultiScatTexture: texture_2d<f32>,
    useLUT: bool,
    includeGlow: bool,
    radiance: ptr<function, vec3<f32>>, 
    transmittance: ptr<function, vec3<f32>>
) {
    if (tMax <= tMin) { return; }
    let r = params.earthRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);
    
    let phaseR = phaseRayleigh(viewSunCos);
    
    var phaseM: f32;
    if (includeGlow) {
        // [KO] 전체 에너지가 1로 정규화된 듀얼 위상 함수 사용
        // [EN] Use dual phase function normalized to total energy of 1
        phaseM = phaseMieDual(viewSunCos, params.mieAnisotropy, params.mieHalo, params.mieGlow);
    } else {
        // [KO] Glow로 빠져나갈 에너지를 제외한 '기본 Mie' 성분만 계산 (에너지 보존)
        // [KO] Integral of phaseM is (1.0 - mieGlow).
        // [EN] Calculate only the 'Base Mie' component excluding the energy that will go to Glow (Energy conservation)
        // [EN] Integral of phaseM is (1.0 - mieGlow).
        phaseM = phaseMie(viewSunCos, params.mieAnisotropy) * (1.0 - params.mieGlow);
    }
    
    let phaseF = phaseMie(viewSunCos, params.heightFogAnisotropy);

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

        let scatR = params.rayleighScattering * d.rhoR * params.skyViewScatMult;
        let scatM = params.mieScattering * d.rhoM * params.skyViewScatMult;
        let scatF = params.heightFogDensity * d.rhoF * params.skyViewScatMult;
        
        let stepScat = (scatR * phaseR + vec3<f32>(scatM * phaseM + scatF * phaseF)) * sunTrans * shadowMask;
        
        // [KO] 중복 배율 제거: msScat 계산 시 scatR/M/F에 이미 skyViewScatMult가 포함되어 있으므로 추가 배율 없이 합산
        let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
        let msScat = textureSampleLevel(atmosphereMultiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (scatR + vec3<f32>(scatM + scatF)) * shadowMask;

        let ext = scatR + vec3<f32>(params.mieExtinction * d.rhoM * params.skyViewScatMult) + params.ozoneAbsorption * d.rhoO + vec3<f32>(scatF);

        *radiance += *transmittance * (stepScat + msScat) * stepSize;
        *transmittance *= exp(-ext * stepSize);
    }
}
