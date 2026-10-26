#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include systemStruct.SkyAtmosphere

const MAX_TAU: f32 = 100.0;

const TRANSMITTANCE_STEPS: u32 = 40u;
const MULTI_SCAT_STEPS: u32 = 40u;
const SKY_VIEW_STEPS: u32 = 128u;
const AP_STEPS: u32 = 64u;

const MIE_GLOW_SUPPRESS: f32 = 0.40;
const NEAR_FIELD_CORRECTION_DIST: f32 = 0.2;

/**
 * [KO] 특정 고도에서의 레일리, 미, 오존 입자 밀도를 담는 구조체입니다.
 * [EN] Structure holding Rayleigh, Mie, and Ozone particle densities at a specific altitude.
 */
struct AtmosphereDensities {
    rhoR: f32, rhoM: f32, rhoO: f32
};

/**
 * [KO] 광선과 구의 첫 번째 양수 교차 거리를 계산합니다. (교차하지 않으면 -1.0 반환)
 * [EN] Calculates the first positive intersection distance between a ray and a sphere. (Returns -1.0 if no intersection)
 */
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
 * [KO] 고도와 천정각 코사인 값을 Transmittance LUT의 UV 좌표로 변환합니다.
 * [EN] Converts altitude and zenith angle cosine into UV coordinates for the Transmittance LUT.
 */
fn getTransmittanceUV(viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
    let mu = clamp(cosTheta, -1.0, 1.0);
    let u = clamp(0.5 + 0.5 * sign(mu) * sqrt(abs(mu)), 0.001, 0.999);
    let v = clamp(1.0 - viewHeight / atmosphereHeight, 0.001, 0.999);
    return vec2<f32>(u, v);
}

/**
 * [KO] 시선 방향과 카메라 고도를 지평선 중심 비선형 매핑이 적용된 SkyView LUT UV 좌표로 변환합니다.
 * [EN] Converts view direction and camera altitude into SkyView LUT UV coordinates with horizon-centered non-linear mapping.
 */
fn getSkyViewUV(viewDir: vec3<f32>, viewHeight: f32, groundRadius: f32) -> vec2<f32> {
    var azimuth: f32;
    if (abs(viewDir.z) < 1e-6 && abs(viewDir.x) < 1e-6) {
        azimuth = 0.0;
    } else {
        azimuth = atan2(viewDir.z, viewDir.x);
    }
    let u = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
    let h = max(0.0001, viewHeight);
    
    let horizonCos = -sqrt(max(0.0, h * (2.0 * groundRadius + h))) / (groundRadius + h);
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

/**
 * [KO] 특정 고도와 각도에서의 대기 투과율(Transmittance)을 조회하고 지평선 하단 차폐를 적용합니다.
 * [EN] Retrieves atmospheric transmittance at a specific altitude and angle with sub-horizon ground occlusion.
 */
fn getTransmittance(transmittanceLUT: texture_2d<f32>, skyAtmosphereSampler: sampler, viewHeight: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
    let uv = getTransmittanceUV(viewHeight, cosTheta, atmosphereHeight);
    var transmittance = textureSampleLevel(transmittanceLUT, skyAtmosphereSampler, uv, 0.0).rgb;
    if (cosTheta < 0.0) {
        transmittance *= smoothstep(-0.015, 0.0, cosTheta);
    }
    return transmittance;
}

/**
 * [KO] 지정된 위치에서 태양 방향이 행성 지표면에 의해 차폐되는지 여부를 판별합니다. (차폐 시 0.0, 비차폐 시 1.0)
 * [EN] Determines whether the sun direction from a given position is occluded by the planet surface. (0.0 if occluded, 1.0 otherwise)
 */
fn getPlanetShadowMask(p: vec3<f32>, sunDir: vec3<f32>, r: f32) -> f32 {
    if (r > 0.0 && getRaySphereIntersection(p, sunDir, r) > 0.0) { return 0.0; }
    return 1.0;
}

/**
 * [KO] 주어진 고도(km)에서 레일리, 미, 오존 입자의 상대 밀도를 계산합니다.
 * [EN] Calculates the relative densities of Rayleigh, Mie, and Ozone particles at a given altitude (km).
 */
fn getAtmosphereDensities(viewHeight: f32, params: SkyAtmosphere) -> AtmosphereDensities {
    var d: AtmosphereDensities;
    d.rhoR = exp(-viewHeight / params.rayleighExponentialDistribution);
    d.rhoM = exp(-viewHeight / params.mieExponentialDistribution);
    let ozoneDist = abs(viewHeight - params.absorptionTipAltitude);
    d.rhoO = max(0.0, 1.0 - ozoneDist / params.absorptionTentWidth);
    return d;
}

/**
 * [KO] 광선 구간을 따라 레일리, 미, 오존에 의한 누적 광학 깊이(Optical Depth)를 수치 적분합니다.
 * [EN] Numerically integrates cumulative optical depth from Rayleigh, Mie, and Ozone along a ray segment.
 */
fn integrateOpticalDepth(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, params: SkyAtmosphere) -> vec3<f32> {
    if (tMax <= tMin) { return vec3<f32>(0.0); }
    let stepSize = (tMax - tMin) / f32(steps);
    var totalRho = vec3<f32>(0.0);
    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pSq = dot(p, p);
        let invPLen = inverseSqrt(pSq);
        let viewHeight = (pSq * invPLen) - params.groundRadius;
        if (viewHeight < 0.0) { continue; }
        let d = getAtmosphereDensities(viewHeight, params);
        totalRho += vec3<f32>(d.rhoR, d.rhoM, d.rhoO);
    }
    let mieExt = params.mieScattering + params.mieAbsorption;
    return (params.rayleighScattering * totalRho.x + mieExt * totalRho.y + params.absorptionCoefficient * totalRho.z) * stepSize;
}

