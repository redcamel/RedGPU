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

    // [KO] 텍셀 중심 매핑
    // [EN] Pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * PI2;

    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    
    // 지평선 각도 계산
    let horizonCos = -sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH);
    let horizonElevation = asin(clamp(horizonCos, -1.0, 1.0));

    // [UE5 표준 역매핑]
    var viewElevation: f32;
    if (uv.y < 0.5) {
        // [Sky Part] v = 0.5 * (1 - sqrt(ratio)) -> ratio = (1 - 2v)^2
        let ratio = (1.0 - 2.0 * uv.y) * (1.0 - 2.0 * uv.y);
        viewElevation = horizonElevation + ratio * (HPI - horizonElevation);
    } else {
        // [Ground Part] v = 0.5 * (1 + sqrt(ratio)) -> ratio = (2v - 1)^2
        let ratio = (2.0 * uv.y - 1.0) * (2.0 * uv.y - 1.0);
        viewElevation = horizonElevation - ratio * (horizonElevation + HPI);
    }

    // [KO] Artistic Symmetry: useGround가 꺼진 경우 상하 대칭을 위해 각도 반전
    // [EN] Artistic Symmetry: Mirror elevation if useGround is disabled for perfect symmetry
    var effectiveViewElevation = viewElevation;
    if (params.useGround < 0.5) {
        effectiveViewElevation = abs(viewElevation);
    }

    let viewDir = vec3<f32>(cos(effectiveViewElevation) * cos(azimuth), sin(effectiveViewElevation), cos(effectiveViewElevation) * sin(azimuth));
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);

    let tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    
    // [KO] 지면 교차점 계산 (tIn, tOut 모두 확보)
    // [EN] Calculate earth intersections (get both tIn and tOut)
    let b = dot(rayOrigin, viewDir);
    let c = dot(rayOrigin, rayOrigin) - r * r;
    let delta = b * b - c;
    var tEarthIn = -1.0;
    var tEarthOut = -1.0;
    if (delta >= 0.0) {
        let s = sqrt(delta);
        tEarthIn = -b - s;
        tEarthOut = -b + s;
    }

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 구간 설정: 광선이 행성 볼륨(Radius)과 교차하는지 확인합니다.
    // [EN] Segment Setup: Check if the ray intersects the planet volume (Radius).
    // [KO] useGround 여부와 상관없이, 구체 내부를 통과하는 경로는 구간 분할 적분 필수적입니다.
    let intersectsPlanetVolume = tEarthIn > 0.0;
    
    if (intersectsPlanetVolume) {
        // --- Segment 1: Camera to Earth (Front Atmosphere) ---
        let stepsFront = 32;
        let stepSizeFront = tEarthIn / f32(stepsFront);
        for (var i = 0; i < stepsFront; i = i + 1) {
            let t = (f32(i) + 0.5) * stepSizeFront;
            integrateStep(rayOrigin + viewDir * t, viewDir, stepSizeFront, &radiance, &transmittance);
        }

        if (params.useGround > 0.5 && params.showGround > 0.5) {
            // [KO] 일반 모드: 지면 반사광 추가 후 종료
            let hitPos = rayOrigin + viewDir * tEarthIn;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosSun, params.atmosphereHeight);
            let albedo = params.groundAlbedo * INV_PI;
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 0.0), 0.0).rgb;
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * albedo;
        } else if (tEarthOut > 0.0 && tMax > tEarthOut) {
            // --- Segment 2: Earth Exit to Atmosphere Top (Back Atmosphere) ---
            // [KO] Ghost Planet 또는 useGround=false 모드: 지면 너머의 대기를 정밀하게 적분하여 밴딩 제거
            let backDist = tMax - tEarthOut;
            let stepsBack = 32;
            let stepSizeBack = backDist / f32(stepsBack);
            for (var i = 0; i < stepsBack; i = i + 1) {
                let t = tEarthOut + (f32(i) + 0.5) * stepSizeBack;
                integrateStep(rayOrigin + viewDir * t, viewDir, stepSizeBack, &radiance, &transmittance);
            }
        }
    } else if (tMax > 0.0) {
        // --- Single Segment: Camera to Space (Normal Sky) ---
        let steps = 64;
        let stepSize = tMax / f32(steps);
        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * stepSize;
            integrateStep(rayOrigin + viewDir * t, viewDir, stepSize, &radiance, &transmittance);
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}

