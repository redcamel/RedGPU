#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include color.getLuminance

const MAX_TAU: f32 = 100.0;

// [KO] 태양 물리 상수 (기본값 계산용)
const SUN_ANGULAR_RADIUS_RAD: f32 = 0.00465; // 0.2665 degrees
const SUN_SOLID_ANGLE_BASE: f32 = 6.794e-5;

// [KO] 품질 상수 (내부적으로 고정)
const TRANSMITTANCE_STEPS: u32 = 40u;
const MULTI_SCAT_STEPS: u32 = 40u; // [KO] 20u에서 상향
const SKY_VIEW_STEPS: u32 = 128u;
const AP_STEPS: u32 = 64u; // [KO] 32u에서 상향
const MULTI_SCAT_SAMPLES: u32 = 128u;
const IRRADIANCE_SAMPLES: u32 = 256u;

// [KO] 렌더링 상수를 정의합니다.
const SUN_RADIANCE_BOOST: f32 = 1.0;
const SUN_RADIANCE_THRESHOLD: f32 = 65000.0;
const MIE_GLOW_SUPPRESS: f32 = 0.40; // [KO] 0.10에서 상향 (UE5 스타일의 강력한 글로우)
const MIE_GLOW_THRESHOLD: f32 = 40000.0;
const IBL_RADIANCE_THRESHOLD: f32 = 60000.0;
const NEAR_FIELD_CORRECTION_DIST: f32 = 0.2;

