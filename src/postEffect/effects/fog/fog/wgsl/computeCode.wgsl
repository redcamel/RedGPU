let id = global_id.xy;
let coord = vec2<i32>(id);

var sceneColor = textureLoad(sourceTexture, coord);
let depth = textureLoad(depthTexture, coord, 0);

// 1. 표준 깊이 복구
let linDepth = linearizeDepth(depth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);

// 2. 포그 계수 계산 (Inline)
let u_density = uniforms.density;
let u_near = uniforms.nearDistance;
let u_far = uniforms.farDistance;
let cameraFar = systemUniforms.camera.farClipping;

var fogFactor: f32;

// 배경/스카이박스 감지
if (linDepth >= (cameraFar * 0.99)) {
    fogFactor = 1.0 - u_density;
} else {
    /* 일반 객체 처리 */
    let dist = max(0.0, linDepth - u_near);
    let maxDist = u_far - u_near;
    let normalizedDist = clamp(dist / max(0.1, maxDist), 0.0, 1.0);

    if (uniforms.fogType == 0u) {
        /* Exponential Fog */
        fogFactor = exp(-u_density * normalizedDist * 10.0);
    } else {
        /* Exponential Squared Fog */
        let expVal = u_density * normalizedDist * 5.0;
        fogFactor = exp(-(expVal * expVal));
    }
}

// 3. 최종 합성
let finalColor = mix(uniforms.fogColor.rgb, sceneColor.rgb, saturate(fogFactor));
textureStore(outputTexture, coord, vec4<f32>(finalColor, sceneColor.a));
