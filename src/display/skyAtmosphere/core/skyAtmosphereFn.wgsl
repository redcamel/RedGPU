#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere

const MAX_TAU: f32 = 100.0;

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
    let mu = clamp(cosTheta, -1.0, 1.0);
    // [KO] 경계면 블리딩 방지를 위한 안전 클램핑 (0.001 ~ 0.999)
    // [EN] Safe clamping (0.001 to 0.999) to prevent edge bleeding
    let u = clamp(0.5 + 0.5 * sign(mu) * sqrt(abs(mu)), 0.001, 0.999);
    let v = clamp(1.0 - h / atmosphereHeight, 0.001, 0.999);
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
    // [KO] 방위각(Azimuth) U축에도 경계면 블리딩 방지를 위한 안전 클램핑 추가
    let u = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
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
    // [KO] 수평선 및 양극점(Zenith/Nadir)에서의 아티팩트 방지를 위한 v축 클램핑
    // [EN] v-axis clamping to prevent artifacts at the horizon and poles (Zenith/Nadir)
    return vec2<f32>(u, clamp(v, 0.001, 0.999));
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
        
        // [KO] 오존층 밀도: 물리적으로 더 정확한 Tent Function 기반 프로파일 (Hillaire 2020)
        // [EN] Ozone density: Physically more accurate Tent Function based profile (Hillaire 2020)
        let ozoneDist = abs(h - params.ozoneLayerCenter);
        d.rhoO = max(0.0, 1.0 - ozoneDist / params.ozoneLayerWidth);
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
        optExt += integrateOpticalDepth(p, sunDir, 0.0, intersect.x, 20u, params);
        if (intersect.y > 0.0 && tMax > intersect.y) {
            optExt += integrateOpticalDepth(p, sunDir, intersect.y, tMax, 20u, params);
        }
    } else {
        optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 40u, params);
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
/**
 * [KO] 수평선 근처에서 태양이 수직으로 압축되는 효과를 반영한 View-Sun Cosine 값을 계산합니다.
 * [EN] Calculates the View-Sun Cosine value reflecting the vertical squashing effect of the sun near the horizon.
 */