struct AtmosphereDensities {
    rhoR: f32, rhoM: f32, rhoO: f32
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
    var transmittance = textureSampleLevel(transmittanceLUT, skyAtmosphereSampler, uv, 0.0).rgb;
    let mu = clamp(cosTheta, -1.0, 1.0);
    if (mu < 0.0) {
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
    // [KO] 지평선 아래에서 대기가 너무 어두워지는 것을 방지하기 위해 태양 고도 보정
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
        let scatR = params.rayleighScattering * d.rhoR * params.skyLuminanceFactor;
        let mieExt = (params.mieScattering + params.mieAbsorption) * d.rhoM * params.skyLuminanceFactor;
        let absC = params.absorptionCoefficient * d.rhoO;
        
        optExt += (scatR + mieExt + absC) * stepSize;
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

// [KO] LUT 생성에 사용되는 안정적인(부드러운) Mie 위상 함수
// [EN] Stable (smooth) Mie phase function used for LUT generation
fn phaseMieStable(cosTheta: f32, g: f32) -> f32 {
    // [KO] 비등방성 계수를 낮추어 LUT에서의 픽셀화를 방지
    return phaseMie(cosTheta, min(g, 0.65));
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

    var radiance = (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;

    let luma = getLuminance(radiance);
    if (luma > SUN_RADIANCE_THRESHOLD) {
        let softLuma = SUN_RADIANCE_THRESHOLD + (luma - SUN_RADIANCE_THRESHOLD) / (1.0 + (luma - SUN_RADIANCE_THRESHOLD) / SUN_RADIANCE_THRESHOLD);
        radiance = radiance * (softLuma / luma);
    }
    return radiance;
}

fn getSunDiskRadianceIBL(
    viewSunCos: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>,
    params: SkyAtmosphere
) -> vec3<f32> {
    let sunRad = (params.sunSize * 0.5) * DEG_TO_RAD;
    let iblAlpha = sunRad * 2.0; 
    let cosAlpha = cos(iblAlpha);
    
    let radScale = 1.0 / (PI2 * (1.0 - cosAlpha));
    let diff = saturate(1.0 - viewSunCos);
    let sigma_sq = 1.0 - cosAlpha;
    let falloff = exp(-diff / max(1e-7, sigma_sq));
    if (falloff < 0.001) { return vec3<f32>(0.0); }

    var radiance = (radScale * falloff) * skyTrans;
    let luma = getLuminance(radiance);
    if (luma > IBL_RADIANCE_THRESHOLD) {
        let softLuma = IBL_RADIANCE_THRESHOLD + (luma - IBL_RADIANCE_THRESHOLD) / (1.0 + (luma - IBL_RADIANCE_THRESHOLD) / IBL_RADIANCE_THRESHOLD);
        radiance = radiance * (softLuma / luma);
    }
    return radiance;
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
    let halo = select(params.mieAnisotropy, overrideHalo, overrideHalo > 0.0);
    
    // [KO] 언리얼 엔진 스타일의 하이브리드 글로우: (날카로운 위상 - LUT에 포함된 부드러운 위상)
    // [EN] Unreal Engine style hybrid glow: (Sharp Phase - Smooth Phase included in LUT)
    let sharpPhase = phaseMie(viewSunCos, min(halo, 0.99));
    let stablePhase = phaseMieStable(viewSunCos, params.mieAnisotropy);
    let diffPhase = max(0.0, sharpPhase - stablePhase);

    let sunDirY = params.sunDirection.y;
    let sunCosTheta = clamp(sunDirY, -1.0, 1.0); 
    let sunTransForGlow = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, sunCosTheta, params.atmosphereHeight);
    
    var glow = sunTransForGlow * (params.mieScattering / max(vec3<f32>(0.0001), params.mieScattering + params.mieAbsorption)) 
                        * (diffPhase) * (1.0 - transToEdge) * MIE_GLOW_SUPPRESS;

    let luma = getLuminance(glow);
    if (luma > MIE_GLOW_THRESHOLD) {
        let softLuma = MIE_GLOW_THRESHOLD + (luma - MIE_GLOW_THRESHOLD) / (1.0 + (luma - MIE_GLOW_THRESHOLD) / MIE_GLOW_THRESHOLD);
        glow = glow * (softLuma / luma);
    }
    return glow;
}

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
    let phaseR = phaseRayleigh(viewSunCos);
    
    // [KO] LUT 생성 시에는 부드러운 위상 함수를 사용하여 픽셀화 방지
    // [EN] Use a smooth phase function during LUT generation to prevent pixelation
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
            sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, cosSun, params.atmosphereHeight);
        } else {
            sunTrans = getSunTransmittanceManual(p, sunDir, params);
        }
        
        let shadowMask = select(1.0, 0.0, r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0);
        let d = getAtmosphereDensities(viewHeight, params);

        let scatR = params.rayleighScattering * d.rhoR * params.skyLuminanceFactor;
        let scatM = params.mieScattering * d.rhoM * params.skyLuminanceFactor;
        
        let stepScat = (scatR * phaseR + scatM * phaseM) * sunTrans * shadowMask;
        
        let scatTotal = scatR + scatM;
        let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - viewHeight / params.atmosphereHeight, 0.001, 0.999));
        let msScat = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb * scatTotal * shadowMask * params.multiScatteringFactor;

        // [KO] 태양 강도 적용 (단위 계수에서 광휘로 변환)
        // [EN] Apply sun intensity (convert from unit factor to radiance)
        *radiance += *transmittance * (stepScat + msScat) * stepSize * params.sunIntensity;
        *transmittance *= exp(-((scatR + ((params.mieScattering + params.mieAbsorption) * d.rhoM * params.skyLuminanceFactor) + params.absorptionCoefficient * d.rhoO)) * stepSize);
    }
}

fn getCubeMapDirection(uv: vec2<f32>, face: u32) -> vec3<f32> {
    let tex = uv * 2.0 - 1.0;
    var dir: vec3<f32>;
    switch (face) {
        case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); } // +X
        case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); } // -X
        case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }  // +Y
        case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); } // -Y
        case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }  // +Z
        case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); } // -Z
        default: { dir = vec3<f32>(0.0); }
    }
    return dir;
}

