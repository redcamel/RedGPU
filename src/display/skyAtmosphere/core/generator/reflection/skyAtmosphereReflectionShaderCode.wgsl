@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outputTexture).xy;
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let clipPos = vec4<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, 1.0, 1.0);
    
    // [KO] 큐브맵 페이스 행렬을 이용해 월드 공간 방향 계산
    // [EN] Calculate world space direction using cubemap face matrix
    let worldPos = faceMatrices[face] * clipPos;
    var viewDir = normalize(worldPos.xyz);
    
    // [KO] Artistic Symmetry: useGround가 꺼진 경우 상하 대칭을 위해 고도 반전
    if (params.useGround < 0.5) {
        viewDir.y = abs(viewDir.y);
    }
    
    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);

    let tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, r);
    
    // [KO] 반사(조명)는 시각적 옵션과 상관없이 물리적 지면(useGround)만 따릅니다.
    var distLimit = select(tMax, tEarth, params.useGround > 0.5 && tEarth > 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 지면 교차점 계산 (tIn, tOut 모두 확보)
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

    let intersectsPlanetVolume = tEarthIn > 0.0;

    if (distLimit > 0.0) {
        if (intersectsPlanetVolume) {
            // --- Segment 1: Camera to Earth (Front Atmosphere) ---
            let stepsFront = 16;
            let stepSizeFront = tEarthIn / f32(stepsFront);
            for (var i = 0; i < stepsFront; i = i + 1) {
                let t = (f32(i) + 0.5) * stepSizeFront;
                integrateReflectionStep(rayOrigin + viewDir * t, viewDir, stepSizeFront, &radiance, &transmittance);
            }

            if (params.useGround > 0.5 && params.showGround > 0.5) {
                // [KO] 일반 모드: 지면 반사광 추가
                let hitPos = rayOrigin + viewDir * tEarthIn;
                let up = normalize(hitPos);
                let cosSun = dot(up, params.sunDirection);
                let sunTrans = getPhysicalTransmittance(hitPos, params.sunDirection, r, params.atmosphereHeight, params);
                let albedo = params.groundAlbedo * INV_PI;
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 0.0), 0.0).rgb;
                radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * albedo;
            } else if (tEarthOut > 0.0 && distLimit > tEarthOut) {
                // --- Segment 2: Earth Exit to Atmosphere Top (Back Atmosphere) ---
                let backDist = distLimit - tEarthOut;
                let stepsBack = 16;
                let stepSizeBack = backDist / f32(stepsBack);
                for (var i = 0; i < stepsBack; i = i + 1) {
                    let t = tEarthOut + (f32(i) + 0.5) * stepSizeBack;
                    integrateReflectionStep(rayOrigin + viewDir * t, viewDir, stepSizeBack, &radiance, &transmittance);
                }
            }
        } else {
            // --- Single Segment: Standard Sky Path ---
            let steps = 32;
            let stepSize = distLimit / f32(steps);
            for (var i = 0; i < steps; i = i + 1) {
                let t = (f32(i) + 0.5) * stepSize;
                integrateReflectionStep(rayOrigin + viewDir * t, viewDir, stepSize, &radiance, &transmittance);
            }
        }
    }

    // [KO] 최종 광도 저장 (태양 강도는 재질에서 샘플링 시 곱함)
    // [EN] Store final radiance (sun intensity is multiplied when sampling in the material)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}

fn integrateReflectionStep(p: vec3<f32>, viewDir: vec3<f32>, stepSize: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let pLen = length(p);
    let r = params.earthRadius;
    let curH = pLen - r;
    let up = p / pLen;
    let cosSun = dot(up, params.sunDirection);

    // [KO] 물리적으로 지면 아래면 적분 건너뜀
    if (params.useGround > 0.5 && curH < -0.001) { return; }

    // [KO] 조명 에너지는 지면 가림을 무시하는 물리 투과율 사용
    let sunTrans = getPhysicalTransmittance(p, params.sunDirection, r, params.atmosphereHeight, params);

    // [KO] 행성 내부(curH < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rhoR = 0.0;
    var rhoM = 0.0;
    var rhoF = 0.0;
    if (curH >= 0.0) {
        rhoR = exp(-curH / params.rayleighScaleHeight);
        rhoM = exp(-curH / params.mieScaleHeight);
        rhoF = exp(-curH * params.heightFogFalloff);
    }

    // [KO] 행성 그림자: 물리적 지면(useGround)이 있을 때만 계산합니다.
    var shadowMask = 1.0;
    if (params.useGround > 0.5 && getRaySphereIntersection(p, params.sunDirection, r) > 0.0) { shadowMask = 0.0; }

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
