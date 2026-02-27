#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere

const MAX_TAU: f32 = 50.0;

/**
 * [KO] 특정 고도에서의 대기 성분별 밀도 구조체
 * [EN] Atmospheric density structure by component at a specific altitude
 */
struct AtmosphereDensities {
    rhoR: f32, // Rayleigh
    rhoM: f32, // Mie
    rhoF: f32, // Height Fog
    rhoO: f32  // Ozone
};

/**
 * [KO] 산란 및 소멸 계수 구조체
 * [EN] Scattering and extinction coefficients structure
 */
struct AtmosphereCoefficients {
    scatR: vec3<f32>,
    scatM: vec3<f32>,
    scatF: vec3<f32>,
    extinction: vec3<f32>
};

// [KO] 레이-구체 교차점 계산
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

/**
 * [KO] 행성 본체와의 정밀 교차 정보 (tIn, tOut) 반환
 * [EN] Returns precise planet intersection info (tIn, tOut)
 */
fn getPlanetIntersection(origin: vec3<f32>, dir: vec3<f32>, r: f32) -> vec2<f32> {
    let b = dot(origin, dir);
    let c = dot(origin, origin) - r * r;
    let delta = b * b - c;
    if (delta < 0.0) { return vec2<f32>(-1.0); }
    let s = sqrt(delta);
    return vec2<f32>(-b - s, -b + s);
}

// [KO] LUT UV 매핑 함수군 (UE5 표준)
fn getTransmittanceUV(h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
    let H = clamp(h / atmosphereHeight, 0.0, 1.0);
    let mu = cosTheta * 0.5 + 0.5;
    return vec2<f32>(mu, 1.0 - H);
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

// [KO] 페이즈 함수
fn phaseRayleigh(cosTheta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

fn phaseMie(cosTheta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(EPSILON, 1.0 + g2 - 2.0 * g * cosTheta), 1.5));
}

/**
 * [KO] 고도별 대기 성분 밀도 산출 (진공 처리 포함)
 * [EN] Calculate atmospheric component densities by altitude (includes vacuum handling)
 */
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

/**
 * [KO] 밀도와 파라미터를 결합하여 최종 산란/소멸 계수 산출
 * [EN] Calculate final scattering/extinction coefficients by combining densities and parameters
 */
fn getAtmosphereCoefficients(d: AtmosphereDensities, params: SkyAtmosphere) -> AtmosphereCoefficients {
    var c: AtmosphereCoefficients;
    c.scatR = params.rayleighScattering * d.rhoR;
    c.scatM = vec3<f32>(params.mieScattering * d.rhoM);
    c.scatF = vec3<f32>(params.heightFogDensity * d.rhoF);
    c.extinction = c.scatR + vec3<f32>(params.mieExtinction * d.rhoM) + params.ozoneAbsorption * d.rhoO + c.scatF;
    return c;
}

// [KO] 전체 소멸 계수 (기존 함수 유지, 리팩토링용)
fn getTotalExtinction(h: f32, params: SkyAtmosphere) -> vec3<f32> {
    let d = getAtmosphereDensities(h, params);
    let c = getAtmosphereCoefficients(d, params);
    return c.extinction;
}

/**
 * [KO] 특정 구간의 광학 깊이를 정밀하게 적분
 * [EN] Precisely integrate optical depth over a specific segment
 */
fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
    if (tMax <= tMin) { return vec3<f32>(0.0); }
    let stepSize = (tMax - tMin) / f32(steps);
    var optExt = vec3<f32>(0.0);
    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let h = length(origin + dir * t) - params.earthRadius;
        optExt += getTotalExtinction(h, params) * stepSize;
    }
    return optExt;
}

/**
 * [KO] 수동 태양 투과율 적분 (Hollow Shell 및 Ghost Planet 대응)
 * [EN] Manual sun transmittance integration (Handles Hollow Shell and Ghost Planet)
 */
fn getSunTransmittanceManual(p: vec3<f32>, sunDir: vec3<f32>, params: SkyAtmosphere) -> vec3<f32> {
    let r = params.earthRadius;
    let tMax = getRaySphereIntersection(p, sunDir, r + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(1.0); }

    let intersect = getPlanetIntersection(p, sunDir, r);
    var optExt = vec3<f32>(0.0);
    
    if (intersect.x > EPSILON && intersect.x < tMax) {
        optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, 16u, params);
        if (intersect.y > 0.0 && tMax > intersect.y) {
            optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, 16u, params);
        }
    } else {
        optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 32u, params);
    }
    return exp(-min(optExt, vec3<f32>(MAX_TAU)));
}

// [KO] 투과율 샘플링 (LUT 기반)
fn getTransmittance(tTex: texture_2d<f32>, tSam: sampler, h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
    let uv = getTransmittanceUV(h, cosTheta, atmosphereHeight);
    return textureSampleLevel(tTex, tSam, uv, 0.0).rgb;
}

// [KO] 물리 기반 투과율 (상황에 따라 LUT/수동 선택)
fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmH: f32, params: SkyAtmosphere) -> vec3<f32> {
    let tMax = getRaySphereIntersection(p, sunDir, r + atmH);
    if (tMax <= 0.0) { return vec3<f32>(1.0); }

    let intersect = getPlanetIntersection(p, sunDir, r);
    if (params.useGround > 0.5 && intersect.x > EPSILON) { return vec3<f32>(0.0); }

    // [KO] 지면을 관통하거나 Ghost Planet 모드인 경우 수동 적분 수행
    if (params.useGround < 0.5 || (intersect.x > EPSILON && intersect.x < tMax)) {
        return getSunTransmittanceManual(p, sunDir, params);
    }
    
    let h = length(p) - r;
    let cosTheta = dot(normalize(p), sunDir);
    return getSunTransmittanceManual(p, sunDir, params); // TODO: LUT 샘플링으로 최적화 가능하나 일단 일관성을 위해 유지
}