fn getSquashedViewSunCos(viewDir: vec3<f32>, sunDir: vec3<f32>) -> f32 {
    let sunElevationParam = saturate(sunDir.y);
    let squashFactor = mix(0.85, 1.0, sunElevationParam);
    let verticalDist = viewDir.y - sunDir.y;
    
    // [KO] 천장(Zenith) 및 태양 반대편에서의 아티팩트 방지를 위한 가드 조건
    let correctionGuard = saturate(dot(viewDir, sunDir) * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
    let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) * correctionGuard;
    
    return dot(viewDir, sunDir) - squashCorrection;
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

    var radiance = (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;

    // [KO] 휘도 피크 억제 (Soft-Knee Clamping): 점 아티팩트 및 f16 폭주 방지
    // [EN] Suppress radiance peaks (Soft-Knee Clamping): Prevent dot artifacts and f16 explosion
    let luma = dot(radiance, vec3<f32>(0.299, 0.587, 0.114));
    let threshold = 500.0; // 태양 본체는 Mie Glow보다 높은 임계값 적용
    if (luma > threshold) {
        let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
        radiance = radiance * (softLuma / luma);
    }

    return radiance;
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
    // [KO] IBL 안정성을 위해 태양 반지름을 약 15도(sigma=7.5)로 대폭 분산시킴.
    // [KO] 중요도 샘플링(Importance Sampling) 시 샘플들이 태양을 놓치지 않도록 충분히 넓은 영역을 확보합니다.
    // [EN] Spread the sun radius to about 15 degrees (sigma=7.5) for maximum IBL stability.
    // [EN] Ensure a wide enough area so that importance sampling doesn't miss the sun.
    const IBL_SUN_ALPHA: f32 = 0.26; // ~15 degrees
    const IBL_SUN_COS: f32 = 0.9659; // cos(IBL_SUN_ALPHA)
    const IBL_RADIANCE_SCALE: f32 = 4.66; // 1.0 / (2 * PI * (1 - IBL_SUN_COS))

    let diff = saturate(1.0 - viewSunCos);
    let sigma_sq = 1.0 - IBL_SUN_COS;
    
    // [KO] Exponential falloff (Gaussian approximation)
    let falloff = exp(-diff / max(1e-7, sigma_sq));
    if (falloff < 0.001) { return vec3<f32>(0.0); }

    // [KO] 에너지 정규화
    var radiance = (IBL_RADIANCE_SCALE * falloff) * skyTrans;

    // [KO] IBL 휘도 피크 억제: 샘플링 시 에일리언싱 및 Fireflies 방지
    let luma = dot(radiance, vec3<f32>(0.299, 0.587, 0.114));
    let threshold = 100.0; // 넓어진 면적에 맞춰 임계값을 더 낮춰 수치적 안정성 확보
    if (luma > threshold) {
        let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
        radiance = radiance * (softLuma / luma);
    }

    return radiance;
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
    
    // [KO] LUT에서 누락된 '날카로운(Sharp)' Mie 성분만 별도로 계산하여 합산
    // [KO] LUT 생성 시 Mie 산란의 (1.0 - mieGlow) 비중만 계산했으므로, 나머지를 보충함
    // [EN] Separately calculate and add only the 'Sharp' Mie component missing from the LUT
    // [EN] Since only (1.0 - mieGlow) of Mie scattering was calculated during LUT generation, the rest is supplemented
    let sharpPhase = phaseMie(viewSunCos, min(halo, 0.98));

    // [KO] 태양 방향의 투과율 참조 (카메라 높이 h 기준)
    // [EN] Reference sun transmittance (based on camera height h)
    let sunDirY = params.sunDirection.y;
    let sunCosTheta = clamp(sunDirY, -1.0, 1.0); 
    let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, h, sunCosTheta, params.atmosphereHeight);
    
    // [KO] 중복 배율 제거: (1.0 - transToEdge) 내부에 이미 skyViewScatMult가 반영되어 있으므로 추가 배율 없이 계산
    // [KO] (params.mieScattering / params.mieExtinction)은 단일 산란 알베도(SSA) 역할
    // [EN] Remove redundant multiplier: Since skyViewScatMult is already reflected in (1.0 - transToEdge)
    // [EN] (params.mieScattering / params.mieExtinction) acts as Single Scattering Albedo (SSA)
    var glow = sunTransForGlow * (params.mieScattering / max(0.0001, params.mieExtinction)) 
                        * (sharpPhase * params.mieGlow) * (1.0 - transToEdge);

    // [KO] 휘도 피크 억제 (Soft-Knee Clamping): f16 텍스처 안정성 확보 및 시각적 타버림 방지
    // [EN] Suppress radiance peaks (Soft-Knee Clamping): Ensure f16 texture stability and prevent visual burnout
    let luma = dot(glow, vec3<f32>(0.299, 0.587, 0.114));
    let threshold = 100.0;
    if (luma > threshold) {
        // [KO] 임계값(100.0) 이상에서 에너지를 부드럽게 수렴시켜 수치적 폭주 방지
        // [EN] Softly converge energy above the threshold (100.0) to prevent numerical explosion
        let softLuma = threshold + (luma - threshold) / (1.0 + (luma - threshold) / threshold);
        glow = glow * (softLuma / luma);
    }
    return glow;
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
        
        // [KO] 다중 산란광 계산: msLUT는 전체 산란 에너지 보정 비율이므로, 현재의 전체 산란 계수(scaled)와 직접 곱합니다.
        // [EN] Multi-Scattering calculation: msLUT is the total scattering energy compensation ratio, 
        // [EN] so multiply it directly with the current total scattering coefficient (scaled).
        let scatTotal = scatR + vec3<f32>(scatM + scatF);
        let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - h / params.atmosphereHeight, 0.001, 0.999));
        let msScat = textureSampleLevel(atmosphereMultiScatTexture, atmosphereSampler, msUV, 0.0).rgb * scatTotal * shadowMask;

        let ext = scatR + vec3<f32>(params.mieExtinction * d.rhoM * params.skyViewScatMult) + params.ozoneAbsorption * d.rhoO + vec3<f32>(scatF);

        *radiance += *transmittance * (stepScat + msScat) * stepSize;
        *transmittance *= exp(-ext * stepSize);
    }
}