/**
 * [KO] 레일리 산란(Rayleigh Scattering) 위상 함수를 평가합니다.
 * [EN] Evaluates the Rayleigh scattering phase function.
 */
fn phaseRayleigh(cosTheta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

/**
 * [KO] Henyey-Greenstein 근사 기반 미 산란(Mie Scattering) 위상 함수를 평가합니다.
 * [EN] Evaluates the Mie scattering phase function based on the Henyey-Greenstein approximation.
 */
fn phaseMie(cosTheta: f32, g: f32) -> f32 {
    let g2 = g * g;
    let denom = max(EPSILON, 1.0 + g2 - 2.0 * g * cosTheta);
    let invSqrtDenom = inverseSqrt(denom);
    let invDenom15 = invSqrtDenom * invSqrtDenom * invSqrtDenom;
    return (0.25 * INV_PI) * ((1.0 - g2) * invDenom15);
}

/**
 * [KO] LUT 베이킹 시 특이점 방지를 위해 비등방성 계수 상한(0.80)을 제한한 안정화 미 위상 함수입니다.
 * [EN] Stabilized Mie phase function with anisotropy capped at 0.80 to prevent singularities during LUT baking.
 */
fn phaseMieStable(cosTheta: f32, g: f32) -> f32 {
    return phaseMie(cosTheta, min(g, 0.80));
}

/**
 * [KO] 일출/일몰 시 대기 굴절에 의해 태양 디스크가 수직으로 압축되는 코사인 각도를 보정합니다.
 * [EN] Adjusts the view-sun cosine angle for vertical sun disk squashing caused by atmospheric refraction near the horizon.
 */
fn getSquashedViewSunCos(viewDir: vec3<f32>, sunDir: vec3<f32>) -> f32 {
    let viewSunDot = dot(viewDir, sunDir);
    if (viewSunDot <= 0.0) { return viewSunDot; }
    let sunElevationParam = saturate(sunDir.y);
    let squashFactor = mix(0.85, 1.0, sunElevationParam);
    let verticalDist = viewDir.y - sunDir.y;
    let correctionGuard = saturate(viewSunDot * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
    let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) * correctionGuard;
    return viewSunDot - squashCorrection;
}

/**
 * [KO] 주연 감광(Limb Darkening)이 적용된 태양 디스크의 단위 복사휘도를 계산합니다.
 * [EN] Calculates the unit radiance of the sun disk with limb darkening applied.
 */
fn getSunDiskRadianceUnit(
    viewSunCos: f32,
    sunSize: f32,
    sunLimbDarkening: f32,
    skyTrans: vec3<f32>
) -> vec3<f32> {
    let sunRad = (sunSize * 0.5) * DEG_TO_RAD;
    let cosSunRad = cos(sunRad);
    if (viewSunCos <= cosSunRad) { return vec3<f32>(0.0); }
    let oneMinusCosSunRad = 1.0 - cosSunRad;
    let dist = (1.0 - viewSunCos) / max(1e-7, oneMinusCosSunRad);
    let sunMask = 1.0 - smoothstep(0.99, 1.0, dist);
    if (sunMask <= 0.0) { return vec3<f32>(0.0); }

    let solidAngle = PI2 * oneMinusCosSunRad;
    let radianceScale = 1.0 / max(6.7e-5, solidAngle); 
    let limbDarkening = pow(max(1e-7, 1.0 - saturate(dist)), sunLimbDarkening);
    let energyNormalization = sunLimbDarkening + 1.0;

    return (radianceScale * limbDarkening * energyNormalization * sunMask) * skyTrans;
}

/**
 * [KO] IBL 큐브맵 베이킹 시 앨리어싱 방지를 위해 가우시안 감쇠로 완화한 태양 디스크 복사휘도를 계산합니다.
 * [EN] Calculates Gaussian-softened sun disk radiance to prevent aliasing during IBL cubemap baking.
 */
fn getSunDiskRadianceIBL(
    viewSunCos: f32,
    skyTrans: vec3<f32>,
    params: SkyAtmosphere
) -> vec3<f32> {
    let sunRad = (params.sunSize * 0.5) * DEG_TO_RAD;
    let iblAlpha = max(sunRad * 2.0, 0.175); 
    let cosAlpha = cos(iblAlpha);
    let sigma_sq = 1.0 - cosAlpha;
    let diff = saturate(1.0 - viewSunCos);
    let falloff = exp(-diff / max(1e-7, sigma_sq));
    if (falloff < 0.001) { return vec3<f32>(0.0); }

    let radScale = 1.0 / (PI2 * sigma_sq);
    return (radScale * falloff) * skyTrans / PI;
}

/**
 * [KO] 태양 주변의 날카로운 전방 미 산란 광륜(Mie Glow) 보정치를 계산합니다.
 * [EN] Calculates the sharp forward Mie scattering glow (solar aureole) around the sun.
 */
fn getMieGlowAmountUnit(
    viewSunCos: f32,
    viewHeight: f32, 
    params: SkyAtmosphere, 
    transmittanceLUT: texture_2d<f32>, 
    skyAtmosphereSampler: sampler,
    transToEdge: vec3<f32>
) -> vec3<f32> {
    let sharpG = min(max(params.mieAnisotropy, 0.88), 0.94); 
    let stableG = min(params.mieAnisotropy, 0.80);

    let sharpPhase = phaseMie(viewSunCos, sharpG);
    let stablePhase = phaseMie(viewSunCos, stableG);
    let diffPhase = max(0.0, sharpPhase - stablePhase);
    if (diffPhase <= 0.0) { return vec3<f32>(0.0); }

    let sunTransForGlow = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, params.sunDirection.y, params.atmosphereHeight);
    
    return sunTransForGlow * (params.mieScattering / max(vec3<f32>(0.0001), params.mieScattering + params.mieAbsorption)) 
                        * (diffPhase) * (1.0 - transToEdge) * MIE_GLOW_SUPPRESS * params.skyLuminanceFactor;
}

