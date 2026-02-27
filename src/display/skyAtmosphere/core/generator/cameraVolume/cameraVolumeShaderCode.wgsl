// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(cameraVolumeTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    
    // UVW를 뷰 공간의 방향과 거리로 변환
    let azimuth = (uvw.x - 0.5) * 2.0 * PI;
    let elevation = (uvw.y - 0.5) * PI;
    
    // [KO] Artistic Symmetry: useGround가 꺼진 경우 상하 대칭을 위해 각도 반전
    var effectiveElevation = elevation;
    if (params.useGround < 0.5) {
        effectiveElevation = abs(elevation);
    }
    
    let viewDir = vec3<f32>(cos(effectiveElevation) * cos(azimuth), sin(effectiveElevation), cos(effectiveElevation) * sin(azimuth));
    
    // 거리 매핑 (언리얼과 유사하게 비선형적으로 설정, 최대 100km)
    let maxDist = 100.0;
    let sliceDist = uvw.z * uvw.z * maxDist; 

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, h_c + r, 0.0);

    // 적분 시작
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

    if (sliceDist > 0.0) {
        if (intersectsPlanetVolume) {
            // --- Segment 1: Camera to Earth (Front Atmosphere) ---
            let tFrontEnd = min(sliceDist, tEarthIn);
            let stepsFront = 16;
            let stepSizeFront = tFrontEnd / f32(stepsFront);
            for (var i = 0; i < stepsFront; i = i + 1) {
                let t = (f32(i) + 0.5) * stepSizeFront;
                integrateCameraVolumeStep(rayOrigin + viewDir * t, viewDir, stepSizeFront, &radiance, &transmittance);
            }

            if (params.useGround < 0.5 && sliceDist > tEarthOut && tEarthOut > 0.0) {
                // --- Segment 2: Earth Exit to Slice Dist (Back Atmosphere) ---
                let backDist = sliceDist - tEarthOut;
                let stepsBack = 16;
                let stepSizeBack = backDist / f32(stepsBack);
                for (var i = 0; i < stepsBack; i = i + 1) {
                    let t = tEarthOut + (f32(i) + 0.5) * stepSizeBack;
                    integrateCameraVolumeStep(rayOrigin + viewDir * t, viewDir, stepSizeBack, &radiance, &transmittance);
                }
            }
        } else {
            // --- Single Segment: Standard Sky Path ---
            let steps = 32;
            let stepSize = sliceDist / f32(steps);
            for (var i = 0; i < steps; i = i + 1) {
                let t = (f32(i) + 0.5) * stepSize;
                integrateCameraVolumeStep(rayOrigin + viewDir * t, viewDir, stepSize, &radiance, &transmittance);
            }
        }
    }

    // 결과 저장 (RGB: 산란광, A: 평균 투과율)
    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, avgTrans));
}

fn integrateCameraVolumeStep(p: vec3<f32>, viewDir: vec3<f32>, stepSize: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let pLen = length(p);
    let r = params.earthRadius;
    let curH = pLen - r;
    let up = p / pLen;
    let cosSun = dot(up, params.sunDirection);

    // [KO] useGround가 켜져 있는 경우에만 지표면 아래에서 적분을 스킵합니다.
    if (params.useGround > 0.5 && curH < -0.001) { return; }

    // [KO] 조명 에너지는 지면 가림을 무시하는 물리 투과율 사용
    let sunTrans = getPhysicalTransmittance(p, params.sunDirection, r, params.atmosphereHeight, params);

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

    // [KO] 행성 그림자
    var shadowMask = 1.0;
    if (params.useGround > 0.5 && getRaySphereIntersection(p, params.sunDirection, r) > 0.0) { shadowMask = 0.0; }

    let viewSunCos = dot(viewDir, params.sunDirection);
    
    let scatR = params.rayleighScattering * rhoR * phaseRayleigh(viewSunCos);
    let scatM = vec3<f32>(params.mieScattering * rhoM * phaseMie(viewSunCos, params.mieAnisotropy));
    let scatF = vec3<f32>(params.heightFogDensity * rhoF * phaseMie(viewSunCos, 0.7)); 
    
    let stepScat = (scatR + scatM + scatF) * sunTrans * shadowMask;

    // [KO] 다중 산란 기여분 (에너지 보존 고려)
    let msUV = vec2<f32>(clamp(cosSun * 0.5 + 0.5, 0.0, 1.0), 1.0 - clamp(curH / params.atmosphereHeight, 0.0, 1.0));
    let multiScatEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb;
    let totalScatCoeff = params.rayleighScattering * rhoR + vec3<f32>((params.mieScattering * rhoM) + (params.heightFogDensity * rhoF));
    let msScat = multiScatEnergy * totalScatCoeff * shadowMask;

    // [KO] 전체 소멸 계수 (에너지 소실)
    let extinction = getTotalExtinction(curH, params) + vec3<f32>(params.heightFogDensity * rhoF);

    *radiance += *transmittance * (stepScat + msScat) * stepSize;
    *transmittance *= exp(-extinction * stepSize);
}
