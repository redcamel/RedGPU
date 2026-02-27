// [KO] UE5 표준 Multi-Scattering LUT 생성
#redgpu_include math.INV_PI

@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑
    // [EN] Pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let cosSunTheta = uv.x * 2.0 - 1.0;
    
    // [KO] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm (Transmittance와 일관성 유지)
    // [EN] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm (Keep consistency with Transmittance)
    let h = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let r = params.earthRadius;
    let rayOrigin = vec3<f32>(0.0, h + r, 0.0);
    let sunDir = vec3<f32>(sqrt(max(0.0, 1.0 - cosSunTheta * cosSunTheta)), cosSunTheta, 0.0);

    var lumTotal = vec3<f32>(0.0);
    var fmsTotal = vec3<f32>(0.0);

    let sampleCount = 64;
    for (var i = 0; i < sampleCount; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(clamp(1.0 - 2.0 * step / f32(sampleCount), -1.0, 1.0));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        let rayDir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let tMax = getRaySphereIntersection(rayOrigin, rayDir, r + params.atmosphereHeight);

        // [KO] 지면 충돌 정보 확보
        let bVal = dot(rayOrigin, rayDir);
        let cVal = dot(rayOrigin, rayOrigin) - r * r;
        let deltaVal = bVal * bVal - cVal;
        var tEarthIn = -1.0;
        var tEarthOut = -1.0;
        if (deltaVal >= 0.0) {
            let sVal = sqrt(deltaVal);
            tEarthIn = -bVal - sVal;
            tEarthOut = -bVal + sVal;
        }

        var L1 = vec3<f32>(0.0);
        var f1 = vec3<f32>(0.0);
        var TPath = vec3<f32>(1.0);

        let hitEarth = params.useGround > 0.5 && tEarthIn > 0.0;
        
        if (hitEarth) {
            // Segment 1: Camera to Earth
            let steps = 16u;
            let stepSize = tEarthIn / f32(steps);
            for(var j = 0u; j < steps; j = j + 1u) {
                let t = (f32(j) + 0.5) * stepSize;
                integrateMultiScatStep(rayOrigin + rayDir * t, rayDir, stepSize, sunDir, &L1, &f1, &TPath);
            }
            // Add ground reflection
            let hitP = rayOrigin + rayDir * tEarthIn;
            let upHit = normalize(hitP);
            let cosS = max(0.0, dot(upHit, sunDir));
            let sunTGround = getPhysicalTransmittance(hitP, sunDir, r, params.atmosphereHeight, params);
            L1 += TPath * sunTGround * cosS * params.groundAlbedo * INV_PI;
        } else {
            // Hollow Shell Mode (useGround=false or looking at sky)
            if (params.useGround < 0.5 && tEarthIn > 0.0) {
                 // Segment 1: Front Atmosphere
                 let stepsF = 16u;
                 let stepSizeF = tEarthIn / f32(stepsF);
                 for(var j = 0u; j < stepsF; j = j + 1u) {
                     let t = (f32(j) + 0.5) * stepSizeF;
                     integrateMultiScatStep(rayOrigin + rayDir * t, rayDir, stepSizeF, sunDir, &L1, &f1, &TPath);
                 }
                 // Segment 2: Back Atmosphere
                 if (tEarthOut > 0.0 && tMax > tEarthOut) {
                     let stepsB = 16u;
                     let stepSizeB = (tMax - tEarthOut) / f32(stepsB);
                     for(var j = 0u; j < stepsB; j = j + 1u) {
                         let t = tEarthOut + (f32(j) + 0.5) * stepSizeB;
                         integrateMultiScatStep(rayOrigin + rayDir * t, rayDir, stepSizeB, sunDir, &L1, &f1, &TPath);
                     }
                 }
            } else if (tMax > 0.0) {
                 // Normal atmosphere to space
                 let steps = 20u;
                 let stepSize = tMax / f32(steps);
                 for(var j = 0u; j < steps; j = j + 1u) {
                     let t = (f32(j) + 0.5) * stepSize;
                     integrateMultiScatStep(rayOrigin + rayDir * t, rayDir, stepSize, sunDir, &L1, &f1, &TPath);
                 }
            }
        }
        lumTotal += L1;
        fmsTotal += f1 / f32(sampleCount);
    }

    let output = (lumTotal / f32(sampleCount)) / (1.0 - min(fmsTotal, vec3<f32>(0.999)));
    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}

fn integrateMultiScatStep(curP: vec3<f32>, rayDir: vec3<f32>, stepSize: f32, sunDir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, TPath: ptr<function, vec3<f32>>) {
    let r = params.earthRadius;
    let curPLen = length(curP);
    let upP = curP / curPLen;
    let curH = curPLen - r;
    
    // [KO] 행성 내부(curH < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rhoR = 0.0;
    var rhoM = 0.0;
    if (curH >= 0.0) {
        rhoR = exp(-curH / params.rayleighScaleHeight);
        rhoM = exp(-curH / params.mieScaleHeight);
    }
    
    let sunT = getPhysicalTransmittance(curP, sunDir, r, params.atmosphereHeight, params);
    
    // 행성 그림자
    var shadowMask = 1.0;
    if (params.useGround > 0.5 && getRaySphereIntersection(curP, sunDir, r) > 0.0) { shadowMask = 0.0; }

    let scatTotal = params.rayleighScattering * rhoR + vec3<f32>(params.mieScattering * rhoM);
    let extTotal = params.rayleighScattering * rhoR + vec3<f32>(params.mieExtinction * rhoM);

    *L1 += *TPath * sunT * scatTotal * (0.25 * INV_PI) * shadowMask * stepSize;
    *f1 += *TPath * scatTotal * stepSize;
    *TPath *= exp(-extTotal * stepSize);
}