/**
 * [KO] 광선 구간을 따라 단일 및 다중 대기 산란 복사휘도와 투과율을 적분합니다.
 * [EN] Integrates single and multiple atmospheric scattering radiance and transmittance along a ray segment.
 */
fn integrateScatSegment(
    origin: vec3<f32>, dir: vec3<f32>, 
    tMin: f32, tMax: f32, steps: u32, 
    params: SkyAtmosphere,
    transmittanceLUT: texture_2d<f32>, 
    skyAtmosphereSampler: sampler,
    multiScatLUT: texture_2d<f32>,
    radiance: ptr<function, vec3<f32>>, 
    transmittance: ptr<function, vec3<f32>>
) {
    if (tMax <= tMin) { return; }
    let r = params.groundRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);
    
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = phaseMieStable(viewSunCos, params.mieAnisotropy);
    let rayleighScatLuminous = params.rayleighScattering * params.skyLuminanceFactor;
    let mieScatLuminous = params.mieScattering * params.skyLuminanceFactor;
    let mieExtPhys = params.mieScattering + params.mieAbsorption;
    let invAtmosphereHeight = 1.0 / params.atmosphereHeight;

    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pSq = dot(p, p);
        let invPLen = inverseSqrt(pSq);
        let pLen = pSq * invPLen;
        let viewHeight = pLen - r;
        
        if (r > 0.0 && viewHeight < 0.0) { continue; }

        let d = getAtmosphereDensities(viewHeight, params);

        if (getPlanetShadowMask(p, sunDir, r) > 0.0) {
            let up = p * invPLen;
            let cosSun = dot(up, sunDir);
            
            let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, cosSun, params.atmosphereHeight);

            let scatR_luminous = rayleighScatLuminous * d.rhoR;
            let scatM_luminous = mieScatLuminous * d.rhoM;
            
            let stepScat = (scatR_luminous * phaseR + scatM_luminous * phaseM) * sunTrans;
            
            let scatTotal_luminous = scatR_luminous + scatM_luminous;
            let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.001, 0.999), clamp(1.0 - viewHeight * invAtmosphereHeight, 0.001, 0.999));
            let msScat = textureSampleLevel(multiScatLUT, skyAtmosphereSampler, msUV, 0.0).rgb * scatTotal_luminous * params.multiScatteringFactor;

            *radiance += *transmittance * (stepScat + msScat) * stepSize;
        }
        
        let extinction_phys = params.rayleighScattering * d.rhoR + mieExtPhys * d.rhoM + params.absorptionCoefficient * d.rhoO;
        *transmittance *= exp(-extinction_phys * stepSize);
    }
}

