// [KO] 1. 인덱스 계산 및 기초 데이터 로드
// [EN] 1. Index calculation and basic data loading
let id = global_id.xy;
let coord = vec2<i32>(id);

var sceneColor = textureLoad(sourceTexture, coord, 0);
let depth = textureLoad(depthTexture, coord, 0);

// [KO] 2. 표준 선형 깊이 복구
// [EN] 2. Restore standard linear depth
let linDepth = getLinearizeDepth(depth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);

// [KO] 3. 포그 계수(Fog Factor) 계산
// [EN] 3. Calculate Fog Factor
let u_density = uniforms.density;
let u_near = uniforms.nearDistance;
let u_far = uniforms.farDistance;
let cameraFar = systemUniforms.camera.farClipping;

var fogFactor: f32;

// [KO] 배경 및 스카이박스 감지 (거의 무한대 깊이)
// [EN] Detect background and skybox (near infinite depth)
if (linDepth >= (cameraFar * 0.99)) {
    // [KO] 배경은 밀도에 비례하여 일정한 안개량 적용
    // [EN] Apply constant fog amount proportional to density for background
    fogFactor = 1.0 - u_density;
} else {
    // [KO] 일반 객체 거리 기반 계산
    // [EN] Distance-based calculation for general objects
    let dist = max(0.0, linDepth - u_near);
    let maxDist = u_far - u_near;
    let normalizedDist = clamp(dist / max(0.1, maxDist), 0.0, 1.0);

    if (uniforms.fogType == 0u) {
        // [KO] 지수형 안개 (Exponential Fog): 자연스러운 대기 감쇠
        // [EN] Exponential Fog: Natural atmospheric attenuation
        fogFactor = exp(-u_density * normalizedDist * 10.0);
    } else {
        // [KO] 지수제곱형 안개 (Exponential Squared Fog): 더 급격한 원거리 차폐
        // [EN] Exponential Squared Fog: Steeper distance occlusion
        let expVal = u_density * normalizedDist * 5.0;
        fogFactor = exp(-(expVal * expVal));
    }
}

// [KO] 4. 최종 색상 합성 및 저장
// [EN] 4. Final color composition and storage
let finalColor = mix(uniforms.fogColor.rgb, sceneColor.rgb, saturate(fogFactor));
textureStore(outputTexture, coord, vec4<f32>(finalColor, sceneColor.a));
