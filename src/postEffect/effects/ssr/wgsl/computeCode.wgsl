let screenCoord = vec2<i32>(global_id.xy);
let texDims = textureDimensions(sourceTexture);
let texSize = vec2<i32>(texDims);

// 경계 체크
if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) {
    return;
}

let originalColor = textureLoad(sourceTexture, screenCoord);
let depth = textureLoad(depthTexture, screenCoord, 0);

// 원거리 픽셀은 반사 스킵
if (depth >= 0.999) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let gBufferNormalData = textureLoad(gBufferNormalTexture, screenCoord, 0);
let precomputedReflectionStrength = gBufferNormalData.a;

// 반사 강도가 너무 낮으면 스킵
if (precomputedReflectionStrength < 0.05) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let worldPos = reconstructWorldPosition(screenCoord, depth);
let worldNormal = reconstructWorldNormal(gBufferNormalData);

// 노멀 유효성 체크
if (length(worldNormal) < 0.01) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let normal = normalize(worldNormal);
let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

// 🎯 깔끔한 반사 계산 (지터 없음)
let reflectionDir = calculateWorldReflectionRay(worldPos, normal, cameraWorldPos);
let reflection = performWorldRayMarching(worldPos, reflectionDir);

// 반사 결과 처리
if (reflection.a > 0.001) {
    let finalReflectionStrength = reflection.a *
                                 uniforms.reflectionIntensity *
                                 precomputedReflectionStrength;

    let reflectionColor = reflection.rgb * finalReflectionStrength;
    let diffuseColor = originalColor.rgb * (1.0 - finalReflectionStrength);
    let finalColor = diffuseColor + reflectionColor;

    textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
} else {
    textureStore(outputTexture, screenCoord, originalColor);
}