fn evaluateGroundRadiance(cosSun: f32, sunTrans: vec3<f32>, msEnergy: vec3<f32>, groundAlbedo: vec3<f32>, sunIntensity: f32) -> vec3<f32> {
    let sunShadow = smoothstep(-0.01, 0.01, cosSun);
    var groundRadiance = vec3<f32>(0.0);
    
    // [KO] 지면 반사광 계산: (직사광 조도 + 다중산란 조도) * (알베도 / PI)
    // [EN] Ground radiance calculation: (Direct Irradiance + Multi-scattering Irradiance) * (Albedo / PI)
    if (sunShadow > 0.0) {
        // [KO] 지면은 거칠기 때문에 하늘만큼 밝은 정반사를 일으키지 않음. 물리적 기반 하에 에너지 보존을 강화하여 차분하게 표현
        // [KO] 다중 산란 에너지(msEnergy)는 이미 적분된 조도 성분이므로 직접 조도와 그대로 합산
        groundRadiance = (sunTrans * max(0.0, cosSun) + msEnergy) * (groundAlbedo * INV_PI) * sunShadow;
    } else {
        groundRadiance = msEnergy * (groundAlbedo * INV_PI);
    }
    
    return groundRadiance * sunIntensity;
}

fn getSpecularSunLobe(viewSun: f32, lobeHalfAngle: f32) -> f32 {
    let cosHalf = cos(lobeHalfAngle);
    let sunLobePower = clamp(log(0.5) / log(max(1e-4, cosHalf)), 2.0, 128.0);
    let sunLobeNorm = (sunLobePower + 1.0) * (0.5 * INV_PI);
    return sunLobeNorm * pow(max(0.0, viewSun), sunLobePower);
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

    let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, params.groundRadius);
    let isGround = r > 0.0 && tEarth > 0.0 && viewDir.y < -0.0001;

    var radiance = vec3<f32>(0.0);
    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);

    if (isGround) {
        let hitP = camPos + viewDir * tEarth;
        let hitNormal = normalize(hitP);
        let cosS = dot(hitNormal, sunDir);
        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, cosS, atmosphereHeight);
        let msEnergy = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
        
        // [KO] 지면 자체의 휘도 평가 (직사광 + 간접광)
        let groundRadiance = evaluateGroundRadiance(cosS, sunT, msEnergy, params.groundAlbedo, params.sunIntensity);

        // [KO] 지면으로부터 실제 카메라 고도까지의 투과율 계산
        let viewZenithCosAngle = dot(hitNormal, -viewDir);
        let viewTransmittance = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, viewZenithCosAngle, atmosphereHeight);
        
        // [KO] 카메라와 지면 사이의 대기 산란광 (in-scattering)
        // [KO] 수평선 부근에서 지면과 하늘이 자연스럽게 이어지도록 보강
        let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
        let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);
        let atmosphericInScattering = skySample.rgb * (1.0 - viewTransmittance);

        let transToEdge = vec3<f32>(skySample.a);
        let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge, 0.80) * params.sunIntensity;

        // [KO] 최종 합성: (지면 휘도 * 대기 감쇄) + 대기 산란광 + 미 글로우
        radiance = groundRadiance * viewTransmittance + atmosphericInScattering + mieGlowAmount * (1.0 - viewTransmittance);
    } else {
        let skyUV = getSkyViewUV(viewDir, viewHeight, r, atmosphereHeight);
        let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);
        
        // [KO] 하늘 휘도 (skySample은 이미 sunIntensity가 포함된 Radiance임)
        radiance = skySample.rgb;

        // [KO] 지평선 근처의 미 산란 글로우 보강 (선명한 수평선 및 파란늘 밝기 확보)
        let transToViewEdge = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight);
        // [KO] 리플렉션의 생동감을 위해 헤일로 강도를 0.90으로 상향 (태양 주변의 강력한 산란광 표현)
        let mieGlowStable = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToViewEdge, 0.90) * params.sunIntensity;
        radiance += mieGlowStable;
    }

    return radiance;
}

fn getFrustumRayDirection(uv: vec2<f32>, invP: mat4x4<f32>, invV: mat4x4<f32>) -> vec3<f32> {
    let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
    let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    return normalize(worldRotation * viewSpaceDir);
}
