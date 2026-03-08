// [KO] UE5 표준 Transmittance LUT 생성

@group(0) @binding(0) var atmosphereTransmittanceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(atmosphereTransmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑으로 정밀도 향상
    // [EN] Improve precision with pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    
    // [KO] 수평선(cosTheta = 0) 부근에 더 많은 텍셀을 할당하기 위한 비선형 역매핑
    // [EN] Non-linear inverse mapping to allocate more texels near the horizon (cosTheta = 0)
    let x = uv.x * 2.0 - 1.0;
    let cosTheta = sign(x) * x * x;
    
    // [KO] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
    // [EN] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
    let h = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let T = exp(-min(getOpticalDepth(h, cosTheta), vec3<f32>(100.0)));
    textureStore(atmosphereTransmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
}

fn getOpticalDepth(h: f32, cosTheta: f32) -> vec3<f32> {
    let r = params.earthRadius;
    let rayOrigin = vec3<f32>(0.0, h + r, 0.0);
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
    let rayDir = vec3<f32>(sinTheta, cosTheta, 0.0);

    let tMax = getRaySphereIntersection(rayOrigin, rayDir, r + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(0.0); }

    // [KO] 지면 교차점 계산 (tIn, tOut 모두 확보)
    // [EN] Calculate earth intersections (get both tIn and tOut)
    let b = dot(rayOrigin, rayDir);
    let c = dot(rayOrigin, rayOrigin) - r * r;
    let delta = b * b - c;
    
    var optExt = vec3<f32>(0.0);
    if (delta >= 0.0) {
        let s = sqrt(delta);
        let tIn = -b - s;
        let tOut = -b + s;

        // [KO] useGround가 활성화된 경우에만 지면 아래를 불투명 처리합니다.
        if (params.useGround > 0.5 && tIn > EPSILON) { 
            return vec3<f32>(MAX_TAU); 
        }

        // [KO] 지면 관통 시 (useGround가 꺼져 있는 경우 포함): 구간 분할 적분
        if (tIn > EPSILON && tIn < tMax) {
             // 1. 앞쪽 대기 구간 (진입점까지)
             optExt += integrateOpticalDepth(rayOrigin, rayDir, 0.0, tIn, 20u, params);
             // 2. 뒤쪽 대기 구간 (탈출점부터 대기 끝까지)
             if (tOut > 0.0 && tMax > tOut) {
                 optExt += integrateOpticalDepth(rayOrigin, rayDir, tOut, tMax, 20u, params);
             }
        } else {
             // 지면을 비껴가는 일반적인 경로
             optExt = integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, 40u, params);
        }
    } else {
        // 지면과 전혀 만나지 않는 경로
        optExt = integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, 40u, params);
    }

    return optExt;
}
