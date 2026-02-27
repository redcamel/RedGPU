#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.EPSILON
#redgpu_include math.hash.getHash3D_vec3
#redgpu_include systemStruct.SkyAtmosphere
// [KO] 대기 산란 공통 함수 [EN] Sky atmosphere common functions
const MAX_TAU: f32 = 50.0;

// [KO] 레이-구체 교차점 계산
fn getRaySphereIntersection(rayOrigin: vec3<f32>, rayDir: vec3<f32>, sphereRadius: f32) -> f32 {
    let b = dot(rayOrigin, rayDir);
    let c = dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let s = sqrt(delta);
    let t0 = -b - s;
    let t1 = -b + s;
    
    // [KO] epsilon을 EPSILON로 조정하여 정밀도 문제로 인한 자기 교차 방지
    // [EN] Adjust epsilon to EPSILON to prevent self-intersection due to precision issues
    if (t0 > EPSILON) { return t0; }
    if (t1 > EPSILON) { return t1; }
    return -1.0;
}

// [KO] UE5 표준 Transmittance LUT UV 매핑 (u: zenith, v: height)
// WebGPU: V=0.0 (Top) -> Atmosphere Top, V=1.0 (Bottom) -> Ground
fn getTransmittanceUV(h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec2<f32> {
    let H = clamp(h / atmosphereHeight, 0.0, 1.0);
    let mu = cosTheta * 0.5 + 0.5;
    return vec2<f32>(mu, 1.0 - H); // V축 반전: 0(Top)=Atmo, 1(Bottom)=Ground
}

// [KO] 투과율 샘플링
fn getTransmittance(tTex: texture_2d<f32>, tSam: sampler, h: f32, cosTheta: f32, atmosphereHeight: f32) -> vec3<f32> {
    let uv = getTransmittanceUV(h, cosTheta, atmosphereHeight);
    return textureSampleLevel(tTex, tSam, uv, 0.0).rgb;
}

// [KO] UE5 표준 Sky-View LUT UV 매핑 (v=0.5: Horizon, v=0: Top, v=1: Bottom)
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
        // [Sky Part] Horizon -> Top (0.5 -> 0.0)
        let vRange = HPI - horizonElevation;
        let ratio = (viewElevation - horizonElevation) / vRange;
        v = 0.5 * (1.0 - sqrt(max(0.0, ratio)));
    } else {
        // [Ground Part] Horizon -> Bottom (0.5 -> 1.0)
        let vRange = horizonElevation + HPI;
        let ratio = (horizonElevation - viewElevation) / vRange;
        v = 0.5 * (1.0 + sqrt(max(0.0, ratio)));
    }
    return vec2<f32>(u, clamp(v, 0.0, 1.0));
}

// [KO] 오존 농도 분포 (Gaussian-like distribution)
fn getOzoneDensity(h: f32, center: f32, width: f32) -> f32 {
    if (h < 0.0) { return 0.0; }
    let x = (h - center) / width;
    return max(0.0, 1.0 - abs(x));
}

// [KO] 전체 소멸 계수 계산 (Extinction)
fn getTotalExtinction(h: f32, params: SkyAtmosphere) -> vec3<f32> {
    if (h < 0.0) { return vec3<f32>(0.0); }
    let rhoR = exp(-h / params.rayleighScaleHeight);
    let rhoM = exp(-h / params.mieScaleHeight);
    let rhoO = getOzoneDensity(h, params.ozoneLayerCenter, params.ozoneLayerWidth);
    
    return params.rayleighScattering * rhoR + 
           vec3<f32>(params.mieExtinction * rhoM) + 
           params.ozoneAbsorption * rhoO;
}

// [KO] 페이즈 함수
fn phaseRayleigh(cosTheta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

fn phaseMie(cosTheta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(EPSILON, 1.0 + g2 - 2.0 * g * cosTheta), 1.5));
}

// [KO] 구간별 광학 깊이 적분 함수
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

// [KO] 물리 기반 투과율 (지면 가림 무시, 조명 에너지용)
fn getPhysicalTransmittance(p: vec3<f32>, sunDir: vec3<f32>, r: f32, atmH: f32, params: SkyAtmosphere) -> vec3<f32> {
    let tMax = getRaySphereIntersection(p, sunDir, r + atmH);
    if (tMax <= 0.0) { return vec3<f32>(1.0); }

    let b = dot(p, sunDir);
    let c = dot(p, p) - r * r;
    let delta = b * b - c;
    
    var optExt = vec3<f32>(0.0);
    
    // [KO] 지면 충돌 여부 확인
    if (delta >= 0.0) {
        let s = sqrt(delta);
        let tIn = -b - s;
        let tOut = -b + s;

        // [KO] useGround가 켜져 있고 지평선 아래라면 즉시 0 반환
        if (params.useGround > 0.5 && tIn > EPSILON) {
             return vec3<f32>(0.0); 
        }

        // [KO] 지면 관통 시 (useGround가 꺼져 있는 경우 포함): 구간 분할 적분
        if (tIn > EPSILON && tIn < tMax) {
             // 1. 앞쪽 대기 구간 (진입점까지)
             optExt += integrateOpticalDepth(p, sunDir, 0.0, tIn, 10u, params);
             // 2. 뒤쪽 대기 구간 (탈출점부터 대기 끝까지)
             if (tOut > 0.0 && tMax > tOut) {
                 optExt += integrateOpticalDepth(p, sunDir, tOut, tMax, 10u, params);
             }
        } else {
             // 지면을 비껴가는 일반적인 경로
             optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 20u, params);
        }
    } else {
        // 지면과 전혀 만나지 않는 경로
        optExt = integrateOpticalDepth(p, sunDir, 0.0, tMax, 20u, params);
    }
    
    return exp(-min(optExt, vec3<f32>(MAX_TAU)));
}

// [KO] 높이 안개 투과율
fn getHeightFogTransmittance(camH: f32, rayDirY: f32, dist: f32, density: f32, falloff: f32) -> f32 {
    if (density <= 0.0) { return 1.0; }
    let h = max(0.0, camH);
    let k = falloff;
    let y = rayDirY;
    var exponent: f32;
    if (abs(y) < EPSILON) {
        exponent = density * exp(-k * h) * dist;
    } else {
        exponent = (density * exp(-k * h)) / (k * y) * (1.0 - exp(-k * y * dist));
    }
    return exp(-max(0.0, exponent));
}

/**
 * [KO] 지면 노이즈를 생성합니다. (표준 getHash3D_vec3 사용)
 * [EN] Generates ground noise. (Using standard getHash3D_vec3)
 */
fn getGroundNoisePE(p: vec3<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    
    // [KO] 표준 math.getHash3D_vec3를 활용한 노이즈 합성
    // [EN] Noise synthesis using standard math.getHash3D_vec3
    return mix(mix(mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 0.0, 0.0)), f - vec3<f32>(0.0, 0.0, 0.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 0.0, 0.0)), f - vec3<f32>(1.0, 0.0, 0.0)), u.x),
                   mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 1.0, 0.0)), f - vec3<f32>(0.0, 1.0, 0.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 1.0, 0.0)), f - vec3<f32>(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 0.0, 1.0)), f - vec3<f32>(0.0, 0.0, 1.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 0.0, 1.0)), f - vec3<f32>(1.0, 0.0, 1.0)), u.x),
                   mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 1.0, 1.0)), f - vec3<f32>(0.0, 1.0, 1.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 1.0, 1.0)), f - vec3<f32>(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}