/**
 * [KO] 큐브맵 면(Face) 인덱스와 정규화 UV 좌표를 3D 방향 벡터로 변환합니다.
 * [EN] Converts a cubemap face index and normalized UV coordinates into a 3D direction vector.
 */
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

/**
 * [KO] 태양 직접광 투과율과 다중 산란 에너지를 기반으로 지표면 난반사 복사휘도를 평가합니다.
 * [EN] Evaluates ground diffuse radiance based on direct sun transmittance and multi-scattering energy.
 */
fn evaluateGroundRadiance(cosSun: f32, sunTrans: vec3<f32>, msEnergy: vec3<f32>, groundAlbedo: vec3<f32>) -> vec3<f32> {
    let sunShadow = smoothstep(-0.01, 0.01, cosSun);
    if (sunShadow > 0.0) {
        return (sunTrans * max(0.0, cosSun) * INV_PI + msEnergy) * groundAlbedo * sunShadow;
    }
    return msEnergy * groundAlbedo;
}

/**
 * [KO] IBL 큐브맵 베이킹을 위해 주어진 시선 방향의 하늘 산란광, 미 산란 광륜 및 태양 디스크 복사휘도를 평가합니다.
 * [EN] Evaluates sky scattering, Mie glow, and optional sun disk radiance along a view direction for IBL cubemap baking.
 */
fn evaluateIBLRadiance(
    viewDir: vec3<f32>, 
    params: SkyAtmosphere, 
    transmittanceLUT: texture_2d<f32>, 
    skyViewLUT: texture_2d<f32>, 
    skyAtmosphereSampler: sampler,
    includeSunDisk: bool
) -> vec3<f32> {
    let r = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let sunDir = params.sunDirection;

    let skyUV = getSkyViewUV(viewDir, viewHeight, r);
    var radiance = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0).rgb;

    let camPos = vec3<f32>(0.0, r + viewHeight, 0.0);
    let isGround = viewDir.y < -0.0001 && r > 0.0 && getRaySphereIntersection(camPos, viewDir, r) > 0.0;

    if (!isGround && getPlanetShadowMask(camPos, sunDir, r) > 0.0) {
        let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
        let transToEdge = getTransmittance(transmittanceLUT, skyAtmosphereSampler, viewHeight, viewDir.y, params.atmosphereHeight);
        radiance += getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transToEdge);
        if (includeSunDisk) {
            radiance += getSunDiskRadianceIBL(viewSunCos, transToEdge, params);
        }
    }

    return radiance;
}

