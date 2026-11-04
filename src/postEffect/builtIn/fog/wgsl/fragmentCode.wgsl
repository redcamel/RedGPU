// [KO] 1. 3D 유클리드 거리(Euclidean Distance) 복원 및 farDistance 상한 클램프
// [EN] 1. Reconstruct 3D Euclidean distance and clamp to farDistance
let coord = vec2<i32>(fragCoord);
let depth = textureLoad(depthTexture, coord, 0);
let u_near = uniforms.nearDistance;
let u_far = max(uniforms.farDistance, u_near);

var camDistance: f32;
if (depth >= 0.99999) {
    camDistance = u_far;
} else {
    let worldPos = getWorldPositionFromDepth(uv, depth, systemUniforms.projection.inverseProjectionViewMatrix);
    camDistance = min(length(worldPos - systemUniforms.camera.cameraPosition), u_far);
}

// [KO] 2. 근거리(nearDistance 이내) Early-out (exp SFU 및 ROP 쓰기 생략)
// [EN] 2. Early-out for near range (skips exp SFU and ROP write)
if (camDistance <= u_near) {
    discard;
    return vec4<f32>(0.0);
}

// [KO] 3. 순수 Beer-Lambert 물리 거리 감쇠 및 maxOpacity 상한 적용
// [EN] 3. Pure Beer-Lambert physical distance attenuation and maxOpacity cap
let u_density = uniforms.density;
let u_maxOpacity = saturate(uniforms.maxOpacity);
let opticalDepth = u_density * (camDistance - u_near);

var fogFactor: f32;
if (uniforms.fogType == 0u) {
    // [KO] 지수형 안개 (Exponential Fog): T = exp(-density * d)
    // [EN] Exponential Fog: T = exp(-density * d)
    fogFactor = exp(-opticalDepth);
} else {
    // [KO] 지수제곱형 안개 (Exponential Squared Fog): T = exp(-(density * d)^2)
    // [EN] Exponential Squared Fog: T = exp(-(density * d)^2)
    fogFactor = exp(-(opticalDepth * opticalDepth));
}
let transmittance = max(saturate(fogFactor), 1.0 - u_maxOpacity);

// [KO] 4. 하드웨어 ROP 블렌더(SRC_ALPHA + ONE_MINUS_SRC_ALPHA)로 선형 HDR 안개 합성
// [EN] 4. Linear HDR fog composition via hardware ROP blending (SRC_ALPHA + ONE_MINUS_SRC_ALPHA)
return vec4<f32>(uniforms.fogColor.rgb, 1.0 - transmittance);
