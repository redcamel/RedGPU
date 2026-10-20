#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var transmittanceLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

/**
 * [KO] 고도와 천정각에 따른 대기 투과율(Transmittance) 2D LUT를 사전 계산하는 컴퓨트 셰이더입니다.
 * [EN] Compute shader that precomputes the 2D Transmittance LUT by altitude and zenith angle.
 */
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);

    // [KO] UV 좌표를 천정각 코사인(cosTheta)과 대기 고도(viewHeight)로 역매핑합니다.
    // [EN] Inverse-map UV coordinates to zenith cosine (cosTheta) and atmospheric altitude (viewHeight).
    let x = uv.x * 2.0 - 1.0;
    let cosTheta = sign(x) * x * x;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    // [KO] 광학 깊이를 적분하여 Beer-Lambert 법칙 기반의 투과율을 산출합니다.
    // [EN] Integrate optical depth and compute transmittance via the Beer-Lambert law.
    let T = exp(-min(getOpticalDepth(viewHeight, cosTheta), vec3<f32>(MAX_TAU)));

    textureStore(transmittanceLUT, global_id.xy, vec4<f32>(T, 1.0));
}

/**
 * [KO] 지정된 고도와 시선 천정각에서 대기권 외곽까지의 누적 광학 깊이를 계산합니다.
 * [EN] Computes cumulative optical depth from a given altitude and zenith angle to the top of the atmosphere.
 */
fn getOpticalDepth(viewHeight: f32, cosTheta: f32) -> vec3<f32> {
    let groundRadius = params.groundRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
    let rayDir = vec3<f32>(sinTheta, cosTheta, 0.0);

    let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(0.0); }

    let tEarth = getRaySphereIntersection(rayOrigin, rayDir, groundRadius);
    if (groundRadius > 0.0 && tEarth > 0.0) {
        return vec3<f32>(MAX_TAU);
    }

    return integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, TRANSMITTANCE_STEPS, params);
}