/**
 * [KO] 정수 비트 연산 기반의 2D 의사 난수 해시 함수입니다.
 * [EN] 2D pseudo-random hash function based on integer bit manipulation.
 */
fn cloud_hash_u(p: vec2<u32>) -> f32 {
    var q = p * vec2<u32>(1597334673u, 3812015801u);
    let n = (q.x ^ q.y) * 1597334673u;
    return f32(n) * (1.0 / 4294967296.0);
}

/**
 * [KO] Hermite 보간을 사용하는 2D 값 노이즈(Value Noise) 함수입니다.
 * [EN] 2D value noise function using Hermite interpolation.
 */
fn cloud_noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    let ui = vec2<u32>(vec2<i32>(i) + vec2<i32>(0x8000));
    return mix(mix(cloud_hash_u(ui + vec2<u32>(0u, 0u)), cloud_hash_u(ui + vec2<u32>(1u, 0u)), u.x),
               mix(cloud_hash_u(ui + vec2<u32>(0u, 1u)), cloud_hash_u(ui + vec2<u32>(1u, 1u)), u.x), u.y);
}

/**
 * [KO] 5옥타브 프랙탈 브라운 운동(fBm) 기반 구름 밀도 노이즈를 생성합니다.
 * [EN] Generates 5-octave Fractal Brownian Motion (fBm) cloud density noise.
 */
fn cloud_fbm(p: vec2<f32>) -> f32 {
    var v = 0.0;
    var a = 0.5;
    const SHIFT = vec2<f32>(100.0);
    var p_mut = p;
    for (var i = 0; i < 5; i = i + 1) {
        v += a * cloud_noise(p_mut);
        p_mut = p_mut * 2.0 + SHIFT;
        a *= 0.5;
    }
    return v;
}

/**
 * [KO] 도메인 워핑(Domain Warping)이 적용된 구름 샘플링 UV 좌표를 계산합니다.
 * [EN] Calculates domain-warped UV coordinates for cloud sampling.
 */
fn getCloudWarpedUV(hitP: vec3<f32>, params: SkyAtmosphere) -> vec2<f32> {
    let baseUV = hitP.xz * 0.05 + vec2<f32>(params.cloudTime * 0.02);
    let scaledUV = baseUV * 1.2;
    let warp = vec2<f32>(
        cloud_noise(scaledUV + vec2<f32>(params.cloudTime * 0.01)),
        cloud_noise(scaledUV + vec2<f32>(5.7, 1.3) + vec2<f32>(params.cloudTime * 0.012))
    );
    return baseUV + warp * 0.2;
}

/**
 * [KO] 구름 커버리지와 밀도 파라미터를 적용하여 최종 구름 불투명도 마스크를 반환합니다.
 * [EN] Applies cloud coverage and density parameters to return the final cloud opacity mask.
 */
fn getCloudDensity(density: f32, params: SkyAtmosphere) -> f32 {
    let coverage = params.cloudCoverage;
    let softness = (1.0 - params.cloudDensity) * 0.5 + 0.01;
    return smoothstep(1.0 - coverage, 1.0 - coverage + softness, density);
}

/**
 * [KO] 인접 구름 밀도 차분을 이용해 구름 표면의 의사 법선(Pseudo-Normal) 벡터를 계산합니다.
 * [EN] Computes a pseudo-normal vector of the cloud surface using finite differences of cloud density.
 */
fn getCloudNormal(warpedUV: vec2<f32>, density: f32) -> vec3<f32> {
    const EPS: f32 = 0.2;
    const INV_EPS: f32 = 5.0;
    let dIdx = (cloud_fbm(warpedUV + vec2<f32>(EPS, 0.0)) - density) * INV_EPS;
    let dIdy = (cloud_fbm(warpedUV + vec2<f32>(0.0, EPS)) - density) * INV_EPS;
    let n = vec3<f32>(-dIdx, 2.0, -dIdy);
    let invNLen = inverseSqrt(dot(n, n));
    return n * invNLen;
}