// [KO] 개별 적분 단계 함수 (중복 제거)
fn integrateStep(p: vec3<f32>, viewDir: vec3<f32>, stepSize: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let pLen = length(p);
    let r = params.earthRadius;
    let curH = pLen - r;
    let up = p / pLen;
    let cosSun = dot(up, params.sunDirection);

    // [KO] Ghost Planet 모드에서의 태양 투과율 계산 (지면 가림 고려)
    var sunTrans: vec3<f32>;
    let isGhostPlanet = params.useGround > 0.5 && params.showGround < 0.5;
    
    if (isGhostPlanet) {
        let tMaxSun = getRaySphereIntersection(p, params.sunDirection, r + params.atmosphereHeight);
        if (tMaxSun <= 0.0) {
            sunTrans = vec3<f32>(1.0);
        } else {
            // [KO] Ghost Planet 모드에서도 지면 관통 시 구간 분할 적분 적용
            let bSun = dot(p, params.sunDirection);
            let cSun = dot(p, p) - r * r;
            let deltaSun = bSun * bSun - cSun;
            
            var optExtSun = vec3<f32>(0.0);
            if (deltaSun >= 0.0) {
                let sSun = sqrt(deltaSun);
                let tInSun = -bSun - sSun;
                let tOutSun = -bSun + sSun;
                
                if (tInSun > EPSILON && tInSun < tMaxSun) {
                    optExtSun += integrateOpticalDepth(p, params.sunDirection, 0.0, tInSun, 16u, params);
                    if (tOutSun > 0.0 && tMaxSun > tOutSun) {
                        optExtSun += integrateOpticalDepth(p, params.sunDirection, tOutSun, tMaxSun, 16u, params);
                    }
                } else {
                    optExtSun = integrateOpticalDepth(p, params.sunDirection, 0.0, tMaxSun, 32u, params);
                }
            } else {
                optExtSun = integrateOpticalDepth(p, params.sunDirection, 0.0, tMaxSun, 32u, params);
            }
            sunTrans = exp(-min(optExtSun, vec3<f32>(MAX_TAU)));
        }
    } else {
        sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, curH, cosSun, params.atmosphereHeight);
    }

    // [KO] 행성 그림자
    var shadowMask = 1.0;
    if (params.useGround > 0.5 && getRaySphereIntersection(p, params.sunDirection, r) > 0.0) { shadowMask = 0.0; }

    // [KO] 행성 내부(curH < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rhoR = 0.0;
    var rhoM = 0.0;
    var rhoF = 0.0;
    var rhoO = 0.0;

    if (curH >= 0.0) {
        rhoR = exp(-curH / params.rayleighScaleHeight);
        rhoM = exp(-curH / params.mieScaleHeight);
        rhoF = exp(-curH * params.heightFogFalloff);
        let ozoneDist = abs(curH - params.ozoneLayerCenter);
        rhoO = exp(-max(0.0, ozoneDist * ozoneDist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));
    }

    let viewSunCos = dot(viewDir, params.sunDirection);
    let scatR = params.rayleighScattering * rhoR * phaseRayleigh(viewSunCos);
    let scatM = vec3<f32>(params.mieScattering * rhoM * phaseMie(viewSunCos, params.mieAnisotropy));
    let scatF = vec3<f32>(params.heightFogDensity * rhoF * phaseMie(viewSunCos, 0.7)); 
    
    let scat = (scatR + scatM + scatF) * sunTrans * shadowMask;

    let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(curH / params.atmosphereHeight, 0.0, 1.0));
    let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb;
    let totalScatCoeff = params.rayleighScattering * rhoR + vec3<f32>(params.mieScattering * rhoM + params.heightFogDensity * rhoF);
    let msScat = msEnergy * totalScatCoeff * shadowMask;

    let extinction = getTotalExtinction(curH, params) + vec3<f32>(params.heightFogDensity * rhoF);

    *radiance += *transmittance * (scat + msScat) * stepSize;
    *transmittance *= exp(-extinction * stepSize);
}
