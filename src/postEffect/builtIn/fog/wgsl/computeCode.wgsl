// [KO] 1. 인덱스 계산 및 비활성(density <= 0) Early-out (depthTexture 로드 생략)
// [EN] 1. Index calculation and early-out for zero density (skips depthTexture load)
let coord = vec2<i32>(global_id.xy);
let sceneColor = textureLoad(sourceTexture, coord, 0);

let u_density = uniforms.density;
if (u_density <= 0.0) {
    textureStore(outputTexture, coord, sceneColor);
    return;
}

// [KO] 2. 3D 유클리드 거리(Euclidean Distance) 복원 및 farDistance 상한 클램프
// [EN] 2. Reconstruct 3D Euclidean distance and clamp to farDistance
let depth = textureLoad(depthTexture, coord, 0);
let u_near = uniforms.nearDistance;
let u_far = max(uniforms.farDistance, u_near);

var camDistance: f32;
if (depth >= 0.99999) {
    camDistance = u_far;
} else {
    let dimF = vec2<f32>(textureDimensions(sourceTexture));
    let screenCoord = (vec2<f32>(coord) + 0.5) / dimF;
    let worldPos = getWorldPositionFromDepth(screenCoord, depth, systemUniforms.projection.inverseProjectionViewMatrix);
    camDistance = min(length(worldPos - systemUniforms.camera.cameraPosition), u_far);
}

// [KO] 3. 근거리(nearDistance 이내) Early-out (exp SFU 생략)
// [EN] 3. Early-out for near range (skips exp SFU)
if (camDistance <= u_near) {
    textureStore(outputTexture, coord, sceneColor);
    return;
}

// [KO] 4. 순수 Beer-Lambert 물리 거리 감쇠 (매직 넘버 제거)
// [EN] 4. Pure Beer-Lambert physical distance attenuation (zero magic numbers)
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

// [KO] 5. 선형 HDR 공간 최종 색상 합성 및 저장
// [EN] 5. Final color composition in Linear HDR space and storage
let finalColor = mix(uniforms.fogColor.rgb, sceneColor.rgb, saturate(fogFactor));
textureStore(outputTexture, coord, vec4<f32>(finalColor, sceneColor.a));
